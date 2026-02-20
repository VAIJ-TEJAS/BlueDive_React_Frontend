/**
 * Simple Form Validator Component
 * Basic form validation with real-time feedback and error handling
 */

import React, { useState, useCallback, useEffect } from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  email?: boolean;
  url?: boolean;
  custom?: (value: any) => boolean | string;
  message?: string;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel' | 'textarea';
  rules?: ValidationRule[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export interface FormValidatorProps {
  fields: FieldConfig[];
  initialValues?: Record<string, any>;
  onSubmit?: (values: Record<string, any>) => void;
  onFieldChange?: (fieldName: string, value: any, isValid: boolean) => void;
  onValidationChange?: (isValid: boolean, errors: Record<string, string>) => void;
  submitButtonText?: string;
  submitButtonClassName?: string;
  showErrorsInline?: boolean;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  className?: string;
  disabled?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const FormValidator: React.FC<FormValidatorProps> = ({
  fields,
  initialValues = {},
  onSubmit,
  onFieldChange,
  onValidationChange,
  submitButtonText = 'Submit',
  submitButtonClassName = '',
  showErrorsInline = true,
  validateOnChange = true,
  validateOnBlur = true,
  className = '',
  disabled = false
}) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((fieldName: string, value: any): ValidationResult => {
    const field = fields.find(f => f.name === fieldName);
    if (!field || !field.rules) {
      return { isValid: true };
    }

    for (const rule of field.rules) {
      // Required validation
      if (rule.required && (!value || value.toString().trim() === '')) {
        return { 
          isValid: false, 
          error: rule.message || `${field.label} is required` 
        };
      }

      // Skip other validations if field is empty and not required
      if (!value || value.toString().trim() === '') {
        continue;
      }

      // String validations
      const stringValue = value.toString();

      // Min length validation
      if (rule.minLength && stringValue.length < rule.minLength) {
        return { 
          isValid: false, 
          error: rule.message || `${field.label} must be at least ${rule.minLength} characters` 
        };
      }

      // Max length validation
      if (rule.maxLength && stringValue.length > rule.maxLength) {
        return { 
          isValid: false, 
          error: rule.message || `${field.label} must not exceed ${rule.maxLength} characters` 
        };
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(stringValue)) {
        return { 
          isValid: false, 
          error: rule.message || `${field.label} format is invalid` 
        };
      }

      // Email validation
      if (rule.email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(stringValue)) {
          return { 
            isValid: false, 
            error: rule.message || `${field.label} must be a valid email address` 
          };
        }
      }

      // URL validation
      if (rule.url) {
        try {
          new URL(stringValue);
        } catch {
          return { 
            isValid: false, 
            error: rule.message || `${field.label} must be a valid URL` 
          };
        }
      }

      // Number validations
      if (field.type === 'number') {
        const numValue = Number(value);
        
        if (isNaN(numValue)) {
          return { 
            isValid: false, 
            error: rule.message || `${field.label} must be a valid number` 
          };
        }

        if (rule.min !== undefined && numValue < rule.min) {
          return { 
            isValid: false, 
            error: rule.message || `${field.label} must be at least ${rule.min}` 
          };
        }

        if (rule.max !== undefined && numValue > rule.max) {
          return { 
            isValid: false, 
            error: rule.message || `${field.label} must not exceed ${rule.max}` 
          };
        }
      }

      // Custom validation
      if (rule.custom) {
        const result = rule.custom(value);
        if (result === false) {
          return { 
            isValid: false, 
            error: rule.message || `${field.label} is invalid` 
          };
        } else if (typeof result === 'string') {
          return { 
            isValid: false, 
            error: result 
          };
        }
      }
    }

    return { isValid: true };
  }, [fields]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    for (const field of fields) {
      const result = validateField(field.name, values[field.name]);
      if (!result.isValid) {
        newErrors[field.name] = result.error!;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [fields, values, validateField]);

  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    const newValues = { ...values, [fieldName]: value };
    setValues(newValues);

    if (validateOnChange) {
      const result = validateField(fieldName, value);
      const newErrors = { ...errors };
      
      if (result.isValid) {
        delete newErrors[fieldName];
      } else {
        newErrors[fieldName] = result.error!;
      }
      
      setErrors(newErrors);
      onFieldChange?.(fieldName, value, result.isValid);
    }
  }, [values, errors, validateOnChange, validateField, onFieldChange]);

  const handleFieldBlur = useCallback((fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    if (validateOnBlur) {
      const result = validateField(fieldName, values[fieldName]);
      const newErrors = { ...errors };
      
      if (result.isValid) {
        delete newErrors[fieldName];
      } else {
        newErrors[fieldName] = result.error!;
      }
      
      setErrors(newErrors);
    }
  }, [values, errors, validateOnBlur, validateField]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (disabled || isSubmitting) return;

    const isValid = validateForm();
    
    if (isValid) {
      setIsSubmitting(true);
      try {
        await onSubmit?.(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [disabled, isSubmitting, validateForm, onSubmit, values]);

  // Notify parent of validation changes
  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange?.(isValid, errors);
  }, [errors, onValidationChange]);

  const renderField = (field: FieldConfig) => {
    const value = values[field.name] || '';
    const error = errors[field.name];
    const isTouched = touched[field.name];
    const showError = showErrorsInline && error && isTouched;

    const baseInputClasses = `
      w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
      ${showError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
      ${field.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
      ${field.className || ''}
    `.trim();

    const renderInput = () => {
      switch (field.type) {
        case 'textarea':
          return (
            <textarea
              id={field.name}
              name={field.name}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              onBlur={() => handleFieldBlur(field.name)}
              placeholder={field.placeholder}
              disabled={field.disabled || disabled}
              className={baseInputClasses}
              rows={4}
            />
          );
        
        default:
          return (
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              onBlur={() => handleFieldBlur(field.name)}
              placeholder={field.placeholder}
              disabled={field.disabled || disabled}
              className={baseInputClasses}
            />
          );
      }
    };

    return (
      <div key={field.name} className="mb-4">
        <label 
          htmlFor={field.name} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {field.label}
          {field.rules?.some(rule => rule.required) && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
        
        {renderInput()}
        
        {showError && (
          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {fields.map(renderField)}
      
      <div className="mt-6">
        <button
          type="submit"
          disabled={disabled || isSubmitting}
          className={`
            w-full py-2 px-4 rounded-md font-medium text-white
            bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
            disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors
            ${submitButtonClassName}
          `.trim()}
        >
          {isSubmitting ? 'Submitting...' : submitButtonText}
        </button>
      </div>
    </form>
  );
};

// Hook for form validation
export const useFormValidator = (fields: FieldConfig[], initialValues?: Record<string, any>) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues || {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((fieldName: string, value: any): ValidationResult => {
    const field = fields.find(f => f.name === fieldName);
    if (!field || !field.rules) {
      return { isValid: true };
    }

    for (const rule of field.rules) {
      if (rule.required && (!value || value.toString().trim() === '')) {
        return { 
          isValid: false, 
          error: rule.message || `${field.label} is required` 
        };
      }

      if (!value || value.toString().trim() === '') {
        continue;
      }

      const stringValue = value.toString();

      if (rule.minLength && stringValue.length < rule.minLength) {
        return { 
          isValid: false, 
          error: rule.message || `${field.label} must be at least ${rule.minLength} characters` 
        };
      }

      if (rule.maxLength && stringValue.length > rule.maxLength) {
        return { 
          isValid: false, 
          error: rule.message || `${field.label} must not exceed ${rule.maxLength} characters` 
        };
      }

      if (rule.pattern && !rule.pattern.test(stringValue)) {
        return { 
          isValid: false, 
          error: rule.message || `${field.label} format is invalid` 
        };
      }

      if (rule.email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(stringValue)) {
          return { 
            isValid: false, 
            error: rule.message || `${field.label} must be a valid email address` 
          };
        }
      }

      if (rule.url) {
        try {
          new URL(stringValue);
        } catch {
          return { 
            isValid: false, 
            error: rule.message || `${field.label} must be a valid URL` 
          };
        }
      }

      if (field.type === 'number') {
        const numValue = Number(value);
        
        if (isNaN(numValue)) {
          return { 
            isValid: false, 
            error: rule.message || `${field.label} must be a valid number` 
          };
        }

        if (rule.min !== undefined && numValue < rule.min) {
          return { 
            isValid: false, 
            error: rule.message || `${field.label} must be at least ${rule.min}` 
          };
        }

        if (rule.max !== undefined && numValue > rule.max) {
          return { 
            isValid: false, 
            error: rule.message || `${field.label} must not exceed ${rule.max}` 
          };
        }
      }

      if (rule.custom) {
        const result = rule.custom(value);
        if (result === false) {
          return { 
            isValid: false, 
            error: rule.message || `${field.label} is invalid` 
          };
        } else if (typeof result === 'string') {
          return { 
            isValid: false, 
            error: result 
          };
        }
      }
    }

    return { isValid: true };
  }, [fields]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    for (const field of fields) {
      const result = validateField(field.name, values[field.name]);
      if (!result.isValid) {
        newErrors[field.name] = result.error!;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [fields, values, validateField]);

  const setFieldValue = useCallback((fieldName: string, value: any) => {
    setValues(prev => ({ ...prev, [fieldName]: value }));
  }, []);

  const setFieldError = useCallback((fieldName: string, error: string) => {
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const setFieldTouched = useCallback((fieldName: string, touched: boolean = true) => {
    setTouched(prev => ({ ...prev, [fieldName]: touched }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues || {});
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const isFormValid = Object.keys(errors).length === 0;
  const isFormDirty = Object.keys(touched).length > 0;

  return {
    values,
    errors,
    touched,
    isFormValid,
    isFormDirty,
    validateField,
    validateForm,
    setFieldValue,
    setFieldError,
    clearFieldError,
    setFieldTouched,
    resetForm
  };
};

// Predefined validation rules
export const commonRules = {
  required: { required: true },
  email: { email: true },
  url: { url: true },
  password: { 
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
  },
  phone: {
    pattern: /^\+?[\d\s\-\(\)]+$/
  },
  username: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9]+$/
  }
};

// Predefined field configurations
export const commonFields = {
  name: {
    name: 'name',
    label: 'Full Name',
    type: 'text' as const,
    rules: [commonRules.required, { minLength: 2, maxLength: 50 }]
  },
  email: {
    name: 'email',
    label: 'Email Address',
    type: 'email' as const,
    rules: [commonRules.required, commonRules.email]
  },
  password: {
    name: 'password',
    label: 'Password',
    type: 'password' as const,
    rules: [commonRules.password]
  },
  confirmPassword: {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password' as const,
    rules: [commonRules.required]
  },
  phone: {
    name: 'phone',
    label: 'Phone Number',
    type: 'tel' as const,
    rules: [commonRules.phone]
  },
  username: {
    name: 'username',
    label: 'Username',
    type: 'text' as const,
    rules: [commonRules.username]
  },
  message: {
    name: 'message',
    label: 'Message',
    type: 'textarea' as const,
    rules: [commonRules.required, { minLength: 10, maxLength: 500 }]
  }
};

export default FormValidator;
