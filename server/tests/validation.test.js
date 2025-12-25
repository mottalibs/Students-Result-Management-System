/**
 * Unit tests for validation.js
 */

const { 
    isValidEmail, 
    isValidPhone, 
    isValidRoll, 
    isValidSemester,
    isValidSession,
    isValidMarks,
    isValidCGPA,
    isValidCredits,
    validateStudentInput,
    validateResultInput,
    sanitize,
    sanitizeObject
} = require('../utils/validation');

describe('Validation Utils', () => {
    describe('isValidEmail', () => {
        it('should return true for valid emails', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
            expect(isValidEmail('user.name@domain.org')).toBe(true);
        });

        it('should return false for invalid emails', () => {
            expect(isValidEmail('invalid')).toBe(false);
            expect(isValidEmail('no@domain')).toBe(false);
            expect(isValidEmail('@domain.com')).toBe(false);
        });

        it('should return true for empty (optional)', () => {
            expect(isValidEmail('')).toBe(true);
            expect(isValidEmail(null)).toBe(true);
        });
    });

    describe('isValidPhone', () => {
        it('should return true for valid 11-digit phone', () => {
            expect(isValidPhone('01712345678')).toBe(true);
        });

        it('should return false for invalid phone', () => {
            expect(isValidPhone('0171234567')).toBe(false); // 10 digits
            expect(isValidPhone('abc12345678')).toBe(false);
        });

        it('should return true for empty (optional)', () => {
            expect(isValidPhone('')).toBe(true);
        });
    });

    describe('isValidSemester', () => {
        it('should return true for valid semesters', () => {
            expect(isValidSemester('1st')).toBe(true);
            expect(isValidSemester('2nd')).toBe(true);
            expect(isValidSemester('8th')).toBe(true);
        });

        it('should return false for invalid semesters', () => {
            expect(isValidSemester('9th')).toBe(false);
            expect(isValidSemester('first')).toBe(false);
            expect(isValidSemester('')).toBe(false);
        });
    });

    describe('isValidSession', () => {
        it('should return true for valid session format', () => {
            expect(isValidSession('2024-2025')).toBe(true);
            expect(isValidSession('2023-2024')).toBe(true);
        });

        it('should return false for invalid session', () => {
            expect(isValidSession('2024-2026')).toBe(false); // Gap > 1
            expect(isValidSession('2024')).toBe(false);
            expect(isValidSession('2024-2024')).toBe(false);
        });
    });

    describe('isValidMarks', () => {
        it('should return true for valid marks 0-100', () => {
            expect(isValidMarks(0)).toBe(true);
            expect(isValidMarks(50)).toBe(true);
            expect(isValidMarks(100)).toBe(true);
        });

        it('should return false for invalid marks', () => {
            expect(isValidMarks(-1)).toBe(false);
            expect(isValidMarks(101)).toBe(false);
            expect(isValidMarks('abc')).toBe(false);
        });
    });

    describe('validateStudentInput', () => {
        it('should pass for valid student data', () => {
            const data = {
                name: 'John Doe',
                roll: '1001',
                registrationNo: 'REG001',
                department: 'Computer Science',
                semester: '1st'
            };
            const result = validateStudentInput(data);
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should fail for missing required fields', () => {
            const data = { name: 'J' }; // Too short
            const result = validateStudentInput(data);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });
    });

    describe('validateResultInput', () => {
        it('should pass for valid result data', () => {
            const data = {
                studentId: '507f1f77bcf86cd799439011',
                semester: '1st',
                subjects: [
                    { subjectName: 'Math', marks: 85 }
                ]
            };
            const result = validateResultInput(data);
            expect(result.valid).toBe(true);
        });

        it('should fail for invalid marks', () => {
            const data = {
                studentId: '507f1f77bcf86cd799439011',
                semester: '1st',
                subjects: [
                    { subjectName: 'Math', marks: 150 } // Invalid
                ]
            };
            const result = validateResultInput(data);
            expect(result.valid).toBe(false);
        });
    });

    describe('sanitize', () => {
        it('should remove HTML tags', () => {
            expect(sanitize('<script>alert(1)</script>')).toBe('scriptalert(1)/script');
        });

        it('should trim whitespace', () => {
            expect(sanitize('  test  ')).toBe('test');
        });
    });
});
