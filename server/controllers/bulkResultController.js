const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Result = require('../models/Result');
const Student = require('../models/Student');
const { calculateCGPA } = require('../utils/gradeUtils');

// Bulk Add Results
const addBulkResults = async (req, res) => {
    try {
        const { results } = req.body; // Array of { roll, semester, subjects: [{ subjectName, marks }] }

        if (!Array.isArray(results) || results.length === 0) {
            return res.status(400).json({ message: 'No results provided' });
        }

        const stats = {
            success: 0,
            failed: 0,
            errors: []
        };

        for (const item of results) {
            try {
                // Find student by roll
                const student = await Student.findOne({ roll: item.roll });
                if (!student) {
                    stats.failed++;
                    stats.errors.push(`Roll ${item.roll}: Student not found`);
                    continue;
                }

                // Enforce department restriction
                if (req.user.role === 'teacher' && req.user.department !== student.department) {
                    stats.failed++;
                    stats.errors.push(`Roll ${item.roll}: Student belongs to different department`);
                    continue;
                }

                // Calculate CGPA
                const { cgpa, status, failedSubjects } = calculateCGPA(item.subjects);

                // Create or Update Result
                // Check if result already exists for this student & semester
                let result = await Result.findOne({ studentId: student._id, semester: item.semester });

                if (result) {
                    // Update
                    result.subjects = item.subjects.map(sub => ({
                        ...sub,
                        grade: calculateGrade(sub.marks), // Helper needed or use utils
                        point: getPoint(calculateGrade(sub.marks))
                    }));
                    result.cgpa = cgpa;
                    result.status = status;
                    result.failedSubjects = failedSubjects;
                    await result.save();
                } else {
                    // Create
                    // Need to enrich subjects with grade/point if calculateCGPA doesn't do it fully
                    // calculateCGPA in utils usually returns aggregate stats.
                    // Let's assume we need to calculate grade/point for each subject here.
                    
                    const enrichedSubjects = item.subjects.map(sub => ({
                        subjectName: sub.subjectName,
                        marks: sub.marks,
                        grade: calculateGrade(sub.marks),
                        point: getPoint(calculateGrade(sub.marks))
                    }));

                    const { cgpa: newCgpa, status: newStatus, failedSubjects: newFailed } = calculateCGPA(enrichedSubjects);

                    result = new Result({
                        studentId: student._id,
                        semester: item.semester,
                        subjects: enrichedSubjects,
                        cgpa: newCgpa,
                        status: newStatus,
                        failedSubjects: newFailed
                    });
                    await result.save();
                }
                stats.success++;

            } catch (err) {
                stats.failed++;
                stats.errors.push(`Roll ${item.roll}: ${err.message}`);
            }
        }

        res.status(200).json({ message: 'Bulk processing complete', stats });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Helpers (Duplicate of client logic, ideally should be in shared utils or imported)
const calculateGrade = (marks) => {
    if (marks >= 80) return 'A+';
    if (marks >= 75) return 'A';
    if (marks >= 70) return 'A-';
    if (marks >= 65) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 55) return 'B-';
    if (marks >= 50) return 'C+';
    if (marks >= 45) return 'C';
    if (marks >= 40) return 'D';
    return 'F';
};

const getPoint = (grade) => {
    const points = { 'A+': 4.0, 'A': 3.75, 'A-': 3.5, 'B+': 3.25, 'B': 3.0, 'B-': 2.75, 'C+': 2.5, 'C': 2.25, 'D': 2.0, 'F': 0 };
    return points[grade] || 0;
};

module.exports = { addBulkResults };
