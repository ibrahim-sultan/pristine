const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Program = require('../models/Program');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const { protect } = require('../middleware/auth');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|webm|mov|avi|pdf|doc|docx|ppt|pptx|xls|xlsx|zip|rar/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type'));
  }
});

// Middleware to check if user is instructor
const isInstructor = (req, res, next) => {
  if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Instructors only.' });
  }
  next();
};

// Check if instructor has access to program
const hasAccessToProgram = async (req, res, next) => {
  const programId = req.params.programId || req.body.program;
  
  if (req.user.role === 'admin') {
    return next(); // Admins have access to all
  }
  
  const user = await User.findById(req.user._id);
  if (!user.assignedPrograms.includes(programId)) {
    return res.status(403).json({ success: false, message: 'You are not assigned to this program' });
  }
  next();
};

// @route   GET /api/instructor/dashboard
// @desc    Get instructor dashboard
// @access  Private/Instructor
router.get('/dashboard', protect, isInstructor, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('assignedPrograms', 'title category duration thumbnail');
    
    // Get stats for assigned programs
    const programIds = user.assignedPrograms.map(p => p._id);
    
    const [totalLessons, totalEnrollments] = await Promise.all([
      Lesson.countDocuments({ program: { $in: programIds } }),
      Enrollment.countDocuments({ program: { $in: programIds }, status: { $in: ['confirmed', 'active'] } })
    ]);

    res.json({
      success: true,
      instructor: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        bio: user.bio,
        expertise: user.expertise
      },
      programs: user.assignedPrograms,
      stats: {
        totalPrograms: user.assignedPrograms.length,
        totalLessons,
        totalStudents: totalEnrollments
      }
    });
  } catch (error) {
    console.error('Instructor dashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/instructor/programs
// @desc    Get instructor's assigned programs
// @access  Private/Instructor
router.get('/programs', protect, isInstructor, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'assignedPrograms',
      select: 'title category description duration level price isActive modules'
    });

    res.json({
      success: true,
      programs: user.assignedPrograms
    });
  } catch (error) {
    console.error('Get instructor programs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/instructor/programs/:programId
// @desc    Get single program details for instructor
// @access  Private/Instructor
router.get('/programs/:programId', protect, isInstructor, hasAccessToProgram, async (req, res) => {
  try {
    const program = await Program.findById(req.params.programId);
    const lessons = await Lesson.find({ program: req.params.programId }).sort({ moduleIndex: 1, order: 1 });
    const enrollments = await Enrollment.find({ 
      program: req.params.programId,
      status: { $in: ['confirmed', 'active'] }
    }).select('studentInfo status createdAt');

    res.json({
      success: true,
      program,
      lessons,
      enrollments,
      stats: {
        totalLessons: lessons.length,
        totalStudents: enrollments.length
      }
    });
  } catch (error) {
    console.error('Get program details error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/instructor/lessons
// @desc    Create a lesson
// @access  Private/Instructor
router.post('/lessons', protect, isInstructor, hasAccessToProgram, async (req, res) => {
  try {
    const lesson = await Lesson.create(req.body);
    res.status(201).json({ success: true, lesson });
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/instructor/lessons/:id
// @desc    Update a lesson
// @access  Private/Instructor
router.put('/lessons/:id', protect, isInstructor, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    // Check access
    if (req.user.role !== 'admin') {
      const user = await User.findById(req.user._id);
      if (!user.assignedPrograms.includes(lesson.program.toString())) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, lesson: updatedLesson });
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/instructor/lessons/:id
// @desc    Delete a lesson
// @access  Private/Instructor
router.delete('/lessons/:id', protect, isInstructor, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    // Check access
    if (req.user.role !== 'admin') {
      const user = await User.findById(req.user._id);
      if (!user.assignedPrograms.includes(lesson.program.toString())) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    await Lesson.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Lesson deleted' });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/instructor/upload/video
// @desc    Upload video file
// @access  Private/Instructor
router.post('/upload/video', protect, isInstructor, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const videoUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      url: videoUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload video error:', error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

// @route   POST /api/instructor/upload/resource
// @desc    Upload resource file (PDF, documents, etc.)
// @access  Private/Instructor
router.post('/upload/resource', protect, isInstructor, upload.single('resource'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const resourceUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      url: resourceUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      type: path.extname(req.file.originalname).substring(1)
    });
  } catch (error) {
    console.error('Upload resource error:', error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

// @route   GET /api/instructor/students/:programId
// @desc    Get students enrolled in a program
// @access  Private/Instructor
router.get('/students/:programId', protect, isInstructor, hasAccessToProgram, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      program: req.params.programId,
      status: { $in: ['confirmed', 'active', 'completed'] }
    }).populate('user', 'firstName lastName email');

    const Progress = require('../models/Progress');
    const studentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const progress = await Progress.findOne({
          enrollment: enrollment._id
        });
        return {
          enrollment,
          progress: progress ? {
            overallProgress: progress.overallProgress,
            completedLessons: progress.completedLessons.length,
            lastAccessed: progress.lastAccessedAt
          } : null
        };
      })
    );

    res.json({
      success: true,
      students: studentsWithProgress
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/instructor/profile
// @desc    Update instructor profile
// @access  Private/Instructor
router.put('/profile', protect, isInstructor, async (req, res) => {
  try {
    const { firstName, lastName, bio, expertise, phone } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, bio, expertise, phone },
      { new: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
