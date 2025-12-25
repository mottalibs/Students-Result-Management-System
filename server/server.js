const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Load environment variables first
dotenv.config();

// Load centralized configuration
const { config, validateConfig } = require('./config/config');
const logger = require('./utils/logger');

// Validate configuration
validateConfig();

const app = express();
const PORT = config.port;

// Security Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false // Disable for development
}));

// CORS Configuration - Properly configured with allowed origins
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        if (config.cors.allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            logger.warn(`Blocked CORS request from: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Rate Limiting - General
const generalLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: { message: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false
});

// Rate Limiting - Auth (stricter)
const authLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.authMaxRequests,
    message: { message: 'Too many login attempts, please try again after 15 minutes.' }
});

// Apply rate limiting
app.use('/api/', generalLimiter);

// Middleware
app.use(compression()); // Gzip compression for responses
app.use(express.json({ limit: '10mb' })); // Limit body size

// Cache control headers
app.use((req, res, next) => {
    // No cache for API mutations
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        res.set('Cache-Control', 'no-store');
    } else if (req.path.startsWith('/api/')) {
        // Short cache for API GET requests (5 minutes)
        res.set('Cache-Control', 'private, max-age=300');
    }
    next();
});

// Response time logging for performance monitoring
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.slow(req.method, req.path, duration);
    });
    next();
});

// Activity logging for security audit
const activityLog = [];
app.use((req, res, next) => {
    // Skip logging for GET requests to reduce noise
    if (req.method !== 'GET') {
        const log = {
            timestamp: new Date().toISOString(),
            method: req.method,
            path: req.path,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent')?.substring(0, 50),
            body: req.method === 'POST' || req.method === 'PUT' ? 
                  { ...req.body, password: undefined } : undefined // Exclude passwords
        };
        activityLog.push(log);
        // Keep only last 100 logs in memory
        if (activityLog.length > 100) activityLog.shift();
        logger.activity(log.method, log.path, log.ip);
    }
    next();
});

// Activity log endpoint (admin only)
app.get('/api/activity-log', (req, res) => {
    // In production, add auth check here
    res.json(activityLog.slice(-50).reverse());
});

// Database Connection
const connectDB = async () => {
    try {
        // Try local MongoDB first
        const localUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_result_system';

        await mongoose.connect(localUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // 5 second timeout
        });
        console.log(`MongoDB Connected: ${localUri}`);

    } catch (err) {
        console.warn('Local MongoDB not available, starting in-memory database...');

        // Fallback to in-memory MongoDB
        const mongoServer = await MongoMemoryServer.create();
        const memoryUri = mongoServer.getUri();

        await mongoose.connect(memoryUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`In-Memory MongoDB Connected: ${memoryUri}`);
        console.log('⚠️  Data will not persist after server restart!');

        // Seed demo data for testing
        await seedDemoData();
    }
};

// Seed Demo Data
const seedDemoData = async () => {
    const Admin = require('./models/Admin');
    const Teacher = require('./models/Teacher');
    const Student = require('./models/Student');
    const Result = require('./models/Result');
    const bcrypt = require('bcryptjs');

    // Check if already seeded
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) return;

    console.log('📦 Seeding massive demo data (120 students)...');

    // Create Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await Admin.create({ username: 'admin', password: hashedPassword });

    // Create Multiple Teachers
    const teacherPassword = await bcrypt.hash('teacher123', 10);
    await Teacher.insertMany([
        { name: 'Dr. Mohammad Rahman', email: 'rahman@university.edu', password: teacherPassword, department: 'Computer Science', designation: 'Professor' },
        { name: 'Dr. Fatima Akter', email: 'fatima@university.edu', password: teacherPassword, department: 'Electrical Engineering', designation: 'Associate Professor' },
        { name: 'Md. Karim Hossain', email: 'karim@university.edu', password: teacherPassword, department: 'Computer Science', designation: 'Assistant Professor' },
        { name: 'Dr. Aminul Islam', email: 'aminul@university.edu', password: teacherPassword, department: 'Civil Engineering', designation: 'Professor' },
        { name: 'Dr. Sharmin Sultana', email: 'sharmin@university.edu', password: teacherPassword, department: 'Mechanical Engineering', designation: 'Associate Professor' },
    ]);

    // Generate 120 Students with realistic Bengali names
    const firstNames = ['Md.', 'Mohammad', 'Abdul', 'Rafiq', 'Kamal', 'Jamal', 'Rahim', 'Karim', 'Sohel', 'Rubel', 'Shakil', 'Tanvir', 'Arif', 'Nasir', 'Habib', 'Faruk', 'Masud', 'Rashid', 'Zahir', 'Imran', 'Fatima', 'Aisha', 'Nadia', 'Sadia', 'Tasnim', 'Jannatul', 'Mim', 'Riya', 'Priya', 'Nusrat', 'Sumon', 'Rony', 'Rakib', 'Sajib', 'Mamun', 'Rashed', 'Shanto', 'Fahim', 'Naim', 'Tarek'];
    const lastNames = ['Hossain', 'Rahman', 'Islam', 'Ahmed', 'Khan', 'Akter', 'Begum', 'Mia', 'Chowdhury', 'Uddin', 'Hasan', 'Ali', 'Sheikh', 'Sarker', 'Das', 'Roy', 'Mondal', 'Biswas', 'Talukdar', 'Sultana', 'Kabir', 'Siddique', 'Khatun', 'Bhuiyan', 'Mahmud'];
    const departments = ['Computer Science', 'Electrical Engineering', 'Civil Engineering', 'Mechanical Engineering', 'Electronics & Telecommunication'];
    const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
    const sessions = ['2020-2021', '2021-2022', '2022-2023', '2023-2024', '2024-2025'];

    const students = [];
    for (let i = 1; i <= 120; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const dept = departments[Math.floor(Math.random() * departments.length)];
        const sem = semesters[Math.floor(Math.random() * semesters.length)];
        const session = sessions[Math.floor(Math.random() * sessions.length)];

        students.push({
            name: `${firstName} ${lastName}`,
            roll: String(1000 + i),
            registrationNo: `REG${String(i).padStart(4, '0')}`,
            department: dept,
            semester: sem,
            session: session,
            email: `student${i}@university.edu`
        });
    }

    const createdStudents = await Student.insertMany(students);

    // Generate subjects by department
    const subjectsByDept = {
        'Computer Science': ['Data Structures', 'Algorithms', 'Database Systems', 'Web Development', 'Operating Systems', 'Computer Networks', 'Software Engineering', 'Machine Learning'],
        'Electrical Engineering': ['Circuit Theory', 'Power Systems', 'Control Systems', 'Digital Electronics', 'Signal Processing', 'Electromagnetics', 'Electric Machines'],
        'Civil Engineering': ['Structural Analysis', 'Fluid Mechanics', 'Geotechnical Engineering', 'Transportation Engineering', 'Construction Management', 'Surveying'],
        'Mechanical Engineering': ['Thermodynamics', 'Manufacturing Processes', 'Machine Design', 'Heat Transfer', 'Fluid Dynamics', 'Dynamics of Machines'],
        'Electronics & Telecommunication': ['Analog Electronics', 'Digital Communication', 'Microprocessors', 'VLSI Design', 'Antenna Engineering', 'Wireless Networks']
    };

    const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'];
    const gradePoints = { 'A+': 4.0, 'A': 3.75, 'A-': 3.5, 'B+': 3.25, 'B': 3.0, 'B-': 2.75, 'C+': 2.5, 'C': 2.25, 'D': 2.0, 'F': 0 };

    const results = [];
    for (const student of createdStudents) {
        const deptSubjects = subjectsByDept[student.department] || subjectsByDept['Computer Science'];
        const numSubjects = Math.floor(Math.random() * 3) + 4; // 4-6 subjects
        const selectedSubjects = deptSubjects.slice(0, numSubjects);

        let totalPoints = 0;
        const subjects = selectedSubjects.map(subName => {
            const marks = Math.floor(Math.random() * 60) + 40; // 40-100
            let grade;
            if (marks >= 90) grade = 'A+';
            else if (marks >= 85) grade = 'A';
            else if (marks >= 80) grade = 'A-';
            else if (marks >= 75) grade = 'B+';
            else if (marks >= 70) grade = 'B';
            else if (marks >= 65) grade = 'B-';
            else if (marks >= 60) grade = 'C+';
            else if (marks >= 55) grade = 'C';
            else if (marks >= 50) grade = 'D';
            else grade = 'F';

            totalPoints += gradePoints[grade];
            return { subjectName: subName, marks, grade };
        });

        const cgpa = (totalPoints / subjects.length).toFixed(2);

        results.push({
            studentId: student._id,
            semester: student.semester,
            subjects,
            cgpa: parseFloat(cgpa)
        });
    }

    await Result.insertMany(results);

    console.log(`✅ Demo data seeded successfully! (${createdStudents.length} students, ${results.length} results)`);
};

connectDB();

// Routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const resultRoutes = require('./routes/resultRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const bulkResultRoutes = require('./routes/bulkResultRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/bulk-results', bulkResultRoutes);

app.get('/', (req, res) => {
    res.send('Student Result Management System API is running');
});

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({ 
        message: 'Route not found',
        path: req.originalUrl 
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(`❌ Error: ${err.message}`);
    console.error(err.stack);
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation Error',
            errors: Object.values(err.errors).map(e => e.message)
        });
    }
    
    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            message: `${field} already exists`
        });
    }
    
    // JWT errors are handled in middleware
    // Default error
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
