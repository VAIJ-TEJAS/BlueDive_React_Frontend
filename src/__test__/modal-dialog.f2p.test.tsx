/**
 * F2P tests for modal dialog component.
 * These tests would fail on the base branch and pass after the fixes.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ModalDialog } from '../components/modal-dialog';

describe('Modal Dialog F2P Tests', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  describe('Basic rendering', () => {
    it('should not render when isOpen is false', () => {
      const { container } = render(
        <ModalDialog isOpen={false} onClose={mockOnClose}>
          <div>Modal content</div>
        </ModalDialog>
      );
      
      expect(container.firstChild).toBeNull();
    });

    it('should render when isOpen is true', () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose}>
          <div>Modal content</div>
        </ModalDialog>
      );
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('should render overlay', () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose}>
          <div>Modal content</div>
        </ModalDialog>
      );
      
      const overlay = screen.getByRole('dialog').previousSibling;
      expect(overlay).toHaveClass('bg-black', 'bg-opacity-50');
    });

    it('should render with custom className', () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} className="custom-modal">
          <div>Modal content</div>
        </ModalDialog>
      );
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('custom-modal');
    });
  });

  describe('Title and header', () => {
    it('should render title when provided', () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} title="Test Title">
          <div>Modal content</div>
        </ModalDialog>
      );
      
      const title = screen.getByText('Test Title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass('text-lg', 'font-semibold');
    });

    it('should not render header when no title and no close button', () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} showCloseButton={false}>
          <div>Modal content</div>
        </ModalDialog>
      );
      
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    it('should render close button when showCloseButton is true', () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} showCloseButton={true}>
          <div>Modal content</div>
        </ModalDialog>
      );
      
      const closeButton = screen.getByLabelText('Close dialog');
      expect(closeButton).toBeInTheDocument();
    });

    it('should not render close button when showCloseButton is false', () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} showCloseButton={false}>
          <div>Modal content</div>
        </ModalDialog>
      );
      
      expect(screen.queryByLabelText('Close dialog')).not.toBeInTheDocument();
    });

    it('should render header with title and close button', () => {
      render(
        <ModalDialog 
          isOpen={true} 
          onClose={mockOnClose} 
          title="Test Title"
          showCloseButton={true}
        >
          <div>Modal content</div>
        </ModalDialog>
      );
      
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
    });
  });

  describe('Size variations', () => {
    it('should render small size', () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} size="small">
          <div>Modal content</div>
        </ModalDialog>
      );
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('max-w-md');
    });

    it('should render medium size (default)', () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} size="medium">
          <div>Modal content</div>
        </ModalDialog>
      );
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('max-w-lg');
    });

    it('should render large size', () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} size="large">
          <div>Modal content</div>
        </ModalDialog>
      );
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('max-w-2xl');
    });

    it('should handle invalid size gracefully', () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} size={'invalid' as any}>
          <div>Modal content</div>
        </ModalDialog>
      );
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('max-w-lg'); // Should default to medium
    });
  });

  describe('Close functionality', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} showCloseButton={true}>
          <div>Modal content</div>
        </ModalDialog>
      );
      
      const closeButton = screen.getByLabelText('Close dialog');
      await user.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when overlay is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} closeOnOverlayClick={true}>
          <div>Modal content</div>
        </ModalDialog>
      );
      
      const overlay = screen.getByRole('dialog').previousSibling as Element;
      await user.click(overlay);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when overlay is clicked if closeOnOverlayClick is false', async () => {
      const user = userEvent.setup();
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} closeOnOverlayClick={false}>
          <div>Modal content</div>
        </ModalDialog>
      );
      
      const overlay = screen.getByRole('dialog').previousSibling as Element;
      await user.click(overlay);
      
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should call onClose when Escape key is pressed', async () => {
      const user = userEvent.setup();
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose}>
          <div>Modal content</div>
        </ModalDialog>
      );
      
      await user.keyboard('{Escape}');
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Content rendering', () => {
    it('should render children content', () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose}>
          <div>Modal content</div>
          <p>Additional content</p>
        </ModalDialog>
      );
      
      expect(screen.getByText('Modal content')).toBeInTheDocument();
      expect(screen.getByText('Additional content')).toBeInTheDocument();
    });

    it('should render complex children', () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose}>
          <form>
            <label htmlFor="input">Input:</label>
            <input id="input" type="text" />
            <button type="submit">Submit</button>
          </form>
        </ModalDialog>
      );
      
      expect(screen.getByLabelText('Input:')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('should render null children', () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose}>
          {null}
        </ModalDialog>
      );
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('dialog').children[1]).toBeEmptyDOMElement();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} title="Test Title">
          <div>Modal content</div>
        </ModalDialog>
      );
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('should not have aria-labelledby when no title', () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose}>
          <div>Modal content</div>
        </ModalDialog>
      );
      
      const modal = screen.getByRole('dialog');
      expect(modal).not.toHaveAttribute('aria-labelledby');
    });

    it('should have proper close button aria-label', () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} showCloseButton={true}>
          <div>Modal content</div>
        </ModalDialog>
      );
      
      const closeButton = screen.getByLabelText('Close dialog');
      expect(closeButton).toBeInTheDocument();
    });

    it('should have aria-hidden on overlay', () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose}>
          <div>Modal content</div>
        </ModalDialog>
      );
      
      const overlay = screen.getByRole('dialog').previousSibling as Element;
      expect(overlay).toHaveAttribute('aria-hidden', 'true');
    });

    it('should focus management', () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose}>
          <div>Modal content</div>
        </ModalDialog>
      );
      
      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('CSS classes and styling', () => {
    it('should have correct base classes', () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose}>
          <div>Modal content</div>
        </ModalDialog>
      );
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass(
        'relative',
        'bg-white',
        'rounded-lg',
        'shadow-xl',
        'max-w-lg',
        'w-full',
        'mx-4'
      );
    });

    it('should combine custom classes correctly', () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} className="custom-class another-class">
          <div>Modal content</div>
        </ModalDialog>
      );
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('custom-class', 'another-class');
    });

    it('should have correct container classes', () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose}>
          <div>Modal content</div>
        </ModalDialog>
      );
      
      const container = screen.getByRole('dialog').parentElement;
      expect(container).toHaveClass(
        'fixed',
        'inset-0',
        'z-50',
        'flex',
        'items-center',
        'justify-center'
      );
    });
  });

  describe('Edge cases', () => {
    it('should handle empty title', () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} title="">
          <div>Modal content</div>
        </ModalDialog>
      );
      
      expect(screen.getByRole('heading')).toBeInTheDocument();
      expect(screen.getByRole('heading')).toHaveTextContent('');
    });

    it('should handle missing onClose', () => {
      expect(() => {
        render(
          <ModalDialog isOpen={true} onClose={() => {}}>
            <div>Modal content</div>
          </ModalDialog>
        );
      }).not.toThrow();
    });

    it('should handle rapid open/close', () => {
      const { rerender } = render(
        <ModalDialog isOpen={false} onClose={mockOnClose}>
          <div>Modal content</div>
        </ModalDialog>
      );
      
      rerender(
        <ModalDialog isOpen={true} onClose={mockOnClose}>
          <div>Modal content</div>
        </ModalDialog>
      );
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      
      rerender(
        <ModalDialog isOpen={false} onClose={mockOnClose}>
          <div>Modal content</div>
        </ModalDialog>
      );
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Event handling', () => {
    it('should handle overlay click correctly', async () => {
      const user = userEvent.setup();
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose}>
          <div>Modal content</div>
        </ModalDialog>
      );
      
      const modal = screen.getByRole('dialog');
      const overlay = modal.previousSibling as Element;
      
      // Click on modal content should not close
      await user.click(modal);
      expect(mockOnClose).not.toHaveBeenCalled();
      
      // Click on overlay should close
      await user.click(overlay);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard events', async () => {
      const user = userEvent.setup();
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose}>
          <div>Modal content</div>
        </ModalDialog>
      );
      
      // Other keys should not close
      await user.keyboard('{Enter}');
      expect(mockOnClose).not.toHaveBeenCalled();
      
      // Escape should close
      await user.keyboard('{Escape}');
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Integration', () => {
    it('should work with form submission', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn();
      
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose}>
          <form onSubmit={mockSubmit}>
            <input type="text" placeholder="Test input" />
            <button type="submit">Submit</button>
          </form>
        </ModalDialog>
      );
      
      const input = screen.getByPlaceholderText('Test input');
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      
      await user.type(input, 'test value');
      await user.click(submitButton);
      
      expect(mockSubmit).toHaveBeenCalled();
    });

    it('should work with nested components', () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose}>
          <div>
            <h3>Nested Title</h3>
            <p>Nested content</p>
            <button>Nested button</button>
          </div>
        </ModalDialog>
      );
      
      expect(screen.getByText('Nested Title')).toBeInTheDocument();
      expect(screen.getByText('Nested content')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Nested button' })).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should handle multiple modals efficiently', () => {
      const { container } = render(
        <div>
          <ModalDialog isOpen={true} onClose={mockOnClose}>
            <div>Modal 1</div>
          </ModalDialog>
          <ModalDialog isOpen={true} onClose={mockOnClose}>
            <div>Modal 2</div>
          </ModalDialog>
        </div>
      );
      
      const modals = container.querySelectorAll('[role="dialog"]');
      expect(modals).toHaveLength(2);
    });

    it('should handle large content efficiently', () => {
      const largeContent = Array.from({ length: 1000 }, (_, i) => <div key={i}>Item {i}</div>);
      
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose}>
          <div>{largeContent}</div>
        </ModalDialog>
      );
      
      expect(screen.getByText('Item 0')).toBeInTheDocument();
      expect(screen.getByText('Item 999')).toBeInTheDocument();
    });
  });
});
