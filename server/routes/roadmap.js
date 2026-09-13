const express = require('express');
const router = express.Router();
const { generateRoadmapHandler, getRoadmap, updateProgress } = require('../controllers/roadmapController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getRoadmap);
router.post('/generate', generateRoadmapHandler);
router.put('/progress', updateProgress);

module.exports = router;
