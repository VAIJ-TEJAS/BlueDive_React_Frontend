/**
 * F2P tests for notification toast component.
 * These tests would fail on the base branch and pass after the fixes.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { 
  NotificationToast, 
  ToastContainer, 
  useToast,
  Toast,
  ToastContainerProps 
} from '../components/notification-toast-new';

// Mock timers for auto-dismiss functionality
jest.useFakeTimers();

describe('NotificationToast F2P Tests', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Basic rendering', () => {
    it('should render toast message', () => {
      render(
        <NotificationToast message="Test message" />
      );
      
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('should render toast with title', () => {
      render(
        <NotificationToast title="Test Title" message="Test message" />
      );
      
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('should render success toast', () => {
      render(
        <NotificationToast type="success" message="Success message" />
      );
      
      const toast = screen.getByRole('alert');
      expect(toast).toHaveClass('bg-green-500');
    });

    it('should render error toast', () => {
      render(
        <NotificationToast type="error" message="Error message" />
      );
      
      const toast = screen.getByRole('alert');
      expect(toast).toHaveClass('bg-red-500');
    });

    it('should render warning toast', () => {
      render(
        <NotificationToast type="warning" message="Warning message" />
      );
      
      const toast = screen.getByRole('alert');
      expect(toast).toHaveClass('bg-yellow-500');
    });

    it('should render info toast', () => {
      render(
        <NotificationToast type="info" message="Info message" />
      );
      
      const toast = screen.getByRole('alert');
      expect(toast).toHaveClass('bg-blue-500');
    });
  });

  describe('Auto-dismiss functionality', () => {
    it('should auto-dismiss after duration', async () => {
      render(
        <NotificationToast message="Test message" duration={1000} />
      );
      
      expect(screen.getByText('Test message')).toBeInTheDocument();
      
      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      await waitFor(() => {
        expect(screen.queryByText('Test message')).not.toBeInTheDocument();
      });
    });

    it('should not auto-dismiss when duration is 0', async () => {
      render(
        <NotificationToast message="Test message" duration={0} />
      );
      
      expect(screen.getByText('Test message')).toBeInTheDocument();
      
      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('should pause auto-dismiss on hover', async () => {
      render(
        <NotificationToast message="Test message" duration={1000} showProgress />
      );
      
      const toast = screen.getByText('Test message').closest('div');
      
      // Hover over toast
      fireEvent.mouseEnter(toast!);
      
      // Fast-forward time while hovering
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      // Should still be visible
      expect(screen.getByText('Test message')).toBeInTheDocument();
      
      // Unhover
      fireEvent.mouseLeave(toast!);
      
      // Fast-forward remaining time
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      await waitFor(() => {
        expect(screen.queryByText('Test message')).not.toBeInTheDocument();
      });
    });

    it('should show progress bar when enabled', () => {
      render(
        <NotificationToast message="Test message" duration={1000} showProgress />
      );
      
      const progressBar = screen.getByRole('progressbar') || 
                          document.querySelector('.bg-white.h-1.rounded-full');
      expect(progressBar).toBeInTheDocument();
    });

    it('should not show progress bar when disabled', () => {
      render(
        <NotificationToast message="Test message" duration={1000} showProgress={false} />
      );
      
      const progressBar = document.querySelector('.bg-white.h-1.rounded-full');
      expect(progressBar).not.toBeInTheDocument();
    });
  });

  describe('Manual dismiss functionality', () => {
    it('should dismiss when close button is clicked', async () => {
      const onClose = jest.fn();
      render(
        <NotificationToast message="Test message" onClose={onClose} />
      );
      
      const closeButton = screen.getByLabelText('Dismiss');
      await userEvent.click(closeButton);
      
      expect(onClose).toHaveBeenCalled();
    });

    it('should dismiss when action button is clicked', async () => {
      const onAction = jest.fn();
      const onClose = jest.fn();
      render(
        <NotificationToast 
          message="Test message" 
          actionText="Action"
          onAction={onAction}
          onClose={onClose}
        />
      );
      
      const actionButton = screen.getByText('Action');
      await userEvent.click(actionButton);
      
      expect(onAction).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Positioning', () => {
    it('should position toast at top-right by default', () => {
      render(
        <NotificationToast message="Test message" />
      );
      
      const toastContainer = screen.getByText('Test message').closest('.fixed');
      expect(toastContainer).toHaveClass('top-4', 'right-4');
    });

    it('should position toast at top-left', () => {
      render(
        <NotificationToast message="Test message" position="top-left" />
      );
      
      const toastContainer = screen.getByText('Test message').closest('.fixed');
      expect(toastContainer).toHaveClass('top-4', 'left-4');
    });

    it('should position toast at bottom-right', () => {
      render(
        <NotificationToast message="Test message" position="bottom-right" />
      );
      
      const toastContainer = screen.getByText('Test message').closest('.fixed');
      expect(toastContainer).toHaveClass('bottom-4', 'right-4');
    });

    it('should position toast at bottom-left', () => {
      render(
        <NotificationToast message="Test message" position="bottom-left" />
      );
      
      const toastContainer = screen.getByText('Test message').closest('.fixed');
      expect(toastContainer).toHaveClass('bottom-4', 'left-4');
    });

    it('should position toast at top-center', () => {
      render(
        <NotificationToast message="Test message" position="top-center" />
      );
      
      const toastContainer = screen.getByText('Test message').closest('.fixed');
      expect(toastContainer).toHaveClass('top-4', 'left-1/2', 'transform', '-translate-x-1/2');
    });

    it('should position toast at bottom-center', () => {
      render(
        <NotificationToast message="Test message" position="bottom-center" />
      );
      
      const toastContainer = screen.getByText('Test message').closest('.fixed');
      expect(toastContainer).toHaveClass('bottom-4', 'left-1/2', 'transform', '-translate-x-1/2');
    });
  });

  describe('Toast container', () => {
    it('should render multiple toasts', () => {
      const toasts: Toast[] = [
        { id: '1', message: 'First message' },
        { id: '2', message: 'Second message' },
        { id: '3', message: 'Third message' }
      ];
      
      const onRemove = jest.fn();
      render(
        <ToastContainer toasts={toasts} onRemove={onRemove} />
      );
      
      expect(screen.getByText('First message')).toBeInTheDocument();
      expect(screen.getByText('Second message')).toBeInTheDocument();
      expect(screen.getByText('Third message')).toBeInTheDocument();
    });

    it('should call onRemove when toast is closed', async () => {
      const toasts: Toast[] = [
        { id: '1', message: 'Test message' }
      ];
      
      const onRemove = jest.fn();
      render(
        <ToastContainer toasts={toasts} onRemove={onRemove} />
      );
      
      const closeButton = screen.getByLabelText('Dismiss');
      await userEvent.click(closeButton);
      
      expect(onRemove).toHaveBeenCalledWith('1');
    });

    it('should render empty container when no toasts', () => {
      const toasts: Toast[] = [];
      const onRemove = jest.fn();
      
      render(
        <ToastContainer toasts={toasts} onRemove={onRemove} />
      );
      
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('useToast hook', () => {
    it('should add and remove toasts', () => {
      const TestComponent = () => {
        const { addToast, removeToast, toasts } = useToast();
        
        const handleAdd = () => {
          addToast({ message: 'Test message' });
        };
        
        const handleRemove = () => {
          if (toasts.length > 0) {
            removeToast(toasts[0].id);
          }
        };
        
        return (
          <div>
            <button onClick={handleAdd}>Add Toast</button>
            <button onClick={handleRemove}>Remove Toast</button>
            <ToastContainer toasts={toasts} onRemove={removeToast} />
          </div>
        );
      };
      
      render(<TestComponent />);
      
      // Initially no toasts
      expect(screen.queryByText('Test message')).not.toBeInTheDocument();
      
      // Add toast
      const addButton = screen.getByText('Add Toast');
      fireEvent.click(addButton);
      
      expect(screen.getByText('Test message')).toBeInTheDocument();
      
      // Remove toast
      const removeButton = screen.getByText('Remove Toast');
      fireEvent.click(removeButton);
      
      expect(screen.queryByText('Test message')).not.toBeInTheDocument();
    });

    it('should provide convenience methods', () => {
      const TestComponent = () => {
        const { success, error, warning, info, toasts } = useToast();
        
        return (
          <div>
            <button onClick={() => success('Success message')}>Success</button>
            <button onClick={() => error('Error message')}>Error</button>
            <button onClick={() => warning('Warning message')}>Warning</button>
            <button onClick={() => info('Info message')}>Info</button>
            <ToastContainer toasts={toasts} onRemove={() => {}} />
          </div>
        );
      };
      
      render(<TestComponent />);
      
      // Test success toast
      fireEvent.click(screen.getByText('Success'));
      expect(screen.getByText('Success message')).toBeInTheDocument();
      
      // Test error toast
      fireEvent.click(screen.getByText('Error'));
      expect(screen.getByText('Error message')).toBeInTheDocument();
      
      // Test warning toast
      fireEvent.click(screen.getByText('Warning'));
      expect(screen.getByText('Warning message')).toBeInTheDocument();
      
      // Test info toast
      fireEvent.click(screen.getByText('Info'));
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });

    it('should clear all toasts', () => {
      const TestComponent = () => {
        const { addToast, clearToasts, toasts } = useToast();
        
        const handleAddMultiple = () => {
          addToast({ message: 'Message 1' });
          addToast({ message: 'Message 2' });
          addToast({ message: 'Message 3' });
        };
        
        return (
          <div>
            <button onClick={handleAddMultiple}>Add Multiple</button>
            <button onClick={clearToasts}>Clear All</button>
            <ToastContainer toasts={toasts} onRemove={() => {}} />
          </div>
        );
      };
      
      render(<TestComponent />);
      
      // Add multiple toasts
      fireEvent.click(screen.getByText('Add Multiple'));
      expect(screen.getByText('Message 1')).toBeInTheDocument();
      expect(screen.getByText('Message 2')).toBeInTheDocument();
      expect(screen.getByText('Message 3')).toBeInTheDocument();
      
      // Clear all toasts
      fireEvent.click(screen.getByText('Clear All'));
      expect(screen.queryByText('Message 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Message 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Message 3')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <NotificationToast message="Test message" />
      );
      
      const toast = screen.getByText('Test message').closest('div[role]');
      expect(toast).toHaveAttribute('role', 'alert');
    });

    it('should have dismiss button with proper label', () => {
      render(
        <NotificationToast message="Test message" />
      );
      
      const closeButton = screen.getByLabelText('Dismiss');
      expect(closeButton).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const onClose = jest.fn();
      render(
        <NotificationToast message="Test message" onClose={onClose} />
      );
      
      const closeButton = screen.getByLabelText('Dismiss');
      closeButton.focus();
      
      await userEvent.keyboard('{Enter}');
      
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty message', () => {
      render(
        <NotificationToast message="" />
      );
      
      const toast = screen.getByRole('alert');
      expect(toast).toBeInTheDocument();
    });

    it('should handle very long message', () => {
      const longMessage = 'This is a very long message that should wrap properly and not break the layout of the toast notification component. '.repeat(5);
      
      render(
        <NotificationToast message={longMessage} />
      );
      
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('should handle special characters in message', () => {
      const message = 'Message with <script>alert("xss")</script> and & special characters';
      
      render(
        <NotificationToast message={message} />
      );
      
      expect(screen.getByText(message)).toBeInTheDocument();
    });

    it('should handle missing action text', () => {
      render(
        <NotificationToast 
          message="Test message" 
          onAction={() => {}}
        />
      );
      
      expect(screen.queryByRole('button', { name: /action/i })).not.toBeInTheDocument();
    });

    it('should handle missing onAction callback', () => {
      render(
        <NotificationToast 
          message="Test message" 
          actionText="Action"
        />
      );
      
      expect(screen.queryByRole('button', { name: /action/i })).not.toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should handle many toasts efficiently', () => {
      const toasts: Toast[] = Array.from({ length: 100 }, (_, i) => ({
        id: `toast-${i}`,
        message: `Message ${i}`
      }));
      
      const onRemove = jest.fn();
      
      const startTime = performance.now();
      render(
        <ToastContainer toasts={toasts} onRemove={onRemove} />
      );
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(1000); // Should render within 1 second
      expect(screen.getAllByText(/Message \d+/)).toHaveLength(100);
    });

    it('should clean up timers on unmount', () => {
      const { unmount } = render(
        <NotificationToast message="Test message" duration={1000} />
      );
      
      unmount();
      
      // Should not throw errors when timers fire after unmount
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      expect(screen.queryByText('Test message')).not.toBeInTheDocument();
    });
  });

  describe('Integration scenarios', () => {
    it('should work with form submission feedback', async () => {
      const TestComponent = () => {
        const { success, error, toasts } = useToast();
        
        const handleSubmit = async () => {
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 100));
            success('Form submitted successfully!');
          } catch {
            error('Form submission failed!');
          }
        };
        
        return (
          <div>
            <button onClick={handleSubmit}>Submit Form</button>
            <ToastContainer toasts={toasts} onRemove={() => {}} />
          </div>
        );
      };
      
      render(<TestComponent />);
      
      const submitButton = screen.getByText('Submit Form');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Form submitted successfully!')).toBeInTheDocument();
      });
    });

    it('should work with real-time notifications', () => {
      const TestComponent = () => {
        const { info, toasts } = useToast();
        
        React.useEffect(() => {
          const interval = setInterval(() => {
            info(`Update at ${new Date().toLocaleTimeString()}`);
          }, 1000);
          
          return () => clearInterval(interval);
        }, [info]);
        
        return (
          <ToastContainer toasts={toasts} onRemove={() => {}} />
        );
      };
      
      render(<TestComponent />);
      
      // Should show first notification
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      expect(screen.getByText(/Update at/)).toBeInTheDocument();
      
      // Should show second notification
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      const notifications = screen.getAllByText(/Update at/);
      expect(notifications).toHaveLength(2);
    });
  });
});
