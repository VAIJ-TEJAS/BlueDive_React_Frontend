export const formatNumber = (number: number | null | undefined): string => {
    if (number === null || number === undefined || isNaN(number)) return '0';
    return new Intl.NumberFormat('en-IN').format(number);
};