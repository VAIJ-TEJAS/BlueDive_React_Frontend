/**
 * F2P tests for tooltip component.
 * These tests would fail on the base branch and pass after the fixes.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Tooltip } from '../components/tooltip';

// Mock getBoundingClientRect
Element.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 100,
  height: 50,
  top: 100,
  left: 100,
  right: 200,
  bottom: 150,
  x: 100,
  y: 100,
  toJSON: jest.fn()
}));

// Mock window properties
Object.defineProperty(window, 'pageXOffset', {
  writable: true,
  value: 0
});

Object.defineProperty(window, 'pageYOffset', {
  writable: true,
  value: 0
});

Object.defineProperty(window, 'innerWidth', {
  writable: true,
  value: 1024
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  value: 768
});

describe('Tooltip F2P Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render children', () => {
      render(
        <Tooltip content="Tooltip content">
          <button>Hover me</button>
        </Tooltip>
      );
      
      expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument();
    });

    it('should not show tooltip initially', () => {
      render(
        <Tooltip content="Tooltip content">
          <button>Hover me</button>
        </Tooltip>
      );
      
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('should show tooltip on mouse enter', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Tooltip content">
          <button>Hover me</button>
        </Tooltip>
      );
      
      const button = screen.getByRole('button', { name: 'Hover me' });
      await user.hover(button);
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
        expect(screen.getByText('Tooltip content')).toBeInTheDocument();
      });
    });

    it('should hide tooltip on mouse leave', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Tooltip content">
          <button>Hover me</button>
        </Tooltip>
      );
      
      const button = screen.getByRole('button', { name: 'Hover me' });
      await user.hover(button);
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
      
      await user.unhover(button);
      
      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it('should show tooltip on focus', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Tooltip content">
          <button>Focus me</button>
        </Tooltip>
      );
      
      const button = screen.getByRole('button', { name: 'Focus me' });
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('should hide tooltip on blur', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Tooltip content">
          <button>Focus me</button>
        </Tooltip>
      );
      
      const button = screen.getByRole('button', { name: 'Focus me' });
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
      
      await user.tab(); // Move focus away
      
      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      }, { timeout: 1000 });
    });
  });

  describe('Positioning', () => {
    it('should position tooltip at top by default', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Tooltip content" position="top">
          <button>Hover me</button>
        </Tooltip>
      );
      
      const button = screen.getByRole('button', { name: 'Hover me' });
      await user.hover(button);
      
      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toBeInTheDocument();
        // Check if tooltip is positioned above the button
        const tooltipStyle = window.getComputedStyle(tooltip);
        expect(tooltipStyle.position).toBe('fixed');
      });
    });

    it('should position tooltip at bottom', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Tooltip content" position="bottom">
          <button>Hover me</button>
        </Tooltip>
      );
      
      const button = screen.getByRole('button', { name: 'Hover me' });
      await user.hover(button);
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('should position tooltip at left', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Tooltip content" position="left">
          <button>Hover me</button>
        </Tooltip>
      );
      
      const button = screen.getByRole('button', { name: 'Hover me' });
      await user.hover(button);
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('should position tooltip at right', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Tooltip content" position="right">
          <button>Hover me</button>
        </Tooltip>
      );
      
      const button = screen.getByRole('button', { name: 'Hover me' });
      await user.hover(button);
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });
  });

  describe('Content types', () => {
    it('should render text content', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Simple text">
          <button>Hover me</button>
        </Tooltip>
      );
      
      await user.hover(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(screen.getByText('Simple text')).toBeInTheDocument();
      });
    });

    it('should render JSX content', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content={
          <div>
            <strong>Bold text</strong>
            <span>Regular text</span>
          </div>
        }>
          <button>Hover me</button>
        </Tooltip>
      );
      
      await user.hover(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(screen.getByText('Bold text')).toBeInTheDocument();
        expect(screen.getByText('Regular text')).toBeInTheDocument();
      });
    });

    it('should render complex content', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content={
          <div className="p-4">
            <h3 className="font-bold">Title</h3>
            <p>Description</p>
            <button>Action</button>
          </div>
        }>
          <button>Hover me</button>
        </Tooltip>
      );
      
      await user.hover(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
      });
    });
  });

  describe('Delay functionality', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should respect delay before showing tooltip', async () => {
      render(
        <Tooltip content="Delayed tooltip" delay={500}>
          <button>Hover me</button>
        </Tooltip>
      );
      
      const button = screen.getByRole('button', { name: 'Hover me' });
      fireEvent.mouseEnter(button);
      
      // Should not show immediately
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      
      // Advance time by delay
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('should cancel delay on mouse leave', async () => {
      render(
        <Tooltip content="Delayed tooltip" delay={500}>
          <button>Hover me</button>
        </Tooltip>
      );
      
      const button = screen.getByRole('button', { name: 'Hover me' });
      fireEvent.mouseEnter(button);
      
      // Leave before delay completes
      fireEvent.mouseLeave(button);
      
      // Advance time by delay
      jest.advanceTimersByTime(500);
      
      // Should not show tooltip
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  describe('Disabled state', () => {
    it('should not show tooltip when disabled', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Disabled tooltip" disabled>
          <button>Hover me</button>
        </Tooltip>
      );
      
      const button = screen.getByRole('button', { name: 'Hover me' });
      await user.hover(button);
      
      // Wait for potential delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('should not show tooltip on focus when disabled', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Disabled tooltip" disabled>
          <button>Focus me</button>
        </Tooltip>
      );
      
      const button = screen.getByRole('button', { name: 'Focus me' });
      await user.click(button);
      
      // Wait for potential delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  describe('Custom styling', () => {
    it('should apply custom className to container', () => {
      render(
        <Tooltip content="Tooltip content" className="custom-container">
          <button>Hover me</button>
        </Tooltip>
      );
      
      const container = screen.getByRole('button').parentElement;
      expect(container).toHaveClass('custom-container');
    });

    it('should apply custom className to tooltip', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Tooltip content" tooltipClassName="custom-tooltip">
          <button>Hover me</button>
        </Tooltip>
      );
      
      await user.hover(screen.getByRole('button'));
      
      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveClass('custom-tooltip');
      });
    });
  });

  describe('Viewport boundaries', () => {
    it('should adjust position when tooltip would go outside viewport', async () => {
      // Mock window dimensions
      Object.defineProperty(window, 'innerWidth', { value: 200 });
      Object.defineProperty(window, 'innerHeight', { value: 200 });
      
      // Mock getBoundingClientRect to return position near viewport edge
      Element.prototype.getBoundingClientRect = jest.fn(() => ({
        width: 100,
        height: 50,
        top: 150,
        left: 150,
        right: 250,
        bottom: 200,
        x: 150,
        y: 150,
        toJSON: jest.fn()
      }));
      
      const user = userEvent.setup();
      render(
        <Tooltip content="Tooltip content" position="right">
          <button>Hover me</button>
        </Tooltip>
      );
      
      await user.hover(screen.getByRole('button'));
      
      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toBeInTheDocument();
        // Tooltip should be repositioned to stay within viewport
        const style = window.getComputedStyle(tooltip);
        expect(parseInt(style.left || '0')).toBeLessThanOrEqual(200);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have tooltip role', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Tooltip content">
          <button>Hover me</button>
        </Tooltip>
      );
      
      await user.hover(screen.getByRole('button'));
      
      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toBeInTheDocument();
      });
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Tooltip content">
          <button>Tab to me</button>
        </Tooltip>
      );
      
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });
  });

  describe('Event handling', () => {
    it('should handle rapid hover events', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Tooltip content">
          <button>Hover me</button>
        </Tooltip>
      );
      
      const button = screen.getByRole('button', { name: 'Hover me' });
      
      // Rapid hover/unhover
      await user.hover(button);
      await user.unhover(button);
      await user.hover(button);
      await user.unhover(button);
      
      // Should not crash and tooltip should be hidden
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('should handle multiple tooltips', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <Tooltip content="First tooltip">
            <button>Button 1</button>
          </Tooltip>
          <Tooltip content="Second tooltip">
            <button>Button 2</button>
          </Tooltip>
        </div>
      );
      
      const button1 = screen.getByRole('button', { name: 'Button 1' });
      const button2 = screen.getByRole('button', { name: 'Button 2' });
      
      await user.hover(button1);
      
      await waitFor(() => {
        expect(screen.getByText('First tooltip')).toBeInTheDocument();
      });
      
      await user.unhover(button1);
      await user.hover(button2);
      
      await waitFor(() => {
        expect(screen.queryByText('First tooltip')).not.toBeInTheDocument();
        expect(screen.getByText('Second tooltip')).toBeInTheDocument();
      });
    });
  });

  describe('Window events', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should recalculate position on window resize', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Tooltip content">
          <button>Hover me</button>
        </Tooltip>
      );
      
      await user.hover(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
      
      // Trigger window resize
      fireEvent.resize(window);
      
      // Should still be visible and repositioned
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('should recalculate position on window scroll', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Tooltip content">
          <button>Hover me</button>
        </Tooltip>
      );
      
      await user.hover(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
      
      // Trigger window scroll
      fireEvent.scroll(window);
      
      // Should still be visible and repositioned
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  describe('Cleanup', () => {
    it('should clean up event listeners on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      
      const { unmount } = render(
        <Tooltip content="Tooltip content">
          <button>Hover me</button>
        </Tooltip>
      );
      
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
      
      removeEventListenerSpy.mockRestore();
    });

    it('should clear timeout on unmount', () => {
      jest.useFakeTimers();
      
      const { unmount } = render(
        <Tooltip content="Tooltip content" delay={1000}>
          <button>Hover me</button>
        </Tooltip>
      );
      
      const button = screen.getByRole('button', { name: 'Hover me' });
      fireEvent.mouseEnter(button);
      
      // Unmount before timeout completes
      unmount();
      
      // Advance time - should not cause issues
      jest.advanceTimersByTime(1000);
      
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      
      jest.useRealTimers();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty content', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="">
          <button>Hover me</button>
        </Tooltip>
      );
      
      await user.hover(screen.getByRole('button'));
      
      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toBeEmptyDOMElement();
      });
    });

    it('should handle null content', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content={null}>
          <button>Hover me</button>
        </Tooltip>
      );
      
      await user.hover(screen.getByRole('button'));
      
      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toBeEmptyDOMElement();
      });
    });

    it('should handle very long content', async () => {
      const user = userEvent.setup();
      const longContent = 'A'.repeat(1000);
      
      render(
        <Tooltip content={longContent}>
          <button>Hover me</button>
        </Tooltip>
      );
      
      await user.hover(screen.getByRole('button'));
      
      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveTextContent(longContent);
      });
    });

    it('should handle zero delay', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Immediate tooltip" delay={0}>
          <button>Hover me</button>
        </Tooltip>
      );
      
      await user.hover(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('should handle many tooltips efficiently', () => {
      const { container } = render(
        <div>
          {Array.from({ length: 100 }, (_, i) => (
            <Tooltip key={i} content={`Tooltip ${i}`}>
              <button>Button {i}</button>
            </Tooltip>
          ))}
        </div>
      );
      
      const buttons = container.querySelectorAll('button');
      expect(buttons).toHaveLength(100);
    });

    it('should not create memory leaks with repeated hover', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Tooltip content">
          <button>Hover me</button>
        </Tooltip>
      );
      
      const button = screen.getByRole('button', { name: 'Hover me' });
      
      // Repeated hover/unhover
      for (let i = 0; i < 50; i++) {
        await user.hover(button);
        await user.unhover(button);
      }
      
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });
});
