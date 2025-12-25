/**
 * Simple Logger Utility
 * Replaces console.log with environment-aware logging
 */

const isProduction = process.env.NODE_ENV === 'production';

const logger = {
    info: (...args) => {
        console.log('ℹ️', new Date().toISOString(), ...args);
    },
    
    warn: (...args) => {
        console.warn('⚠️', new Date().toISOString(), ...args);
    },
    
    error: (...args) => {
        console.error('❌', new Date().toISOString(), ...args);
    },
    
    debug: (...args) => {
        if (!isProduction) {
            console.log('🔍', new Date().toISOString(), ...args);
        }
    },
    
    // Performance logging
    slow: (method, path, duration) => {
        if (duration > 500) {
            console.warn(`⚠️ Slow request: ${method} ${path} took ${duration}ms`);
        }
    },
    
    // Activity logging for security
    activity: (method, path, ip) => {
        if (!isProduction) {
            console.log(`📝 ${method} ${path} from ${ip}`);
        }
    }
};

module.exports = logger;
