export const formatPhoneDisplay = (phone: string): string => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
        return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
    }
    return phone;
};

export const maskPhone = (phone: string): string => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 4) return cleaned;
    const visible = cleaned.slice(-4);
    const masked = '*'.repeat(cleaned.length - 4);
    return masked + visible;
};

export const stripCountryCode = (phone: string): string => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('91') && cleaned.length === 12) {
        return cleaned.slice(2);
    }
    return cleaned;
};

export const addCountryCode = (phone: string, code: string = '91'): string => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith(code)) return `+${cleaned}`;
    return `+${code}${cleaned}`;
};
