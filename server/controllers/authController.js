const Admin = require('../models/Admin');
const Teacher = require('../models/Teacher');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { config } = require('../config/config');

// JWT Configuration from centralized config
const JWT_SECRET = config.jwt.secret;
const JWT_EXPIRY = config.jwt.expiry;

const login = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (role === 'teacher') {
            const teacher = await Teacher.findOne({ email: username });
            if (!teacher) {
                return res.status(404).json({ message: 'Teacher not found' });
            }

            const isMatch = await teacher.matchPassword(password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { 
                    id: teacher._id, 
                    role: 'teacher', 
                    email: teacher.email,
                    department: teacher.department 
                }, 
                JWT_SECRET, 
                { expiresIn: JWT_EXPIRY }
            );
            
            return res.status(200).json({
                message: 'Login successful',
                user: { 
                    id: teacher._id,
                    name: teacher.name, 
                    email: teacher.email, 
                    department: teacher.department,
                    role: 'teacher' 
                },
                token
            });
        } else {
            // Default to Admin login
            const admin = await Admin.findOne({ username });
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }

            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: admin._id, role: 'admin', username: admin.username }, 
                JWT_SECRET, 
                { expiresIn: JWT_EXPIRY }
            );
            
            return res.status(200).json({
                message: 'Login successful',
                user: { 
                    id: admin._id,
                    username: admin.username, 
                    role: 'admin' 
                },
                token
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const registerTeacher = async (req, res) => {
    try {
        const { name, email, password, department, designation } = req.body;

        const teacherExists = await Teacher.findOne({ email });
        if (teacherExists) {
            return res.status(400).json({ message: 'Teacher already exists with this email' });
        }

        const teacher = await Teacher.create({
            name,
            email,
            password,
            department,
            designation: designation || 'Lecturer'
        });

        res.status(201).json({ 
            message: 'Teacher registered successfully', 
            teacher: {
                id: teacher._id,
                name: teacher.name,
                email: teacher.email,
                department: teacher.department,
                designation: teacher.designation
            }
        });
    } catch (error) {
        console.error('Register teacher error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get current user info from token
const getMe = async (req, res) => {
    try {
        if (req.user.role === 'admin') {
            const admin = await Admin.findById(req.user.id).select('-password');
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }
            return res.json({ user: { ...admin.toObject(), role: 'admin' } });
        } else {
            const teacher = await Teacher.findById(req.user.id).select('-password');
            if (!teacher) {
                return res.status(404).json({ message: 'Teacher not found' });
            }
            return res.json({ user: { ...teacher.toObject(), role: 'teacher' } });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { login, registerTeacher, getMe };
