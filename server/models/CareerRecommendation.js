const mongoose = require('mongoose');

const careerPathSchema = new mongoose.Schema({
  role: String,
  matchPercentage: Number,
  requiredSkills: [String],
  currentStrengths: [String],
  missingSkills: [String],
  description: String,
  averageSalary: String,
  growthProspect: String,
  recommendedPath: [String]
});

const careerRecommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  careerPaths: [careerPathSchema],
  topRecommendation: String,
  generatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('CareerRecommendation', careerRecommendationSchema);
