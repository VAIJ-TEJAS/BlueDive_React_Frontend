/**
 * Real-time Notifications Service for BlueDive React Frontend
 * Provides WebSocket-based real-time notifications with fallback mechanisms
 */

import { EventEmitter } from 'events';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actions?: NotificationAction[];
  metadata?: Record<string, any>;
  expiresAt?: number;
}

export interface NotificationAction {
  id: string;
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

export interface NotificationPreferences {
  enabled: boolean;
  soundEnabled: boolean;
  desktopEnabled: boolean;
  types: {
    info: boolean;
    success: boolean;
    warning: boolean;
    error: boolean;
  };
  priorities: {
    low: boolean;
    medium: boolean;
    high: boolean;
    urgent: boolean;
  };
  quietHours?: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string;   // HH:MM format
  };
}

export interface WebSocketMessage {
  type: 'notification' | 'ping' | 'pong' | 'auth' | 'error';
  data?: any;
  id?: string;
  timestamp: number;
}

export class RealTimeNotificationsService extends EventEmitter {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private isDestroyed = false;
  private notifications: Notification[] = [];
  private preferences: NotificationPreferences;
  private notificationQueue: Notification[] = [];
  private storageKey = 'bluedive_notifications';
  private preferencesKey = 'bluedive_notification_preferences';

  constructor(private wsUrl: string = 'ws://localhost:8080/notifications') {
    super();
    this.preferences = this.loadPreferences();
    this.loadStoredNotifications();
    this.setupEventListeners();
  }

  /**
   * Connect to WebSocket server
   */
  async connect(): Promise<void> {
    if (this.isConnecting || this.isDestroyed || this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isConnecting = true;
    this.emit('connecting');

    try {
      this.ws = new WebSocket(this.wsUrl);
      this.setupWebSocket();
    } catch (error) {
      this.isConnecting = false;
      this.handleConnectionError(error);
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.isDestroyed = true;
    this.clearHeartbeat();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.emit('disconnected');
  }

  /**
   * Add a new notification
   */
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): string {
    const id = this.generateNotificationId();
    const fullNotification: Notification = {
      ...notification,
      id,
      timestamp: Date.now(),
      read: false
    };

    this.notifications.unshift(fullNotification);
    this.saveNotifications();
    this.emit('notification', fullNotification);

    // Handle notification display
    if (this.shouldDisplayNotification(fullNotification)) {
      this.displayNotification(fullNotification);
    }

    // Handle expiration
    if (fullNotification.expiresAt) {
      this.scheduleExpiration(fullNotification);
    }

    return id;
  }

  /**
   * Mark notification as read
   */
  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification && !notification.read) {
      notification.read = true;
      this.saveNotifications();
      this.emit('notificationRead', notification);
    }
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    const unreadNotifications = this.notifications.filter(n => !n.read);
    unreadNotifications.forEach(notification => {
      notification.read = true;
    });
    
    this.saveNotifications();
    this.emit('allNotificationsRead');
  }

  /**
   * Remove a notification
   */
  removeNotification(id: string): void {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      const removed = this.notifications.splice(index, 1)[0];
      this.saveNotifications();
      this.emit('notificationRemoved', removed);
    }
  }

  /**
   * Clear all notifications
   */
  clearAllNotifications(): void {
    this.notifications = [];
    this.saveNotifications();
    this.emit('allNotificationsCleared');
  }

  /**
   * Get all notifications
   */
  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  /**
   * Get unread notifications count
   */
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  /**
   * Update notification preferences
   */
  updatePreferences(preferences: Partial<NotificationPreferences>): void {
    this.preferences = { ...this.preferences, ...preferences };
    this.savePreferences();
    this.emit('preferencesUpdated', this.preferences);
  }

  /**
   * Get current preferences
   */
  getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  /**
   * Check if service is connected
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): 'connected' | 'connecting' | 'disconnected' | 'reconnecting' {
    if (this.isDestroyed) return 'disconnected';
    if (this.isConnecting) return 'connecting';
    if (this.isConnected()) return 'connected';
    if (this.reconnectAttempts > 0) return 'reconnecting';
    return 'disconnected';
  }

  /**
   * Setup WebSocket event handlers
   */
  private setupWebSocket(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.emit('connected');
      
      // Send queued notifications
      this.flushNotificationQueue();
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleWebSocketMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = (event) => {
      this.isConnecting = false;
      this.clearHeartbeat();
      this.emit('disconnected');
      
      if (!this.isDestroyed && !event.wasClean) {
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      this.isConnecting = false;
      this.emit('error', error);
    };
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleWebSocketMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'notification':
        if (message.data) {
          this.addNotification(message.data);
        }
        break;
      
      case 'ping':
        this.sendPong();
        break;
      
      case 'pong':
        // Heartbeat response received
        break;
      
      case 'auth':
        this.emit('authRequired');
        break;
      
      case 'error':
        this.emit('serverError', message.data);
        break;
    }
  }

  /**
   * Send message to WebSocket server
   */
  private sendMessage(message: WebSocketMessage): void {
    if (this.isConnected() && this.ws) {
      this.ws.send(JSON.stringify(message));
    }
  }

  /**
   * Send pong response to ping
   */
  private sendPong(): void {
    this.sendMessage({
      type: 'pong',
      timestamp: Date.now()
    });
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.clearHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected()) {
        this.sendMessage({
          type: 'ping',
          timestamp: Date.now()
        });
      }
    }, 30000); // 30 seconds
  }

  /**
   * Clear heartbeat interval
   */
  private clearHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('reconnectFailed');
      return;
    }

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
    this.emit('reconnecting', { attempt: this.reconnectAttempts + 1, delay });

    setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  /**
   * Handle connection errors
   */
  private handleConnectionError(error: any): void {
    console.error('WebSocket connection error:', error);
    this.emit('error', error);
    this.scheduleReconnect();
  }

  /**
   * Setup browser event listeners
   */
  private setupEventListeners(): void {
    // Handle page visibility changes
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && !this.isConnected()) {
          this.connect();
        }
      });
    }

    // Handle online/offline events
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        if (!this.isConnected()) {
          this.connect();
        }
      });

      window.addEventListener('offline', () => {
        this.disconnect();
      });
    }
  }

  /**
   * Check if notification should be displayed
   */
  private shouldDisplayNotification(notification: Notification): boolean {
    if (!this.preferences.enabled) return false;
    
    // Check type preferences
    if (!this.preferences.types[notification.type]) return false;
    
    // Check priority preferences
    if (!this.preferences.priorities[notification.priority]) return false;
    
    // Check quiet hours
    if (this.preferences.quietHours?.enabled) {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const { start, end } = this.preferences.quietHours;
      
      if (this.isTimeInRange(currentTime, start, end)) {
        return notification.priority === 'urgent';
      }
    }
    
    return true;
  }

  /**
   * Check if time is in range
   */
  private isTimeInRange(current: string, start: string, end: string): boolean {
    const currentMinutes = this.timeToMinutes(current);
    const startMinutes = this.timeToMinutes(start);
    const endMinutes = this.timeToMinutes(end);
    
    if (startMinutes <= endMinutes) {
      return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    } else {
      // Crosses midnight
      return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
    }
  }

  /**
   * Convert time string to minutes
   */
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Display notification to user
   */
  private displayNotification(notification: Notification): void {
    // Browser notification
    if (this.preferences.desktopEnabled && this.hasNotificationPermission()) {
      this.showBrowserNotification(notification);
    }

    // Sound notification
    if (this.preferences.soundEnabled) {
      this.playNotificationSound(notification);
    }
  }

  /**
   * Check if browser notification permission is granted
   */
  private hasNotificationPermission(): boolean {
    if (typeof Notification === 'undefined') return false;
    return Notification.permission === 'granted';
  }

  /**
   * Show browser notification
   */
  private showBrowserNotification(notification: Notification): void {
    if (typeof Notification === 'undefined') return;

    const browserNotification = new Notification(notification.title, {
      body: notification.message,
      icon: '/favicon.ico',
      tag: notification.id,
      requireInteraction: notification.priority === 'urgent'
    });

    browserNotification.onclick = () => {
      window.focus();
      this.emit('notificationClicked', notification);
      browserNotification.close();
    };

    // Auto-close after 5 seconds unless urgent
    if (notification.priority !== 'urgent') {
      setTimeout(() => {
        browserNotification.close();
      }, 5000);
    }
  }

  /**
   * Play notification sound
   */
  private playNotificationSound(notification: Notification): void {
    if (typeof Audio === 'undefined') return;

    try {
      const audio = new Audio('/notification-sound.mp3');
      audio.volume = notification.priority === 'urgent' ? 0.8 : 0.5;
      audio.play().catch(error => {
        console.log('Could not play notification sound:', error);
      });
    } catch (error) {
      console.log('Could not create audio element:', error);
    }
  }

  /**
   * Schedule notification expiration
   */
  private scheduleExpiration(notification: Notification): void {
    if (!notification.expiresAt) return;

    const delay = notification.expiresAt - Date.now();
    if (delay <= 0) return;

    setTimeout(() => {
      this.removeNotification(notification.id);
    }, delay);
  }

  /**
   * Flush queued notifications
   */
  private flushNotificationQueue(): void {
    while (this.notificationQueue.length > 0) {
      const notification = this.notificationQueue.shift();
      if (notification) {
        this.addNotification(notification);
      }
    }
  }

  /**
   * Queue notification for when connection is restored
   */
  private queueNotification(notification: Notification): void {
    this.notificationQueue.push(notification);
    
    // Limit queue size to prevent memory issues
    if (this.notificationQueue.length > 100) {
      this.notificationQueue.shift();
    }
  }

  /**
   * Generate unique notification ID
   */
  private generateNotificationId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Save notifications to localStorage
   */
  private saveNotifications(): void {
    if (typeof localStorage === 'undefined') return;
    
    try {
      const data = {
        notifications: this.notifications,
        timestamp: Date.now()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }

  /**
   * Load notifications from localStorage
   */
  private loadStoredNotifications(): void {
    if (typeof localStorage === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.notifications = data.notifications || [];
        
        // Clean up old notifications (older than 30 days)
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        this.notifications = this.notifications.filter(n => n.timestamp > thirtyDaysAgo);
        
        this.saveNotifications();
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }

  /**
   * Save preferences to localStorage
   */
  private savePreferences(): void {
    if (typeof localStorage === 'undefined') return;
    
    try {
      localStorage.setItem(this.preferencesKey, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }

  /**
   * Load preferences from localStorage
   */
  private loadPreferences(): NotificationPreferences {
    if (typeof localStorage === 'undefined') {
      return this.getDefaultPreferences();
    }
    
    try {
      const stored = localStorage.getItem(this.preferencesKey);
      if (stored) {
        return { ...this.getDefaultPreferences(), ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
    
    return this.getDefaultPreferences();
  }

  /**
   * Get default preferences
   */
  private getDefaultPreferences(): NotificationPreferences {
    return {
      enabled: true,
      soundEnabled: true,
      desktopEnabled: true,
      types: {
        info: true,
        success: true,
        warning: true,
        error: true
      },
      priorities: {
        low: true,
        medium: true,
        high: true,
        urgent: true
      },
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      }
    };
  }

  /**
   * Request notification permission
   */
  async requestNotificationPermission(): Promise<boolean> {
    if (typeof Notification === 'undefined') return false;

    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Get notification statistics
   */
  getStatistics(): {
    total: number;
    unread: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
  } {
    const stats = {
      total: this.notifications.length,
      unread: this.getUnreadCount(),
      byType: {} as Record<string, number>,
      byPriority: {} as Record<string, number>
    };

    this.notifications.forEach(notification => {
      stats.byType[notification.type] = (stats.byType[notification.type] || 0) + 1;
      stats.byPriority[notification.priority] = (stats.byPriority[notification.priority] || 0) + 1;
    });

    return stats;
  }

  /**
   * Search notifications
   */
  searchNotifications(query: string): Notification[] {
    const lowerQuery = query.toLowerCase();
    return this.notifications.filter(notification =>
      notification.title.toLowerCase().includes(lowerQuery) ||
      notification.message.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Filter notifications by type or priority
   */
  filterNotifications(filters: {
    type?: Notification['type'];
    priority?: Notification['priority'];
    read?: boolean;
  }): Notification[] {
    return this.notifications.filter(notification => {
      if (filters.type && notification.type !== filters.type) return false;
      if (filters.priority && notification.priority !== filters.priority) return false;
      if (filters.read !== undefined && notification.read !== filters.read) return false;
      return true;
    });
  }
}

// Export singleton instance
export const notificationService = new RealTimeNotificationsService();

// Export types for external usage
export * from './real-time-notifications';
