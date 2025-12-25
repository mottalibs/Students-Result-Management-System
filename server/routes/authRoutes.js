const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { login, registerTeacher, getMe } = require('../controllers/authController');
const { protectTeacher, protectAdmin } = require('../middleware/authMiddleware');

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts
    message: { message: 'Too many login attempts. Please try again after 15 minutes.' }
});

// Validation middleware
const loginValidation = [
    body('username').trim().notEmpty().withMessage('Username is required').escape(),
    body('password').notEmpty().withMessage('Password is required')
];

const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }).escape(),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('department').trim().notEmpty().withMessage('Department is required').escape()
];

// Validation error handler
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            message: 'Validation failed', 
            errors: errors.array().map(e => e.msg) 
        });
    }
    next();
};

// Routes
router.post('/login', authLimiter, loginValidation, validate, login);
router.post('/register-teacher', protectAdmin, registerValidation, validate, registerTeacher);
router.get('/me', protectTeacher, getMe);

module.exports = router;

