/**
 * Performance monitoring utility for React applications.
 * Provides comprehensive performance tracking and optimization insights.
 */

export interface PerformanceMetrics {
  timestamp: number;
  renderTime: number;
  componentName: string;
  propsSize: number;
  stateSize: number;
  hookCount: number;
  memoryUsage?: number;
  renderCount: number;
  averageRenderTime: number;
  lastRenderTime: number;
  minRenderTime: number;
  maxRenderTime: number;
}

export interface ComponentPerformanceData {
  componentName: string;
  metrics: PerformanceMetrics[];
  currentMetrics: PerformanceMetrics;
  isPerformanceIssue: boolean;
  recommendations: string[];
}

export interface PerformanceThresholds {
  maxRenderTime: number;
  maxPropsSize: number;
  maxStateSize: number;
  maxHookCount: number;
  maxMemoryUsage: number;
  maxRenderCount: number;
}

export interface PerformanceConfig {
  enabled: boolean;
  thresholds: PerformanceThresholds;
  trackingEnabled: boolean;
  recommendationsEnabled: boolean;
  autoOptimizationEnabled: boolean;
  maxHistorySize: number;
  samplingRate: number;
}

class PerformanceMonitor {
  private config: PerformanceConfig;
  private componentData: Map<string, ComponentPerformanceData> = new Map();
  private renderStack: Map<string, number> = new Map();
  private globalMetrics: PerformanceMetrics[] = [];
  private observers: PerformanceObserver[] = [];
  private memoryMonitorInterval?: NodeJS.Timeout;

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = {
      enabled: true,
      thresholds: {
        maxRenderTime: 16, // 60fps = 16.67ms per frame
        maxPropsSize: 1000, // 1KB
        maxStateSize: 500, // 500 bytes
        maxHookCount: 10,
        maxMemoryUsage: 50 * 1024 * 1024, // 50MB
        maxRenderCount: 100
      },
      trackingEnabled: true,
      recommendationsEnabled: true,
      autoOptimizationEnabled: false,
      maxHistorySize: 100,
      samplingRate: 1.0,
      ...config
    };

    if (this.config.enabled) {
      this.initializeMonitoring();
    }
  }

  /**
   * Initialize performance monitoring
   */
  private initializeMonitoring(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      this.setupPerformanceObservers();
      this.startMemoryMonitoring();
    }
  }

  /**
   * Setup performance observers
   */
  private setupPerformanceObservers(): void {
    try {
      // Observer for render performance
      const renderObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure' && entry.name.startsWith('render-')) {
            this.handleRenderMeasure(entry);
          }
        }
      });
      renderObserver.observe({ entryTypes: ['measure'] });
      this.observers.push(renderObserver);

      // Observer for navigation timing
      const navigationObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            this.handleNavigationTiming(entry);
          }
        }
      });
      navigationObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navigationObserver);
    } catch (error) {
      console.warn('Performance observers not supported:', error);
    }
  }

  /**
   * Start memory monitoring
   */
  private startMemoryMonitoring(): void {
    if ('memory' in performance) {
      this.memoryMonitorInterval = setInterval(() => {
        this.recordMemoryUsage();
      }, 5000); // Every 5 seconds
    }
  }

  /**
   * Handle render measure
   */
  private handleRenderMeasure(entry: PerformanceEntry): void {
    const componentName = entry.name.replace('render-', '');
    const renderTime = entry.duration;

    this.updateComponentMetrics(componentName, renderTime);
  }

  /**
   * Handle navigation timing
   */
  private handleNavigationTiming(entry: PerformanceNavigationTiming): void {
    // Log page load performance
    console.log('Page Load Performance:', {
      domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
      loadComplete: entry.loadEventEnd - entry.loadEventStart,
      totalLoadTime: entry.loadEventEnd - entry.fetchStart,
      firstPaint: this.getFirstPaint(),
      firstContentfulPaint: this.getFirstContentfulPaint()
    });
  }

  /**
   * Get first paint time
   */
  private getFirstPaint(): number | null {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : null;
  }

  /**
   * Get first contentful paint time
   */
  private getFirstContentfulPaint(): number | null {
    const paintEntries = performance.getEntriesByType('paint');
    const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return firstContentfulPaint ? firstContentfulPaint.startTime : null;
  }

  /**
   * Record memory usage
   */
  private recordMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryUsage = {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        timestamp: Date.now()
      };

      // Check for memory leaks
      if (memoryUsage.used > this.config.thresholds.maxMemoryUsage) {
        console.warn('High memory usage detected:', memoryUsage);
        this.generateMemoryRecommendations(memoryUsage);
      }
    }
  }

  /**
   * Start component render tracking
   */
  startRender(componentName: string): void {
    if (!this.config.enabled || Math.random() > this.config.samplingRate) {
      return;
    }

    this.renderStack.set(componentName, performance.now());
  }

  /**
   * End component render tracking
   */
  endRender(componentName: string, props?: any, state?: any, hookCount?: number): void {
    if (!this.config.enabled || !this.renderStack.has(componentName)) {
      return;
    }

    const startTime = this.renderStack.get(componentName)!;
    const renderTime = performance.now() - startTime;
    this.renderStack.delete(componentName);

    this.updateComponentMetrics(componentName, renderTime, props, state, hookCount);
  }

  /**
   * Update component metrics
   */
  private updateComponentMetrics(
    componentName: string,
    renderTime: number,
    props?: any,
    state?: any,
    hookCount?: number
  ): void {
    let componentData = this.componentData.get(componentName);

    if (!componentData) {
      componentData = {
        componentName,
        metrics: [],
        currentMetrics: this.createEmptyMetrics(componentName),
        isPerformanceIssue: false,
        recommendations: []
      };
      this.componentData.set(componentName, componentData);
    }

    const propsSize = props ? this.getObjectSize(props) : 0;
    const stateSize = state ? this.getObjectSize(state) : 0;
    const memoryUsage = this.getCurrentMemoryUsage();

    const newMetric: PerformanceMetrics = {
      timestamp: Date.now(),
      renderTime,
      componentName,
      propsSize,
      stateSize,
      hookCount: hookCount || 0,
      memoryUsage,
      renderCount: componentData.metrics.length + 1,
      averageRenderTime: 0,
      lastRenderTime: renderTime,
      minRenderTime: renderTime,
      maxRenderTime: renderTime
    };

    // Calculate averages and min/max
    const allMetrics = [...componentData.metrics, newMetric];
    newMetric.averageRenderTime = allMetrics.reduce((sum, m) => sum + m.renderTime, 0) / allMetrics.length;
    newMetric.minRenderTime = Math.min(...allMetrics.map(m => m.renderTime));
    newMetric.maxRenderTime = Math.max(...allMetrics.map(m => m.renderTime));

    componentData.metrics.push(newMetric);
    componentData.currentMetrics = newMetric;

    // Maintain history size
    if (componentData.metrics.length > this.config.maxHistorySize) {
      componentData.metrics = componentData.metrics.slice(-this.config.maxHistorySize);
    }

    // Check for performance issues
    this.checkPerformanceIssues(componentData);

    // Generate recommendations
    if (this.config.recommendationsEnabled) {
      this.generateRecommendations(componentData);
    }
  }

  /**
   * Create empty metrics object
   */
  private createEmptyMetrics(componentName: string): PerformanceMetrics {
    return {
      timestamp: Date.now(),
      renderTime: 0,
      componentName,
      propsSize: 0,
      stateSize: 0,
      hookCount: 0,
      renderCount: 0,
      averageRenderTime: 0,
      lastRenderTime: 0,
      minRenderTime: 0,
      maxRenderTime: 0
    };
  }

  /**
   * Get object size in bytes
   */
  private getObjectSize(obj: any): number {
    try {
      return new Blob([JSON.stringify(obj)]).size;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Get current memory usage
   */
  private getCurrentMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return undefined;
  }

  /**
   * Check for performance issues
   */
  private checkPerformanceIssues(componentData: ComponentPerformanceData): void {
    const { currentMetrics, thresholds } = this;
    const issues: string[] = [];

    if (currentMetrics.renderTime > thresholds.maxRenderTime) {
      issues.push(`Render time ${currentMetrics.renderTime.toFixed(2)}ms exceeds threshold ${thresholds.maxRenderTime}ms`);
    }

    if (currentMetrics.propsSize > thresholds.maxPropsSize) {
      issues.push(`Props size ${currentMetrics.propsSize} bytes exceeds threshold ${thresholds.maxPropsSize} bytes`);
    }

    if (currentMetrics.stateSize > thresholds.maxStateSize) {
      issues.push(`State size ${currentMetrics.stateSize} bytes exceeds threshold ${thresholds.maxStateSize} bytes`);
    }

    if (currentMetrics.hookCount > thresholds.maxHookCount) {
      issues.push(`Hook count ${currentMetrics.hookCount} exceeds threshold ${thresholds.maxHookCount}`);
    }

    if (currentMetrics.memoryUsage && currentMetrics.memoryUsage > thresholds.maxMemoryUsage) {
      issues.push(`Memory usage ${(currentMetrics.memoryUsage / 1024 / 1024).toFixed(2)}MB exceeds threshold ${(thresholds.maxMemoryUsage / 1024 / 1024).toFixed(2)}MB`);
    }

    componentData.isPerformanceIssue = issues.length > 0;
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(componentData: ComponentPerformanceData): void {
    const recommendations: string[] = [];
    const { currentMetrics } = componentData;

    if (currentMetrics.renderTime > this.config.thresholds.maxRenderTime) {
      recommendations.push('Consider using React.memo() to prevent unnecessary re-renders');
      recommendations.push('Optimize expensive calculations with useMemo()');
      recommendations.push('Use useCallback() for stable function references');
      recommendations.push('Consider code splitting for large components');
    }

    if (currentMetrics.propsSize > this.config.thresholds.maxPropsSize) {
      recommendations.push('Reduce props size by passing only necessary data');
      recommendations.push('Consider using context instead of prop drilling');
      recommendations.push('Split large props objects into smaller, focused props');
    }

    if (currentMetrics.stateSize > this.config.thresholds.maxStateSize) {
      recommendations.push('Consider state normalization or state splitting');
      recommendations.push('Move large state to external state management');
      recommendations.push('Use useReducer() for complex state logic');
    }

    if (currentMetrics.hookCount > this.config.thresholds.maxHookCount) {
      recommendations.push('Consider extracting custom hooks');
      recommendations.push('Split component into smaller, focused components');
      recommendations.push('Review hook dependencies and optimize re-renders');
    }

    if (currentMetrics.averageRenderTime > currentMetrics.renderTime * 2) {
      recommendations.push('Component performance is inconsistent - investigate conditional rendering');
      recommendations.push('Check for expensive operations that run conditionally');
    }

    componentData.recommendations = recommendations;
  }

  /**
   * Generate memory recommendations
   */
  private generateMemoryRecommendations(memoryUsage: any): void {
    const recommendations: string[] = [];

    if (memoryUsage.used > memoryUsage.total * 0.9) {
      recommendations.push('Memory usage is near capacity - consider memory optimization');
      recommendations.push('Check for memory leaks in event listeners and subscriptions');
      recommendations.push('Use WeakMap/WeakSet for temporary object storage');
    }

    if (recommendations.length > 0) {
      console.warn('Memory Recommendations:', recommendations);
    }
  }

  /**
   * Get component performance data
   */
  getComponentData(componentName: string): ComponentPerformanceData | undefined {
    return this.componentData.get(componentName);
  }

  /**
   * Get all component performance data
   */
  getAllComponentData(): ComponentPerformanceData[] {
    return Array.from(this.componentData.values());
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    totalComponents: number;
    componentsWithIssues: number;
    averageRenderTime: number;
    totalMemoryUsage: number;
    recommendations: string[];
  } {
    const allData = this.getAllComponentData();
    const componentsWithIssues = allData.filter(data => data.isPerformanceIssue);
    const averageRenderTime = allData.reduce((sum, data) => sum + data.currentMetrics.averageRenderTime, 0) / allData.length || 0;
    const totalMemoryUsage = this.getCurrentMemoryUsage() || 0;

    const allRecommendations = allData.flatMap(data => data.recommendations);

    return {
      totalComponents: allData.length,
      componentsWithIssues: componentsWithIssues.length,
      averageRenderTime,
      totalMemoryUsage,
      recommendations: [...new Set(allRecommendations)] // Remove duplicates
    };
  }

  /**
   * Get performance report
   */
  getPerformanceReport(): string {
    const summary = this.getPerformanceSummary();
    const allData = this.getAllComponentData();

    let report = `Performance Report\n`;
    report += `==================\n\n`;
    report += `Total Components: ${summary.totalComponents}\n`;
    report += `Components with Issues: ${summary.componentsWithIssues}\n`;
    report += `Average Render Time: ${summary.averageRenderTime.toFixed(2)}ms\n`;
    report += `Total Memory Usage: ${(summary.totalMemoryUsage / 1024 / 1024).toFixed(2)}MB\n\n`;

    if (summary.componentsWithIssues > 0) {
      report += `Performance Issues:\n`;
      report += `-------------------\n`;
      allData.filter(data => data.isPerformanceIssue).forEach(data => {
        report += `\n${data.componentName}:\n`;
        report += `- Render Time: ${data.currentMetrics.renderTime.toFixed(2)}ms\n`;
        report += `- Props Size: ${data.currentMetrics.propsSize} bytes\n`;
        report += `- State Size: ${data.currentMetrics.stateSize} bytes\n`;
        report += `- Hook Count: ${data.currentMetrics.hookCount}\n`;
        if (data.recommendations.length > 0) {
          report += `- Recommendations: ${data.recommendations.join(', ')}\n`;
        }
      });
    }

    if (summary.recommendations.length > 0) {
      report += `\nGeneral Recommendations:\n`;
      report += `----------------------\n`;
      summary.recommendations.forEach((rec, index) => {
        report += `${index + 1}. ${rec}\n`;
      });
    }

    return report;
  }

  /**
   * Clear performance data
   */
  clearData(): void {
    this.componentData.clear();
    this.globalMetrics = [];
    this.renderStack.clear();
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<PerformanceConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): PerformanceConfig {
    return { ...this.config };
  }

  /**
   * Enable/disable monitoring
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    if (enabled) {
      this.initializeMonitoring();
    } else {
      this.cleanup();
    }
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    
    if (this.memoryMonitorInterval) {
      clearInterval(this.memoryMonitorInterval);
      this.memoryMonitorInterval = undefined;
    }
  }

  /**
   * Export performance data
   */
  exportData(): {
    timestamp: number;
    config: PerformanceConfig;
    componentData: ComponentPerformanceData[];
    summary: ReturnType<typeof this.getPerformanceSummary>;
  } {
    return {
      timestamp: Date.now(),
      config: this.getConfig(),
      componentData: this.getAllComponentData(),
      summary: this.getPerformanceSummary()
    };
  }
}

/**
 * React hook for performance monitoring
 */
export function usePerformanceMonitor(componentName: string, options?: {
  trackProps?: boolean;
  trackState?: boolean;
  trackHooks?: boolean;
}) {
  const monitor = PerformanceMonitor.getInstance();
  
  const startRender = () => {
    monitor.startRender(componentName);
  };

  const endRender = (props?: any, state?: any, hookCount?: number) => {
    if (options?.trackProps !== false && props) {
      // Track props
    }
    if (options?.trackState !== false && state) {
      // Track state
    }
    if (options?.trackHooks !== false && hookCount) {
      // Track hooks
    }
    
    monitor.endRender(componentName, props, state, hookCount);
  };

  return { startRender, endRender };
}

/**
 * Higher-order component for performance monitoring
 */
export function withPerformanceMonitor<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  return React.memo<P>((props) => {
    const { startRender, endRender } = usePerformanceMonitor(displayName);
    
    React.useEffect(() => {
      startRender();
      
      return () => {
        // Component unmount
        endRender(props);
      };
    });
    
    React.useLayoutEffect(() => {
      endRender(props);
    });
    
    return React.createElement(WrappedComponent, props);
  });
}

/**
 * Singleton instance
 */
PerformanceMonitor.getInstance = (() => {
  let instance: PerformanceMonitor;
  
  return () => {
    if (!instance) {
      instance = new PerformanceMonitor();
    }
    return instance;
  };
})();

// Add getInstance method to class
(PerformanceMonitor as any).getInstance = (() => {
  let instance: PerformanceMonitor;
  
  return () => {
    if (!instance) {
      instance = new PerformanceMonitor();
    }
    return instance;
  };
})();

export default PerformanceMonitor.getInstance();
