/**
 * Input Validation Utilities
 * Reusable validation functions for API inputs
 */

// Validation patterns
const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[0-9]{11}$/,
    roll: /^[A-Za-z0-9\-]+$/,
    semester: /^(1st|2nd|3rd|4th|5th|6th|7th|8th)$/i,
    session: /^\d{4}-\d{4}$/
};

// Sanitize string input
const sanitize = (input) => {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
};

// Validate email
const isValidEmail = (email) => {
    if (!email) return true; // Optional
    return patterns.email.test(email);
};

// Validate phone
const isValidPhone = (phone) => {
    if (!phone) return true; // Optional
    return patterns.phone.test(phone);
};

// Validate roll number
const isValidRoll = (roll) => {
    if (!roll) return false;
    return patterns.roll.test(roll) && roll.length >= 2 && roll.length <= 20;
};

// Validate semester
const isValidSemester = (semester) => {
    if (!semester) return false;
    return patterns.semester.test(semester);
};

// Validate session format (e.g., 2024-2025)
const isValidSession = (session) => {
    if (!session) return false;
    if (!patterns.session.test(session)) return false;
    const [start, end] = session.split('-').map(Number);
    return end === start + 1;
};

// Validate marks (0-100)
const isValidMarks = (marks) => {
    const num = Number(marks);
    return !isNaN(num) && num >= 0 && num <= 100;
};

// Validate CGPA (0-4)
const isValidCGPA = (cgpa) => {
    const num = Number(cgpa);
    return !isNaN(num) && num >= 0 && num <= 4;
};

// Validate credits (1-6)
const isValidCredits = (credits) => {
    const num = Number(credits);
    return !isNaN(num) && num >= 1 && num <= 6;
};

// Validate student input
const validateStudentInput = (data) => {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters');
    }
    
    if (!isValidRoll(data.roll)) {
        errors.push('Roll number is required and must be 2-20 alphanumeric characters');
    }
    
    if (!data.registrationNo || data.registrationNo.trim().length < 2) {
        errors.push('Registration number is required');
    }
    
    if (!data.department || data.department.trim().length < 2) {
        errors.push('Department is required');
    }
    
    if (!isValidSemester(data.semester)) {
        errors.push('Invalid semester format (use 1st, 2nd, 3rd, etc.)');
    }
    
    if (data.email && !isValidEmail(data.email)) {
        errors.push('Invalid email format');
    }
    
    if (data.phone && !isValidPhone(data.phone)) {
        errors.push('Phone must be 11 digits');
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
};

// Validate result input
const validateResultInput = (data) => {
    const errors = [];
    
    if (!data.studentId) {
        errors.push('Student ID is required');
    }
    
    if (!isValidSemester(data.semester)) {
        errors.push('Invalid semester format');
    }
    
    if (!data.subjects || !Array.isArray(data.subjects) || data.subjects.length === 0) {
        errors.push('At least one subject is required');
    } else {
        data.subjects.forEach((sub, i) => {
            if (!sub.subjectName || sub.subjectName.trim().length < 2) {
                errors.push(`Subject ${i + 1}: Name is required`);
            }
            if (!isValidMarks(sub.marks)) {
                errors.push(`Subject ${i + 1}: Marks must be 0-100`);
            }
            if (sub.credits && !isValidCredits(sub.credits)) {
                errors.push(`Subject ${i + 1}: Credits must be 1-6`);
            }
        });
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
};

// Sanitize object recursively
const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
            sanitized[key] = value.map(item => 
                typeof item === 'object' ? sanitizeObject(item) : sanitize(item)
            );
        } else if (typeof value === 'object' && value !== null) {
            sanitized[key] = sanitizeObject(value);
        } else {
            sanitized[key] = sanitize(value);
        }
    }
    return sanitized;
};

module.exports = {
    patterns,
    sanitize,
    sanitizeObject,
    isValidEmail,
    isValidPhone,
    isValidRoll,
    isValidSemester,
    isValidSession,
    isValidMarks,
    isValidCGPA,
    isValidCredits,
    validateStudentInput,
    validateResultInput
};
