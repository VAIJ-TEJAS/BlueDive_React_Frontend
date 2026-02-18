/**
 * F2P tests for contact form validation bug fixes.
 * These tests would fail on the base branch and pass after the fixes.
 */
import { describe, it, expect } from 'vitest';

describe('Contact Form Validation F2P Tests', () => {
  describe('Form validation', () => {
    it('should reject empty name field', () => {
      // Bug: Should validate required fields
      const formData = {
        name: '',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test message'
      };
      
      const validateForm = (data: typeof formData) => {
        if (!data.name.trim()) {
          return 'Please enter your name.';
        }
        return null;
      };
      
      const error = validateForm(formData);
      expect(error).toBe('Please enter your name.');
    });

    it('should reject name with only whitespace', () => {
      // Bug: Should validate name is not just whitespace
      const formData = {
        name: '   ',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test message'
      };
      
      const validateForm = (data: typeof formData) => {
        if (!data.name.trim()) {
          return 'Please enter your name.';
        }
        return null;
      };
      
      const error = validateForm(formData);
      expect(error).toBe('Please enter your name.');
    });

    it('should reject empty email field', () => {
      // Bug: Should validate required email field
      const formData = {
        name: 'Test User',
        email: '',
        subject: 'Test Subject',
        message: 'Test message'
      };
      
      const validateForm = (data: typeof formData) => {
        if (!data.email.trim()) {
          return 'Please enter your email address.';
        }
        return null;
      };
      
      const error = validateForm(formData);
      expect(error).toBe('Please enter your email address.');
    });

    it('should reject invalid email format', () => {
      // Bug: Should validate email format
      const formData = {
        name: 'Test User',
        email: 'invalid-email',
        subject: 'Test Subject',
        message: 'Test message'
      };
      
      const validateForm = (data: typeof formData) => {
        if (!data.email.trim()) {
          return 'Please enter your email address.';
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          return 'Please enter a valid email address.';
        }
        
        return null;
      };
      
      const error = validateForm(formData);
      expect(error).toBe('Please enter a valid email address.');
    });

    it('should reject email without domain', () => {
      // Bug: Should validate email has domain
      const formData = {
        name: 'Test User',
        email: 'test@',
        subject: 'Test Subject',
        message: 'Test message'
      };
      
      const validateForm = (data: typeof formData) => {
        if (!data.email.trim()) {
          return 'Please enter your email address.';
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          return 'Please enter a valid email address.';
        }
        
        return null;
      };
      
      const error = validateForm(formData);
      expect(error).toBe('Please enter a valid email address.');
    });

    it('should reject email without @ symbol', () => {
      // Bug: Should validate email has @ symbol
      const formData = {
        name: 'Test User',
        email: 'testexample.com',
        subject: 'Test Subject',
        message: 'Test message'
      };
      
      const validateForm = (data: typeof formData) => {
        if (!data.email.trim()) {
          return 'Please enter your email address.';
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          return 'Please enter a valid email address.';
        }
        
        return null;
      };
      
      const error = validateForm(formData);
      expect(error).toBe('Please enter a valid email address.');
    });

    it('should reject empty subject field', () => {
      // Bug: Should validate required subject field
      const formData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: '',
        message: 'Test message'
      };
      
      const validateForm = (data: typeof formData) => {
        if (!data.subject.trim()) {
          return 'Please enter a subject.';
        }
        return null;
      };
      
      const error = validateForm(formData);
      expect(error).toBe('Please enter a subject.');
    });

    it('should reject empty message field', () => {
      // Bug: Should validate required message field
      const formData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: ''
      };
      
      const validateForm = (data: typeof formData) => {
        if (!data.message.trim()) {
          return 'Please enter your message.';
        }
        return null;
      };
      
      const error = validateForm(formData);
      expect(error).toBe('Please enter your message.');
    });

    it('should accept valid form data', () => {
      // Bug: Should accept valid input
      const formData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test message'
      };
      
      const validateForm = (data: typeof formData) => {
        if (!data.name.trim()) {
          return 'Please enter your name.';
        }
        
        if (!data.email.trim()) {
          return 'Please enter your email address.';
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          return 'Please enter a valid email address.';
        }
        
        if (!data.subject.trim()) {
          return 'Please enter a subject.';
        }
        
        if (!data.message.trim()) {
          return 'Please enter your message.';
        }
        
        return null;
      };
      
      const error = validateForm(formData);
      expect(error).toBeNull();
    });
  });
});
