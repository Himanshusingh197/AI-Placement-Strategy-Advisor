const CareerRecommendation = require('../models/CareerRecommendation');
const Profile = require('../models/Profile');
const Resume = require('../models/Resume');
const { recommendCareers } = require('../services/ai/careerRecommendationService');

// @desc    Generate career recommendations
// @route   POST /api/career/recommend
const generateRecommendations = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(400).json({ success: false, message: 'Please complete your profile first' });
    }

    const resume = await Resume.findOne({ userId: req.user.id });
    const skills = [
      ...(profile.technicalSkills?.programmingLanguages || []),
      ...(profile.technicalSkills?.frameworks || []),
      ...(profile.technicalSkills?.databases || []),
      ...(profile.technicalSkills?.tools || [])
    ];

    const result = await recommendCareers({
      skills,
      cgpa: profile.academicDetails?.cgpa || profile.academicDetails?.percentage,
      interests: profile.careerInfo?.careerInterests || [],
      desiredRole: profile.careerInfo?.desiredRole,
      experienceLevel: profile.careerInfo?.experienceLevel || 'fresher',
      resumeSummary: resume?.analysis?.summary || ''
    });

    const recommendation = await CareerRecommendation.findOneAndUpdate(
      { userId: req.user.id },
      {
        userId: req.user.id,
        careerPaths: result.careerPaths || [],
        topRecommendation: result.topRecommendation || '',
        generatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, recommendation, summary: result.summary });
  } catch (error) {
    console.error('Career recommendation error:', error);
    res.status(500).json({ success: false, message: error.message || 'Career recommendation failed' });
  }
};

// @desc    Get career recommendations
// @route   GET /api/career/recommendations
const getRecommendations = async (req, res) => {
  try {
    const recommendation = await CareerRecommendation.findOne({ userId: req.user.id });
    res.json({ success: true, recommendation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch recommendations' });
  }
};

module.exports = { generateRecommendations, getRecommendations };
