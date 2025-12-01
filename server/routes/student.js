const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');
const Program = require('../models/Program');
const { protect } = require('../middleware/auth');

// @route   GET /api/student/dashboard
// @desc    Get student dashboard data
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    // Get all enrollments for this user (by user id or email)
    const enrollments = await Enrollment.find({
      $or: [
        { 'studentInfo.email': req.user.email },
        { user: req.user._id }
      ]
    }).populate('program', 'title shortDescription category duration thumbnail');

    // Get progress for active enrollments
    const activeEnrollments = enrollments.filter(e => 
      ['confirmed', 'active'].includes(e.status)
    );

    const enrollmentsWithProgress = await Promise.all(
      activeEnrollments.map(async (enrollment) => {
        const progress = await Progress.findOne({
          user: req.user._id,
          program: enrollment.program._id
        });

        const lessonCount = await Lesson.countDocuments({
          program: enrollment.program._id,
          isPublished: true
        });

        return {
          enrollment: enrollment.toObject(),
          progress: progress ? progress.toObject() : null,
          totalLessons: lessonCount
        };
      })
    );

    // Get recent activity
    const recentProgress = await Progress.find({ user: req.user._id })
      .sort({ lastAccessedAt: -1 })
      .limit(5)
      .populate('program', 'title')
      .populate('currentLesson', 'title');

    // Calculate stats
    const stats = {
      totalEnrollments: enrollments.length,
      activePrograms: activeEnrollments.length,
      completedPrograms: enrollments.filter(e => e.status === 'completed').length,
      pendingEnrollments: enrollments.filter(e => e.status === 'pending').length
    };

    res.json({
      success: true,
      enrollments: enrollmentsWithProgress,
      pendingEnrollments: enrollments.filter(e => e.status === 'pending'),
      recentActivity: recentProgress,
      stats
    });
  } catch (error) {
    console.error('Student dashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/student/program/:programId
// @desc    Get program learning page data
// @access  Private
router.get('/program/:programId', protect, async (req, res) => {
  try {
    const { programId } = req.params;

    // Check enrollment
    const enrollment = await Enrollment.findOne({
      program: programId,
      'studentInfo.email': req.user.email,
      status: { $in: ['confirmed', 'active'] }
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in this program or enrollment is pending'
      });
    }

    // Get program details
    const program = await Program.findById(programId);

    // Get all lessons organized by module
    const lessons = await Lesson.find({ 
      program: programId, 
      isPublished: true 
    }).sort({ moduleIndex: 1, order: 1 });

    // Organize lessons by module
    const moduleMap = {};
    lessons.forEach(lesson => {
      if (!moduleMap[lesson.moduleIndex]) {
        moduleMap[lesson.moduleIndex] = {
          moduleInfo: program.modules[lesson.moduleIndex] || { title: `Module ${lesson.moduleIndex + 1}` },
          lessons: []
        };
      }
      moduleMap[lesson.moduleIndex].lessons.push(lesson);
    });

    const modules = Object.values(moduleMap);

    // Get or create progress
    let progress = await Progress.findOne({
      user: req.user._id,
      program: programId
    });

    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        enrollment: enrollment._id,
        program: programId,
        currentLesson: lessons[0]?._id
      });
    }

    // Update last accessed
    progress.lastAccessedAt = new Date();
    await progress.save();

    // Update enrollment status to active if confirmed
    if (enrollment.status === 'confirmed') {
      enrollment.status = 'active';
      await enrollment.save();
    }

    res.json({
      success: true,
      program,
      modules,
      progress,
      enrollment
    });
  } catch (error) {
    console.error('Get program learning error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/student/notes
// @desc    Save a note for a lesson
// @access  Private
router.post('/notes', protect, async (req, res) => {
  try {
    const { programId, lessonId, content, timestamp } = req.body;

    let progress = await Progress.findOne({
      user: req.user._id,
      program: programId
    });

    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress not found' });
    }

    progress.notes.push({
      lesson: lessonId,
      content,
      timestamp
    });

    await progress.save();

    res.json({ success: true, notes: progress.notes });
  } catch (error) {
    console.error('Save note error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/student/notes/:programId
// @desc    Get notes for a program
// @access  Private
router.get('/notes/:programId', protect, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user._id,
      program: req.params.programId
    }).populate('notes.lesson', 'title');

    res.json({
      success: true,
      notes: progress?.notes || []
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/student/quiz/:lessonId/submit
// @desc    Submit quiz answers
// @access  Private
router.post('/quiz/:lessonId/submit', protect, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson || lesson.type !== 'quiz') {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const { answers } = req.body;
    let correctCount = 0;

    const results = lesson.quiz.questions.map((q, i) => {
      const isCorrect = answers[i] === q.correctAnswer;
      if (isCorrect) correctCount++;
      return {
        question: q.question,
        yourAnswer: answers[i],
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      };
    });

    const score = Math.round((correctCount / lesson.quiz.questions.length) * 100);
    const passed = score >= lesson.quiz.passingScore;

    // Update progress if passed
    if (passed) {
      let progress = await Progress.findOne({
        user: req.user._id,
        program: lesson.program
      });

      if (progress) {
        const alreadyCompleted = progress.completedLessons.find(
          cl => cl.lesson.toString() === lesson._id.toString()
        );

        if (!alreadyCompleted) {
          progress.completedLessons.push({
            lesson: lesson._id,
            quizScore: score
          });

          const totalLessons = await Lesson.countDocuments({
            program: lesson.program,
            isPublished: true
          });
          progress.overallProgress = Math.round((progress.completedLessons.length / totalLessons) * 100);
          await progress.save();
        }
      }
    }

    res.json({
      success: true,
      score,
      passed,
      passingScore: lesson.quiz.passingScore,
      results
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
