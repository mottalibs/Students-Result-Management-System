const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Student = require('./models/Student');
const Result = require('./models/Result');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const departments = ['Computer Science', 'Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Architecture'];
const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
const firstNames = ['Rahim', 'Karim', 'Fatima', 'Nadia', 'Sabbir', 'Tasnim', 'Mehedi', 'Zara', 'Arif', 'Sadia', 'Hassan', 'Jamil', 'Rokeya', 'Sumon', 'Tania'];
const lastNames = ['Ahmed', 'Hassan', 'Khan', 'Islam', 'Rahman', 'Akter', 'Begum', 'Mahmud', 'Sultana', 'Uddin', 'Chowdhury', 'Ali', 'Mia', 'Sarkar'];

const generateStudent = (index) => {
    const dept = departments[Math.floor(Math.random() * departments.length)];
    const sem = semesters[Math.floor(Math.random() * semesters.length)];
    const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;

    return {
        name,
        roll: (1000 + index).toString(),
        registrationNo: `R2021${(1000 + index)}`,
        department: dept,
        semester: sem,
        session: '2021-2022'
    };
};

const generateResult = (studentId, semester) => {
    const subjects = [
        { subjectName: 'Programming', marks: Math.floor(Math.random() * 40) + 50, grade: '' },
        { subjectName: 'Database', marks: Math.floor(Math.random() * 40) + 50, grade: '' },
        { subjectName: 'Web Technology', marks: Math.floor(Math.random() * 40) + 50, grade: '' },
        { subjectName: 'Software Engineering', marks: Math.floor(Math.random() * 40) + 50, grade: '' },
        { subjectName: 'Networking', marks: Math.floor(Math.random() * 40) + 50, grade: '' },
    ];

    subjects.forEach(sub => {
        if (sub.marks >= 80) sub.grade = 'A+';
        else if (sub.marks >= 70) sub.grade = 'A';
        else if (sub.marks >= 60) sub.grade = 'A-';
        else if (sub.marks >= 50) sub.grade = 'B';
        else sub.grade = 'F';
    });

    const totalMarks = subjects.reduce((acc, curr) => acc + curr.marks, 0);
    const avgMarks = totalMarks / subjects.length;
    let cgpa = (avgMarks / 20).toFixed(2); // Simplified CGPA calc
    if (cgpa > 4.00) cgpa = 4.00;

    return {
        studentId,
        semester,
        subjects,
        cgpa: parseFloat(cgpa),
    };
};

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(async () => {
        console.log('MongoDB Connected');

        // Seed Admin
        const adminExists = await Admin.findOne({ username: 'admin' });
        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            await Admin.create({ username: 'admin', password: hashedPassword });
            console.log('✓ Admin created: admin / password123');
        }

        // Clear existing data for fresh start
        await Student.deleteMany({});
        await Result.deleteMany({});
        console.log('✓ Cleared existing data');

        // Generate 50 Students
        const studentsData = Array.from({ length: 50 }, (_, i) => generateStudent(i));
        const createdStudents = await Student.insertMany(studentsData);
        console.log(`✓ ${createdStudents.length} students added`);

        // Generate Results for them
        const results = createdStudents.map(student =>
            generateResult(student._id, student.semester)
        );
        await Result.insertMany(results);
        console.log(`✓ ${results.length} results added`);

        console.log('\n🎉 Massive Database Seeded Successfully!');
        process.exit();
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
