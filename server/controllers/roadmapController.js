const Roadmap = require('../models/Roadmap');
const Profile = require('../models/Profile');
const SkillAnalysis = require('../models/SkillAnalysis');
const { generateRoadmap } = require('../services/ai/roadmapService');

// @desc    Generate learning roadmap
// @route   POST /api/roadmap/generate
const generateRoadmapHandler = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    const skillAnalysis = await SkillAnalysis.findOne({ userId: req.user.id });

    const targetRole = req.body.targetRole || profile?.careerInfo?.desiredRole || 'Software Developer';
    const currentSkills = [
      ...(profile?.technicalSkills?.programmingLanguages || []),
      ...(profile?.technicalSkills?.frameworks || []),
      ...(profile?.technicalSkills?.databases || [])
    ];
    const missingSkills = skillAnalysis?.missingSkills || [];
    const experienceLevel = profile?.careerInfo?.experienceLevel || 'fresher';

    const result = await generateRoadmap({ targetRole, currentSkills, missingSkills, experienceLevel });

    const roadmap = await Roadmap.findOneAndUpdate(
      { userId: req.user.id },
      {
        userId: req.user.id,
        targetRole,
        experienceLevel,
        phases: result.phases || [],
        totalProgress: 0,
        generatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, roadmap, totalDuration: result.totalDuration, summary: result.summary });
  } catch (error) {
    console.error('Roadmap generation error:', error);
    res.status(500).json({ success: false, message: error.message || 'Roadmap generation failed' });
  }
};

// @desc    Get roadmap
// @route   GET /api/roadmap
const getRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ userId: req.user.id });
    res.json({ success: true, roadmap });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch roadmap' });
  }
};

// @desc    Update roadmap item completion
// @route   PUT /api/roadmap/progress
const updateProgress = async (req, res) => {
  try {
    const { phaseIndex, itemIndex, completed } = req.body;
    const roadmap = await Roadmap.findOne({ userId: req.user.id });
    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    if (roadmap.phases[phaseIndex]?.items[itemIndex] !== undefined) {
      roadmap.phases[phaseIndex].items[itemIndex].completed = completed;
    }

    // Calculate total progress
    let totalItems = 0, completedItems = 0;
    roadmap.phases.forEach(phase => {
      phase.items.forEach(item => {
        totalItems++;
        if (item.completed) completedItems++;
      });
      phase.completed = phase.items.every(item => item.completed);
    });

    roadmap.totalProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    await roadmap.save();

    res.json({ success: true, roadmap });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update progress' });
  }
};

module.exports = { generateRoadmapHandler, getRoadmap, updateProgress };
