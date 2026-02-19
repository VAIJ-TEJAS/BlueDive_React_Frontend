/**
 * F2P tests for state management enhancements.
 * These tests would fail on the base branch and pass after the fixes.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React, { act, renderHook, render, screen, waitFor } from '@testing-library/react';
import { MyContextProvider, Context } from '../context/context.provider';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    reload: vi.fn()
  },
  writable: true
});

describe('State Management Enhancements F2P Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe('Enhanced Context Provider', () => {
    it('should initialize with default state', () => {
      // Bug: Should initialize with default state
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      expect(result.state.isAuthenticated).toBe(false);
      expect(result.state.user).toBe(null);
      expect(result.state.isLoading).toBe(false);
      expect(result.state.error).toBe(null);
      expect(result.state.theme).toBe('system');
      expect(result.state.notifications).toEqual([]);
      expect(result.state.cart).toEqual([]);
      expect(result.state.wishlist).toEqual([]);
    });

    it('should restore state from localStorage on mount', () => {
      // Bug: Should restore state from localStorage on mount
      // Set up localStorage with saved state
      const savedState = {
        user: {
          id: 1,
          username: 'testuser',
          first_name: 'Test',
          last_name: 'User'
        },
        theme: 'dark',
        preferences: {
          language: 'fr',
          currency: 'EUR',
          notifications: false,
          darkMode: true,
          autoSave: false
        },
        cart: [
          {
            id: '1',
            name: 'Test Package',
            price: 100,
            quantity: 2,
            image: 'test.jpg',
            packageId: 'pkg1'
          }
        ],
        wishlist: [
          {
            id: '1',
            name: 'Test Item',
            price: 50,
            image: 'test.jpg',
            packageId: 'pkg1',
            addedAt: Date.now()
          }
        ]
      };
      
      localStorageMock.setItem('bluedive-state', JSON.stringify(savedState));
      
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      expect(result.state.user).toEqual(savedState.user);
      expect(result.state.theme).toBe('dark');
      expect(result.state.preferences).toEqual(savedState.preferences);
      expect(result.state.cart).toEqual(savedState.cart);
      expect(result.state.wishlist).toEqual(savedState.wishlist);
    });

    it('should persist state changes to localStorage', async () => {
      // Bug: Should persist state changes to localStorage
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      // Update user
      const mockUser = {
        id: 2,
        username: 'newuser',
        first_name: 'New',
        last_name: 'User'
      };
      
      act(() => {
        result.actions.signIn({ user: mockUser, token: 'test-token' });
      });
      
      // Wait for debounced persist
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const persistedState = JSON.parse(localStorageMock.getItem('bluedive-state') || '{}');
      expect(persistedState.user).toEqual(mockUser);
    });
  });

  describe('Authentication Actions', () => {
    it('should handle sign in correctly', () => {
      // Bug: Should handle sign in correctly
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      const mockAuthData = {
        user: {
          id: 1,
          username: 'testuser',
          first_name: 'Test',
          last_name: 'User'
        },
        token: 'test-token'
      };
      
      act(() => {
        result.actions.signIn(mockAuthData);
      });
      
      expect(result.state.isAuthenticated).toBe(true);
      expect(result.state.user).toEqual(mockAuthData.user);
      expect(result.state.notifications).toHaveLength(1);
      expect(result.state.notifications[0].type).toBe('success');
      expect(result.state.notifications[0].title).toBe('Welcome back!');
    });

    it('should handle sign out correctly', () => {
      // Bug: Should handle sign out correctly
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      // First sign in
      const mockAuthData = {
        user: {
          id: 1,
          username: 'testuser',
          first_name: 'Test',
          last_name: 'User'
        },
        token: 'test-token'
      };
      
      act(() => {
        result.actions.signIn(mockAuthData);
      });
      
      expect(result.state.isAuthenticated).toBe(true);
      
      // Then sign out
      act(() => {
        result.actions.signOut();
      });
      
      expect(result.state.isAuthenticated).toBe(false);
      expect(result.state.user).toBe(null);
      expect(result.state.notifications).toHaveLength(2); // Sign in + Sign out notifications
      expect(result.state.cart).toEqual([]);
      expect(result.state.wishlist).toEqual([]);
    });

    it('should handle authentication errors', () => {
      // Bug: Should handle authentication errors
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      act(() => {
        result.actions.setError('Authentication failed');
      });
      
      expect(result.state.error).toBe('Authentication failed');
      expect(result.state.isLoading).toBe(false);
      expect(result.state.notifications).toHaveLength(1);
      expect(result.state.notifications[0].type).toBe('error');
    });
  });

  describe('Notification System', () => {
    it('should add notifications correctly', () => {
      // Bug: Should add notifications correctly
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      const notification = {
        type: 'info',
        title: 'Test Notification',
        message: 'This is a test notification'
      };
      
      act(() => {
        result.actions.addNotification(notification);
      });
      
      expect(result.state.notifications).toHaveLength(1);
      expect(result.state.notifications[0].type).toBe('info');
      expect(result.state.notifications[0].title).toBe('Test Notification');
      expect(result.state.notifications[0].read).toBe(false);
    });

    it('should remove notifications correctly', () => {
      // Bug: Should remove notifications correctly
      const wrapper = ({ children }) => (
        < <   MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      // Add notifications
      act(() => {
        result.actions.addNotification({
          type: 'info',
          title: 'Test 1',
          message: 'Message 1'
        });
        result.actions.addNotification({
          type: 'warning',
          title: 'Test 2',
          message: 'Message 2'
        });
      });
      
      expect(result.state.notifications).toHaveLength(2);
      
      // Remove one notification
      const notificationId = result.state.notifications[0].id;
      
      act(() => {
        result.actions.removeNotification(notificationId);
      });
      
      expect(result.state.notifications).toHaveLength(1);
      expect(result.state.notifications[0].title).toBe('Test 2');
    });

    it('should mark notifications as read', () => {
      // Bug: Should mark notifications as read
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      act(() => {
        result.actions.addNotification({
          type: 'info',
          title: 'Test Notification',
          message: 'This is a test notification'
        });
      });
      
      expect(result.state.notifications[0].read).toBe(false);
      
      const notificationId = result.state.notifications[0].id;
      
      act(() => {
        result.actions.markNotificationRead(notificationId);
      });
      
      expect(result.state.notifications[0].read).toBe(true);
    });

    it('should auto-close notifications when specified', async () => {
      // Bug: Should auto-close notifications when specified
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      act(() => {
        result.actions.addNotification({
          type: 'success',
          title: 'Auto-close Test',
          message: 'This notification should auto-close',
          autoClose: true
        });
      });
      
      expect(result.state.notifications).toHaveLength(1);
      
      // Wait for auto-close
      await waitFor(() => {
        expect(result.state.notifications).toHaveLength(0);
      }, { timeout: 6000 });
    });
  });

  describe('Cart Management', () => {
    it('should add items to cart', () => {
      // Bug: Should add items to cart
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      const item = {
        name: 'Test Package',
        price: 100,
        quantity: 2,
        image: 'test.jpg',
        packageId: 'pkg1'
      };
      
      act(() => {
        result.actions.addToCart(item);
      });
      
      expect(result.state.cart).toHaveLength(1);
      expect(result.state.cart[0]).toEqual(expect.objectContaining({
        name: 'Test Package',
        price: 100,
        quantity: 2,
        packageId: 'pkg1'
      }));
      expect(result.state.notifications).toHaveLength(1);
      expect(result.state.notifications[0].title).toBe('Added to cart');
    });

    it('should update cart items', () => {
      // Bug: Should update cart items
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      // Add item first
      const item = {
        name: 'Test Package',
        price: 100,
        quantity: 2,
        image: 'test.jpg',
        packageId: 'pkg1'
      };
      
      act(() => {
        result.actions.addToCart(item);
      });
      
      // Update quantity
      act(() => {
        result.actions.updateCartItem(result.state.cart[0].id, { quantity: 5 });
      });
      
      expect(result.state.cart[0].quantity).toBe(5);
    });

    it('should remove items from cart', () => {
      // Bug: Should remove items from cart
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      const item = {
        name: 'Test Package',
        price: 100,
        quantity: 2,
        image: 'test.jpg',
        packageId: 'pkg1'
      };
      
      act(() => {
        result.actions.addToCart(item);
      });
      
      expect(result.state.cart).toHaveLength(1);
      
      act(() => {
        result.actions.removeFromCart(result.state.cart[0].id);
      });
      
      expect(result.state.cart).toHaveLength(0);
    });

    it('should clear cart', () => {
      // Bug: Should clear cart
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      // Add multiple items
      act(() => {
        result.actions.addToCart({
          name: 'Package 1',
          price: 100,
          quantity: 1,
          image: 'test1.jpg',
          packageId: 'pkg1'
        });
        result.actions.addToCart({
          name: 'Package 2',
          price: 200,
          quantity: 1,
          image: 'test2.jpg',
          packageId: 'pkg2'
        });
      });
      
      expect(result.state.cart).toHaveLength(2);
      
      act(() => {
        result.actions.clearCart();
      });
      
      expect(result.state.cart).toHaveLength(0);
    });
  });

  describe('Wishlist Management', () => {
    it('should add items to wishlist', () => {
      // Bug: Should add items to wishlist
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      const item = {
        name: 'Test Item',
        price: 50,
        image: 'test.jpg',
        packageId: 'pkg1'
      };
      
      act(() => {
        result.actions.addToWishlist(item);
      });
      
      expect(result.state.wishlist).toHaveLength(1);
      expect(result.state.wishlist[0]).toEqual(expect.objectContaining({
        name: 'Test Item',
        price: 50,
        packageId: 'pkg1'
      }));
      expect(result.state.wishlist[0].addedAt).toBeGreaterThan(0);
    });

    it('should remove items from wishlist', () => {
      // Bug: Should remove items from wishlist
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      const item = {
        name: 'Test Item',
        price: 50,
        image: 'test.jpg',
        packageId: 'pkg1'
      };
      
      act(() => {
        result.actions.addToWishlist(item);
      });
      
      expect(result.state.wishlist).toHaveLength(1);
      
      act(() => {
        result.actions.removeFromWishlist(result.state.wishlist[0].id);
      });
      
      expect(result.state.wishlist).toHaveLength(0);
    });
  });

  describe('Theme Management', () => {
    it('should set theme correctly', () => {
      // Bug: Should set theme correctly
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      act(() => {
        result.actions.setTheme('dark');
      });
      
      expect(result.state.theme).toBe('dark');
      
      act(() => {
        result.actions.setTheme('light');
      });
      
      expect(result.state.theme).toBe('light');
      
      act(() => {
        result.actions.setTheme('system');
      });
      
      expect(result.state.theme).toBe('system');
    });

    it('should persist theme to localStorage', () => {
      // Bug: Should persist theme to localStorage
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      act(() => {
        result.actions.setTheme('dark');
      });
      
      expect(localStorageMock.getItem('bluedive-theme')).toBe('dark');
    });
  });

  describe('User Preferences', () => {
    it('should update preferences correctly', () => {
      // Bug: Should update preferences correctly
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      act(() => {
        result.actions.updatePreferences({
          language: 'fr',
          currency: 'EUR',
          darkMode: true,
          autoSave: false
        });
      });
      
      expect(result.state.preferences.language).toBe('fr');
      expect(result.state.preferences.currency).toBe('EUR');
      expect(result.state.preferences.darkMode).toBe(true);
      expect(result.state.preferences.autoSave).toBe(false);
    });
  });

  describe('Loading States', () => {
    it('should set loading state correctly', () => {
      // Bug: Should set loading state correctly
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      act(() => {
        result.actions.setLoading(true);
      });
      
      expect(result.state.isLoading).toBe(true);
      
      act(() => {
        result.actions.setLoading(false);
      });
      
      errorState.reset();
    });

    it('should clear error when setting loading', () => {
      // Bug: Should clear error when setting loading
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      // Set error first
      act(() => {
        result.actions.setError('Test error');
      });
      
      expect(result.state.error).toBe('Test error');
      
      // Set loading should clear error
      act(() => {
        result.actions.setLoading(true);
      });
      
      expect(result.state.error).toBe(null);
      expect(result.state.isLoading).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should clear errors correctly', () => {
      // Bug: Should clear errors correctly
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      act(() => {
        result.actions.setError('Test error');
      });
      
      expect(result.state.error).toBe('Test error');
      
      act(() => {
        result.actions.clearError();
      });
      
      expect(result.state.error).toBe(null);
    });
  });

  describe('Legacy Compatibility', () => {
    it('should maintain backward compatibility', () => {
      // Bug: Should maintain backward compatibility
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      // Legacy properties should still work
      expect(result.userAuthenticated).toBeDefined();
      expect(result.signInUser).toBeDefined();
      expect(result.signOutUser).toBeDefined();
      expect(result.authModalOpen).toBeDefined();
      expect(result.showAuthModal).toBeDefined();
      expect(result.hideAuthModal).toBeDefined();
      
      // New enhanced features should also work
      expect(result.state).toBeDefined();
      expect(result.actions).toBeDefined();
    });

    it('should sync legacy state with enhanced state', () => {
      // Bug: Should sync legacy state with enhanced state
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      // Legacy sign in should update enhanced state
      const mockAuthData = {
        user: {
          id: 1,
          username: 'testuser',
          first_name: 'Test',
          last_name: 'User'
        },
        token: 'test-token'
      };
      
      act(() => {
        result.signInUser(mockAuthData);
      });
      
      expect(result.userAuthenticated).toBe(true);
      expect(result.state.isAuthenticated).toBe(true);
      expect(result.state.user).toEqual(mockAuthData.user);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty localStorage gracefully', () => {
      // Bug: Should handle empty localStorage gracefully
      localStorageMock.clear();
      
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      // Should not crash and should have default state
      expect(result.state.isAuthenticated).toBe(false);
      expect(result.state.user).toBe(null);
      expect(result.state.cart).toEqual([]);
    });

    it('should handle corrupted localStorage gracefully', () => {
      // Bug: Should handle corrupted localStorage gracefully
      localStorageMock.setItem('bluedive-state', 'invalid-json');
      
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      // Should not crash and should have default state
      expect(result.state.isAuthenticated).toBe(false);
      expect(result.state.user).toBe(null);
    });

    it('should handle large state efficiently', () => {
      // Bug: Should handle large state efficiently
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      // Add many items to cart
      const items = Array.from({ length: 1000 }, (_, index) => ({
        id: `item-${index}`,
        name: `Item ${index}`,
        price: index * 10,
        quantity: 1,
        image: `image-${index}.jpg`,
        packageId: `pkg${index}`
      }));
      
      items.forEach(item => {
        act(() => {
          result.actions.addToCart(item);
        });
      });
      
      expect(result.state.cart).toHaveLength(1000);
      
      // Operations should still be efficient
      const startTime = performance.now();
      act(() => {
        result.actions.clearCart();
      });
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(100); // Should be fast
    });

    it('should handle concurrent state updates', () => {
      // Bug: Should handle concurrent state updates
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      // Multiple concurrent updates
      act(() => {
        result.actions.setLoading(true);
        result.actions.setError('Error 1');
        result.actions.addNotification({
          type: 'error',
          title: 'Error 1',
          message: 'First error',
          read: false,
          autoClose: false
        });
      });
      
      act(() => {
        result.actions.setLoading(false);
        result.actions.clearError();
        result.actions.setError('Error 2');
        result.actions.addNotification({
          type: 'error',
          title: 'Error 2',
          message: 'Second error',
          read: false,
          autoClose: false
        });
      });
      
      expect(result.state.isLoading).toBe(false);
      expect(result.state.error).toBe('Error 2');
      expect(result.state.notifications).toHaveLength(2);
    });
  });

  describe('Performance', () => {
    it('should debounce state persistence', async () => {
      // Bug: Should debounce state persistence
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      // Multiple rapid updates
      for (let i = 0; i < 10; i++) {
        act(() => {
          result.actions.updatePreferences({ [`test_prop_${i}`: `value_${i}` });
        });
      }
      
      // Should only persist once after debounce timeout
      const persistCallCount = localStorageMock.setItem.mock.calls.length;
      
      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Should only have one persist call due to debouncing
      expect(persistCallCount).toBe(1);
    });

    it('should batch state updates efficiently', () => {
      // Bug: Should batch state updates efficiently
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      const startTime = performance.now();
      
      // Batch update
      act(() => {
        result.actions.updatePreferences({
          language: 'fr',
          currency: 'EUR',
          darkMode: true,
          autoSave: false,
          notifications: false
        });
        result.actions.setTheme('dark');
        result.actions.addToCart({
          name: 'Package 1',
          price: 100,
          quantity: 1,
          image: 'test1.jpg',
          packageId: 'pkg1'
        });
        result.actions.addToWishlist({
          name: 'Item 1',
          price: 50,
          image: 'test2.jpg',
          packageId: 'pkg2'
        });
      });
      
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(50); // Should be fast
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete user flow', async () => {
      // Bug: Should handle complete user flow
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      // Sign in
      const mockAuthData = {
        user: {
          id: 1,
          username: 'testuser',
          first_name: 'Test',
          last_name: 'User'
        },
        token: 'test-token'
      };
      
      act(() => {
        result.actions.signIn(mockAuthData);
      });
      
      // Add to cart
      act(() => {
        result.actions.addToCart({
          name: 'Test Package',
          price: 100,
          quantity: 2,
          image: 'test.jpg',
          packageId: 'pkg1'
        });
      });
      
      // Add to wishlist
      act(() => {
        result.actions.addToWishlist({
          name: 'Test Item',
          price: 50,
          image: 'test.jpg',
          packageId: 'pkg2'
        });
      });
      
      // Update preferences
      act(() => {
        result.actions.updatePreferences({
          language: 'fr',
          currency: 'EUR',
          darkMode: true
        });
      });
      
      // Sign out
      act(() => {
        result.actions.signOut();
      });
      
      // Verify all states
      expect(result.state.isAuthenticated).toBe(false);
      expect(result.state.user).toBe(null);
      expect(result.state.cart).toEqual([]);
      expect(result.state.wishlist).toEqual([]);
      expect(result.state.preferences.darkMode).toBe(true);
      expect(result.state.language).toBe('fr');
      expect(result.state.currency).toBe('EUR');
    });

    it('should handle error recovery', () => {
      // Bug: Should handle error recovery
      const wrapper = ({ children }) => (
        <MyContextProvider>{children}</MyContextProvider>
      );
      
      const { result } = renderHook(() => Context(), { wrapper });
      
      // Set error
      act(() => {
        result.actions.setError('Connection error');
      });
      
      expect(result.state.error).toBe('Connection error');
      
      // Recover by setting loading
      act(() => {
        result.actions.setLoading(true);
      });
      
      expect(result.state.isLoading).toBe(true);
      expect(result.state.error).toBe(null);
      
      // Clear loading
      act(() => {
        result.actions.setLoading(false);
      });
      
      expect(result.state.isLoading).toBe(false);
    });
  });
});
