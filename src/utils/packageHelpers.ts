export const formatPrice = (price: number | null | undefined): string => {
    if (price === null || price === undefined || isNaN(price)) return '';
    return `₹${new Intl.NumberFormat('en-IN').format(price)}`;
};

export const formatPriceRange = (min: number, max: number): string => {
    if (min === max) return formatPrice(min);
    return `${formatPrice(min)} - ${formatPrice(max)}`;
};

export const getDiscountedPrice = (price: number, discountPercent: number): number => {
    if (!price || price <= 0) return 0;
    if (!discountPercent || discountPercent <= 0 || discountPercent > 100) return price;
    return Math.round(price * (1 - discountPercent / 100));
};

export const parseDuration = (duration: string): { days: number; nights: number } => {
    if (!duration) return { days: 0, nights: 0 };
    const dayMatch = duration.match(/(\d+)\s*(?:day|days)/i);
    const nightMatch = duration.match(/(\d+)\s*(?:night|nights)/i);
    return {
        days: dayMatch ? parseInt(dayMatch[1], 10) : 0,
        nights: nightMatch ? parseInt(nightMatch[1], 10) : 0,
    };
};

export const formatDuration = (days: number, nights: number): string => {
    if (days <= 0 && nights <= 0) return '';
    const dayStr = days === 1 ? '1 Day' : `${days} Days`;
    const nightStr = nights === 1 ? '1 Night' : `${nights} Nights`;
    if (days > 0 && nights > 0) return `${dayStr} / ${nightStr}`;
    if (days > 0) return dayStr;
    return nightStr;
};

export const getSavingsText = (original: number, discounted: number): string => {
    if (!original || !discounted || discounted >= original) return '';
    const saved = original - discounted;
    return `Save ${formatPrice(saved)}`;
};
