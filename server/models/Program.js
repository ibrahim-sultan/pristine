const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  title: String,
  description: String,
  duration: String,
  topics: [String]
});

const programSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Program title is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  category: {
    type: String,
    enum: ['bootcamp', 'olympiad', 'corporate', 'climate'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'all-levels'],
    default: 'beginner'
  },
  ageGroup: {
    min: Number,
    max: Number
  },
  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  modules: [moduleSchema],
  outcomes: [String],
  prerequisites: [String],
  features: [String],
  deliveryMode: {
    type: String,
    enum: ['online', 'onsite', 'hybrid'],
    default: 'online'
  },
  cohortDates: [{
    startDate: Date,
    endDate: Date,
    spotsAvailable: Number
  }],
  thumbnail: String,
  icon: String,
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  instructor: {
    name: String,
    title: String,
    bio: String,
    avatar: String
  }
}, {
  timestamps: true
});

// Generate slug before saving
programSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Program', programSchema);
