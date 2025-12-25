const express = require('express');
const router = express.Router();
const { addBulkResults } = require('../controllers/bulkResultController');
const { body } = require('express-validator');
const { protectTeacher } = require('../middleware/authMiddleware');

// Validation
const bulkValidation = [
    body('results').isArray().withMessage('Results must be an array'),
    body('results.*.roll').notEmpty().withMessage('Roll number is required'),
    body('results.*.semester').notEmpty().withMessage('Semester is required'),
    body('results.*.subjects').isArray().withMessage('Subjects must be an array')
];

// Protected route - only teachers/admins can add bulk results
router.post('/', protectTeacher, bulkValidation, addBulkResults);

module.exports = router;
