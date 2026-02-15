export const buildQueryString = (params: Record<string, string | number | boolean | undefined>): string => {
    const filtered = Object.entries(params).filter(
        ([, value]) => value !== undefined && value !== ''
    );
    if (filtered.length === 0) return '';
    const query = filtered
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
    return `?${query}`;
};

export const parseQueryString = (search: string): Record<string, string> => {
    if (!search) return {};
    const cleaned = search.startsWith('?') ? search.slice(1) : search;
    if (!cleaned) return {};
    const result: Record<string, string> = {};
    cleaned.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        if (key) {
            result[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
    });
    return result;
};

export const buildPackageUrl = (packageName: string): string => {
    if (!packageName) return '/tour-packages';
    return `/package/${encodeURIComponent(packageName)}`;
};

export const buildBookingUrl = (packageName: string, tripId?: number): string => {
    if (!packageName) return '/tour-packages';
    const base = `/booking/${encodeURIComponent(packageName)}`;
    if (tripId) return `${base}?trip=${tripId}`;
    return base;
};

export const isExternalUrl = (url: string): boolean => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://');
};
