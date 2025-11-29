const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const Program = require('../models/Program');
const Progress = require('../models/Progress');
const Enrollment = require('../models/Enrollment');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/lessons/program/:programId
// @desc    Get all lessons for a program
// @access  Private (enrolled users or admin)
router.get('/program/:programId', protect, async (req, res) => {
  try {
    const { programId } = req.params;

    // Check if user is admin or enrolled
    if (req.user.role !== 'admin') {
      const enrollment = await Enrollment.findOne({
        program: programId,
        'studentInfo.email': req.user.email,
        status: { $in: ['confirmed', 'active'] }
      });

      if (!enrollment) {
        return res.status(403).json({
          success: false,
          message: 'You must be enrolled in this program to view lessons'
        });
      }
    }

    const lessons = await Lesson.find({ 
      program: programId,
      isPublished: true 
    }).sort({ moduleIndex: 1, order: 1 });

    // Get user progress
    let progress = null;
    if (req.user.role !== 'admin') {
      progress = await Progress.findOne({
        user: req.user._id,
        program: programId
      });
    }

    res.json({
      success: true,
      lessons,
      progress
    });
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/lessons/:id
// @desc    Get single lesson
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('program', 'title');

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    // Check access if not admin
    if (req.user.role !== 'admin' && !lesson.isFree) {
      const enrollment = await Enrollment.findOne({
        program: lesson.program._id,
        'studentInfo.email': req.user.email,
        status: { $in: ['confirmed', 'active'] }
      });

      if (!enrollment) {
        return res.status(403).json({
          success: false,
          message: 'You must be enrolled to view this lesson'
        });
      }
    }

    res.json({ success: true, lesson });
  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/lessons
// @desc    Create a lesson
// @access  Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const lesson = await Lesson.create(req.body);
    res.status(201).json({ success: true, lesson });
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/lessons/:id
// @desc    Update a lesson
// @access  Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    res.json({ success: true, lesson });
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/lessons/:id
// @desc    Delete a lesson
// @access  Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    res.json({ success: true, message: 'Lesson deleted' });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/lessons/:id/complete
// @desc    Mark lesson as complete
// @access  Private
router.post('/:id/complete', protect, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    const { watchTime, quizScore } = req.body;

    let progress = await Progress.findOne({
      user: req.user._id,
      program: lesson.program
    });

    if (!progress) {
      const enrollment = await Enrollment.findOne({
        program: lesson.program,
        'studentInfo.email': req.user.email
      });

      if (!enrollment) {
        return res.status(403).json({ success: false, message: 'Not enrolled' });
      }

      progress = await Progress.create({
        user: req.user._id,
        enrollment: enrollment._id,
        program: lesson.program,
        completedLessons: []
      });
    }

    // Check if already completed
    const alreadyCompleted = progress.completedLessons.find(
      cl => cl.lesson.toString() === lesson._id.toString()
    );

    if (!alreadyCompleted) {
      progress.completedLessons.push({
        lesson: lesson._id,
        watchTime,
        quizScore
      });
    }

    // Calculate overall progress
    const totalLessons = await Lesson.countDocuments({ 
      program: lesson.program, 
      isPublished: true 
    });
    progress.overallProgress = Math.round((progress.completedLessons.length / totalLessons) * 100);
    progress.totalWatchTime += watchTime || 0;
    progress.lastAccessedAt = new Date();

    await progress.save();

    res.json({ success: true, progress });
  } catch (error) {
    console.error('Complete lesson error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
