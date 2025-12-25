const jwt = require('jsonwebtoken');
const { config } = require('../config/config');

// JWT Secret from centralized config (validated at startup)
const JWT_SECRET = config.jwt.secret;

// Protect Teacher & Admin routes
const protectTeacher = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: 'Access Denied. No token provided.',
                code: 'NO_TOKEN'
            });
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                message: 'Access Denied. Invalid token format.',
                code: 'INVALID_FORMAT'
            });
        }

        const verified = jwt.verify(token, JWT_SECRET);
        
        if (verified.role !== 'teacher' && verified.role !== 'admin') {
            return res.status(403).json({ 
                message: 'Access Restricted. Teachers and Admins only.',
                code: 'FORBIDDEN'
            });
        }
        
        req.user = verified;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token expired. Please login again.',
                code: 'TOKEN_EXPIRED'
            });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'Invalid token. Please login again.',
                code: 'INVALID_TOKEN'
            });
        }
        res.status(500).json({ 
            message: 'Authentication error.',
            code: 'AUTH_ERROR'
        });
    }
};

// Admin-only middleware
const protectAdmin = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: 'Access Denied. No token provided.',
                code: 'NO_TOKEN'
            });
        }

        const token = authHeader.split(' ')[1];
        const verified = jwt.verify(token, JWT_SECRET);
        
        if (verified.role !== 'admin') {
            return res.status(403).json({ 
                message: 'Access Restricted. Admins only.',
                code: 'ADMIN_ONLY'
            });
        }
        
        req.user = verified;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token expired. Please login again.',
                code: 'TOKEN_EXPIRED'
            });
        }
        res.status(401).json({ 
            message: 'Invalid token.',
            code: 'INVALID_TOKEN'
        });
    }
};

// Optional auth - doesn't fail if no token, just sets req.user if valid
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const verified = jwt.verify(token, JWT_SECRET);
            req.user = verified;
        }
        next();
    } catch (err) {
        // Continue without user - token was invalid but that's ok for optional
        next();
    }
};

module.exports = { protectTeacher, protectAdmin, optionalAuth };
