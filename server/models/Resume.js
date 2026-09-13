const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: { type: String, required: true },
  originalName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileSize: { type: Number },
  extractedText: { type: String, default: '' },
  uploadDate: { type: Date, default: Date.now },
  isAnalyzed: { type: Boolean, default: false },
  analysis: {
    score: { type: Number, default: 0 },
    strengths: [String],
    weaknesses: [String],
    skillGaps: [String],
    recommendations: [String],
    extractedSkills: [String],
    experienceLevel: String,
    summary: String,
    analyzedAt: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
