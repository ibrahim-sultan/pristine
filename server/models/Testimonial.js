const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  organization: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Testimonial content is required']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  avatar: String,
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program'
  },
  category: {
    type: String,
    enum: ['student', 'parent', 'school', 'corporate'],
    default: 'student'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
