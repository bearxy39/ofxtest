export const isValidCurrencyCode = (code: string): boolean => {
    if (!code) return false;
    try {
        new Intl.NumberFormat('en', { style: 'currency', currency: code });
        return true;
    } catch {
        return false;
    }
};

export const hasAtMostTwoDecimals = (n: number): boolean => {
    return Number.isInteger(n * 100);
};