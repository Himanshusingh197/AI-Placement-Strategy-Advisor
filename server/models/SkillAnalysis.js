const mongoose = require('mongoose');

const skillGapSchema = new mongoose.Schema({
  skill: String,
  currentLevel: {
    type: String,
    enum: ['none', 'beginner', 'intermediate', 'advanced', 'expert']
  },
  requiredLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert']
  },
  gap: { type: String, enum: ['none', 'low', 'medium', 'high'] },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'] }
});

const skillAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetRole: { type: String, required: true },
  currentSkills: [String],
  requiredSkills: [String],
  missingSkills: [String],
  skillGaps: [skillGapSchema],
  overallGapScore: { type: Number, default: 0 },
  recommendations: [String],
  analyzedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('SkillAnalysis', skillAnalysisSchema);
