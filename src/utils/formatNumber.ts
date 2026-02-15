export const formatNumber = (number: number) => {
    if (number === null || number === undefined || isNaN(number)) {
        return '0';
    }
    return new Intl.NumberFormat('en-IN').format(number);
};

export const formatCurrency = (amount: number): string => {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return '₹0';
    }
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export const calculateDiscount = (original: number, discounted: number): number => {
    if (!original || original <= 0) return 0;
    if (!discounted || discounted < 0) return 0;
    if (discounted >= original) return 0;
    return Math.round(((original - discounted) / original) * 100);
};