export const clamp = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
};

export const roundTo = (value: number, decimals: number): number => {
    if (decimals < 0) return Math.round(value);
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
};

export const percentage = (part: number, total: number): number => {
    if (!total || total === 0) return 0;
    return roundTo((part / total) * 100, 1);
};

export const sum = (values: number[]): number => {
    return values.reduce((acc, val) => acc + (val || 0), 0);
};

export const average = (values: number[]): number => {
    if (!values.length) return 0;
    return roundTo(sum(values) / values.length, 2);
};

export const randomInRange = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const formatCompact = (value: number): string => {
    if (value >= 10000000) return `${roundTo(value / 10000000, 1)} Cr`;
    if (value >= 100000) return `${roundTo(value / 100000, 1)} L`;
    if (value >= 1000) return `${roundTo(value / 1000, 1)} K`;
    return String(value);
};
