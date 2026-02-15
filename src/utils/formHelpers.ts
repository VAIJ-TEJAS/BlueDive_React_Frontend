export interface FormError {
    field: string;
    message: string;
}

export const validateRequired = (value: string, fieldName: string): FormError | null => {
    if (!value || !value.trim()) {
        return { field: fieldName, message: `${fieldName} is required` };
    }
    return null;
};

export const validateMinLength = (value: string, min: number, fieldName: string): FormError | null => {
    if (value && value.trim().length < min) {
        return { field: fieldName, message: `${fieldName} must be at least ${min} characters` };
    }
    return null;
};

export const validateMaxLength = (value: string, max: number, fieldName: string): FormError | null => {
    if (value && value.trim().length > max) {
        return { field: fieldName, message: `${fieldName} must be at most ${max} characters` };
    }
    return null;
};

export const validatePattern = (value: string, pattern: RegExp, fieldName: string, message?: string): FormError | null => {
    if (value && !pattern.test(value)) {
        return { field: fieldName, message: message || `${fieldName} is invalid` };
    }
    return null;
};

export const collectErrors = (...results: (FormError | null)[]): FormError[] => {
    return results.filter((r): r is FormError => r !== null);
};

export const hasErrors = (errors: FormError[]): boolean => {
    return errors.length > 0;
};

export const getFieldError = (errors: FormError[], field: string): string | undefined => {
    return errors.find(e => e.field === field)?.message;
};
