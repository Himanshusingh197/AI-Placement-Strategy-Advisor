const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  question: String,
  answer: String,
  feedback: String,
  score: { type: Number, min: 0, max: 10 },
  category: String
});

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: { type: String, required: true },
  type: {
    type: String,
    enum: ['technical', 'aptitude', 'hr', 'mock'],
    default: 'mock'
  },
  questions: [{ question: String, category: String, difficulty: String }],
  answers: [answerSchema],
  scores: {
    relevance: { type: Number, default: 0 },
    technicalAccuracy: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    completeness: { type: Number, default: 0 },
    overall: { type: Number, default: 0 }
  },
  feedback: {
    strengths: [String],
    weaknesses: [String],
    improvements: [String],
    summary: String
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'in-progress'
  },
  startedAt: { type: Date, default: Date.now },
  completedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
