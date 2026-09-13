const mongoose = require('mongoose');

const roadmapItemSchema = new mongoose.Schema({
  topic: String,
  description: String,
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
  estimatedTime: String,
  resources: [{ title: String, url: String, type: String }],
  completed: { type: Boolean, default: false }
});

const phaseSchema = new mongoose.Schema({
  phaseNumber: Number,
  phaseName: String,
  description: String,
  duration: String,
  items: [roadmapItemSchema],
  completed: { type: Boolean, default: false }
});

const roadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetRole: { type: String, required: true },
  experienceLevel: String,
  phases: [phaseSchema],
  totalProgress: { type: Number, default: 0 },
  generatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Roadmap', roadmapSchema);
