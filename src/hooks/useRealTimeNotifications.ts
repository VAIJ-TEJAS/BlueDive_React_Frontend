/**
 * React Hook for Real-Time Notifications
 * Provides easy integration with the RealTimeNotificationsService
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  notificationService, 
  Notification, 
  NotificationPreferences,
  NotificationAction 
} from '../services/real-time-notifications';

export interface UseRealTimeNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'reconnecting';
  preferences: NotificationPreferences;
  statistics: {
    total: number;
    unread: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
  };
  
  // Actions
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => string;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void;
  connect: () => Promise<void>;
  disconnect: () => void;
  requestPermission: () => Promise<boolean>;
  
  // Utilities
  searchNotifications: (query: string) => Notification[];
  filterNotifications: (filters: {
    type?: Notification['type'];
    priority?: Notification['priority'];
    read?: boolean;
  }) => Notification[];
}

export const useRealTimeNotifications = (): UseRealTimeNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected' | 'reconnecting'>('disconnected');
  const [preferences, setPreferences] = useState<NotificationPreferences>(notificationService.getPreferences());
  const [statistics, setStatistics] = useState({
    total: 0,
    unread: 0,
    byType: {} as Record<string, number>,
    byPriority: {} as Record<string, number>
  });

  const serviceRef = useRef(notificationService);
  const unsubscribeFunctionsRef = useRef<(() => void)[]>([]);

  // Update statistics when notifications change
  const updateStatistics = useCallback(() => {
    const stats = serviceRef.current.getStatistics();
    setStatistics(stats);
  }, []);

  // Subscribe to service events
  useEffect(() => {
    const service = serviceRef.current;

    const unsubscribeFunctions: (() => void)[] = [];

    // Notification events
    const onNotification = (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
      updateStatistics();
    };

    const onNotificationRead = (notification: Notification) => {
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      );
      updateStatistics();
    };

    const onNotificationRemoved = (notification: Notification) => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
      updateStatistics();
    };

    const onAllNotificationsRead = () => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      updateStatistics();
    };

    const onAllNotificationsCleared = () => {
      setNotifications([]);
      updateStatistics();
    };

    const onPreferencesUpdated = (newPreferences: NotificationPreferences) => {
      setPreferences(newPreferences);
    };

    // Connection events
    const onConnected = () => {
      setIsConnected(true);
      setConnectionStatus('connected');
    };

    const onConnecting = () => {
      setConnectionStatus('connecting');
    };

    const onDisconnected = () => {
      setIsConnected(false);
      setConnectionStatus('disconnected');
    };

    const onReconnecting = ({ attempt, delay }: { attempt: number; delay: number }) => {
      setIsConnected(false);
      setConnectionStatus('reconnecting');
    };

    // Subscribe to events
    unsubscribeFunctions.push(
      service.on('notification', onNotification),
      service.on('notificationRead', onNotificationRead),
      service.on('notificationRemoved', onNotificationRemoved),
      service.on('allNotificationsRead', onAllNotificationsRead),
      service.on('allNotificationsCleared', onAllNotificationsCleared),
      service.on('preferencesUpdated', onPreferencesUpdated),
      service.on('connected', onConnected),
      service.on('connecting', onConnecting),
      service.on('disconnected', onDisconnected),
      service.on('reconnecting', onReconnecting)
    );

    unsubscribeFunctionsRef.current = unsubscribeFunctions;

    // Initialize state
    setNotifications(service.getNotifications());
    setIsConnected(service.isConnected());
    setConnectionStatus(service.getConnectionStatus());
    updateStatistics();

    return () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    };
  }, [updateStatistics]);

  // Actions
  const markAsRead = useCallback((id: string) => {
    serviceRef.current.markAsRead(id);
  }, []);

  const markAllAsRead = useCallback(() => {
    serviceRef.current.markAllAsRead();
  }, []);

  const removeNotification = useCallback((id: string) => {
    serviceRef.current.removeNotification(id);
  }, []);

  const clearAllNotifications = useCallback(() => {
    serviceRef.current.clearAllNotifications();
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    return serviceRef.current.addNotification(notification);
  }, []);

  const updatePreferences = useCallback((newPreferences: Partial<NotificationPreferences>) => {
    serviceRef.current.updatePreferences(newPreferences);
  }, []);

  const connect = useCallback(async () => {
    await serviceRef.current.connect();
  }, []);

  const disconnect = useCallback(() => {
    serviceRef.current.disconnect();
  }, []);

  const requestPermission = useCallback(async () => {
    return await serviceRef.current.requestNotificationPermission();
  }, []);

  const searchNotifications = useCallback((query: string) => {
    return serviceRef.current.searchNotifications(query);
  }, []);

  const filterNotifications = useCallback((filters: {
    type?: Notification['type'];
    priority?: Notification['priority'];
    read?: boolean;
  }) => {
    return serviceRef.current.filterNotifications(filters);
  }, []);

  return {
    notifications,
    unreadCount: statistics.unread,
    isConnected,
    connectionStatus,
    preferences,
    statistics,
    
    // Actions
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    addNotification,
    updatePreferences,
    connect,
    disconnect,
    requestPermission,
    
    // Utilities
    searchNotifications,
    filterNotifications
  };
};

export default useRealTimeNotifications;
