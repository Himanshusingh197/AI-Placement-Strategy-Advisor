const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  academicDetails: {
    cgpa: { type: Number, min: 0, max: 10 },
    percentage: { type: Number, min: 0, max: 100 },
    relevantSubjects: [String],
    achievements: [String]
  },
  technicalSkills: {
    programmingLanguages: [String],
    frameworks: [String],
    databases: [String],
    tools: [String],
    cloudTechnologies: [String],
    otherSkills: [String]
  },
  careerInfo: {
    desiredRole: { type: String, trim: true },
    preferredIndustry: { type: String, trim: true },
    careerInterests: [String],
    experienceLevel: {
      type: String,
      enum: ['fresher', 'beginner', 'intermediate', 'experienced'],
      default: 'fresher'
    },
    targetCompanies: [String]
  },
  personalInfo: {
    linkedIn: String,
    github: String,
    portfolio: String,
    bio: String
  },
  completionScore: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Calculate profile completion score
profileSchema.methods.calculateCompletion = function () {
  let score = 0;
  const total = 10;
  if (this.academicDetails?.cgpa || this.academicDetails?.percentage) score++;
  if (this.academicDetails?.relevantSubjects?.length > 0) score++;
  if (this.technicalSkills?.programmingLanguages?.length > 0) score++;
  if (this.technicalSkills?.frameworks?.length > 0) score++;
  if (this.technicalSkills?.databases?.length > 0) score++;
  if (this.careerInfo?.desiredRole) score++;
  if (this.careerInfo?.preferredIndustry) score++;
  if (this.careerInfo?.experienceLevel) score++;
  if (this.personalInfo?.linkedIn || this.personalInfo?.github) score++;
  if (this.personalInfo?.bio) score++;
  return Math.round((score / total) * 100);
};

module.exports = mongoose.model('Profile', profileSchema);
