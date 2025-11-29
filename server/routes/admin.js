const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Program = require('../models/Program');
const Enrollment = require('../models/Enrollment');
const Contact = require('../models/Contact');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    const [
      totalPrograms,
      activePrograms,
      totalEnrollments,
      pendingEnrollments,
      totalContacts,
      newContacts,
      totalUsers
    ] = await Promise.all([
      Program.countDocuments(),
      Program.countDocuments({ isActive: true }),
      Enrollment.countDocuments(),
      Enrollment.countDocuments({ status: 'pending' }),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      User.countDocuments()
    ]);

    // Recent enrollments
    const recentEnrollments = await Enrollment.find()
      .populate('program', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    // Enrollments by category
    const enrollmentsByCategory = await Enrollment.aggregate([
      {
        $lookup: {
          from: 'programs',
          localField: 'program',
          foreignField: '_id',
          as: 'programData'
        }
      },
      { $unwind: '$programData' },
      {
        $group: {
          _id: '$programData.category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        programs: {
          total: totalPrograms,
          active: activePrograms
        },
        enrollments: {
          total: totalEnrollments,
          pending: pendingEnrollments
        },
        contacts: {
          total: totalContacts,
          new: newContacts
        },
        users: totalUsers
      },
      recentEnrollments,
      enrollmentsByCategory
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (role) query.role = role;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      count: users.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user (admin)
// @access  Private/Admin
router.put('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    const { role, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user'
    });
  }
});

// @route   PUT /api/admin/users/:id/assign-programs
// @desc    Assign programs to an instructor
// @access  Private/Admin
router.put('/users/:id/assign-programs', protect, adminOnly, async (req, res) => {
  try {
    const { programIds } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role !== 'instructor') {
      return res.status(400).json({ success: false, message: 'User is not an instructor' });
    }

    user.assignedPrograms = programIds;
    await user.save();

    await user.populate('assignedPrograms', 'title');

    res.json({
      success: true,
      message: 'Programs assigned successfully',
      user
    });
  } catch (error) {
    console.error('Assign programs error:', error);
    res.status(500).json({ success: false, message: 'Error assigning programs' });
  }
});

// @route   GET /api/admin/instructors
// @desc    Get all instructors with their assigned programs
// @access  Private/Admin
router.get('/instructors', protect, adminOnly, async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor' })
      .select('-password')
      .populate('assignedPrograms', 'title category');

    res.json({
      success: true,
      instructors
    });
  } catch (error) {
    console.error('Get instructors error:', error);
    res.status(500).json({ success: false, message: 'Error fetching instructors' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    // Prevent deleting other admins
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    // Delete user's enrollments and progress
    await Enrollment.deleteMany({ 'studentInfo.email': user.email });
    const Progress = require('../models/Progress');
    await Progress.deleteMany({ user: user._id });

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user'
    });
  }
});

// @route   GET /api/admin/export/emails
// @desc    Export email list
// @access  Private/Admin
router.get('/export/emails', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ isActive: true }).select('email firstName lastName');
    const enrollments = await Enrollment.find().select('studentInfo.email studentInfo.firstName studentInfo.lastName');

    const emails = new Set();
    
    users.forEach(u => {
      emails.add(JSON.stringify({ email: u.email, name: `${u.firstName} ${u.lastName}` }));
    });
    
    enrollments.forEach(e => {
      if (e.studentInfo?.email) {
        emails.add(JSON.stringify({ 
          email: e.studentInfo.email, 
          name: `${e.studentInfo.firstName} ${e.studentInfo.lastName}` 
        }));
      }
    });

    const emailList = Array.from(emails).map(e => JSON.parse(e));

    res.json({
      success: true,
      count: emailList.length,
      emails: emailList
    });
  } catch (error) {
    console.error('Export emails error:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting emails'
    });
  }
});

module.exports = router;
