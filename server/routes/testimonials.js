const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/testimonials
// @desc    Get approved testimonials
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, featured, limit = 10 } = req.query;
    
    let query = { isApproved: true };
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;

    const testimonials = await Testimonial.find(query)
      .populate('program', 'title')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: testimonials.length,
      testimonials
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonials'
    });
  }
});

// @route   GET /api/testimonials/all
// @desc    Get all testimonials (admin)
// @access  Private/Admin
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .populate('program', 'title')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: testimonials.length,
      testimonials
    });
  } catch (error) {
    console.error('Get all testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonials'
    });
  }
});

// @route   POST /api/testimonials
// @desc    Create testimonial
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      testimonial
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating testimonial'
    });
  }
});

// @route   PUT /api/testimonials/:id
// @desc    Update testimonial
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      message: 'Testimonial updated successfully',
      testimonial
    });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating testimonial'
    });
  }
});

// @route   DELETE /api/testimonials/:id
// @desc    Delete testimonial
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting testimonial'
    });
  }
});

module.exports = router;
