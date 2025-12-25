/**
 * API Response Utilities
 * Helper functions to normalize API responses
 */

/**
 * Normalize student API response
 * Handles both legacy array response and new paginated response
 */
export const normalizeStudentsResponse = (data) => {
    if (Array.isArray(data)) {
        return { students: data, pagination: null };
    }
    return {
        students: data.students || [],
        pagination: data.pagination || null
    };
};

/**
 * Normalize results API response
 * Handles both legacy array response and new paginated response
 */
export const normalizeResultsResponse = (data) => {
    if (Array.isArray(data)) {
        return { results: data, pagination: null };
    }
    return {
        results: data.results || [],
        pagination: data.pagination || null
    };
};

/**
 * Extract array from API response (backward compatible)
 */
export const extractArray = (data, key = 'data') => {
    if (Array.isArray(data)) {
        return data;
    }
    return data[key] || data.students || data.results || [];
};

/**
 * Parse API Error
 * Extracts a user-friendly error message from various API error formats
 */
export const parseApiError = (error) => {
    if (!error) return 'An unknown error occurred';
    
    // Handle Axios response errors
    if (error.response) {
        // Server responded with a status code outside 2xx range
        const data = error.response.data;
        
        if (typeof data === 'string') return data;
        
        if (data && data.message) return data.message;
        
        if (data && data.error) return data.error;
        
        // Handle validation errors array
        if (data && data.errors && Array.isArray(data.errors)) {
            return data.errors.map(e => e.msg || e.message).join(', ');
        }
        
        return `Error ${error.response.status}: ${error.response.statusText}`;
    }
    
    // Handle network errors
    if (error.request) {
        return 'Network error. Please check your connection.';
    }
    
    // Handle other errors
    return error.message || 'An unexpected error occurred';
};
