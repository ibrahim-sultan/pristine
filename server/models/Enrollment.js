const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: true
  },
  // For guest enrollments
  studentInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    age: Number,
    parentName: String,
    parentEmail: String,
    parentPhone: String,
    organization: String,
    country: String
  },
  cohortDate: {
    startDate: Date,
    endDate: Date
  },
  enrollmentType: {
    type: String,
    enum: ['individual', 'school', 'corporate'],
    default: 'individual'
  },
  numberOfParticipants: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  payment: {
    amount: Number,
    currency: String,
    status: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentDetails: {
    provider: {
      type: String,
      enum: ['paystack', 'stripe', 'bank_transfer', 'cash', 'other']
    },
    reference: String,
    amount: Number,
    currency: String,
    paidAt: Date,
    metadata: mongoose.Schema.Types.Mixed
  },
  notes: String,
  source: {
    type: String,
    default: 'website'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
