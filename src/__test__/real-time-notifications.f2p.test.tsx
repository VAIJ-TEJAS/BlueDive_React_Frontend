/**
 * F2P tests for real-time notifications system.
 * These tests would fail on the base branch and pass after the fixes.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { 
  RealTimeNotificationsService, 
  notificationService,
  Notification,
  NotificationPreferences 
} from '../services/real-time-notifications';
import { useRealTimeNotifications } from '../hooks/useRealTimeNotifications';
import NotificationToast from '../components/notification-toast';
import NotificationCenter from '../components/notification-center';

// Mock WebSocket
class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readyState = MockWebSocket.OPEN;
  url: string;
  onopen: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;

  constructor(url: string) {
    this.url = url;
    // Simulate connection after a short delay
    setTimeout(() => {
      if (this.onopen) {
        this.onopen(new Event('open'));
      }
    }, 10);
  }

  send(data: string) {
    // Echo ping messages as pong
    try {
      const message = JSON.parse(data);
      if (message.type === 'ping') {
        setTimeout(() => {
          if (this.onmessage) {
            this.onmessage(new MessageEvent('message', {
              data: JSON.stringify({
                type: 'pong',
                timestamp: Date.now()
              })
            }));
          }
        }, 5);
      }
    } catch (e) {
      // Ignore JSON parsing errors
    }
  }

  close() {
    this.readyState = MockWebSocket.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close'));
    }
  }
}

// Mock global WebSocket
global.WebSocket = MockWebSocket as any;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

// Mock Notification API
const mockNotification = {
  requestPermission: jest.fn().mockResolvedValue('granted'),
  permission: 'granted' as NotificationPermission,
};
global.Notification = mockNotification as any;

// Mock Audio
const mockAudio = {
  play: jest.fn().mockResolvedValue(undefined),
};
global.Audio = jest.fn().mockImplementation(() => mockAudio) as any;

// Mock document visibility
Object.defineProperty(document, 'visibilityState', {
  writable: true,
  value: 'visible'
});

// Mock window events
const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

describe('Real-Time Notifications F2P Tests', () => {
  let service: RealTimeNotificationsService;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    service = new RealTimeNotificationsService('ws://test:8080');
  });

  afterEach(() => {
    service.disconnect();
  });

  describe('RealTimeNotificationsService', () => {
    it('should connect to WebSocket server', async () => {
      // Bug: Should establish WebSocket connection
      await service.connect();
      
      await waitFor(() => {
        expect(service.isConnected()).toBe(true);
        expect(service.getConnectionStatus()).toBe('connected');
      });
    });

    it('should handle connection errors gracefully', async () => {
      // Bug: Should handle connection errors without crashing
      const errorService = new RealTimeNotificationsService('ws://invalid:8080');
      
      // Mock WebSocket to throw error
      global.WebSocket = jest.fn().mockImplementation(() => {
        throw new Error('Connection failed');
      }) as any;

      await expect(errorService.connect()).resolves.not.toThrow();
    });

    it('should reconnect on connection loss', async () => {
      // Bug: Should automatically reconnect when connection is lost
      await service.connect();
      
      // Simulate connection loss
      if (service['ws']) {
        service['ws'].close();
      }

      await waitFor(() => {
        expect(service.getConnectionStatus()).toBe('reconnecting');
      });
    });

    it('should add notifications', () => {
      // Bug: Should add notifications to the list
      const notification = {
        title: 'Test Notification',
        message: 'This is a test',
        type: 'info' as const,
        priority: 'medium' as const
      };

      const id = service.addNotification(notification);

      expect(id).toBeDefined();
      expect(id).toMatch(/^notif_\d+_[a-z0-9]+$/);
      
      const notifications = service.getNotifications();
      expect(notifications).toHaveLength(1);
      expect(notifications[0].title).toBe(notification.title);
      expect(notifications[0].read).toBe(false);
    });

    it('should mark notifications as read', () => {
      // Bug: Should mark notifications as read
      const notification = {
        title: 'Test Notification',
        message: 'This is a test',
        type: 'info' as const,
        priority: 'medium' as const
      };

      const id = service.addNotification(notification);
      service.markAsRead(id);

      const notifications = service.getNotifications();
      expect(notifications[0].read).toBe(true);
    });

    it('should mark all notifications as read', () => {
      // Bug: Should mark all notifications as read
      service.addNotification({
        title: 'Test 1',
        message: 'Message 1',
        type: 'info' as const,
        priority: 'medium' as const
      });

      service.addNotification({
        title: 'Test 2',
        message: 'Message 2',
        type: 'success' as const,
        priority: 'high' as const
      });

      service.markAllAsRead();

      const notifications = service.getNotifications();
      expect(notifications.every(n => n.read)).toBe(true);
    });

    it('should remove notifications', () => {
      // Bug: Should remove specific notifications
      const notification = {
        title: 'Test Notification',
        message: 'This is a test',
        type: 'info' as const,
        priority: 'medium' as const
      };

      const id = service.addNotification(notification);
      service.removeNotification(id);

      const notifications = service.getNotifications();
      expect(notifications).toHaveLength(0);
    });

    it('should clear all notifications', () => {
      // Bug: Should clear all notifications
      service.addNotification({
        title: 'Test 1',
        message: 'Message 1',
        type: 'info' as const,
        priority: 'medium' as const
      });

      service.addNotification({
        title: 'Test 2',
        message: 'Message 2',
        type: 'success' as const,
        priority: 'high' as const
      });

      service.clearAllNotifications();

      const notifications = service.getNotifications();
      expect(notifications).toHaveLength(0);
    });

    it('should calculate unread count', () => {
      // Bug: Should correctly calculate unread notifications count
      service.addNotification({
        title: 'Test 1',
        message: 'Message 1',
        type: 'info' as const,
        priority: 'medium' as const
      });

      service.addNotification({
        title: 'Test 2',
        message: 'Message 2',
        type: 'success' as const,
        priority: 'high' as const
      });

      expect(service.getUnreadCount()).toBe(2);

      const notifications = service.getNotifications();
      service.markAsRead(notifications[0].id);

      expect(service.getUnreadCount()).toBe(1);
    });

    it('should update preferences', () => {
      // Bug: Should update notification preferences
      const newPreferences = {
        soundEnabled: false,
        desktopEnabled: true
      };

      service.updatePreferences(newPreferences);

      const preferences = service.getPreferences();
      expect(preferences.soundEnabled).toBe(false);
      expect(preferences.desktopEnabled).toBe(true);
    });

    it('should handle WebSocket messages', async () => {
      // Bug: Should handle incoming WebSocket messages
      await service.connect();

      const notification = {
        title: 'WebSocket Notification',
        message: 'Received via WebSocket',
        type: 'info' as const,
        priority: 'medium' as const
      };

      // Simulate WebSocket message
      if (service['ws'] && service['ws'].onmessage) {
        service['ws'].onmessage(new MessageEvent('message', {
          data: JSON.stringify({
            type: 'notification',
            data: notification,
            timestamp: Date.now()
          })
        }));
      }

      await waitFor(() => {
        const notifications = service.getNotifications();
        expect(notifications).toHaveLength(1);
        expect(notifications[0].title).toBe(notification.title);
      });
    });

    it('should handle heartbeat messages', async () => {
      // Bug: Should handle ping/pong heartbeat messages
      await service.connect();

      // Simulate ping message
      if (service['ws'] && service['ws'].onmessage) {
        service['ws'].onmessage(new MessageEvent('message', {
          data: JSON.stringify({
            type: 'ping',
            timestamp: Date.now()
          })
        }));
      }

      // Should not throw and should send pong response
      await waitFor(() => {
        expect(service.isConnected()).toBe(true);
      });
    });

    it('should save notifications to localStorage', () => {
      // Bug: Should persist notifications to localStorage
      const notification = {
        title: 'Persistent Notification',
        message: 'Should be saved',
        type: 'info' as const,
        priority: 'medium' as const
      };

      service.addNotification(notification);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'bluedive_notifications',
        expect.stringContaining('Persistent Notification')
      );
    });

    it('should load notifications from localStorage', () => {
      // Bug: Should load notifications from localStorage on initialization
      const storedNotifications = {
        notifications: [
          {
            id: 'stored_notif_1',
            title: 'Stored Notification',
            message: 'Loaded from storage',
            type: 'success',
            priority: 'high',
            timestamp: Date.now() - 1000,
            read: false
          }
        ],
        timestamp: Date.now()
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedNotifications));

      const newService = new RealTimeNotificationsService();
      const notifications = newService.getNotifications();

      expect(notifications).toHaveLength(1);
      expect(notifications[0].title).toBe('Stored Notification');
    });

    it('should handle notification expiration', () => {
      // Bug: Should automatically remove expired notifications
      const notification = {
        title: 'Expiring Notification',
        message: 'Will expire soon',
        type: 'warning' as const,
        priority: 'medium' as const,
        expiresAt: Date.now() + 100 // Expires in 100ms
      };

      service.addNotification(notification);

      expect(service.getNotifications()).toHaveLength(1);

      // Wait for expiration
      act(() => {
        jest.advanceTimersByTime(150);
      });

      expect(service.getNotifications()).toHaveLength(0);
    });

    it('should respect quiet hours', () => {
      // Bug: Should respect quiet hours settings
      const preferences: Partial<NotificationPreferences> = {
        quietHours: {
          enabled: true,
          start: '22:00',
          end: '08:00'
        }
      };

      service.updatePreferences(preferences);

      // Mock current time to be during quiet hours
      const mockDate = new Date();
      mockDate.setHours(23);
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      const urgentNotification = {
        title: 'Urgent Notification',
        message: 'Should show during quiet hours',
        type: 'error' as const,
        priority: 'urgent' as const
      };

      const normalNotification = {
        title: 'Normal Notification',
        message: 'Should not show during quiet hours',
        type: 'info' as const,
        priority: 'medium' as const
      };

      // Mock browser notification methods
      const showNotificationSpy = jest.spyOn(service as any, 'showBrowserNotification');

      service.addNotification(urgentNotification);
      service.addNotification(normalNotification);

      // Only urgent notifications should be displayed during quiet hours
      expect(showNotificationSpy).toHaveBeenCalledTimes(1);
      expect(showNotificationSpy).toHaveBeenCalledWith(
        expect.objectContaining({ priority: 'urgent' })
      );

      jest.restoreAllMocks();
    });

    it('should filter notifications by type', () => {
      // Bug: Should filter notifications by type
      service.addNotification({
        title: 'Info Notification',
        message: 'Info message',
        type: 'info' as const,
        priority: 'medium' as const
      });

      service.addNotification({
        title: 'Success Notification',
        message: 'Success message',
        type: 'success' as const,
        priority: 'medium' as const
      });

      const infoNotifications = service.filterNotifications({ type: 'info' });
      expect(infoNotifications).toHaveLength(1);
      expect(infoNotifications[0].type).toBe('info');

      const successNotifications = service.filterNotifications({ type: 'success' });
      expect(successNotifications).toHaveLength(1);
      expect(successNotifications[0].type).toBe('success');
    });

    it('should filter notifications by priority', () => {
      // Bug: Should filter notifications by priority
      service.addNotification({
        title: 'Low Priority',
        message: 'Low priority message',
        type: 'info' as const,
        priority: 'low' as const
      });

      service.addNotification({
        title: 'High Priority',
        message: 'High priority message',
        type: 'warning' as const,
        priority: 'high' as const
      });

      const lowNotifications = service.filterNotifications({ priority: 'low' });
      expect(lowNotifications).toHaveLength(1);
      expect(lowNotifications[0].priority).toBe('low');

      const highNotifications = service.filterNotifications({ priority: 'high' });
      expect(highNotifications).toHaveLength(1);
      expect(highNotifications[0].priority).toBe('high');
    });

    it('should search notifications', () => {
      // Bug: Should search notifications by title and message
      service.addNotification({
        title: 'Booking Confirmed',
        message: 'Your booking has been confirmed',
        type: 'success' as const,
        priority: 'medium' as const
      });

      service.addNotification({
        title: 'Payment Failed',
        message: 'Your payment could not be processed',
        type: 'error' as const,
        priority: 'high' as const
      });

      const bookingResults = service.searchNotifications('booking');
      expect(bookingResults).toHaveLength(1);
      expect(bookingResults[0].title).toContain('booking');

      const paymentResults = service.searchNotifications('payment');
      expect(paymentResults).toHaveLength(1);
      expect(paymentResults[0].title).toContain('payment');
    });

    it('should generate notification statistics', () => {
      // Bug: Should generate accurate notification statistics
      service.addNotification({
        title: 'Info 1',
        message: 'Info message',
        type: 'info' as const,
        priority: 'low' as const
      });

      service.addNotification({
        title: 'Success 1',
        message: 'Success message',
        type: 'success' as const,
        priority: 'high' as const
      });

      service.addNotification({
        title: 'Warning 1',
        message: 'Warning message',
        type: 'warning' as const,
        priority: 'medium' as const
      });

      const stats = service.getStatistics();

      expect(stats.total).toBe(3);
      expect(stats.unread).toBe(3);
      expect(stats.byType.info).toBe(1);
      expect(stats.byType.success).toBe(1);
      expect(stats.byType.warning).toBe(1);
      expect(stats.byPriority.low).toBe(1);
      expect(stats.byPriority.medium).toBe(1);
      expect(stats.byPriority.high).toBe(1);
    });
  });

  describe('useRealTimeNotifications Hook', () => {
    it('should provide notification state and actions', () => {
      // Bug: Should provide all necessary state and actions
      const TestComponent = () => {
        const {
          notifications,
          unreadCount,
          isConnected,
          connectionStatus,
          preferences,
          statistics,
          markAsRead,
          markAllAsRead,
          removeNotification,
          clearAllNotifications,
          addNotification,
          updatePreferences,
          connect,
          disconnect,
          requestPermission,
          searchNotifications,
          filterNotifications
        } = useRealTimeNotifications();

        return (
          <div>
            <div data-testid="notifications-count">{notifications.length}</div>
            <div data-testid="unread-count">{unreadCount}</div>
            <div data-testid="is-connected">{isConnected.toString()}</div>
            <div data-testid="connection-status">{connectionStatus}</div>
            <div data-testid="preferences-enabled">{preferences.enabled.toString()}</div>
            <div data-testid="statistics-total">{statistics.total}</div>
            <button onClick={() => addNotification({
              title: 'Test',
              message: 'Test message',
              type: 'info',
              priority: 'medium'
            })}>Add Notification</button>
            <button onClick={markAllAsRead}>Mark All Read</button>
            <button onClick={clearAllNotifications}>Clear All</button>
          </div>
        );
      };

      render(<TestComponent />);

      expect(screen.getByTestId('notifications-count')).toHaveTextContent('0');
      expect(screen.getByTestId('unread-count')).toHaveTextContent('0');
      expect(screen.getByTestId('is-connected')).toHaveTextContent('false');
      expect(screen.getByTestId('connection-status')).toHaveTextContent('disconnected');
      expect(screen.getByTestId('preferences-enabled')).toHaveTextContent('true');
      expect(screen.getByTestId('statistics-total')).toHaveTextContent('0');
    });

    it('should update state when notifications are added', async () => {
      // Bug: Should update state when notifications are added
      const TestComponent = () => {
        const { notifications, addNotification } = useRealTimeNotifications();

        return (
          <div>
            <div data-testid="notifications-count">{notifications.length}</div>
            <button onClick={() => addNotification({
              title: 'Test',
              message: 'Test message',
              type: 'info',
              priority: 'medium'
            })}>Add Notification</button>
          </div>
        );
      };

      render(<TestComponent />);

      fireEvent.click(screen.getByText('Add Notification'));

      await waitFor(() => {
        expect(screen.getByTestId('notifications-count')).toHaveTextContent('1');
      });
    });

    it('should update state when notifications are marked as read', async () => {
      // Bug: Should update state when notifications are marked as read
      const TestComponent = () => {
        const { notifications, addNotification, markAsRead, unreadCount } = useRealTimeNotifications();

        return (
          <div>
            <div data-testid="unread-count">{unreadCount}</div>
            <button onClick={() => {
              const id = addNotification({
                title: 'Test',
                message: 'Test message',
                type: 'info',
                priority: 'medium'
              });
              setTimeout(() => markAsRead(id), 0);
            }}>Add and Mark Read</button>
          </div>
        );
      };

      render(<TestComponent />);

      fireEvent.click(screen.getByText('Add and Mark Read'));

      await waitFor(() => {
        expect(screen.getByTestId('unread-count')).toHaveTextContent('0');
      });
    });
  });

  describe('NotificationToast Component', () => {
    it('should display notification toast', () => {
      // Bug: Should render notification toast correctly
      const notification: Notification = {
        id: 'test-1',
        title: 'Test Notification',
        message: 'This is a test notification',
        type: 'info',
        priority: 'medium',
        timestamp: Date.now(),
        read: false
      };

      render(
        <NotificationToast
          notification={notification}
          onClose={jest.fn()}
        />
      );

      expect(screen.getByText('Test Notification')).toBeInTheDocument();
      expect(screen.getByText('This is a test notification')).toBeInTheDocument();
    });

    it('should show correct icon based on notification type', () => {
      // Bug: Should display appropriate icon for each notification type
      const types: Notification['type'][] = ['info', 'success', 'warning', 'error'];

      types.forEach(type => {
        const notification: Notification = {
          id: `test-${type}`,
          title: `${type} Notification`,
          message: `This is a ${type} notification`,
          type,
          priority: 'medium',
          timestamp: Date.now(),
          read: false
        };

        const { unmount } = render(
          <NotificationToast
            notification={notification}
            onClose={jest.fn()}
          />
        );

        // Check if appropriate icon is rendered (via SVG presence)
        const svg = document.querySelector('svg');
        expect(svg).toBeInTheDocument();

        unmount();
      });
    });

    it('should handle notification actions', () => {
      // Bug: Should handle notification action clicks
      const mockAction = jest.fn();
      const notification: Notification = {
        id: 'test-1',
        title: 'Test Notification',
        message: 'This is a test notification',
        type: 'info',
        priority: 'medium',
        timestamp: Date.now(),
        read: false,
        actions: [
          {
            id: 'action-1',
            label: 'Click Me',
            action: mockAction,
            style: 'primary'
          }
        ]
      };

      render(
        <NotificationToast
          notification={notification}
          onClose={jest.fn()}
        />
      );

      fireEvent.click(screen.getByText('Click Me'));
      expect(mockAction).toHaveBeenCalled();
    });

    it('should auto-close non-urgent notifications', () => {
      // Bug: Should auto-close notifications that are not urgent
      jest.useFakeTimers();

      const notification: Notification = {
        id: 'test-1',
        title: 'Test Notification',
        message: 'This is a test notification',
        type: 'info',
        priority: 'medium',
        timestamp: Date.now(),
        read: false
      };

      const onClose = jest.fn();

      render(
        <NotificationToast
          notification={notification}
          onClose={onClose}
          autoClose={true}
          duration={1000}
        />
      );

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(onClose).toHaveBeenCalled();

      jest.useRealTimers();
    });

    it('should not auto-close urgent notifications', () => {
      // Bug: Should not auto-close urgent notifications
      jest.useFakeTimers();

      const notification: Notification = {
        id: 'test-1',
        title: 'Urgent Notification',
        message: 'This is urgent',
        type: 'error',
        priority: 'urgent',
        timestamp: Date.now(),
        read: false
      };

      const onClose = jest.fn();

      render(
        <NotificationToast
          notification={notification}
          onClose={onClose}
          autoClose={true}
          duration={1000}
        />
      );

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(onClose).not.toHaveBeenCalled();

      jest.useRealTimers();
    });
  });

  describe('NotificationCenter Component', () => {
    it('should display notification center when open', () => {
      // Bug: Should render notification center when isOpen is true
      render(
        <NotificationCenter
          isOpen={true}
          onClose={jest.fn()}
        />
      );

      expect(screen.getByText('Notifications')).toBeInTheDocument();
    });

    it('should not display notification center when closed', () => {
      // Bug: Should not render when isOpen is false
      render(
        <NotificationCenter
          isOpen={false}
          onClose={jest.fn()}
        />
      );

      expect(screen.queryByText('Notifications')).not.toBeInTheDocument();
    });

    it('should display notifications list', () => {
      // Bug: Should display list of notifications
      const mockService = {
        getNotifications: () => [
          {
            id: 'test-1',
            title: 'Test Notification',
            message: 'Test message',
            type: 'info',
            priority: 'medium',
            timestamp: Date.now(),
            read: false
          }
        ],
        getUnreadCount: () => 1,
        isConnected: () => true,
        getConnectionStatus: () => 'connected',
        getPreferences: () => ({ enabled: true }),
        getStatistics: () => ({ total: 1, unread: 1, byType: {}, byPriority: {} }),
        markAsRead: jest.fn(),
        markAllAsRead: jest.fn(),
        removeNotification: jest.fn(),
        clearAllNotifications: jest.fn(),
        updatePreferences: jest.fn(),
        requestPermission: jest.fn(),
        searchNotifications: jest.fn(),
        filterNotifications: jest.fn()
      };

      jest.doMock('../hooks/useRealTimeNotifications', () => ({
        useRealTimeNotifications: () => mockService
      }));

      render(
        <NotificationCenter
          isOpen={true}
          onClose={jest.fn()}
        />
      );

      expect(screen.getByText('Test Notification')).toBeInTheDocument();
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('should handle search functionality', () => {
      // Bug: Should filter notifications based on search query
      render(
        <NotificationCenter
          isOpen={true}
          onClose={jest.fn()}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search notifications...');
      fireEvent.change(searchInput, { target: { value: 'test' } });

      expect(searchInput).toHaveValue('test');
    });

    it('should handle filter options', () => {
      // Bug: Should provide filtering options
      render(
        <NotificationCenter
          isOpen={true}
          onClose={jest.fn()}
        />
      );

      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Unread')).toBeInTheDocument();
      expect(screen.getByText('All Types')).toBeInTheDocument();
      expect(screen.getByText('All Priorities')).toBeInTheDocument();
    });

    it('should show empty state when no notifications', () => {
      // Bug: Should show empty state when there are no notifications
      render(
        <NotificationCenter
          isOpen={true}
          onClose={jest.fn()}
        />
      );

      expect(screen.getByText('No notifications')).toBeInTheDocument();
    });

    it('should handle close button', () => {
      // Bug: Should handle close button click
      const onClose = jest.fn();

      render(
        <NotificationCenter
          isOpen={true}
          onClose={onClose}
        />
      );

      fireEvent.click(screen.getByText('✕'));
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Integration Tests', () => {
    it('should integrate service with hook and components', async () => {
      // Bug: Should work together as a complete system
      const TestApp = () => {
        const {
          notifications,
          addNotification,
          markAsRead,
          unreadCount
        } = useRealTimeNotifications();

        return (
          <div>
            <div data-testid="unread-count">{unreadCount}</div>
            <button
              onClick={() => addNotification({
                title: 'Integration Test',
                message: 'Testing integration',
                type: 'success',
                priority: 'medium'
              })}
            >
              Add Notification
            </button>
            <button onClick={() => markAsRead(notifications[0]?.id)}>
              Mark First Read
            </button>
            {notifications.length > 0 && (
              <NotificationToast
                notification={notifications[0]}
                onClose={() => {}}
              />
            )}
          </div>
        );
      };

      render(<TestApp />);

      expect(screen.getByTestId('unread-count')).toHaveTextContent('0');

      fireEvent.click(screen.getByText('Add Notification'));

      await waitFor(() => {
        expect(screen.getByTestId('unread-count')).toHaveTextContent('1');
        expect(screen.getByText('Integration Test')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Mark First Read'));

      await waitFor(() => {
        expect(screen.getByTestId('unread-count')).toHaveTextContent('0');
      });
    });

    it('should handle real-time updates', async () => {
      // Bug: Should handle real-time notification updates
      const TestApp = () => {
        const { notifications, addNotification } = useRealTimeNotifications();

        return (
          <div>
            <div data-testid="notification-count">{notifications.length}</div>
            <button
              onClick={() => {
                // Simulate real-time notification
                setTimeout(() => {
                  addNotification({
                    title: 'Real-time Update',
                    message: 'Received via WebSocket',
                    type: 'info',
                    priority: 'high'
                  });
                }, 100);
              }}
            >
              Simulate Real-time
            </button>
          </div>
        );
      };

      render(<TestApp />);

      fireEvent.click(screen.getByText('Simulate Real-time'));

      await waitFor(() => {
        expect(screen.getByTestId('notification-count')).toHaveTextContent('1');
      }, { timeout: 1000 });
    });
  });
});
