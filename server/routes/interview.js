const express = require('express');
const router = express.Router();
const { startInterview, submitAnswer, completeInterview, getHistory, getInterview } = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/history', getHistory);
router.get('/:id', getInterview);
router.post('/start', startInterview);
router.post('/answer', submitAnswer);
router.post('/complete', completeInterview);

module.exports = router;
