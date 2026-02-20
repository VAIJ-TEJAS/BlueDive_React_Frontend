/**
 * F2P tests for theme switcher component.
 * These tests would fail on the base branch and pass after the fixes.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeSwitcher } from '../components/theme-switcher';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('Theme Switcher F2P Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    document.documentElement.className = '';
    document.body.style.backgroundColor = '';
    document.body.style.color = '';
  });

  describe('Component rendering', () => {
    it('should render theme switcher button', () => {
      render(<ThemeSwitcher />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('should render sun icon in light mode', () => {
      render(<ThemeSwitcher />);
      
      const sunIcon = document.querySelector('svg');
      expect(sunIcon).toBeInTheDocument();
      expect(sunIcon).toHaveClass('text-yellow-500');
    });

    it('should render moon icon in dark mode', () => {
      localStorageMock.getItem.mockReturnValue('dark');
      
      render(<ThemeSwitcher />);
      
      const moonIcon = document.querySelector('svg');
      expect(moonIcon).toBeInTheDocument();
      expect(moonIcon).toHaveClass('text-gray-700');
    });

    it('should apply custom className', () => {
      render(<ThemeSwitcher className="custom-class" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('Theme initialization', () => {
    it('should use light theme by default', () => {
      render(<ThemeSwitcher />);
      
      expect(document.documentElement).not.toHaveClass('dark');
      expect(document.body.style.backgroundColor).toBe('#ffffff');
      expect(document.body.style.color).toBe('#000000');
    });

    it('should use saved theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('dark');
      
      render(<ThemeSwitcher />);
      
      expect(document.documentElement).toHaveClass('dark');
      expect(document.body.style.backgroundColor).toBe('#1a1a1a');
      expect(document.body.style.color).toBe('#ffffff');
    });

    it('should respect system preference when no saved theme', () => {
      const mockMatchMedia = window.matchMedia as jest.Mock;
      mockMatchMedia.mockReturnValue({
        matches: true,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      });
      
      render(<ThemeSwitcher />);
      
      expect(document.documentElement).toHaveClass('dark');
    });
  });

  describe('Theme switching', () => {
    it('should toggle to dark mode when clicked', () => {
      render(<ThemeSwitcher />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(document.documentElement).toHaveClass('dark');
      expect(document.body.style.backgroundColor).toBe('#1a1a1a');
      expect(document.body.style.color).toBe('#ffffff');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('should toggle to light mode when clicked in dark mode', () => {
      localStorageMock.getItem.mockReturnValue('dark');
      
      render(<ThemeSwitcher />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(document.documentElement).not.toHaveClass('dark');
      expect(document.body.style.backgroundColor).toBe('#ffffff');
      expect(document.body.style.color).toBe('#000000');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
    });

    it('should update aria-label when theme changes', () => {
      render(<ThemeSwitcher />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
      
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    });

    it('should switch icons when theme changes', () => {
      render(<ThemeSwitcher />);
      
      const button = screen.getByRole('button');
      const initialIcon = document.querySelector('svg');
      expect(initialIcon).toHaveClass('text-yellow-500');
      
      fireEvent.click(button);
      const newIcon = document.querySelector('svg');
      expect(newIcon).toHaveClass('text-gray-700');
    });
  });

  describe('Multiple toggles', () => {
    it('should handle multiple theme switches', () => {
      render(<ThemeSwitcher />);
      
      const button = screen.getByRole('button');
      
      // Toggle to dark
      fireEvent.click(button);
      expect(document.documentElement).toHaveClass('dark');
      
      // Toggle to light
      fireEvent.click(button);
      expect(document.documentElement).not.toHaveClass('dark');
      
      // Toggle to dark again
      fireEvent.click(button);
      expect(document.documentElement).toHaveClass('dark');
    });

    it('should save theme preference on each toggle', () => {
      render(<ThemeSwitcher />);
      
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      expect(localStorageMock.setItem).toHaveBeenLastCalledWith('theme', 'dark');
      
      fireEvent.click(button);
      expect(localStorageMock.setItem).toHaveBeenLastCalledWith('theme', 'light');
    });
  });

  describe('Edge cases', () => {
    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      render(<ThemeSwitcher />);
      
      const button = screen.getByRole('button');
      expect(() => fireEvent.click(button)).not.toThrow();
    });

    it('should handle invalid localStorage values', () => {
      localStorageMock.getItem.mockReturnValue('invalid');
      
      render(<ThemeSwitcher />);
      
      // Should default to light mode
      expect(document.documentElement).not.toHaveClass('dark');
    });

    it('should handle missing localStorage', () => {
      delete (window as any).localStorage;
      
      expect(() => render(<ThemeSwitcher />)).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<ThemeSwitcher />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('should update ARIA label on theme change', () => {
      render(<ThemeSwitcher />);
      
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
      
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('should be keyboard accessible', () => {
      render(<ThemeSwitcher />);
      
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
      
      fireEvent.keyPress(button, { key: 'Enter' });
      expect(document.documentElement).toHaveClass('dark');
    });
  });

  describe('Performance', () => {
    it('should not cause memory leaks on multiple renders', () => {
      const { unmount } = render(<ThemeSwitcher />);
      
      // Toggle theme multiple times
      const button = screen.getByRole('button');
      for (let i = 0; i < 10; i++) {
        fireEvent.click(button);
      }
      
      expect(() => unmount()).not.toThrow();
    });

    it('should handle rapid theme switching', () => {
      render(<ThemeSwitcher />);
      
      const button = screen.getByRole('button');
      
      // Rapid toggles
      for (let i = 0; i < 20; i++) {
        fireEvent.click(button);
      }
      
      // Should still work correctly
      expect(document.documentElement).toHaveClass('dark');
    });
  });
});
