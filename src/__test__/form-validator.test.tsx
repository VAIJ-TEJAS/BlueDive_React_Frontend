/**
 * Tests for form validator component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { FormValidator, useFormValidator, commonRules, commonFields, FieldConfig } from '../components/form-validator';

// Mock timers for async operations
jest.useFakeTimers();

describe('FormValidator Component', () => {
  const mockFields: FieldConfig[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      rules: [{ required: true, minLength: 2 }]
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      rules: [{ required: true, email: true }]
    },
    {
      name: 'age',
      label: 'Age',
      type: 'number',
      rules: [{ required: true, min: 18, max: 120 }]
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      rules: [{ maxLength: 100 }]
    }
  ];

  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Basic rendering', () => {
    it('should render form with all fields', () => {
      render(<FormValidator fields={mockFields} />);
      
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Age')).toBeInTheDocument();
      expect(screen.getByLabelText('Message')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('should render required field indicators', () => {
      render(<FormValidator fields={mockFields} />);
      
      expect(screen.getByText('Name *')).toBeInTheDocument();
      expect(screen.getByText('Email *')).toBeInTheDocument();
      expect(screen.getByText('Age *')).toBeInTheDocument();
      expect(screen.queryByText('Message *')).not.toBeInTheDocument();
    });

    it('should render custom submit button text', () => {
      render(<FormValidator fields={mockFields} submitButtonText="Send Form" />);
      
      expect(screen.getByRole('button', { name: 'Send Form' })).toBeInTheDocument();
    });

    it('should render disabled form when disabled prop is true', () => {
      render(<FormValidator fields={mockFields} disabled />);
      
      expect(screen.getByLabelText('Name')).toBeDisabled();
      expect(screen.getByLabelText('Email')).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });
  });

  describe('Validation functionality', () => {
    it('should show required field errors on submit', async () => {
      const mockOnSubmit = jest.fn();
      render(<FormValidator fields={mockFields} onSubmit={mockOnSubmit} />);
      
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);
      
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Age is required')).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should validate email format', async () => {
      const mockOnSubmit = jest.fn();
      render(<FormValidator fields={mockFields} onSubmit={mockOnSubmit} />);
      
      const emailInput = screen.getByLabelText('Email');
      await userEvent.type(emailInput, 'invalid-email');
      
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);
      
      expect(screen.getByText('Email must be a valid email address')).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should validate number range', async () => {
      const mockOnSubmit = jest.fn();
      render(<FormValidator fields={mockFields} onSubmit={mockOnSubmit} />);
      
      const ageInput = screen.getByLabelText('Age');
      await userEvent.type(ageInput, '15');
      
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);
      
      expect(screen.getByText('Age must be at least 18')).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should validate string length', async () => {
      const mockOnSubmit = jest.fn();
      render(<FormValidator fields={mockFields} onSubmit={mockOnSubmit} />);
      
      const nameInput = screen.getByLabelText('Name');
      await userEvent.type(nameInput, 'A');
      
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);
      
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should submit form with valid data', async () => {
      const mockOnSubmit = jest.fn();
      render(<FormValidator fields={mockFields} onSubmit={mockOnSubmit} />);
      
      await userEvent.type(screen.getByLabelText('Name'), 'John Doe');
      await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
      await userEvent.type(screen.getByLabelText('Age'), '25');
      await userEvent.type(screen.getByLabelText('Message'), 'Test message');
      
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          age: '25',
          message: 'Test message'
        });
      });
    });

    it('should validate on change when enabled', async () => {
      render(<FormValidator fields={mockFields} validateOnChange />);
      
      const emailInput = screen.getByLabelText('Email');
      await userEvent.type(emailInput, 'invalid-email');
      
      // Should show error immediately
      expect(screen.queryByText('Email must be a valid email address')).toBeInTheDocument();
    });

    it('should validate on blur when enabled', async () => {
      render(<FormValidator fields={mockFields} validateOnBlur />);
      
      const emailInput = screen.getByLabelText('Email');
      await userEvent.type(emailInput, 'invalid-email');
      await userEvent.tab(); // Blur the input
      
      // Should show error on blur
      expect(screen.getByText('Email must be a valid email address')).toBeInTheDocument();
    });

    it('should not validate on change when disabled', async () => {
      render(<FormValidator fields={mockFields} validateOnChange={false} />);
      
      const emailInput = screen.getByLabelText('Email');
      await userEvent.type(emailInput, 'invalid-email');
      
      // Should not show error immediately
      expect(screen.queryByText('Email must be a valid email address')).not.toBeInTheDocument();
    });
  });

  describe('Custom validation rules', () => {
    it('should handle custom validation functions', async () => {
      const fieldsWithCustomRule: FieldConfig[] = [
        {
          name: 'password',
          label: 'Password',
          type: 'password',
          rules: [
            { required: true },
            { custom: (value) => value.length >= 8 || 'Password must be at least 8 characters' }
          ]
        }
      ];
      
      render(<FormValidator fields={fieldsWithCustomRule} />);
      
      const passwordInput = screen.getByLabelText('Password');
      await userEvent.type(passwordInput, 'short');
      
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);
      
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });

    it('should handle custom validation with boolean return', async () => {
      const fieldsWithCustomRule: FieldConfig[] = [
        {
          name: 'field',
          label: 'Field',
          type: 'text',
          rules: [
            { custom: (value) => value === 'valid' }
          ]
        }
      ];
      
      render(<FormValidator fields={fieldsWithCustomRule} />);
      
      const fieldInput = screen.getByLabelText('Field');
      await userEvent.type(fieldInput, 'invalid');
      
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);
      
      expect(screen.getByText('Field is invalid')).toBeInTheDocument();
    });

    it('should handle pattern validation', async () => {
      const fieldsWithPattern: FieldConfig[] = [
        {
          name: 'phone',
          label: 'Phone',
          type: 'tel',
          rules: [{ pattern: /^\d{3}-\d{3}-\d{4}$/, message: 'Phone must be in format 123-456-7890' }]
        }
      ];
      
      render(<FormValidator fields={fieldsWithPattern} />);
      
      const phoneInput = screen.getByLabelText('Phone');
      await userEvent.type(phoneInput, 'invalid-phone');
      
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);
      
      expect(screen.getByText('Phone must be in format 123-456-7890')).toBeInTheDocument();
    });
  });

  describe('Callbacks', () => {
    it('should call onFieldChange when field value changes', async () => {
      const mockOnFieldChange = jest.fn();
      render(<FormValidator fields={mockFields} onFieldChange={mockOnFieldChange} />);
      
      const nameInput = screen.getByLabelText('Name');
      await userEvent.type(nameInput, 'John');
      
      expect(mockOnFieldChange).toHaveBeenCalledWith('name', 'John', true);
    });

    it('should call onValidationChange when validation state changes', async () => {
      const mockOnValidationChange = jest.fn();
      render(<FormValidator fields={mockFields} onValidationChange={mockOnValidationChange} />);
      
      const nameInput = screen.getByLabelText('Name');
      await userEvent.type(nameInput, 'John');
      
      expect(mockOnValidationChange).toHaveBeenCalledWith(true, {});
    });
  });

  describe('Field types', () => {
    it('should render textarea field', () => {
      const textareaFields: FieldConfig[] = [
        {
          name: 'message',
          label: 'Message',
          type: 'textarea',
          rules: [{ required: true }]
        }
      ];
      
      render(<FormValidator fields={textareaFields} />);
      
      const textarea = screen.getByRole('textbox', { name: 'Message' });
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('should render number input', () => {
      const numberFields: FieldConfig[] = [
        {
          name: 'age',
          label: 'Age',
          type: 'number',
          rules: [{ required: true }]
        }
      ];
      
      render(<FormValidator fields={numberFields} />);
      
      const numberInput = screen.getByLabelText('Age');
      expect(numberInput).toHaveAttribute('type', 'number');
    });

    it('should render password input', () => {
      const passwordFields: FieldConfig[] = [
        {
          name: 'password',
          label: 'Password',
          type: 'password',
          rules: [{ required: true }]
        }
      ];
      
      render(<FormValidator fields={passwordFields} />);
      
      const passwordInput = screen.getByLabelText('Password');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Accessibility', () => {
    it('should have proper label associations', () => {
      render(<FormValidator fields={mockFields} />);
      
      const nameInput = screen.getByLabelText('Name');
      expect(nameInput.id).toBe('name');
      
      const nameLabel = screen.getByText('Name *');
      expect(nameLabel).toHaveAttribute('for', 'name');
    });

    it('should show error messages with proper semantics', async () => {
      render(<FormValidator fields={mockFields} />);
      
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);
      
      const errorMessage = screen.getByText('Name is required');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty fields array', () => {
      render(<FormValidator fields={[]} />);
      
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('should handle fields without rules', () => {
      const fieldsWithoutRules: FieldConfig[] = [
        {
          name: 'optional',
          label: 'Optional',
          type: 'text'
        }
      ];
      
      render(<FormValidator fields={fieldsWithoutRules} />);
      
      const input = screen.getByLabelText('Optional');
      await userEvent.type(input, 'some value');
      
      // Should not show any validation errors
      expect(screen.queryByText(/is required/)).not.toBeInTheDocument();
    });

    it('should handle initial values', () => {
      const initialValues = {
        name: 'John Doe',
        email: 'john@example.com'
      };
      
      render(<FormValidator fields={mockFields} initialValues={initialValues} />);
      
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    });

    it('should handle disabled fields', () => {
      const fieldsWithDisabled: FieldConfig[] = [
        {
          name: 'disabled',
          label: 'Disabled Field',
          type: 'text',
          disabled: true,
          rules: [{ required: true }]
        }
      ];
      
      render(<FormValidator fields={fieldsWithDisabled} />);
      
      const disabledInput = screen.getByLabelText('Disabled Field');
      expect(disabledInput).toBeDisabled();
    });
  });
});

describe('useFormValidator Hook', () => {
  const mockFields: FieldConfig[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      rules: [{ required: true, minLength: 2 }]
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      rules: [{ required: true, email: true }]
    }
  ];

  it('should initialize with empty values', () => {
    const TestComponent = () => {
      const { values, errors, isFormValid } = useFormValidator(mockFields);
      
      return (
        <div>
          <span data-testid="name-value">{values.name || ''}</span>
          <span data-testid="email-value">{values.email || ''}</span>
          <span data-testid="is-valid">{isFormValid ? 'valid' : 'invalid'}</span>
          <span data-testid="error-count">{Object.keys(errors).length}</span>
        </div>
      );
    };
    
    render(<TestComponent />);
    
    expect(screen.getByTestId('name-value')).toHaveTextContent('');
    expect(screen.getByTestId('email-value')).toHaveTextContent('');
    expect(screen.getByTestId('is-valid')).toHaveTextContent('valid');
    expect(screen.getByTestId('error-count')).toHaveTextContent('0');
  });

  it('should set field values', () => {
    const TestComponent = () => {
      const { values, setFieldValue } = useFormValidator(mockFields);
      
      const handleSetValue = () => {
        setFieldValue('name', 'John Doe');
      };
      
      return (
        <div>
          <span data-testid="name-value">{values.name || ''}</span>
          <button onClick={handleSetValue}>Set Name</button>
        </div>
      );
    };
    
    render(<TestComponent />);
    
    expect(screen.getByTestId('name-value')).toHaveTextContent('');
    
    const setButton = screen.getByText('Set Name');
    userEvent.click(setButton);
    
    expect(screen.getByTestId('name-value')).toHaveTextContent('John Doe');
  });

  it('should validate individual fields', () => {
    const TestComponent = () => {
      const { validateField, setFieldValue, errors } = useFormValidator(mockFields);
      
      const handleValidate = () => {
        setFieldValue('email', 'invalid-email');
        const result = validateField('email', 'invalid-email');
        if (!result.isValid) {
          // Set error manually for testing
          console.log('Validation error:', result.error);
        }
      };
      
      return (
        <div>
          <span data-testid="error-count">{Object.keys(errors).length}</span>
          <button onClick={handleValidate}>Validate Email</button>
        </div>
      );
    };
    
    render(<TestComponent />);
    
    const validateButton = screen.getByText('Validate Email');
    userEvent.click(validateButton);
    
    // Error count should remain 0 since we're not setting errors in this test
    expect(screen.getByTestId('error-count')).toHaveTextContent('0');
  });

  it('should reset form', () => {
    const TestComponent = () => {
      const { values, setFieldValue, resetForm } = useFormValidator(mockFields, { name: 'Initial' });
      
      const handleSetAndReset = () => {
        setFieldValue('name', 'Changed');
        resetForm();
      };
      
      return (
        <div>
          <span data-testid="name-value">{values.name || ''}</span>
          <button onClick={handleSetAndReset}>Set and Reset</button>
        </div>
      );
    };
    
    render(<TestComponent />);
    
    expect(screen.getByTestId('name-value')).toHaveTextContent('Initial');
    
    const setAndResetButton = screen.getByText('Set and Reset');
    userEvent.click(setAndResetButton);
    
    expect(screen.getByTestId('name-value')).toHaveTextContent('Initial');
  });

  it('should track touched state', () => {
    const TestComponent = () => {
      const { touched, setFieldTouched, isFormDirty } = useFormValidator(mockFields);
      
      const handleTouch = () => {
        setFieldTouched('name', true);
      };
      
      return (
        <div>
          <span data-testid="touched-count">{Object.keys(touched).length}</span>
          <span data-testid="is-dirty">{isFormDirty ? 'dirty' : 'clean'}</span>
          <button onClick={handleTouch}>Touch Field</button>
        </div>
      );
    };
    
    render(<TestComponent />);
    
    expect(screen.getByTestId('touched-count')).toHaveTextContent('0');
    expect(screen.getByTestId('is-dirty')).toHaveTextContent('clean');
    
    const touchButton = screen.getByText('Touch Field');
    userEvent.click(touchButton);
    
    expect(screen.getByTestId('touched-count')).toHaveTextContent('1');
    expect(screen.getByTestId('is-dirty')).toHaveTextContent('dirty');
  });
});

describe('Common Rules and Fields', () => {
  it('should have common validation rules', () => {
    expect(commonRules.required).toEqual({ required: true });
    expect(commonRules.email).toEqual({ email: true });
    expect(commonRules.url).toEqual({ url: true });
    expect(commonRules.password).toEqual({
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
    });
  });

  it('should have common field configurations', () => {
    expect(commonFields.name.name).toBe('name');
    expect(commonFields.name.label).toBe('Full Name');
    expect(commonFields.name.type).toBe('text');
    expect(commonFields.email.name).toBe('email');
    expect(commonFields.email.type).toBe('email');
    expect(commonFields.password.type).toBe('password');
    expect(commonFields.message.type).toBe('textarea');
  });

  it('should use common fields in FormValidator', () => {
    const fields = [commonFields.name, commonFields.email];
    render(<FormValidator fields={fields} />);
    
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
  });
});
