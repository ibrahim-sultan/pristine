const express = require('express');
const router = express.Router();
const Program = require('../models/Program');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/programs
// @desc    Get all programs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, featured, active } = req.query;
    
    let query = {};
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (active !== 'false') query.isActive = true;

    const programs = await Program.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: programs.length,
      programs
    });
  } catch (error) {
    console.error('Get programs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching programs'
    });
  }
});

// @route   GET /api/programs/featured
// @desc    Get featured programs
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const programs = await Program.find({ isFeatured: true, isActive: true }).limit(6);

    res.json({
      success: true,
      programs
    });
  } catch (error) {
    console.error('Get featured programs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured programs'
    });
  }
});

// @route   GET /api/programs/category/:category
// @desc    Get programs by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const programs = await Program.find({ 
      category: req.params.category,
      isActive: true 
    });

    res.json({
      success: true,
      count: programs.length,
      programs
    });
  } catch (error) {
    console.error('Get programs by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching programs'
    });
  }
});

// @route   GET /api/programs/:slug
// @desc    Get single program by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const program = await Program.findOne({ slug: req.params.slug });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }

    res.json({
      success: true,
      program
    });
  } catch (error) {
    console.error('Get program error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching program'
    });
  }
});

// @route   POST /api/programs
// @desc    Create a program
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const program = await Program.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Program created successfully',
      program
    });
  } catch (error) {
    console.error('Create program error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating program'
    });
  }
});

// @route   PUT /api/programs/:id
// @desc    Update a program
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }

    res.json({
      success: true,
      message: 'Program updated successfully',
      program
    });
  } catch (error) {
    console.error('Update program error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating program'
    });
  }
});

// @route   DELETE /api/programs/:id
// @desc    Delete a program
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }

    res.json({
      success: true,
      message: 'Program deleted successfully'
    });
  } catch (error) {
    console.error('Delete program error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting program'
    });
  }
});

module.exports = router;
