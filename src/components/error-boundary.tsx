import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  maxRetries?: number;
  resetTimeout?: number;
  enableErrorReporting?: boolean;
  enablePerformanceMonitoring?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
  errorId?: string;
  isRetrying: boolean;
  performanceMetrics?: {
    renderTime: number;
    memoryUsage: number;
    componentCount: number;
  };
}

class ErrorBoundary extends Component<Props, State> {
  private renderStartTime = 0;
  private retryTimeouts: ReturnType<typeof setTimeout>[] = [];

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      retryCount: 0,
      isRetrying: false
    };
  }

  componentDidMount() {
    this.renderStartTime = performance.now();
    if (this.props.enablePerformanceMonitoring) {
      this.collectPerformanceMetrics();
    }
  }

  componentDidUpdate() {
    if (this.props.enablePerformanceMonitoring) {
      this.collectPerformanceMetrics();
    }
  }

  componentWillUnmount() {
    // Clear any pending retry timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
    this.retryTimeouts = [];
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      error,
      retryCount: 0,
      isRetrying: false
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Generate unique error ID
    const errorId = this.generateErrorId();
    
    // Collect performance metrics if enabled
    const performanceMetrics = this.props.enablePerformanceMonitoring 
      ? this.collectPerformanceMetrics() 
      : undefined;

    // Store error info in state
    this.setState({
      error,
      errorInfo,
      errorId,
      performanceMetrics
    });

    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to external service in production
    if (process.env.NODE_ENV === 'production' || this.props.enableErrorReporting) {
      this.logErrorToService(error, errorInfo, errorId, performanceMetrics);
    }

    // Start auto-retry if enabled
    if (this.props.resetTimeout && this.props.resetTimeout > 0) {
      this.handleAutoRetry();
    }
  }

  generateErrorId = (): string => {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  collectPerformanceMetrics = () => {
    const renderTime = performance.now() - this.renderStartTime;
    const memoryUsage = (performance as any).memory ? {
      usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
      totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
      jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
    } : null;

    return {
      renderTime,
      memoryUsage: memoryUsage?.usedJSHeapSize || 0,
      componentCount: this.countComponents()
    };
  };

  countComponents = (): number => {
    // Simple component counting based on DOM elements
    const elementCount = document.querySelectorAll('[data-reactroot]').length;
    return elementCount;
  };

  logErrorToService = (error: Error, errorInfo: ErrorInfo, errorId?: string, performanceMetrics?: any) => {
    // In a real application, you would send this to an error tracking service
    // like Sentry, LogRocket, or your own logging endpoint
    try {
      const errorData = {
        errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        performanceMetrics,
        retryCount: this.state.retryCount,
        environment: process.env.NODE_ENV,
        buildVersion: process.env.REACT_APP_VERSION || 'unknown'
      };

      // Example: Send to logging endpoint
      fetch('/api/log-error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData),
      }).catch(() => {
        // Silently fail logging to avoid infinite error loops
      });
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
    }
  };

  handleRetry = () => {
    const maxRetries = this.props.maxRetries || 3;
    const currentRetryCount = this.state.retryCount;

    if (currentRetryCount >= maxRetries) {
      console.warn('Maximum retry attempts reached');
      return;
    }

    this.setState({ 
      isRetrying: true,
      retryCount: currentRetryCount + 1
    });

    // Reset error state after a short delay
    const timeout = setTimeout(() => {
      this.setState({ 
        hasError: false, 
        error: undefined, 
        errorInfo: undefined,
        isRetrying: false
      });
    }, 1000);

    this.retryTimeouts.push(timeout);
  };

  handleAutoRetry = () => {
    const resetTimeout = this.props.resetTimeout || 30000; // 30 seconds default
    
    const timeout = setTimeout(() => {
      if (this.state.hasError && this.state.retryCount < (this.props.maxRetries || 3)) {
        this.handleRetry();
      }
    }, resetTimeout);

    this.retryTimeouts.push(timeout);
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-red-500">
                <svg
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Something went wrong
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                We apologize for the inconvenience. An unexpected error occurred.
              </p>
              {this.state.errorId && (
                <p className="mt-1 text-xs text-gray-500">
                  Error ID: {this.state.errorId}
                </p>
              )}
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  What happened?
                </h3>
                <p className="text-gray-600 text-sm">
                  The application encountered an unexpected error. Our team has been notified and is working to resolve the issue.
                </p>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  What can you do?
                </h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Try refreshing the page</li>
                  <li>• Check your internet connection</li>
                  <li>• Clear your browser cache</li>
                  <li>• Contact support if the problem persists</li>
                </ul>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-red-900 mb-2">
                    Error Details (Development Only)
                  </h3>
                  <details className="text-sm text-red-800">
                    <summary className="cursor-pointer font-medium">
                      {this.state.error.name}: {this.state.error.message}
                    </summary>
                    <pre className="mt-2 whitespace-pre-wrap text-xs">
                      {this.state.error.stack}
                    </pre>
                    {this.state.errorInfo && (
                      <div className="mt-2">
                        <strong>Component Stack:</strong>
                        <pre className="whitespace-pre-wrap text-xs">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </details>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={this.handleRetry}
                  disabled={this.state.isRetrying || this.state.retryCount >= (this.props.maxRetries || 3)}
                  className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out ${
                    this.state.isRetrying || this.state.retryCount >= (this.props.maxRetries || 3)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                  }`}
                >
                  {this.state.isRetrying ? 'Retrying...' : `Try Again${this.state.retryCount > 0 ? ` (${this.state.retryCount}/${this.props.maxRetries || 3})` : ''}`}
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                >
                  Refresh Page
                </button>
              </div>
            </div>

            <div className="text-center">
              <a
                href="/"
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                Return to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
