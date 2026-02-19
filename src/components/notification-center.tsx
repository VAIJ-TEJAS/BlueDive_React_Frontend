/**
 * Notification Center Component
 * Displays all notifications with filtering, search, and management features
 */

import React, { useState, useMemo } from 'react';
import { useRealTimeNotifications } from '../hooks/useRealTimeNotifications';
import { Notification, NotificationAction } from '../services/real-time-notifications';
import NotificationToast from './notification-toast';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  className = ''
}) => {
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
    updatePreferences,
    requestPermission,
    searchNotifications,
    filterNotifications
  } = useRealTimeNotifications();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'type' | 'priority'>('all');
  const [selectedType, setSelectedType] = useState<Notification['type'] | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<Notification['priority'] | 'all'>('all');
  const [showPreferences, setShowPreferences] = useState(false);
  const [activeToast, setActiveToast] = useState<Notification | null>(null);

  // Filter and search notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Apply search
    if (searchQuery) {
      filtered = searchNotifications(searchQuery);
    }

    // Apply filters
    if (activeFilter === 'unread') {
      filtered = filtered.filter(n => !n.read);
    } else if (activeFilter === 'type' && selectedType !== 'all') {
      filtered = filterNotifications({ type: selectedType });
    } else if (activeFilter === 'priority' && selectedPriority !== 'all') {
      filtered = filterNotifications({ priority: selectedPriority });
    }

    return filtered;
  }, [notifications, searchQuery, activeFilter, selectedType, selectedPriority, searchNotifications, filterNotifications]);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    setActiveToast(notification);
  };

  const handleNotificationAction = (actionId: string) => {
    // Handle notification actions
    console.log('Action clicked:', actionId);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      clearAllNotifications();
    }
  };

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      updatePreferences({ desktopEnabled: true });
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-600';
      case 'connecting':
      case 'reconnecting':
        return 'text-yellow-600';
      default:
        return 'text-red-600';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'reconnecting':
        return 'Reconnecting...';
      default:
        return 'Disconnected';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${className}`}>
        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowPreferences(!showPreferences)}
                  className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100"
                >
                  ⚙️
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Connection Status */}
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className={`flex items-center ${getConnectionStatusColor()}`}>
                <span className="w-2 h-2 rounded-full bg-current mr-1"></span>
                {getConnectionStatusText()}
              </span>
              <span className="text-gray-500">
                {statistics.total} total notifications
              </span>
            </div>
          </div>

          {/* Preferences Panel */}
          {showPreferences && (
            <div className="bg-gray-50 border-b border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Notification Preferences</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Enable notifications</span>
                  <button
                    onClick={() => updatePreferences({ enabled: !preferences.enabled })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.enabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Sound</span>
                  <button
                    onClick={() => updatePreferences({ soundEnabled: !preferences.soundEnabled })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.soundEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Desktop notifications</span>
                  <button
                    onClick={() => updatePreferences({ desktopEnabled: !preferences.desktopEnabled })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.desktopEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.desktopEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {!preferences.desktopEnabled && (
                  <button
                    onClick={handleRequestPermission}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Enable browser notifications
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex space-x-2 overflow-x-auto">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                  activeFilter === 'all'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({statistics.total})
              </button>
              
              <button
                onClick={() => setActiveFilter('unread')}
                className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                  activeFilter === 'unread'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Unread ({unreadCount})
              </button>

              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value as Notification['type'] | 'all');
                  setActiveFilter('type');
                }}
                className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 border-0 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => {
                  setSelectedPriority(e.target.value as Notification['priority'] | 'all');
                  setActiveFilter('priority');
                }}
                className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 border-0 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 text-4xl mb-2">📭</div>
                <p className="text-gray-500 text-sm">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 text-lg">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium text-gray-900 ${
                            !notification.read ? 'font-semibold' : ''
                          }`}>
                            {notification.title}
                          </p>
                          
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        
                        <p className="mt-1 text-sm text-gray-600">
                          {notification.message}
                        </p>
                        
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {new Date(notification.timestamp).toLocaleString()}
                          </span>
                          
                          {notification.actions && notification.actions.length > 0 && (
                            <div className="flex space-x-1">
                              {notification.actions.slice(0, 2).map((action) => (
                                <button
                                  key={action.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNotificationAction(action.id);
                                  }}
                                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                >
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-white border-t border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {filteredNotifications.length} of {statistics.total} notifications
              </div>
              
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Mark all as read
                  </button>
                )}
                
                {statistics.total > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Toast */}
      {activeToast && (
        <NotificationToast
          notification={activeToast}
          onClose={() => setActiveToast(null)}
          onAction={handleNotificationAction}
          autoClose={activeToast.priority !== 'urgent'}
        />
      )}
    </>
  );
};

export default NotificationCenter;
