const Student = require('../models/Student');
const Result = require('../models/Result');
const xlsx = require('xlsx');
const fs = require('fs');

// Helper to delete file after processing
const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
    });
};

exports.uploadStudents = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        if (data.length === 0) {
            deleteFile(req.file.path);
            return res.status(400).json({ message: 'File is empty' });
        }

        let successCount = 0;
        let duplicateCount = 0;
        let errors = [];

        for (const row of data) {
            // Basic Validation
            if (!row.roll || !row.name || !row.department) {
                errors.push(`Row missing required fields: ${JSON.stringify(row)}`);
                continue;
            }

            // Check if student exists
            const existingStudent = await Student.findOne({ roll: row.roll.toString() });
            if (existingStudent) {
                duplicateCount++;
                continue;
            }

            try {
                await Student.create({
                    name: row.name,
                    roll: row.roll.toString(),
                    registrationNo: row.registrationNo || `REG${row.roll}`,
                    department: row.department,
                    semester: row.semester || '1st',
                    session: row.session || '2023-2024'
                });
                successCount++;
            } catch (err) {
                errors.push(`Error adding roll ${row.roll}: ${err.message}`);
            }
        }

        deleteFile(req.file.path);

        res.status(200).json({
            message: 'Bulk upload processed',
            successCount,
            duplicateCount,
            errors
        });

    } catch (error) {
        if (req.file) deleteFile(req.file.path);
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Server Error during upload' });
    }
};

exports.uploadResults = async (req, res) => {
    // Placeholder for result upload logic if needed later
    // Similar structure: parse file -> find student by roll -> create/update result
    res.status(501).json({ message: 'Result upload not implemented yet' });
};
