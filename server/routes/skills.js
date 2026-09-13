const express = require('express');
const router = express.Router();
const { analyzeSkills, getSkills } = require('../controllers/skillsController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getSkills);
router.post('/analyze', analyzeSkills);

module.exports = router;
