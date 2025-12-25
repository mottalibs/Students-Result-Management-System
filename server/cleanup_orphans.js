const mongoose = require('mongoose');
const Result = require('./models/Result');
const Student = require('./models/Student');
require('dotenv').config();

const cleanOrphans = async () => {
    try {
        // Connect to local MongoDB (or whatever is configured)
        // Note: The user seems to be using an in-memory DB or local one based on previous logs. 
        // I'll try to connect using the standard local URI first or check .env
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student-result-system');
        console.log('Connected to MongoDB');

        const results = await Result.find();
        const students = await Student.find();
        const studentIds = new Set(students.map(s => s._id.toString()));

        console.log(`Total Results: ${results.length}`);
        console.log(`Total Students: ${students.length}`);

        let orphans = 0;
        for (const result of results) {
            if (!result.studentId || !studentIds.has(result.studentId.toString())) {
                console.log(`Found orphaned result: ID ${result._id}, StudentID ${result.studentId}`);
                orphans++;
                // Uncomment to delete
                await Result.findByIdAndDelete(result._id);
            }
        }

        console.log(`Found and deleted ${orphans} orphaned results.`);
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

cleanOrphans();
