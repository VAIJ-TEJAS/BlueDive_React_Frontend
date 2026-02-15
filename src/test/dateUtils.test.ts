import {
  formatDate,
  formatDateTime,
  formatTime,
  getRelativeTime,
  isToday,
  isYesterday,
  addDays,
  subtractDays,
  startOfDay,
  endOfDay
} from '../utils/dateUtils';

describe('Date Utils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date);
      expect(result).toBe('15 Jan 2024');
    });

    it('should handle string date input', () => {
      const result = formatDate('2024-01-15');
      expect(result).toBe('15 Jan 2024');
    });

    it('should handle timestamp input', () => {
      const timestamp = new Date('2024-01-15').getTime();
      const result = formatDate(timestamp);
      expect(result).toBe('15 Jan 2024');
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time correctly', () => {
      const date = new Date('2024-01-15T14:30:00');
      const result = formatDateTime(date);
      expect(result).toMatch(/15 Jan 2024.*14:30/);
    });
  });

  describe('formatTime', () => {
    it('should format time correctly', () => {
      const date = new Date('2024-01-15T14:30:00');
      const result = formatTime(date);
      expect(result).toBe('14:30');
    });
  });

  describe('getRelativeTime', () => {
    beforeEach(() => {
      // Mock current date
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15T12:00:00'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return "Just now" for very recent times', () => {
      const date = new Date('2024-01-15T11:59:30');
      expect(getRelativeTime(date)).toBe('Just now');
    });

    it('should return minutes ago for recent times', () => {
      const date = new Date('2024-01-15T11:45:00');
      expect(getRelativeTime(date)).toBe('15 minutes ago');
    });

    it('should return "1 minute ago" for single minute', () => {
      const date = new Date('2024-01-15T11:59:00');
      expect(getRelativeTime(date)).toBe('1 minute ago');
    });

    it('should return hours ago for same day', () => {
      const date = new Date('2024-01-15T08:00:00');
      expect(getRelativeTime(date)).toBe('4 hours ago');
    });

    it('should return days ago for recent days', () => {
      const date = new Date('2024-01-13T12:00:00');
      expect(getRelativeTime(date)).toBe('2 days ago');
    });

    it('should return formatted date for older dates', () => {
      const date = new Date('2023-12-15T12:00:00');
      expect(getRelativeTime(date)).toBe('15 Dec 2023');
    });
  });

  describe('isToday', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15T12:00:00'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return true for today', () => {
      expect(isToday(new Date('2024-01-15T12:00:00'))).toBe(true);
      expect(isToday('2024-01-15')).toBe(true);
    });

    it('should return false for other dates', () => {
      expect(isToday(new Date('2024-01-14'))).toBe(false);
      expect(isToday('2024-01-16'))).toBe(false);
    });
  });

  describe('isYesterday', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15T12:00:00'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return true for yesterday', () => {
      expect(isYesterday(new Date('2024-01-14T12:00:00'))).toBe(true);
      expect(isYesterday('2024-01-14')).toBe(true);
    });

    it('should return false for other dates', () => {
      expect(isYesterday(new Date('2024-01-13'))).toBe(false);
      expect(isYesterday(new Date('2024-01-15'))).toBe(false);
    });
  });

  describe('addDays', () => {
    it('should add days to date', () => {
      const date = new Date('2024-01-15');
      const result = addDays(date, 5);
      expect(result.getDate()).toBe(20);
      expect(result.getMonth()).toBe(0); // January
    });

    it('should handle string input', () => {
      const result = addDays('2024-01-15', 10);
      expect(result.getDate()).toBe(25);
    });
  });

  describe('subtractDays', () => {
    it('should subtract days from date', () => {
      const date = new Date('2024-01-15');
      const result = subtractDays(date, 5);
      expect(result.getDate()).toBe(10);
      expect(result.getMonth()).toBe(0); // January
    });
  });

  describe('startOfDay', () => {
    it('should return start of day', () => {
      const date = new Date('2024-01-15T14:30:45');
      const result = startOfDay(date);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });
  });

  describe('endOfDay', () => {
    it('should return end of day', () => {
      const date = new Date('2024-01-15T14:30:45');
      const result = endOfDay(date);
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
      expect(result.getMilliseconds()).toBe(999);
    });
  });
});
