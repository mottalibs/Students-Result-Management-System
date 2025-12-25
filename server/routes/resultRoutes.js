const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const { addResult, getResults, getResult, searchResult, updateResult, deleteResult } = require('../controllers/resultController');
const { protectTeacher } = require('../middleware/authMiddleware');

// Validation rules
const resultValidation = [
    body('studentId').isMongoId().withMessage('Invalid student ID'),
    body('semester').trim().notEmpty().withMessage('Semester is required'),
    body('subjects').isArray({ min: 1 }).withMessage('At least one subject is required'),
    body('subjects.*.subjectName').notEmpty().withMessage('Subject name is required'),
    body('subjects.*.marks').isInt({ min: 0, max: 100 }).withMessage('Marks must be 0-100')
];

const idValidation = [
    param('id').isMongoId().withMessage('Invalid result ID')
];

const rollValidation = [
    param('roll').trim().notEmpty().withMessage('Roll number is required')
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

// Public route - students can search their results
router.get('/search/:roll', rollValidation, validate, searchResult);

// Protected routes - need authentication
router.post('/', protectTeacher, resultValidation, validate, addResult);
router.get('/', protectTeacher, getResults);
router.get('/:id', protectTeacher, idValidation, validate, getResult);
router.put('/:id', protectTeacher, idValidation, resultValidation, validate, updateResult);
router.delete('/:id', protectTeacher, idValidation, validate, deleteResult);

module.exports = router;
