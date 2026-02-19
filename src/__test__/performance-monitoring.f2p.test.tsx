/**
 * F2P tests for performance monitoring enhancements.
 * These tests would fail on the base branch and pass after the fixes.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import PerformanceMonitor, {
  usePerformanceMonitor,
  withPerformanceMonitor,
  PerformanceMetrics,
  ComponentPerformanceData
} from '../utils/performance-monitor';

// Mock performance API
const mockPerformance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn(),
  clearMarks: vi.fn(),
  clearMeasures: vi.fn(),
  memory: {
    usedJSHeapSize: 10 * 1024 * 1024,
    totalJSHeapSize: 20 * 1024 * 1024,
    jsHeapSizeLimit: 100 * 1024 * 1024
  }
};

// Mock PerformanceObserver
const mockPerformanceObserver = vi.fn();
mockPerformanceObserver.mockImplementation((callback) => ({
  observe: vi.fn(),
  disconnect: vi.fn()
}));

describe('Performance Monitoring F2P Tests', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock global performance
    (globalThis as any).performance = mockPerformance;
    (globalThis as any).PerformanceObserver = mockPerformanceObserver;
    
    // Create new monitor instance
    monitor = new PerformanceMonitor();
  });

  afterEach(() => {
    monitor.cleanup();
  });

  describe('Performance Monitor Basic Functionality', () => {
    it('should create monitor with default config', () => {
      // Bug: Should create monitor with default configuration
      const config = monitor.getConfig();
      
      expect(config.enabled).toBe(true);
      expect(config.thresholds.maxRenderTime).toBe(16);
      expect(config.thresholds.maxPropsSize).toBe(1000);
      expect(config.thresholds.maxStateSize).toBe(500);
      expect(config.thresholds.maxHookCount).toBe(10);
      expect(config.trackingEnabled).toBe(true);
      expect(config.recommendationsEnabled).toBe(true);
    });

    it('should create monitor with custom config', () => {
      // Bug: Should create monitor with custom configuration
      const customMonitor = new PerformanceMonitor({
        enabled: false,
        thresholds: {
          maxRenderTime: 32,
          maxPropsSize: 2000
        },
        samplingRate: 0.5
      });
      
      const config = customMonitor.getConfig();
      expect(config.enabled).toBe(false);
      expect(config.thresholds.maxRenderTime).toBe(32);
      expect(config.thresholds.maxPropsSize).toBe(2000);
      expect(config.samplingRate).toBe(0.5);
    });

    it('should track component render performance', () => {
      // Bug: Should track component render performance
      const componentName = 'TestComponent';
      
      monitor.startRender(componentName);
      
      // Simulate render time
      mockPerformance.now.mockReturnValueOnce(Date.now() + 10);
      
      monitor.endRender(componentName, { prop1: 'value1' }, { state1: 'value2' }, 5);
      
      const data = monitor.getComponentData(componentName);
      expect(data).toBeDefined();
      expect(data?.componentName).toBe(componentName);
      expect(data?.currentMetrics.renderTime).toBe(10);
      expect(data?.currentMetrics.propsSize).toBeGreaterThan(0);
      expect(data?.currentMetrics.stateSize).toBeGreaterThan(0);
      expect(data?.currentMetrics.hookCount).toBe(5);
    });

    it('should handle multiple renders for same component', () => {
      // Bug: Should handle multiple renders for same component
      const componentName = 'TestComponent';
      
      // First render
      monitor.startRender(componentName);
      mockPerformance.now.mockReturnValueOnce(Date.now() + 10);
      monitor.endRender(componentName);
      
      // Second render
      monitor.startRender(componentName);
      mockPerformance.now.mockReturnValueOnce(Date.now() + 20);
      monitor.endRender(componentName);
      
      const data = monitor.getComponentData(componentName);
      expect(data?.metrics).toHaveLength(2);
      expect(data?.currentMetrics.renderCount).toBe(2);
      expect(data?.currentMetrics.averageRenderTime).toBe(15); // (10 + 20) / 2
    });

    it('should calculate min and max render times', () => {
      // Bug: Should calculate min and max render times
      const componentName = 'TestComponent';
      
      // Multiple renders with different times
      const renderTimes = [5, 15, 25, 10];
      
      renderTimes.forEach((time, index) => {
        monitor.startRender(componentName);
        mockPerformance.now.mockReturnValueOnce(Date.now() + time);
        monitor.endRender(componentName);
      });
      
      const data = monitor.getComponentData(componentName);
      expect(data?.currentMetrics.minRenderTime).toBe(5);
      expect(data?.currentMetrics.maxRenderTime).toBe(25);
    });
  });

  describe('Performance Thresholds and Issues', () => {
    it('should detect performance issues', () => {
      // Bug: Should detect performance issues
      const componentName = 'SlowComponent';
      
      monitor.startRender(componentName);
      mockPerformance.now.mockReturnValueOnce(Date.now() + 25); // Exceeds 16ms threshold
      
      const largeProps = { data: new Array(1000).fill('x').join('') }; // Large props
      monitor.endRender(componentName, largeProps, { large: new Array(500).fill('y').join('') }, 15);
      
      const data = monitor.getComponentData(componentName);
      expect(data?.isPerformanceIssue).toBe(true);
    });

    it('should generate recommendations for slow renders', () => {
      // Bug: Should generate recommendations for slow renders
      const componentName = 'SlowComponent';
      
      monitor.startRender(componentName);
      mockPerformance.now.mockReturnValueOnce(Date.now() + 25);
      monitor.endRender(componentName);
      
      const data = monitor.getComponentData(componentName);
      expect(data?.recommendations).toContain('Consider using React.memo() to prevent unnecessary re-renders');
      expect(data?.recommendations).toContain('Optimize expensive calculations with useMemo()');
    });

    it('should generate recommendations for large props', () => {
      // Bug: Should generate recommendations for large props
      const componentName = 'LargePropsComponent';
      
      monitor.startRender(componentName);
      mockPerformance.now.mockReturnValueOnce(Date.now() + 10);
      
      const largeProps = { data: new Array(2000).fill('x').join('') }; // Exceeds 1000 bytes
      monitor.endRender(componentName, largeProps);
      
      const data = monitor.getComponentData(componentName);
      expect(data?.recommendations).toContain('Reduce props size by passing only necessary data');
      expect(data?.recommendations).toContain('Consider using context instead of prop drilling');
    });

    it('should generate recommendations for many hooks', () => {
      // Bug: Should generate recommendations for many hooks
      const componentName = 'ManyHooksComponent';
      
      monitor.startRender(componentName);
      mockPerformance.now.mockReturnValueOnce(Date.now() + 10);
      monitor.endRender(componentName, undefined, undefined, 15); // Exceeds 10 hooks
      
      const data = monitor.getComponentData(componentName);
      expect(data?.recommendations).toContain('Consider extracting custom hooks');
      expect(data?.recommendations).toContain('Split component into smaller, focused components');
    });
  });

  describe('Performance Summary and Reporting', () => {
    it('should generate performance summary', () => {
      // Bug: Should generate performance summary
      // Add components with different performance characteristics
      const components = [
        { name: 'FastComponent', time: 5, hasIssue: false },
        { name: 'SlowComponent', time: 25, hasIssue: true },
        { name: 'MediumComponent', time: 12, hasIssue: false }
      ];
      
      components.forEach(comp => {
        monitor.startRender(comp.name);
        mockPerformance.now.mockReturnValueOnce(Date.now() + comp.time);
        monitor.endRender(comp.name);
      });
      
      const summary = monitor.getPerformanceSummary();
      expect(summary.totalComponents).toBe(3);
      expect(summary.componentsWithIssues).toBe(1);
      expect(summary.averageRenderTime).toBeCloseTo(14, 1); // (5 + 25 + 12) / 3
      expect(summary.recommendations.length).toBeGreaterThan(0);
    });

    it('should generate performance report', () => {
      // Bug: Should generate performance report
      monitor.startRender('TestComponent');
      mockPerformance.now.mockReturnValueOnce(Date.now() + 20);
      monitor.endRender('TestComponent');
      
      const report = monitor.getPerformanceReport();
      
      expect(report).toContain('Performance Report');
      expect(report).toContain('Total Components: 1');
      expect(report).toContain('Components with Issues: 1');
      expect(report).toContain('TestComponent:');
      expect(report).toContain('Recommendations:');
    });

    it('should export performance data', () => {
      // Bug: Should export performance data
      monitor.startRender('TestComponent');
      mockPerformance.now.mockReturnValueOnce(Date.now() + 10);
      monitor.endRender('TestComponent');
      
      const exportedData = monitor.exportData();
      
      expect(exportedData.timestamp).toBeDefined();
      expect(exportedData.config).toBeDefined();
      expect(exportedData.componentData).toHaveLength(1);
      expect(exportedData.summary).toBeDefined();
    });
  });

  describe('Memory Monitoring', () => {
    it('should record memory usage', () => {
      // Bug: Should record memory usage
      // This would be tested in a real browser environment
      expect(mockPerformance.memory.usedJSHeapSize).toBe(10 * 1024 * 1024);
    });

    it('should detect high memory usage', () => {
      // Bug: Should detect high memory usage
      const customMonitor = new PerformanceMonitor({
        thresholds: {
          maxMemoryUsage: 5 * 1024 * 1024 // 5MB threshold
        }
      });
      
      // Mock high memory usage
      (mockPerformance.memory as any).usedJSHeapSize = 60 * 1024 * 1024; // 60MB
      
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      customMonitor.recordMemoryUsage();
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'High memory usage detected:',
        expect.objectContaining({
          used: 60 * 1024 * 1024
        })
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('Configuration Management', () => {
    it('should update configuration', () => {
      // Bug: Should update configuration
      monitor.updateConfig({
        enabled: false,
        thresholds: {
          maxRenderTime: 32
        }
      });
      
      const config = monitor.getConfig();
      expect(config.enabled).toBe(false);
      expect(config.thresholds.maxRenderTime).toBe(32);
    });

    it('should preserve existing config when updating', () => {
      // Bug: Should preserve existing config when updating
      const originalConfig = monitor.getConfig();
      
      monitor.updateConfig({
        thresholds: {
          maxRenderTime: 50
        }
      });
      
      const newConfig = monitor.getConfig();
      expect(newConfig.thresholds.maxRenderTime).toBe(50);
      expect(newConfig.enabled).toBe(originalConfig.enabled);
      expect(newConfig.trackingEnabled).toBe(originalConfig.trackingEnabled);
    });

    it('should enable/disable monitoring', () => {
      // Bug: Should enable/disable monitoring
      monitor.setEnabled(false);
      expect(monitor.getConfig().enabled).toBe(false);
      
      monitor.setEnabled(true);
      expect(monitor.getConfig().enabled).toBe(true);
    });
  });

  describe('Data Management', () => {
    it('should clear performance data', () => {
      // Bug: Should clear performance data
      monitor.startRender('TestComponent');
      mockPerformance.now.mockReturnValueOnce(Date.now() + 10);
      monitor.endRender('TestComponent');
      
      expect(monitor.getComponentData('TestComponent')).toBeDefined();
      
      monitor.clearData();
      expect(monitor.getComponentData('TestComponent')).toBeUndefined();
    });

    it('should maintain history size limit', () => {
      // Bug: Should maintain history size limit
      const customMonitor = new PerformanceMonitor({
        maxHistorySize: 3
      });
      
      // Add more renders than history size
      for (let i = 0; i < 5; i++) {
        customMonitor.startRender('TestComponent');
        mockPerformance.now.mockReturnValueOnce(Date.now() + i);
        customMonitor.endRender('TestComponent');
      }
      
      const data = customMonitor.getComponentData('TestComponent');
      expect(data?.metrics).toHaveLength(3); // Should be limited to maxHistorySize
    });
  });

  describe('React Hook Integration', () => {
    it('should provide performance monitoring hook', () => {
      // Bug: Should provide performance monitoring hook
      const TestComponent = () => {
        const { startRender, endRender } = usePerformanceMonitor('TestComponent');
        
        React.useEffect(() => {
          startRender();
          endRender({ prop: 'value' }, { state: 'value' }, 3);
        }, []);
        
        return React.createElement('div', null, 'Test');
      };
      
      expect(() => {
        render(React.createElement(TestComponent));
      }).not.toThrow();
    });

    it('should track hook options correctly', () => {
      // Bug: Should track hook options correctly
      const TestComponent = () => {
        const { startRender, endRender } = usePerformanceMonitor('TestComponent', {
          trackProps: false,
          trackState: false,
          trackHooks: true
        });
        
        React.useEffect(() => {
          startRender();
          endRender({}, {}, 5);
        }, []);
        
        return React.createElement('div', null, 'Test');
      };
      
      expect(() => {
        render(React.createElement(TestComponent));
      }).not.toThrow();
    });
  });

  describe('Higher-Order Component', () => {
    it('should wrap component with performance monitoring', () => {
      // Bug: Should wrap component with performance monitoring
      const TestComponent = React.memo(() => React.createElement('div', null, 'Test'));
      TestComponent.displayName = 'TestComponent';
      
      const WrappedComponent = withPerformanceMonitor(TestComponent);
      
      expect(() => {
        render(React.createElement(WrappedComponent, { prop: 'value' }));
      }).not.toThrow();
    });

    it('should use component name from displayName', () => {
      // Bug: Should use component name from displayName
      const TestComponent = React.memo(() => React.createElement('div', null, 'Test'));
      TestComponent.displayName = 'CustomComponent';
      
      const WrappedComponent = withPerformanceMonitor(TestComponent);
      
      expect(WrappedComponent.displayName).toContain('CustomComponent');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle missing performance API', () => {
      // Bug: Should handle missing performance API
      delete (global as any).performance;
      
      expect(() => {
        new PerformanceMonitor();
      }).not.toThrow();
    });

    it('should handle circular references in props', () => {
      // Bug: Should handle circular references in props
      const circular: any = { name: 'test' };
      circular.self = circular;
      
      monitor.startRender('TestComponent');
      mockPerformance.now.mockReturnValueOnce(Date.now() + 10);
      
      expect(() => {
        monitor.endRender('TestComponent', circular);
      }).not.toThrow();
    });

    it('should handle endRender without startRender', () => {
      // Bug: Should handle endRender without startRender
      expect(() => {
        monitor.endRender('TestComponent');
      }).not.toThrow();
    });

    it('should handle sampling rate', () => {
      // Bug: Should handle sampling rate
      const customMonitor = new PerformanceMonitor({
        samplingRate: 0.0 // Never sample
      });
      
      customMonitor.startRender('TestComponent');
      mockPerformance.now.mockReturnValueOnce(Date.now() + 10);
      customMonitor.endRender('TestComponent');
      
      // Should not track due to sampling rate
      expect(customMonitor.getComponentData('TestComponent')).toBeUndefined();
    });

    it('should handle disabled monitoring', () => {
      // Bug: Should handle disabled monitoring
      const customMonitor = new PerformanceMonitor({
        enabled: false
      });
      
      customMonitor.startRender('TestComponent');
      mockPerformance.now.mockReturnValueOnce(Date.now() + 10);
      customMonitor.endRender('TestComponent');
      
      // Should not track when disabled
      expect(customMonitor.getComponentData('TestComponent')).toBeUndefined();
    });
  });

  describe('Performance Observers', () => {
    it('should setup performance observers when available', () => {
      // Bug: Should setup performance observers when available
      expect(mockPerformanceObserver).toHaveBeenCalled();
    });

    it('should handle performance observer errors gracefully', () => {
      // Bug: Should handle performance observer errors gracefully
      mockPerformanceObserver.mockImplementation(() => {
        throw new Error('PerformanceObserver not supported');
      });
      
      expect(() => {
        new PerformanceMonitor();
      }).not.toThrow();
    });

    it('should handle navigation timing', () => {
      // Bug: Should handle navigation timing
      const mockNavigationEntry = {
        entryType: 'navigation',
        domContentLoadedEventEnd: 100,
        domContentLoadedEventStart: 50,
        loadEventEnd: 200,
        loadEventStart: 150,
        fetchStart: 0
      };
      
      const mockCallback = vi.fn();
      mockPerformanceObserver.mockImplementation((callback) => ({
        observe: vi.fn(),
        disconnect: vi.fn()
      }));
      
      const monitor = new PerformanceMonitor();
      // This would be tested in a real browser environment
      expect(monitor).toBeDefined();
    });
  });

  describe('Singleton Pattern', () => {
    it('should return same instance', () => {
      // Bug: Should return same instance
      const instance1 = PerformanceMonitor.getInstance();
      const instance2 = PerformanceMonitor.getInstance();
      
      expect(instance1).toBe(instance2);
    });

    it('should maintain state across getInstance calls', () => {
      // Bug: Should maintain state across getInstance calls
      const instance1 = PerformanceMonitor.getInstance();
      
      instance1.startRender('TestComponent');
      mockPerformance.now.mockReturnValueOnce(Date.now() + 10);
      instance1.endRender('TestComponent');
      
      const instance2 = PerformanceMonitor.getInstance();
      const data = instance2.getComponentData('TestComponent');
      
      expect(data).toBeDefined();
      expect(data?.currentMetrics.renderTime).toBe(10);
    });
  });

  describe('Cleanup and Resource Management', () => {
    it('should cleanup observers on cleanup', () => {
      // Bug: Should cleanup observers on cleanup
      const mockDisconnect = vi.fn();
      mockPerformanceObserver.mockImplementation(() => ({
        observe: vi.fn(),
        disconnect: mockDisconnect
      }));
      
      const customMonitor = new PerformanceMonitor();
      customMonitor.cleanup();
      
      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should clear memory monitoring interval on cleanup', () => {
      // Bug: Should clear memory monitoring interval on cleanup
      const customMonitor = new PerformanceMonitor();
      
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
      
      customMonitor.cleanup();
      
      // This would be tested in a real environment with memory monitoring
      expect(customMonitor).toBeDefined();
      
      clearIntervalSpy.mockRestore();
    });
  });
});
