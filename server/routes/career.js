const express = require('express');
const router = express.Router();
const { generateRecommendations, getRecommendations } = require('../controllers/careerController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/recommendations', getRecommendations);
router.post('/recommend', generateRecommendations);

module.exports = router;
