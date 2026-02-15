export const isValidPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\s/g, '');
    return /^[6-9]\d{9}$/.test(cleaned);
};

export const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isNotEmpty = (value: string | null | undefined): boolean => {
    if (value === null || value === undefined) return false;
    return value.trim().length > 0;
};

export const isValidPincode = (pincode: string): boolean => {
    return /^[1-9][0-9]{5}$/.test(pincode);
};
