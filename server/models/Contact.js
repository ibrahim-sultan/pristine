const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  organization: {
    type: String,
    trim: true
  },
  inquiryType: {
    type: String,
    enum: ['general', 'bootcamp', 'olympiad', 'corporate', 'partnership', 'other'],
    default: 'general'
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'resolved'],
    default: 'new'
  },
  respondedAt: Date,
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
