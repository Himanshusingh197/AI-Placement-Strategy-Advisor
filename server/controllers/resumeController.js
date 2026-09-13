const pdf = require('pdf-parse');
const fs = require('fs');
const Resume = require('../models/Resume');
const Profile = require('../models/Profile');
const { analyzeResume } = require('../services/ai/resumeAnalysisService');

// @desc    Upload resume
// @route   POST /api/resume/upload
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Extract text from PDF
    let extractedText = '';
    try {
      const dataBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdf(dataBuffer);
      extractedText = pdfData.text;
    } catch (pdfError) {
      console.error('PDF extraction error:', pdfError.message);
    }

    // Delete old resume if exists
    await Resume.deleteMany({ userId: req.user.id });

    const resume = await Resume.create({
      userId: req.user.id,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      extractedText
    });

    res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully',
      resume: {
        id: resume._id,
        originalName: resume.originalName,
        uploadDate: resume.uploadDate,
        isAnalyzed: resume.isAnalyzed,
        hasText: extractedText.length > 0
      }
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload resume' });
  }
};

// @desc    Analyze resume with AI
// @route   POST /api/resume/analyze
const analyzeResumeHandler = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'No resume found. Please upload your resume first.' });
    }
    if (!resume.extractedText || resume.extractedText.length < 50) {
      return res.status(400).json({ success: false, message: 'Could not extract enough text from your resume. Please ensure it is a text-based PDF.' });
    }

    const profile = await Profile.findOne({ userId: req.user.id });
    const skills = profile?.technicalSkills
      ? [
          ...(profile.technicalSkills.programmingLanguages || []),
          ...(profile.technicalSkills.frameworks || []),
          ...(profile.technicalSkills.databases || []),
          ...(profile.technicalSkills.tools || [])
        ]
      : [];

    const targetRole = profile?.careerInfo?.desiredRole || 'Software Developer';
    const experienceLevel = profile?.careerInfo?.experienceLevel || 'fresher';

    const analysis = await analyzeResume({
      resumeText: resume.extractedText.substring(0, 4000),
      skills,
      targetRole,
      experienceLevel
    });

    resume.analysis = { ...analysis, analyzedAt: new Date() };
    resume.isAnalyzed = true;
    await resume.save();

    res.json({ success: true, message: 'Resume analyzed successfully', analysis: resume.analysis });
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ success: false, message: error.message || 'Resume analysis failed' });
  }
};

// @desc    Get resume
// @route   GET /api/resume
const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id }).select('-extractedText -filePath');
    if (!resume) {
      return res.json({ success: true, resume: null });
    }
    res.json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch resume' });
  }
};

module.exports = { uploadResume, analyzeResumeHandler, getResume };
