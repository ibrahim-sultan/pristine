const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: true
  },
  moduleIndex: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  type: {
    type: String,
    enum: ['video', 'article', 'quiz', 'assignment', 'resource'],
    default: 'video'
  },
  content: {
    videoUrl: String,
    videoDuration: Number, // in seconds
    articleContent: String,
    resourceUrl: String,
    resourceType: String
  },
  quiz: {
    questions: [{
      question: String,
      options: [String],
      correctAnswer: Number,
      explanation: String
    }],
    passingScore: { type: Number, default: 70 }
  },
  order: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number, // estimated minutes
    default: 10
  },
  isFree: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

lessonSchema.index({ program: 1, moduleIndex: 1, order: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);
