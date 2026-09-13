const Profile = require('../models/Profile');
const SkillAnalysis = require('../models/SkillAnalysis');
const { recommendProjects, recommendCertifications } = require('../services/ai/projectRecommendationService');

// @desc    Get project recommendations
// @route   GET /api/projects/recommend
const getProjectRecommendations = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    const skillAnalysis = await SkillAnalysis.findOne({ userId: req.user.id });

    const currentSkills = [
      ...(profile?.technicalSkills?.programmingLanguages || []),
      ...(profile?.technicalSkills?.frameworks || []),
      ...(profile?.technicalSkills?.databases || [])
    ];
    const skillGaps = skillAnalysis?.missingSkills || [];
    const targetRole = profile?.careerInfo?.desiredRole || 'Software Developer';
    const experienceLevel = profile?.careerInfo?.experienceLevel || 'fresher';

    const result = await recommendProjects({ targetRole, skillGaps, currentSkills, experienceLevel });
    res.json({ success: true, projects: result.projects || [] });
  } catch (error) {
    console.error('Project recommendation error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to get project recommendations' });
  }
};

// @desc    Get certification recommendations
// @route   GET /api/projects/certifications
const getCertificationRecommendations = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    const skillAnalysis = await SkillAnalysis.findOne({ userId: req.user.id });

    const skillGaps = skillAnalysis?.missingSkills || [];
    const targetRole = profile?.careerInfo?.desiredRole || 'Software Developer';
    const experienceLevel = profile?.careerInfo?.experienceLevel || 'fresher';

    const result = await recommendCertifications({ targetRole, skillGaps, experienceLevel });
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Certification recommendation error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to get certifications' });
  }
};

module.exports = { getProjectRecommendations, getCertificationRecommendations };
