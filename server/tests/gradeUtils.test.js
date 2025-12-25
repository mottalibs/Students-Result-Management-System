/**
 * Unit tests for gradeUtils.js
 * Tests BTEB grading system calculations
 */

const { getGradePoint, calculateCGPA } = require('../utils/gradeUtils');

describe('Grade Utils', () => {
    describe('getGradePoint', () => {
        it('should return A+ and 4.00 for marks >= 80', () => {
            expect(getGradePoint(80)).toEqual({ grade: 'A+', point: 4.00 });
            expect(getGradePoint(100)).toEqual({ grade: 'A+', point: 4.00 });
            expect(getGradePoint(95)).toEqual({ grade: 'A+', point: 4.00 });
        });

        it('should return A and 3.75 for marks 75-79', () => {
            expect(getGradePoint(75)).toEqual({ grade: 'A', point: 3.75 });
            expect(getGradePoint(79)).toEqual({ grade: 'A', point: 3.75 });
        });

        it('should return A- and 3.50 for marks 70-74', () => {
            expect(getGradePoint(70)).toEqual({ grade: 'A-', point: 3.50 });
            expect(getGradePoint(74)).toEqual({ grade: 'A-', point: 3.50 });
        });

        it('should return B+ and 3.25 for marks 65-69', () => {
            expect(getGradePoint(65)).toEqual({ grade: 'B+', point: 3.25 });
            expect(getGradePoint(69)).toEqual({ grade: 'B+', point: 3.25 });
        });

        it('should return B and 3.00 for marks 60-64', () => {
            expect(getGradePoint(60)).toEqual({ grade: 'B', point: 3.00 });
        });

        it('should return D and 2.00 for marks 40-44', () => {
            expect(getGradePoint(40)).toEqual({ grade: 'D', point: 2.00 });
            expect(getGradePoint(44)).toEqual({ grade: 'D', point: 2.00 });
        });

        it('should return F and 0.00 for marks < 40', () => {
            expect(getGradePoint(39)).toEqual({ grade: 'F', point: 0.00 });
            expect(getGradePoint(0)).toEqual({ grade: 'F', point: 0.00 });
            expect(getGradePoint(20)).toEqual({ grade: 'F', point: 0.00 });
        });
    });

    describe('calculateCGPA', () => {
        it('should calculate correct CGPA for all passing subjects', () => {
            const subjects = [
                { subjectName: 'Math', marks: 80, credits: 4 },
                { subjectName: 'Physics', marks: 75, credits: 3 },
                { subjectName: 'Chemistry', marks: 70, credits: 3 }
            ];
            
            const result = calculateCGPA(subjects);
            
            expect(result.status).toBe('Passed');
            expect(result.failedSubjects).toHaveLength(0);
            expect(result.cgpa).toBeGreaterThan(0);
        });

        it('should return Referred status when there is a failed subject', () => {
            const subjects = [
                { subjectName: 'Math', marks: 80, credits: 4 },
                { subjectName: 'Physics', marks: 30, credits: 3 }, // Failed
                { subjectName: 'Chemistry', marks: 70, credits: 3 }
            ];
            
            const result = calculateCGPA(subjects);
            
            expect(result.status).toBe('Referred');
            expect(result.failedSubjects).toContain('Physics');
            expect(result.cgpa).toBe(0.00);
        });

        it('should handle subjects without credits (default to 1)', () => {
            const subjects = [
                { subjectName: 'Math', marks: 80 },
                { subjectName: 'Physics', marks: 75 }
            ];
            
            const result = calculateCGPA(subjects);
            
            expect(result.status).toBe('Passed');
            expect(result.totalCredits).toBe(2); // Default 1 credit each
        });

        it('should enrich subjects with grade and point', () => {
            const subjects = [
                { subjectName: 'Math', marks: 85 }
            ];
            
            calculateCGPA(subjects);
            
            expect(subjects[0].grade).toBe('A+');
            expect(subjects[0].point).toBe(4.00);
        });

        it('should handle empty subjects array', () => {
            const subjects = [];
            const result = calculateCGPA(subjects);
            
            expect(result.cgpa).toBe(0);
            expect(result.status).toBe('Passed');
        });
    });
});
