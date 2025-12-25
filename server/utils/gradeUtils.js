/**
 * BTEB Grading System (Standard)
 * 80-100: A+ (4.00)
 * 75-79: A (3.75)
 * 70-74: A- (3.50)
 * 65-69: B+ (3.25)
 * 60-64: B (3.00)
 * 55-59: B- (2.75)
 * 50-54: C+ (2.50)
 * 45-49: C (2.25)
 * 40-44: D (2.00)
 * 00-39: F (0.00)
 */

const getGradePoint = (marks) => {
    if (marks >= 80) return { grade: 'A+', point: 4.00 };
    if (marks >= 75) return { grade: 'A', point: 3.75 };
    if (marks >= 70) return { grade: 'A-', point: 3.50 };
    if (marks >= 65) return { grade: 'B+', point: 3.25 };
    if (marks >= 60) return { grade: 'B', point: 3.00 };
    if (marks >= 55) return { grade: 'B-', point: 2.75 };
    if (marks >= 50) return { grade: 'C+', point: 2.50 };
    if (marks >= 45) return { grade: 'C', point: 2.25 };
    if (marks >= 40) return { grade: 'D', point: 2.00 };
    return { grade: 'F', point: 0.00 };
};

const calculateCGPA = (subjects) => {
    let totalPoints = 0;
    let totalCredits = 0;
    let hasFail = false;
    let failedSubjects = [];

    subjects.forEach(sub => {
        const { grade, point } = getGradePoint(sub.marks);
        // If credits are not provided, assume 4 credits for now or handle it. 
        // Ideally credits should be passed. Defaulting to 1 if missing to avoid NaN.
        const credits = sub.credits || 1; 
        
        totalPoints += point * credits;
        totalCredits += credits;

        if (point === 0) {
            hasFail = true;
            failedSubjects.push(sub.subjectName);
        }
        
        // Enrich subject with calculated data
        sub.grade = grade;
        sub.point = point;
    });

    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0.00;
    
    return {
        cgpa: hasFail ? 0.00 : parseFloat(gpa),
        status: hasFail ? 'Referred' : 'Passed',
        failedSubjects,
        totalCredits
    };
};

module.exports = { getGradePoint, calculateCGPA };
