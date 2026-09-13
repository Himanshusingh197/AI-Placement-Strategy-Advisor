const SkillAnalysis = require('../models/SkillAnalysis');
const Profile = require('../models/Profile');
const { analyzeSkillGap } = require('../services/ai/skillGapService');

// @desc    Analyze skill gaps
// @route   POST /api/skills/analyze
const analyzeSkills = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(400).json({ success: false, message: 'Please complete your profile first' });
    }

    const currentSkills = [
      ...(profile.technicalSkills?.programmingLanguages || []),
      ...(profile.technicalSkills?.frameworks || []),
      ...(profile.technicalSkills?.databases || []),
      ...(profile.technicalSkills?.tools || []),
      ...(profile.technicalSkills?.cloudTechnologies || [])
    ];

    const targetRole = req.body.targetRole || profile.careerInfo?.desiredRole || 'Software Developer';
    const experienceLevel = profile.careerInfo?.experienceLevel || 'fresher';

    if (currentSkills.length === 0) {
      return res.status(400).json({ success: false, message: 'Please add your technical skills to your profile first' });
    }

    const analysis = await analyzeSkillGap({ currentSkills, targetRole, experienceLevel });

    // Save or update analysis
    const skillAnalysis = await SkillAnalysis.findOneAndUpdate(
      { userId: req.user.id },
      {
        userId: req.user.id,
        targetRole,
        currentSkills,
        requiredSkills: analysis.requiredSkills || [],
        missingSkills: analysis.missingSkills || [],
        skillGaps: analysis.skillGaps || [],
        overallGapScore: analysis.overallGapScore || 0,
        recommendations: analysis.recommendations || [],
        analyzedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, analysis: skillAnalysis, aiInsights: analysis });
  } catch (error) {
    console.error('Skill analysis error:', error);
    res.status(500).json({ success: false, message: error.message || 'Skill analysis failed' });
  }
};

// @desc    Get skill analysis
// @route   GET /api/skills
const getSkills = async (req, res) => {
  try {
    const analysis = await SkillAnalysis.findOne({ userId: req.user.id });
    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch skill analysis' });
  }
};

module.exports = { analyzeSkills, getSkills };
