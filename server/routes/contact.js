const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { protect, adminOnly } = require('../middleware/auth');
const { sendContactNotification } = require('../utils/emailService');

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, phone, organization, inquiryType, subject, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      phone,
      organization,
      inquiryType: inquiryType || 'general',
      subject,
      message
    });

    // Send notification email
    await sendContactNotification(contact);

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting contact form'
    });
  }
});

// @route   GET /api/contact
// @desc    Get all contact submissions
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, inquiryType, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (inquiryType) query.inquiryType = inquiryType;

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      count: contacts.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      contacts
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts'
    });
  }
});

// @route   GET /api/contact/test-email
// @desc    Test email configuration
// @access  Public (remove in production)
router.get('/test-email', async (req, res) => {
  const nodemailer = require('nodemailer');
  
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ Email server connection successful!');

    // Send test email
    const info = await transporter.sendMail({
      from: `"Pristine Education" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: '✅ Test Email - Pristine Education',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px;">
          <h1 style="color: #003B73;">Email Configuration Successful! 🎉</h1>
          <p>If you're reading this, your email is configured correctly.</p>
          <p style="background: #d1fae5; padding: 15px; border-radius: 8px; color: #065f46;">
            <strong>✓ SMTP Connection:</strong> Working<br>
            <strong>✓ Email Sending:</strong> Working
          </p>
          <p>You will now receive notifications when:</p>
          <ul>
            <li>A student makes a payment</li>
            <li>Someone submits a contact form</li>
            <li>New enrollments are created</li>
          </ul>
          <p style="color: #6b7280; font-size: 12px;">Sent from Pristine Education Platform</p>
        </div>
      `
    });

    console.log('✅ Test email sent:', info.messageId);

    res.json({
      success: true,
      message: 'Test email sent successfully! Check your inbox.',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('❌ Email test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Email configuration failed',
      error: error.message,
      hint: error.code === 'EAUTH' 
        ? 'Authentication failed. Check EMAIL_USER and EMAIL_PASS in .env' 
        : 'Check your EMAIL_HOST and EMAIL_PORT settings'
    });
  }
});

// @route   PUT /api/contact/:id
// @desc    Update contact status
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status, notes } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        notes,
        respondedAt: status === 'resolved' ? new Date() : undefined
      },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact updated successfully',
      contact
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating contact'
    });
  }
});

module.exports = router;
