const Result = require('../models/Result');
const Student = require('../models/Student');
const { sendResultEmail } = require('../utils/emailService');
const { calculateCGPA } = require('../utils/gradeUtils');
const { validateResultInput, sanitizeObject } = require('../utils/validation');

// Add Result
const addResult = async (req, res) => {
    try {
        // Sanitize input
        const data = sanitizeObject(req.body);
        const { studentId, semester, subjects, sendNotification } = data;

        // Validate input
        const validation = validateResultInput({ studentId, semester, subjects });
        if (!validation.valid) {
            return res.status(400).json({ 
                message: 'Validation failed', 
                errors: validation.errors 
            });
        }

        // Check if student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Enforce department restriction
        if (req.user.role === 'teacher' && req.user.department !== student.department) {
            return res.status(403).json({ message: 'You can only add results for students in your department' });
        }

        // Calculate CGPA and Status
        const { cgpa, status, failedSubjects, totalCredits } = calculateCGPA(subjects);

        const result = new Result({
            studentId,
            semester,
            subjects, 
            cgpa,
            status,
            failedSubjects
        });

        await result.save();

        // Send Email Notification if requested and student has email
        if (sendNotification && student.email) {
            await sendResultEmail(student.email, student.name, { semester, subjects, cgpa, status });
        }

        res.status(201).json({ message: 'Result added successfully', result });
    } catch (error) {
        // Handle duplicate key error (same student, same semester)
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: 'Result already exists for this student in this semester' 
            });
        }
        res.status(400).json({ message: 'Error adding result', error: error.message });
    }
};

// Get Results (with pagination)
const getResults = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;
        
        // Build filter
        const filter = {};
        if (req.query.semester) filter.semester = req.query.semester;
        if (req.query.status) filter.status = req.query.status;
        if (req.query.minCgpa) filter.cgpa = { $gte: parseFloat(req.query.minCgpa) };
        if (req.query.maxCgpa) {
            filter.cgpa = { ...filter.cgpa, $lte: parseFloat(req.query.maxCgpa) };
        }
        
        // Sort parameters
        const sortField = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const sort = { [sortField]: sortOrder };
        
        // Execute query with pagination
        const [results, total] = await Promise.all([
            Result.find(filter)
                .populate('studentId', 'name roll registrationNo department')
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            Result.countDocuments(filter)
        ]);
        
        // Filter by department for teachers
        let filteredResults = results;
        if (req.user && req.user.role === 'teacher' && req.user.department) {
            filteredResults = results.filter(r => 
                r.studentId && r.studentId.department === req.user.department
            );
        }
        
        res.status(200).json({
            results: filteredResults,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching results', error: error.message });
    }
};

// Get Single Result by ID
const getResult = async (req, res) => {
    try {
        const result = await Result.findById(req.params.id).populate('studentId', 'name roll registrationNo department');
        if (!result) return res.status(404).json({ message: 'Result not found' });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching result', error });
    }
};

// Search Result by Roll No (Public)
const searchResult = async (req, res) => {
    try {
        const { roll } = req.params;
        const student = await Student.findOne({ roll });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const results = await Result.find({ studentId: student._id }).populate('studentId', 'name roll registrationNo department session');
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error searching result', error });
    }
};

// Update Result
// Update Result
const updateResult = async (req, res) => {
    try {
        const { semester, subjects } = req.body;
        const resultId = req.params.id;

        const result = await Result.findById(resultId).populate('studentId');
        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }

        // Enforce department restriction
        if (req.user.role === 'teacher' && req.user.department !== result.studentId.department) {
            return res.status(403).json({ message: 'You can only update results for students in your department' });
        }

        // Recalculate CGPA and Status
        const { cgpa, status, failedSubjects } = calculateCGPA(subjects);

        result.semester = semester;
        result.subjects = subjects;
        result.cgpa = cgpa;
        result.status = status;
        result.failedSubjects = failedSubjects;

        await result.save();

        res.status(200).json({ message: 'Result updated successfully', result });
    } catch (error) {
        res.status(400).json({ message: 'Error updating result', error: error.message });
    }
};

// Delete Result
// Delete Result
const deleteResult = async (req, res) => {
    try {
        const result = await Result.findById(req.params.id).populate('studentId');
        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }

        // Enforce department restriction
        if (req.user.role === 'teacher' && req.user.department !== result.studentId.department) {
            return res.status(403).json({ message: 'You can only delete results for students in your department' });
        }

        await Result.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Result deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting result', error });
    }
};

module.exports = { addResult, getResults, getResult, searchResult, updateResult, deleteResult };
