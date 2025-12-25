const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const { addStudent, getStudents, getStudent, updateStudent, deleteStudent, cleanupOrphans } = require('../controllers/studentController');
const { protectTeacher } = require('../middleware/authMiddleware');

// Validation rules
const studentValidation = [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }).escape(),
    body('roll').trim().notEmpty().withMessage('Roll number is required').isLength({ min: 1, max: 20 }),
    body('registrationNo').trim().notEmpty().withMessage('Registration number is required'),
    body('department').trim().notEmpty().withMessage('Department is required'),
    body('semester').trim().notEmpty().withMessage('Semester is required'),
    body('session').trim().notEmpty().withMessage('Session is required'),
    body('email').optional().isEmail().withMessage('Invalid email format').normalizeEmail()
];

const idValidation = [
    param('id').isMongoId().withMessage('Invalid student ID')
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

// Routes - GET is public for result searching, others need auth
router.post('/', protectTeacher, studentValidation, validate, addStudent);
router.get('/', getStudents); // Public - needed for result lookup on home
router.get('/:id', idValidation, validate, getStudent);
router.put('/:id', protectTeacher, idValidation, studentValidation, validate, updateStudent);
router.delete('/:id', protectTeacher, idValidation, validate, deleteStudent);
router.post('/cleanup', cleanupOrphans);

module.exports = router;
