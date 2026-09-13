const express = require('express');
const router = express.Router();
const { getProjectRecommendations, getCertificationRecommendations } = require('../controllers/projectsController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/recommend', getProjectRecommendations);
router.get('/certifications', getCertificationRecommendations);

module.exports = router;
