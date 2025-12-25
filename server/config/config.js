/**
 * Centralized Configuration
 * All environment variables and configuration in one place
 */

const config = {
    // Server
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET,
        expiry: process.env.JWT_EXPIRY || '24h'
    },
    
    // MongoDB
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_result_system'
    },
    
    // CORS Configuration
    cors: {
        allowedOrigins: process.env.CORS_ORIGINS 
            ? process.env.CORS_ORIGINS.split(',') 
            : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173']
    },
    
    // Rate Limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 500,
        authMaxRequests: 20
    }
};

/**
 * Validate required environment variables in production
 */
const validateConfig = () => {
    const errors = [];
    
    if (config.nodeEnv === 'production') {
        if (!config.jwt.secret) {
            errors.push('JWT_SECRET is required in production');
        }
        if (config.jwt.secret && config.jwt.secret.length < 32) {
            errors.push('JWT_SECRET must be at least 32 characters in production');
        }
    }
    
    if (errors.length > 0) {
        console.error('❌ Configuration Errors:');
        errors.forEach(err => console.error(`   - ${err}`));
        process.exit(1);
    }
    
    // Use fallback in development only
    if (!config.jwt.secret && config.nodeEnv === 'development') {
        config.jwt.secret = 'dev_only_secret_do_not_use_in_production_' + Date.now();
        console.warn('⚠️  Using auto-generated JWT secret (development only)');
    }
};

module.exports = { config, validateConfig };
