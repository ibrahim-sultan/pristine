const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  enrollment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true
  },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: true
  },
  completedLessons: [{
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    watchTime: Number, // seconds watched for videos
    quizScore: Number
  }],
  currentLesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  totalWatchTime: {
    type: Number,
    default: 0
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  notes: [{
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
    },
    content: String,
    timestamp: Number,
    createdAt: { type: Date, default: Date.now }
  }],
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateIssuedAt: Date
}, {
  timestamps: true
});

progressSchema.index({ user: 1, program: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
