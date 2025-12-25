const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: [true, 'Student ID is required'],
        index: true  // Index for faster student-based queries
    },
    semester: {
        type: String,
        required: [true, 'Semester is required'],
        trim: true
    },
    subjects: [{
        subjectName: {
            type: String,
            required: [true, 'Subject name is required'],
            trim: true
        },
        marks: {
            type: Number,
            required: [true, 'Marks are required'],
            min: [0, 'Marks cannot be negative'],
            max: [100, 'Marks cannot exceed 100']
        },
        credits: {
            type: Number,
            default: 4,
            min: [1, 'Credits must be at least 1'],
            max: [6, 'Credits cannot exceed 6']
        },
        grade: {
            type: String,
            trim: true
        },
        point: {
            type: Number,
            min: 0,
            max: 4
        }
    }],
    cgpa: {
        type: Number,
        required: [true, 'CGPA is required'],
        min: [0, 'CGPA cannot be negative'],
        max: [4, 'CGPA cannot exceed 4']
    },
    status: {
        type: String,
        enum: {
            values: ['Passed', 'Referred', 'Failed'],
            message: '{VALUE} is not a valid status'
        },
        default: 'Passed'
    },
    failedSubjects: [{
        type: String,
        trim: true
    }]
}, { 
    timestamps: true 
});

// Compound unique index: One result per student per semester
resultSchema.index({ studentId: 1, semester: 1 }, { unique: true });

// Index for faster CGPA range queries
resultSchema.index({ cgpa: 1 });

// Index for status-based filtering
resultSchema.index({ status: 1 });

module.exports = mongoose.model('Result', resultSchema);

