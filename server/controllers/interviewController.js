const Interview = require('../models/Interview');
const Profile = require('../models/Profile');
const { generateInterviewQuestions, evaluateAnswer, generateInterviewFeedback } = require('../services/ai/interviewService');

// @desc    Start mock interview
// @route   POST /api/interview/start
const startInterview = async (req, res) => {
  try {
    const { role, type = 'mock' } = req.body;
    const profile = await Profile.findOne({ userId: req.user.id });

    const skills = [
      ...(profile?.technicalSkills?.programmingLanguages || []),
      ...(profile?.technicalSkills?.frameworks || [])
    ];

    const count = type === 'mock' ? 8 : 10;
    const result = await generateInterviewQuestions({ role, skills, type, count });

    const interview = await Interview.create({
      userId: req.user.id,
      role,
      type,
      questions: result.questions || [],
      answers: [],
      status: 'in-progress'
    });

    res.status(201).json({
      success: true,
      interviewId: interview._id,
      questions: interview.questions,
      totalQuestions: interview.questions.length
    });
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to start interview' });
  }
};

// @desc    Submit answer and get feedback
// @route   POST /api/interview/answer
const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer } = req.body;
    const interview = await Interview.findById(interviewId);

    if (!interview || interview.userId.toString() !== req.user.id.toString()) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    const question = interview.questions[questionIndex];
    if (!question) {
      return res.status(400).json({ success: false, message: 'Invalid question index' });
    }

    const evaluation = await evaluateAnswer({
      question: question.question,
      answer,
      role: interview.role,
      category: question.category
    });

    interview.answers.push({
      question: question.question,
      answer,
      feedback: evaluation.feedback,
      score: evaluation.score,
      category: question.category
    });

    await interview.save();

    res.json({
      success: true,
      feedback: evaluation,
      answersCount: interview.answers.length,
      totalQuestions: interview.questions.length
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to evaluate answer' });
  }
};

// @desc    Complete interview and get final feedback
// @route   POST /api/interview/complete
const completeInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;
    const interview = await Interview.findById(interviewId);

    if (!interview || interview.userId.toString() !== req.user.id.toString()) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    if (interview.answers.length === 0) {
      return res.status(400).json({ success: false, message: 'No answers submitted' });
    }

    // Calculate scores
    const avgScore = interview.answers.reduce((sum, a) => sum + (a.score || 0), 0) / interview.answers.length;
    const scores = {
      relevance: Math.round(avgScore * 0.9 + Math.random() * 1),
      technicalAccuracy: Math.round(avgScore * 0.95),
      communication: Math.round(avgScore * 0.85 + Math.random() * 1.5),
      completeness: Math.round(avgScore * 0.9),
      overall: Math.round(avgScore * 10)
    };

    const feedbackResult = await generateInterviewFeedback({
      role: interview.role,
      answers: interview.answers,
      scores
    });

    interview.scores = scores;
    interview.feedback = feedbackResult;
    interview.status = 'completed';
    interview.completedAt = new Date();
    await interview.save();

    res.json({ success: true, interview });
  } catch (error) {
    console.error('Complete interview error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to complete interview' });
  }
};

// @desc    Get interview history
// @route   GET /api/interview/history
const getHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user.id })
      .select('-questions -answers')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ success: true, interviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch interview history' });
  }
};

// @desc    Get single interview
// @route   GET /api/interview/:id
const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview || interview.userId.toString() !== req.user.id.toString()) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }
    res.json({ success: true, interview });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch interview' });
  }
};

module.exports = { startInterview, submitAnswer, completeInterview, getHistory, getInterview };
