const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Enrollment = require('../models/Enrollment');
const Program = require('../models/Program');
const { protect, adminOnly } = require('../middleware/auth');
const { sendEnrollmentConfirmation } = require('../utils/emailService');

// @route   POST /api/enrollments
// @desc    Create new enrollment
// @access  Public
router.post('/', [
  body('programId').notEmpty().withMessage('Program ID is required'),
  body('studentInfo.firstName').trim().notEmpty().withMessage('First name is required'),
  body('studentInfo.lastName').trim().notEmpty().withMessage('Last name is required'),
  body('studentInfo.email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { programId, studentInfo, cohortDate, enrollmentType, numberOfParticipants, notes } = req.body;

    // Check if program exists
    const program = await Program.findById(programId);
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      program: programId,
      studentInfo,
      cohortDate,
      enrollmentType: enrollmentType || 'individual',
      numberOfParticipants: numberOfParticipants || 1,
      notes,
      payment: {
        amount: program.price.amount * (numberOfParticipants || 1),
        currency: program.price.currency
      }
    });

    // Send confirmation email
    await sendEnrollmentConfirmation(enrollment, program);

    res.status(201).json({
      success: true,
      message: 'Enrollment submitted successfully. Check your email for confirmation.',
      enrollment: {
        id: enrollment._id,
        program: program.title,
        status: enrollment.status
      }
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing enrollment'
    });
  }
});

// @route   GET /api/enrollments
// @desc    Get all enrollments (admin)
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, program, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (program) query.program = program;

    const enrollments = await Enrollment.find(query)
      .populate('program', 'title category')
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Enrollment.countDocuments(query);

    res.json({
      success: true,
      count: enrollments.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      enrollments
    });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching enrollments'
    });
  }
});

// @route   GET /api/enrollments/:id
// @desc    Get single enrollment
// @access  Private/Admin
router.get('/:id', protect, adminOnly, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('program')
      .populate('user', 'firstName lastName email phone');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.json({
      success: true,
      enrollment
    });
  } catch (error) {
    console.error('Get enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching enrollment'
    });
  }
});

// @route   PUT /api/enrollments/:id/status
// @desc    Update enrollment status
// @access  Private/Admin
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, notes } = req.body;

    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true }
    );

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.json({
      success: true,
      message: 'Enrollment status updated',
      enrollment
    });
  } catch (error) {
    console.error('Update enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating enrollment'
    });
  }
});

module.exports = router;
