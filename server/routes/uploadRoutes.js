const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/uploadController');

// Configure Multer for temporary file storage
const upload = multer({ dest: 'uploads/' });

router.post('/students', upload.single('file'), uploadController.uploadStudents);
router.post('/results', upload.single('file'), uploadController.uploadResults);

module.exports = router;
