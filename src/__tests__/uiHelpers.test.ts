/**
 * Tests for uiHelpers utilities
 */

import {
  debounce,
  throttle,
  formatCurrency,
  formatNumber,
  copyToClipboard,
  generateRandomColor,
  getFileExtension,
  formatFileSize,
  isMobileDevice,
  getScrollPosition,
  generateSlug,
  truncateText,
  capitalizeWords,
  getRelativeTime,
} from '../utils/uiHelpers';

// Mock window and navigator
Object.defineProperty(window, 'pageYOffset', {
  writable: true,
  value: 0,
});

Object.defineProperty(window, 'pageXOffset', {
  writable: true,
  value: 0,
});

Object.defineProperty(document, 'documentElement', {
  writable: true,
  value: {
    scrollLeft: 0,
    scrollTop: 0,
  },
});

Object.defineProperty(navigator, 'userAgent', {
  writable: true,
  value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
});

Object.defineProperty(navigator, 'clipboard', {
  writable: true,
  value: {
    writeText: jest.fn(),
  },
});

describe('uiHelpers', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('debounce', () => {
    it('should debounce function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 300);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(300);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 300);

      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(300);
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1000)).toBe('₹1,000');
      expect(formatCurrency(1000000)).toBe('₹10,00,000');
      expect(formatCurrency('5000.50')).toBe('₹5,001');
    });

    it('should handle invalid inputs', () => {
      expect(formatCurrency(0)).toBe('₹0');
      expect(formatCurrency(NaN)).toBe('₹0');
      expect(formatCurrency('invalid')).toBe('₹0');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers correctly', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('10,00,000');
      expect(formatNumber('5000')).toBe('5,000');
    });

    it('should handle invalid inputs', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(NaN)).toBe('0');
    });
  });

  describe('copyToClipboard', () => {
    it('should copy text using modern clipboard API', async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        writable: true,
        value: { writeText: mockWriteText },
      });

      const result = await copyToClipboard('test text');
      expect(result).toBe(true);
      expect(mockWriteText).toHaveBeenCalledWith('test text');
    });

    it('should fallback to execCommand when clipboard API is not available', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        writable: true,
        value: undefined,
      });

      const mockExecCommand = jest.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', {
        writable: true,
        value: mockExecCommand,
      });

      const result = await copyToClipboard('test text');
      expect(result).toBe(true);
    });
  });

  describe('generateRandomColor', () => {
    it('should generate a valid color from the predefined list', () => {
      const color = generateRandomColor();
      const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
      ];
      expect(colors).toContain(color);
    });
  });

  describe('getFileExtension', () => {
    it('should return file extension correctly', () => {
      expect(getFileExtension('document.pdf')).toBe('pdf');
      expect(getFileExtension('image.jpeg')).toBe('jpeg');
      expect(getFileExtension('archive.tar.gz')).toBe('gz');
    });

    it('should handle files without extension', () => {
      expect(getFileExtension('filename')).toBe('');
    });
  });

  describe('formatFileSize', () => {
    it('should format file sizes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });
  });

  describe('isMobileDevice', () => {
    it('should detect mobile devices', () => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      });
      expect(isMobileDevice()).toBe(true);
    });

    it('should detect desktop devices', () => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      });
      expect(isMobileDevice()).toBe(false);
    });
  });

  describe('getScrollPosition', () => {
    it('should return current scroll position', () => {
      Object.defineProperty(window, 'pageYOffset', { value: 100 });
      Object.defineProperty(window, 'pageXOffset', { value: 50 });

      const position = getScrollPosition();
      expect(position).toEqual({ x: 50, y: 100 });
    });
  });

  describe('generateSlug', () => {
    it('should generate slugs correctly', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
      expect(generateSlug('This is a Test!')).toBe('this-is-a-test');
      expect(generateSlug('  Multiple   Spaces  ')).toBe('multiple-spaces');
    });

    it('should handle empty strings', () => {
      expect(generateSlug('')).toBe('');
    });
  });

  describe('truncateText', () => {
    it('should truncate text longer than max length', () => {
      expect(truncateText('This is a long text', 10)).toBe('This is a...');
    });

    it('should return original text if shorter than max length', () => {
      expect(truncateText('Short text', 20)).toBe('Short text');
    });
  });

  describe('capitalizeWords', () => {
    it('should capitalize first letter of each word', () => {
      expect(capitalizeWords('hello world')).toBe('Hello World');
      expect(capitalizeWords('this is a test')).toBe('This Is A Test');
    });

    it('should handle empty strings', () => {
      expect(capitalizeWords('')).toBe('');
    });
  });

  describe('getRelativeTime', () => {
    it('should return relative time correctly', () => {
      const now = new Date();
      
      // Just now
      const justNow = new Date(now.getTime() - 30 * 1000);
      expect(getRelativeTime(justNow)).toBe('just now');

      // Minutes ago
      const minutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      expect(getRelativeTime(minutesAgo)).toBe('5 minutes ago');

      // Hours ago
      const hoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      expect(getRelativeTime(hoursAgo)).toBe('2 hours ago');

      // Days ago
      const daysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      expect(getRelativeTime(daysAgo)).toBe('3 days ago');

      // Far in the past
      const farPast = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      expect(getRelativeTime(farPast)).toBe(farPast.toLocaleDateString());
    });
  });
});
