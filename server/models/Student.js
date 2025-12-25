const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
        type: String,
        required: false,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        required: false,
        trim: true,
        match: [/^[0-9]{11}$/, 'Please enter a valid 11-digit phone number']
    },
    roll: {
        type: String,
        required: [true, 'Roll number is required'],
        unique: true,
        trim: true,
        index: true  // Index for faster queries
    },
    registrationNo: {
        type: String,
        required: [true, 'Registration number is required'],
        unique: true,
        trim: true,
        index: true  // Index for faster queries
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true,
        index: true  // Index for department-based filtering
    },
    semester: {
        type: String,
        required: [true, 'Semester is required'],
        trim: true
    },
    session: {
        type: String,
        required: [true, 'Session is required'],
        trim: true,
        index: true  // Index for session-based filtering
    },
}, { 
    timestamps: true,
    // Compound indexes for common query patterns
    indexes: [
        { department: 1, semester: 1 },
        { session: 1, department: 1 }
    ]
});

// Compound index for department + semester queries
studentSchema.index({ department: 1, semester: 1 });
studentSchema.index({ session: 1, department: 1 });

module.exports = mongoose.model('Student', studentSchema);

