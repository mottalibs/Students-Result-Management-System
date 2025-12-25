const Student = require('../models/Student');
const Result = require('../models/Result');
const { validateStudentInput, sanitizeObject } = require('../utils/validation');

// Add Student
const addStudent = async (req, res) => {
    try {
        // Sanitize input
        const data = sanitizeObject(req.body);
        
        // Validate input
        const validation = validateStudentInput(data);
        if (!validation.valid) {
            return res.status(400).json({ 
                message: 'Validation failed', 
                errors: validation.errors 
            });
        }
        
        // Enforce department restriction for teachers
        if (req.user.role === 'teacher' && req.user.department !== data.department) {
            return res.status(403).json({ message: 'You can only add students to your own department' });
        }

        // Auto-capitalize name
        if (data.name) {
            data.name = data.name.replace(/\b\w/g, l => l.toUpperCase());
        }

        // Check for duplicates
        const existingStudent = await Student.findOne({ 
            $or: [{ roll: data.roll }, { registrationNo: data.registrationNo }] 
        });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student with this Roll or Registration No already exists' });
        }

        const student = new Student(data);
        await student.save();
        res.status(201).json({ message: 'Student added successfully', student });
    } catch (error) {
        res.status(400).json({ message: 'Error adding student', error: error.message });
    }
};

// Get All Students (with pagination)
const getStudents = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;
        
        // Filter parameters
        const filter = {};
        if (req.query.department) filter.department = req.query.department;
        if (req.query.semester) filter.semester = req.query.semester;
        if (req.query.session) filter.session = req.query.session;
        if (req.query.search) {
            filter.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { roll: { $regex: req.query.search, $options: 'i' } },
                { registrationNo: { $regex: req.query.search, $options: 'i' } }
            ];
        }
        
        // Department restriction for teachers
        if (req.user && req.user.role === 'teacher' && req.user.department) {
            filter.department = req.user.department;
        }
        
        // Sort parameters
        const sortField = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const sort = { [sortField]: sortOrder };
        
        // Execute query with pagination
        const [students, total] = await Promise.all([
            Student.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            Student.countDocuments(filter)
        ]);
        
        res.status(200).json({
            students,
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
        res.status(500).json({ message: 'Error fetching students', error: error.message });
    }
};

// Get Single Student
const getStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching student', error });
    }
};

// Update Student
// Update Student
// Update Student
const updateStudent = async (req, res) => {
    try {
        // Check if student exists and belongs to teacher's department
        const studentToCheck = await Student.findById(req.params.id);
        if (!studentToCheck) return res.status(404).json({ message: 'Student not found' });

        if (req.user.role === 'teacher' && req.user.department !== studentToCheck.department) {
            return res.status(403).json({ message: 'You can only update students from your own department' });
        }

        // Auto-capitalize name
        if (req.body.name) {
            req.body.name = req.body.name.replace(/\b\w/g, l => l.toUpperCase());
        }

        // Check for duplicates (excluding current student)
        if (req.body.roll || req.body.registrationNo) {
            const existingStudent = await Student.findOne({ 
                $and: [
                    { _id: { $ne: req.params.id } },
                    { $or: [{ roll: req.body.roll }, { registrationNo: req.body.registrationNo }] }
                ]
            });
            if (existingStudent) {
                return res.status(400).json({ message: 'Student with this Roll or Registration No already exists' });
            }
        }

        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: 'Student updated', student });
    } catch (error) {
        res.status(400).json({ message: 'Error updating student', error });
    }
};

// Delete Student
// Delete Student (Cascading)
// Delete Student (Cascading)
const deleteStudent = async (req, res) => {
    try {
        const studentToCheck = await Student.findById(req.params.id);
        if (!studentToCheck) return res.status(404).json({ message: 'Student not found' });

        if (req.user.role === 'teacher' && req.user.department !== studentToCheck.department) {
            return res.status(403).json({ message: 'You can only delete students from your own department' });
        }

        await Student.findByIdAndDelete(req.params.id);

        // Delete associated results
        await Result.deleteMany({ studentId: req.params.id });

        res.status(200).json({ message: 'Student and associated results deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting student', error });
    }
};

// Cleanup Orphaned Results
const cleanupOrphans = async (req, res) => {
    try {
        const results = await Result.find();
        const students = await Student.find();
        const studentIds = new Set(students.map(s => s._id.toString()));

        let deletedCount = 0;
        for (const result of results) {
            if (!result.studentId || !studentIds.has(result.studentId.toString())) {
                await Result.findByIdAndDelete(result._id);
                deletedCount++;
            }
        }
        res.status(200).json({ message: `Cleanup successful. Deleted ${deletedCount} orphaned results.` });
    } catch (error) {
        res.status(500).json({ message: 'Error cleaning orphans', error });
    }
};

module.exports = { addStudent, getStudents, getStudent, updateStudent, deleteStudent, cleanupOrphans };
