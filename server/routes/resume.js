const express = require('express');
const router = express.Router();
const { uploadResume, analyzeResumeHandler, getResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);
router.get('/', getResume);
router.post('/upload', upload.single('resume'), uploadResume);
router.post('/analyze', analyzeResumeHandler);

module.exports = router;
