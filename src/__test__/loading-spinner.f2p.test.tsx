/**
 * F2P tests for loading spinner component.
 * These tests would fail on the base branch and pass after the fixes.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoadingSpinner } from '../components/loading-spinner';

describe('Loading Spinner F2P Tests', () => {
  describe('Component rendering', () => {
    it('should render loading spinner', () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute('aria-label', 'Loading');
    });

    it('should render with default classes', () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('animate-spin', 'rounded-full', 'border-2', 'w-8', 'h-8', 'text-blue-600');
    });

    it('should render with custom className', () => {
      render(<LoadingSpinner className="custom-class" />);
      
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('custom-class');
    });

    it('should render screen reader text', () => {
      render(<LoadingSpinner />);
      
      const srText = screen.getByText('Loading...');
      expect(srText).toBeInTheDocument();
      expect(srText).toHaveClass('sr-only');
    });
  });

  describe('Size variations', () => {
    it('should render small size', () => {
      render(<LoadingSpinner size="small" />);
      
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('w-4', 'h-4');
    });

    it('should render medium size (default)', () => {
      render(<LoadingSpinner size="medium" />);
      
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('w-8', 'h-8');
    });

    it('should render large size', () => {
      render(<LoadingSpinner size="large" />);
      
      const spinner = screen.getByRole('status');
      expect('status');
      expect(spinner).toHaveClass('w-12', 'h-12');
    });

    it('should handle invalid size gracefully', () => {
      render(<LoadingSpinner size={'invalid' as any} />);
      
      const spinner = screen.getByRole('status');
      // Should default to medium size
      expect(spinner).toHaveClass('w-8', 'h-8');
    });
  });

  describe('Color variations', () => {
    it('should render primary color (default)', () => {
      render(<LoadingSpinner color="primary" />);
      
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('text-blue-600');
    });

    it('should render secondary color', () => {
      render(<LoadingSpinner color="secondary" />);
      
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('text-gray-600');
    });

    it('should render white color', () => {
      render(<LoadingSpinner color="white" />);
      
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('text-white');
    });

    it('should handle invalid color gracefully', () => {
      render(<LoadingSpinner color={'invalid' as any} />);
      
      const spinner = screen.getByRole('status');
      // Should default to primary color
      expect(spinner).toHaveClass('text-blue-600');
    });
  });

  describe('Text display', () => {
    it('should render without text by default', () => {
      render(<LoadingSpinner />);
      
      expect(screen.queryByText(/test/i)).not.toBeInTheDocument();
    });

    it('should render with custom text', () => {
      render(<LoadingSpinner text="Loading data..." />);
      
      const text = screen.getByText('Loading data...');
      expect(text).toBeInTheDocument();
      expect(text).toHaveClass('text-blue-600'); // Default color
    });

    it('should render text with secondary color', () => {
      render(<LoadingSpinner text="Loading..." color="secondary" />);
      
      const text = screen.getByText('Loading...');
      expect(text).toHaveClass('text-gray-600');
    });

    it('should render text with white color', () => {
      render(<LoadingSpinner text="Loading..." color="white" />);
      
      const text = screen.getByText('Loading...');
      expect(text).toHaveClass('text-white');
    });

    it('should render empty text', () => {
      render(<LoadingSpinner text="" />);
      
      expect(screen.queryByText('')).toBeInTheDocument();
    });
  });

  describe('Combined variations', () => {
    it('should render small primary spinner with text', () => {
      render(<LoadingSpinner size="small" color="primary" text="Loading..." />);
      
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('w-4', 'h-4', 'text-blue-600');
      
      const text = screen.getByText('Loading...');
      expect(text).toHaveClass('text-blue-600');
    });

    it('should render large secondary spinner with text', () => {
      render(<LoadingSpinner size="large" color="secondary" text="Please wait..." />);
      
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('w-12', 'h-12', 'text-gray-600');
      
      const text = screen.getByText('Please wait...');
      expect(text).toHaveClass('text-gray-600');
    });

    it('should render medium white spinner with custom className', () => {
      render(<LoadingSpinner size="medium" color="white" className="custom-spinner" />);
      
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('w-8', 'h-8', 'text-white', 'custom-spinner');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('aria-label', 'Loading');
      expect(spinner).toHaveAttribute('role', 'status');
    });

    it('should have screen reader only text', () => {
      render(<LoadingSpinner />);
      
      const srText = screen.getByText('Loading...');
      expect(srText).toHaveClass('sr-only');
    });

    it('should maintain accessibility with custom text', () => {
      render(<LoadingSpinner text="Custom loading text" />);
      
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('aria-label', 'Loading');
      
      const srText = screen.getByText('Loading...');
      expect(srText).toHaveClass('sr-only');
      
      const customText = screen.getByText('Custom loading text');
      expect(customText).toBeInTheDocument();
    });
  });

  describe('CSS classes', () => {
    it('should have all required animation classes', () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('animate-spin');
      expect(spinner).toHaveClass('rounded-full');
      expect(spinner).toHaveClass('border-2');
      expect(spinner).toHaveClass('border-current');
      expect(spinner).toHaveClass('border-t-transparent');
    });

    it('should combine classes correctly', () => {
      render(<LoadingSpinner size="large" color="white" className="extra-class" />);
      
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass(
        'animate-spin',
        'rounded-full',
        'border-2',
        'border-current',
        'border-t-transparent',
        'w-12',
        'h-12',
        'text-white',
        'extra-class'
      );
    });
  });

  describe('Container structure', () => {
    it('should render spinner in flex container', () => {
      render(<LoadingSpinner />);
      
      const container = screen.getByRole('status').parentElement;
      expect(container).toHaveClass('flex', 'items-center', 'justify-center');
    });

    it('should render text next to spinner', () => {
      render(<LoadingSpinner text="Loading..." />);
      
      const container = screen.getByRole('status').parentElement;
      expect(container).toBeInTheDocument();
      
      const text = screen.getByText('Loading...');
      expect(text.parentElement).toBe(container);
    });
  });

  describe('Edge cases', () => {
    it('should handle all props as undefined', () => {
      render(<LoadingSpinner size={undefined} color={undefined} className={undefined} text={undefined} />);
      
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('w-8', 'h-8', 'text-blue-600'); // Default values
    });

    it('should handle empty className', () => {
      render(<LoadingSpinner className="" />);
      
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
    });

    it('should handle whitespace-only className', () => {
      render(<LoadingSpinner className="   " />);
      
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render multiple spinners efficiently', () => {
      const { container } = render(
        <div>
          <LoadingSpinner />
          <LoadingSpinner size="small" />
          <LoadingSpinner size="large" color="secondary" />
        </div>
      );

      const spinners = container.querySelectorAll('[role="status"]');
      expect(spinners).toHaveLength(3);
    });

    it('should handle rapid re-rendering', () => {
      const { rerender } = render(<LoadingSpinner />);
      
      expect(screen.getByRole('status')).toBeInTheDocument();
      
      rerender(<LoadingSpinner size="large" />);
      expect(screen.getByRole('status')).toHaveClass('w-12', 'h-12');
      
      rerender(<LoadingSpinner color="secondary" />);
      expect(screen.getByRole('status')).toHaveClass('text-gray-600');
    });
  });

  describe('Integration', () => {
    it('should work in different container contexts', () => {
      const { container } = render(
        <div className="parent-container">
          <LoadingSpinner text="Loading..." />
        </div>
      );

      const parentContainer = container.querySelector('.parent-container');
      expect(parentContainer).toBeInTheDocument();
      
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
    });

    it('should maintain structure with nested components', () => {
      const { container } = render(
        <div>
          <div className="wrapper">
            <LoadingSpinner size="small" color="white" />
          </div>
          <LoadingSpinner text="Loading data..." />
        </div>
      );

      const spinners = container.querySelectorAll('[role="status"]');
      expect(spinners).toHaveLength(2);
    });
  });
});
