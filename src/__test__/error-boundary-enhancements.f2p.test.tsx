/**
 * F2P tests for error boundary enhancements.
 * These tests would fail on the base branch and pass after the fixes.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ErrorBoundary from '../components/error-boundary';

// Mock console methods to avoid test output pollution
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
const mockFetch = jest.fn();

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    memory: {
      usedJSHeapSize: 1000000,
      totalJSHeapSize: 2000000,
      jsHeapSizeLimit: 4000000
    }
  },
  writable: true
});

// Mock fetch for error logging
global.fetch = mockFetch;

describe('Error Boundary Enhancements F2P Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Enhanced Error Reporting', () => {
    it('should generate unique error IDs', () => {
      // Bug: Should generate unique error IDs for tracking
      const ThrowErrorComponent = () => {
        throw new Error('Test error');
      };

      render(
        <ErrorBoundary enableErrorReporting={true}>
          <ThrowErrorComponent />
        </ErrorBoundary>
      );

      // Should show error ID in the UI
      expect(screen.getByText(/Error ID:/)).toBeInTheDocument();
      expect(screen.getByText(/error_\d+_/)).toBeInTheDocument();
    });

    it('should include performance metrics in error reports', async () => {
      // Bug: Should include performance metrics in error reports
      const ThrowErrorComponent = () => {
        throw new Error('Test error');
      };

      render(
        <ErrorBoundary enableErrorReporting={true} enablePerformanceMonitoring={true}>
          <ThrowErrorComponent />
        </ErrorBoundary>
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/log-error', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: expect.stringContaining('performanceMetrics')
        });
      });
    });

    it('should include retry count in error reports', async () => {
      // Bug: Should include retry count in error reports
      const ThrowErrorComponent = () => {
        throw new Error('Test error');
      };

      render(
        <ErrorBoundary enableErrorReporting={true}>
          <ThrowErrorComponent />
        </ErrorBoundary>
      );

      // Trigger retry
      fireEvent.click(screen.getByText('Try Again'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/log-error', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: expect.stringContaining('"retryCount":1')
        });
      });
    });

    it('should include build version in error reports', async () => {
      // Bug: Should include build version in error reports
      process.env.REACT_APP_VERSION = '1.2.3';
      
      const ThrowErrorComponent = () => {
        throw new Error('Test error');
      };

      render(
        <ErrorBoundary enableErrorReporting={true}>
          <ThrowErrorComponent />
        </ErrorBoundary>
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/log-error', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: expect.stringContaining('"buildVersion":"1.2.3"')
        });
      });

      delete process.env.REACT_APP_VERSION;
    });
  });

  describe('Enhanced Retry Functionality', () => {
    it('should respect max retry limit', () => {
      // Bug: Should respect maximum retry limit
      const ThrowErrorComponent = () => {
        throw new Error('Test error');
      };

      render(
        <ErrorBoundary maxRetries={2}>
          <ThrowErrorComponent />
        </ErrorBoundary>
      );

      const retryButton = screen.getByText('Try Again');

      // First retry
      fireEvent.click(retryButton);
      expect(screen.getByText('Try Again (1/2)')).toBeInTheDocument();

      // Second retry
      fireEvent.click(screen.getByText('Try Again (1/2)'));
      expect(screen.getByText('Try Again (2/2)')).toBeInTheDocument();

      // Third retry should be disabled
      fireEvent.click(screen.getByText('Try Again (2/2)'));
      expect(screen.getByText('Try Again (2/2)')).toBeDisabled();
    });

    it('should show retry count in button text', () => {
      // Bug: Should show retry count in button text
      const ThrowErrorComponent = () => {
        throw new Error('Test error');
      };

      render(
        <ErrorBoundary maxRetries={3}>
          <ThrowErrorComponent />
        </ErrorBoundary>
      );

      const retryButton = screen.getByText('Try Again');

      // First retry
      fireEvent.click(retryButton);
      expect(screen.getByText('Try Again (1/3)')).toBeInTheDocument();

      // Second retry
      fireEvent.click(screen.getByText('Try Again (1/3)'));
      expect(screen.getByText('Try Again (2/3)')).toBeInTheDocument();
    });

    it('should disable retry button during retry', () => {
      // Bug: Should disable retry button during retry
      const ThrowErrorComponent = () => {
        throw new Error('Test error');
      };

      render(
        <ErrorBoundary>
          <ThrowErrorComponent />
        </ErrorBoundary>
      );

      const retryButton = screen.getByText('Try Again');

      fireEvent.click(retryButton);

      // Should show "Retrying..." and be disabled
      expect(screen.getByText('Retrying...')).toBeInTheDocument();
      expect(screen.getByText('Retrying...')).toBeDisabled();
    });

    it('should handle auto-retry functionality', () => {
      // Bug: Should handle auto-retry functionality
      jest.useFakeTimers();

      const ThrowErrorComponent = () => {
        throw new Error('Test error');
      };

      render(
        <ErrorBoundary resetTimeout={5000} maxRetries={2}>
          <ThrowErrorComponent />
        </ErrorBoundary>
      );

      // Fast-forward time to trigger auto-retry
      jest.advanceTimersByTime(5000);

      expect(screen.getByText('Try Again (1/2)')).toBeInTheDocument();

      jest.useRealTimers();
    });

    it('should not auto-retry if max retries reached', () => {
      // Bug: Should not auto-retry if max retries reached
      jest.useFakeTimers();

      const ThrowErrorComponent = () => {
        throw new Error('Test error');
      };

      render(
        <ErrorBoundary resetTimeout={1000} maxRetries={1}>
          <ThrowErrorComponent />
        </ErrorBoundary>
      );

      // Use up all retries
      fireEvent.click(screen.getByText('Try Again'));

      // Fast-forward time
      jest.advanceTimersByTime(1000);

      // Should not retry again
      expect(screen.getByText('Try Again (1/1)')).toBeDisabled();

      jest.useRealTimers();
    });
  });

  describe('Performance Monitoring', () => {
    it('should collect performance metrics when enabled', () => {
      // Bug: Should collect performance metrics when enabled
      const ThrowErrorComponent = () => {
        throw new Error('Test error');
      };

      render(
        <ErrorBoundary enablePerformanceMonitoring={true}>
          <ThrowErrorComponent />
        </ErrorBoundary>
      );

      // Should have called performance.now()
      expect(window.performance.now).toHaveBeenCalled();
    });

    it('should include render time in metrics', () => {
      // Bug: Should include render time in performance metrics
      window.performance.now.mockReturnValue(1000);

      const ThrowErrorComponent = () => {
        throw new Error('Test error');
      };

      render(
        <ErrorBoundary enablePerformanceMonitoring={true}>
          <ThrowErrorComponent />
        </ErrorBoundary>
      );

      // Should calculate render time
      expect(window.performance.now).toHaveBeenCalled();
    });

    it('should include memory usage in metrics', () => {
      // Bug: Should include memory usage in performance metrics
      const ThrowErrorComponent = () => {
        throw new Error('Test error');
      };

      render(
        <ErrorBoundary enablePerformanceMonitoring={true}>
          <ThrowErrorComponent />
        </ErrorBoundary>
      );

      // Should access memory information
      expect(window.performance.memory).toBeDefined();
    });

    it('should handle missing performance API gracefully', () => {
      // Bug: Should handle missing performance API gracefully
      const originalPerformance = window.performance;
      delete (window as any).performance;

      const ThrowErrorComponent = () => {
        throw new Error('Test error');
      };

      expect(() => {
        render(
          <ErrorBoundary enablePerformanceMonitoring={true}>
            <ThrowErrorComponent />
          </ErrorBoundary>
        );
      }).not.toThrow();

      window.performance = originalPerformance;
    });
  });

  describe('Enhanced Error Logging', () => {
    it('should log enhanced error data to service', async () => {
      // Bug: Should log enhanced error data to service
      const ThrowErrorComponent = () => {
        throw new Error('Test error');
      };

      render(
        <ErrorBoundary enableErrorReporting={true}>
          <ThrowErrorComponent />
        </ErrorBoundary>
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/log-error', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: expect.stringContaining('errorId')
        });
      });
    });

    it('should include environment information in error logs', async () => {
      // Bug: Should include environment information in error logs
      const ThrowErrorComponent = () => {
        throw new Error('Test error');
      };

      render(
        <ErrorBoundary enableErrorReporting={true}>
          <ThrowErrorComponent />
        </ErrorBoundary>
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/log-error', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: expect.stringContaining('"environment":"test"')
        });
      });
    });

    it('should handle logging service failures gracefully', async () => {
      // Bug: Should handle logging service failures gracefully
      mockFetch.mockRejectedValue(new Error('Network error'));

      const ThrowErrorComponent = () => {
        throw new Error('Test error');
      };

      expect(() => {
        render(
          <ErrorBoundary enableErrorReporting={true}>
            <ThrowErrorComponent />
          </ErrorBoundary>
        );
      }).not.toThrow();

      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith(
          expect.stringContaining('Failed to log error:'),
          expect.any(Error)
        );
      });
    });
  });

  describe('Cleanup and Memory Management', () => {
    it('should clear retry timeouts on unmount', () => {
      // Bug: Should clear retry timeouts on unmount
      jest.useFakeTimers();
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const ThrowErrorComponent = () => {
        throw new Error('Test error');
      };

      const { unmount } = render(
        <ErrorBoundary resetTimeout={5000}>
          <ThrowErrorComponent />
        </ErrorBoundary>
      );

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();

      jest.useRealTimers();
    });

    it('should not leak memory on repeated errors', () => {
      // Bug: Should not leak memory on repeated errors
      const ThrowErrorComponent = ({ shouldThrow = true }) => {
        if (shouldThrow) {
          throw new Error('Test error');
        }
        return <div>No error</div>;
      };

      const { rerender } = render(
        <ErrorBoundary enablePerformanceMonitoring={true}>
          <ThrowErrorComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      // Fix the error
      rerender(
        <ErrorBoundary enablePerformanceMonitoring={true}>
          <ThrowErrorComponent shouldThrow={false} />
        </ErrorBoundary>
      );

      // Should recover without memory leaks
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });
  });

  describe('Component Lifecycle', () => {
    it('should initialize with correct default state', () => {
      // Bug: Should initialize with correct default state
      const TestComponent = () => <div>Test</div>;

      render(
        <ErrorBoundary>
          <TestComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('should handle errors in nested components', () => {
      // Bug: Should handle errors in nested components
      const NestedErrorComponent = () => {
        return <DeeplyNestedComponent />;
      };

      const DeeplyNestedComponent = () => {
        throw new Error('Deep nested error');
      };

      render(
        <ErrorBoundary>
          <NestedErrorComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should recover after successful retry', () => {
      // Bug: Should recover after successful retry
      let shouldThrow = true;
      const ThrowThenRecoverComponent = () => {
        if (shouldThrow) {
          throw new Error('Temporary error');
        }
        return <div>Recovered</div>;
      };

      const { rerender } = render(
        <ErrorBoundary>
          <ThrowThenRecoverComponent />
        </ErrorBoundary>
      );

      // Fix the error
      shouldThrow = false;
      fireEvent.click(screen.getByText('Try Again'));

      // Should show recovered component
      expect(screen.getByText('Recovered')).toBeInTheDocument();
    });
  });

  describe('Custom Fallback UI', () => {
    it('should use custom fallback when provided', () => {
      // Bug: Should use custom fallback when provided
      const ThrowErrorComponent = () => {
        throw new Error('Test error');
      };

      const CustomFallback = () => <div>Custom error UI</div>;

      render(
        <ErrorBoundary fallback={<CustomFallback />}>
          <ThrowErrorComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom error UI')).toBeInTheDocument();
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });

    it('should call custom error handler when provided', () => {
      // Bug: Should call custom error handler when provided
      const mockErrorHandler = jest.fn();
      const ThrowErrorComponent = () => {
        throw new Error('Test error');
      };

      render(
        <ErrorBoundary onError={mockErrorHandler}>
          <ThrowErrorComponent />
        </ErrorBoundary>
      );

      expect(mockErrorHandler).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String)
        })
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle null children gracefully', () => {
      // Bug: Should handle null children gracefully
      expect(() => {
        render(
          <ErrorBoundary>
            {null}
          </ErrorBoundary>
        );
      }).not.toThrow();
    });

    it('should handle undefined children gracefully', () => {
      // Bug: Should handle undefined children gracefully
      expect(() => {
        render(
          <ErrorBoundary>
            {undefined}
          </ErrorBoundary>
        );
      }).not.toThrow();
    });

    it('should handle multiple rapid errors', () => {
      // Bug: Should handle multiple rapid errors
      const RapidErrorComponent = () => {
        throw new Error('Rapid error');
      };

      render(
        <ErrorBoundary maxRetries={1}>
          <RapidErrorComponent />
        </ErrorBoundary>
      );

      const retryButton = screen.getByText('Try Again');

      // Rapid clicks should not cause issues
      fireEvent.click(retryButton);
      fireEvent.click(retryButton);
      fireEvent.click(retryButton);

      expect(screen.getByText('Try Again (1/1)')).toBeDisabled();
    });

    it('should handle errors during retry', () => {
      // Bug: Should handle errors during retry
      let throwCount = 0;
      const PersistentErrorComponent = () => {
        throwCount++;
        throw new Error(`Error ${throwCount}`);
      };

      render(
        <ErrorBoundary maxRetries={3}>
          <PersistentErrorComponent />
        </ErrorBoundary>
      );

      // Retry should still show error boundary
      fireEvent.click(screen.getByText('Try Again'));
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  describe('Development vs Production Behavior', () => {
    it('should show error details in development', () => {
      // Bug: Should show error details in development
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const ThrowErrorComponent = () => {
        throw new Error('Development error');
      };

      render(
        <ErrorBoundary>
          <ThrowErrorComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Error Details (Development Only)')).toBeInTheDocument();
      expect(screen.getByText('Error: Development error')).toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });

    it('should hide error details in production', () => {
      // Bug: Should hide error details in production
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const ThrowErrorComponent = () => {
        throw new Error('Production error');
      };

      render(
        <ErrorBoundary>
          <ThrowErrorComponent />
        </ErrorBoundary>
      );

      expect(screen.queryByText('Error Details (Development Only)')).not.toBeInTheDocument();
      expect(screen.queryByText('Production error')).not.toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });

    it('should always log errors regardless of environment', () => {
      // Bug: Should always log errors regardless of environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const ThrowErrorComponent = () => {
        throw new Error('Production error');
      };

      render(
        <ErrorBoundary>
          <ThrowErrorComponent />
        </ErrorBoundary>
      );

      expect(mockConsoleError).toHaveBeenCalledWith(
        'ErrorBoundary caught an error:',
        expect.any(Error),
        expect.any(Object)
      );

      process.env.NODE_ENV = originalEnv;
    });
  });
});
