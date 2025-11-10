// Export all utility functions
export * from './dateUtils';
export * from './validation';
export * from './stringUtils';
// Array utilities
export const unique = (array) => [...new Set(array)];
export const groupBy = (array, keyFn) => {
    return array.reduce((groups, item) => {
        const key = keyFn(item);
        groups[key] = groups[key] || [];
        groups[key].push(item);
        return groups;
    }, {});
};
export const sortBy = (array, keyFn, direction = 'asc') => {
    return [...array].sort((a, b) => {
        const aVal = keyFn(a);
        const bVal = keyFn(b);
        if (aVal < bVal)
            return direction === 'asc' ? -1 : 1;
        if (aVal > bVal)
            return direction === 'asc' ? 1 : -1;
        return 0;
    });
};
// Object utilities
export const omit = (obj, keys) => {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
};
export const pick = (obj, keys) => {
    const result = {};
    keys.forEach(key => {
        if (key in obj) {
            result[key] = obj[key];
        }
    });
    return result;
};
// Async utilities
export const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
export const retry = async (fn, attempts = 3, delayMs = 1000) => {
    try {
        return await fn();
    }
    catch (error) {
        if (attempts <= 1)
            throw error;
        await delay(delayMs);
        return retry(fn, attempts - 1, delayMs);
    }
};
// Local storage utilities
export const storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        }
        catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    },
    get: (key, defaultValue) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue ?? null;
        }
        catch (error) {
            console.error('Failed to read from localStorage:', error);
            return defaultValue ?? null;
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        }
        catch (error) {
            console.error('Failed to remove from localStorage:', error);
        }
    },
    clear: () => {
        try {
            localStorage.clear();
        }
        catch (error) {
            console.error('Failed to clear localStorage:', error);
        }
    }
};
