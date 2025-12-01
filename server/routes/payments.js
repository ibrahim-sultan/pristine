const express = require('express');
const router = express.Router();
const https = require('https');
const nodemailer = require('nodemailer');
const Enrollment = require('../models/Enrollment');
const Program = require('../models/Program');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send payment notification to admin
const sendPaymentNotification = async (enrollment, program, user) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  
  const mailOptions = {
    from: `"Pristine Education" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: `💰 New Payment Received - ${program.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #003B73; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">New Payment Received!</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <strong style="color: #065f46;">✓ Payment Confirmed</strong>
          </div>
          
          <h3 style="color: #003B73; border-bottom: 2px solid #003B73; padding-bottom: 10px;">Student Details</h3>
          <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          
          <h3 style="color: #003B73; border-bottom: 2px solid #003B73; padding-bottom: 10px;">Program</h3>
          <p><strong>Title:</strong> ${program.title}</p>
          <p><strong>Category:</strong> ${program.category}</p>
          
          <h3 style="color: #003B73; border-bottom: 2px solid #003B73; padding-bottom: 10px;">Payment Details</h3>
          <p><strong>Amount:</strong> ${enrollment.paymentDetails?.currency?.toUpperCase() || 'USD'} ${enrollment.paymentDetails?.amount}</p>
          <p><strong>Provider:</strong> ${enrollment.paymentDetails?.provider}</p>
          <p><strong>Reference:</strong> ${enrollment.paymentDetails?.reference}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          
          <div style="margin-top: 30px; padding: 20px; background: white; border-radius: 8px; text-align: center;">
            <a href="${process.env.FRONTEND_URL}/admin/enrollments" 
               style="background: #003B73; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View in Dashboard
            </a>
          </div>
        </div>
        <div style="padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
          <p>Pristine Education Platform</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Payment notification sent to admin');
  } catch (error) {
    console.error('Error sending payment notification:', error);
  }
};

// Send confirmation email to student
const sendStudentConfirmation = async (enrollment, program, user) => {
  const mailOptions = {
    from: `"Pristine Education" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `🎉 Enrollment Confirmed - ${program.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #003B73; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Welcome to ${program.title}!</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <p>Dear ${user.firstName},</p>
          <p>Thank you for your payment! Your enrollment has been confirmed.</p>
          
          <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong style="color: #065f46;">✓ Payment Successful</strong>
            <p style="margin: 5px 0 0; color: #065f46;">Amount: ${enrollment.paymentDetails?.currency?.toUpperCase() || 'USD'} ${enrollment.paymentDetails?.amount}</p>
          </div>
          
          <h3 style="color: #003B73;">What's Next?</h3>
          <ul>
            <li>Access your course from your student dashboard</li>
            <li>Start learning at your own pace</li>
            <li>Track your progress as you complete lessons</li>
          </ul>
          
          <div style="margin-top: 30px; text-align: center;">
            <a href="${process.env.FRONTEND_URL}/dashboard" 
               style="background: #0FA776; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Start Learning Now
            </a>
          </div>
        </div>
        <div style="padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
          <p>If you have any questions, contact us at support@pristineeducation.com</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent to student');
  } catch (error) {
    console.error('Error sending student confirmation:', error);
  }
};

// Initialize Stripe (will be undefined if no key)
let stripe;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}

// Paystack API helper
const paystackRequest = (path, method, data) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path,
      method,
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10 second timeout
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(responseData));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
};

// @route   POST /api/payments/initialize
// @desc    Initialize payment (auto-selects provider)
// @access  Private
router.post('/initialize', protect, async (req, res) => {
  try {
    const { programId, provider } = req.body;
    
    const program = await Program.findById(programId);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    const user = await User.findById(req.user._id);
    // Support both new { amount, currency } structure and legacy numeric price
    const amount = typeof program.price === 'object' && program.price !== null
      ? program.price.amount
      : program.price;
    const email = user.email;

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      'studentInfo.email': email,
      program: programId,
      status: { $in: ['confirmed', 'active', 'completed'] }
    });

    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this program' });
    }

    // Use Paystack by default, or Stripe if specified
    if (provider === 'stripe' && stripe) {
      // Stripe Checkout
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: program.title,
              description: program.shortDescription || program.description?.substring(0, 200)
            },
            unit_amount: Math.round(amount * 100) // Stripe uses cents
          },
          quantity: 1
        }],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&program=${programId}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel?program=${programId}`,
        customer_email: email,
        metadata: {
          programId,
          userId: req.user._id.toString()
        }
      });

      return res.json({
        success: true,
        provider: 'stripe',
        sessionId: session.id,
        url: session.url
      });

    } else {
      // Paystack
      if (!process.env.PAYSTACK_SECRET_KEY) {
        return res.status(400).json({ 
          success: false, 
          message: 'Paystack not configured. Please add PAYSTACK_SECRET_KEY to environment variables.' 
        });
      }

      const reference = `PE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      try {
        const response = await paystackRequest('/transaction/initialize', 'POST', {
          email,
          amount: Math.round(amount * 100), // Paystack uses kobo/cents
          reference,
          callback_url: `${process.env.FRONTEND_URL}/payment/verify?reference=${reference}&program=${programId}`,
          metadata: {
            programId,
            userId: req.user._id.toString(),
            programTitle: program.title
          }
        });

        if (!response.status) {
          return res.status(400).json({ success: false, message: response.message || 'Payment initialization failed' });
        }

        return res.json({
          success: true,
          provider: 'paystack',
          reference,
          authorization_url: response.data.authorization_url,
          access_code: response.data.access_code
        });
      } catch (paystackError) {
        console.error('Paystack error:', paystackError);
        return res.status(500).json({ 
          success: false, 
          message: 'Paystack service unavailable. Please try again or contact support.' 
        });
      }
    }

  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({ success: false, message: 'Payment initialization failed' });
  }
});

// @route   GET /api/payments/verify/paystack/:reference
// @desc    Verify Paystack payment
// @access  Private
router.get('/verify/paystack/:reference', protect, async (req, res) => {
  try {
    const { reference } = req.params;
    const { programId } = req.query;

    const response = await paystackRequest(`/transaction/verify/${reference}`, 'GET');

    if (!response.status || response.data.status !== 'success') {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    const paymentData = response.data;
    const program = await Program.findById(programId);
    const user = await User.findById(req.user._id);

    // Create enrollment
    const enrollment = await Enrollment.create({
      program: programId,
      user: req.user._id,
      studentInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || ''
      },
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentDetails: {
        provider: 'paystack',
        reference: reference,
        amount: paymentData.amount / 100,
        currency: paymentData.currency,
        paidAt: new Date(paymentData.paid_at)
      }
    });

    // Send email notifications
    sendPaymentNotification(enrollment, program, user);
    sendStudentConfirmation(enrollment, program, user);

    res.json({
      success: true,
      message: 'Payment verified and enrollment confirmed',
      enrollment
    });

  } catch (error) {
    console.error('Paystack verification error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
});

// @route   POST /api/payments/verify/stripe
// @desc    Verify Stripe payment
// @access  Private
router.post('/verify/stripe', protect, async (req, res) => {
  try {
    const { sessionId, programId } = req.body;

    if (!stripe) {
      return res.status(400).json({ success: false, message: 'Stripe not configured' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ success: false, message: 'Payment not completed' });
    }

    const user = await User.findById(req.user._id);

    // Check if enrollment already exists (prevent duplicates)
    const existing = await Enrollment.findOne({
      'paymentDetails.reference': sessionId
    });

    if (existing) {
      return res.json({ success: true, message: 'Enrollment already exists', enrollment: existing });
    }

    const program = await Program.findById(programId);

    // Create enrollment
    const enrollment = await Enrollment.create({
      program: programId,
      user: req.user._id,
      studentInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || ''
      },
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentDetails: {
        provider: 'stripe',
        reference: sessionId,
        amount: session.amount_total / 100,
        currency: session.currency,
        paidAt: new Date()
      }
    });

    // Send email notifications
    sendPaymentNotification(enrollment, program, user);
    sendStudentConfirmation(enrollment, program, user);

    res.json({
      success: true,
      message: 'Payment verified and enrollment confirmed',
      enrollment
    });

  } catch (error) {
    console.error('Stripe verification error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
});

// @route   POST /api/payments/webhook/paystack
// @desc    Paystack webhook handler
// @access  Public
router.post('/webhook/paystack', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const crypto = require('crypto');
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(400).send('Invalid signature');
    }

    const event = req.body;

    if (event.event === 'charge.success') {
      const { reference, metadata } = event.data;
      
      // Check if already processed
      const existing = await Enrollment.findOne({ 'paymentDetails.reference': reference });
      if (existing) return res.sendStatus(200);

      const user = await User.findById(metadata.userId);
      if (!user) return res.sendStatus(200);

      await Enrollment.create({
        program: metadata.programId,
        user: metadata.userId,
        studentInfo: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || ''
        },
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentDetails: {
          provider: 'paystack',
          reference,
          amount: event.data.amount / 100,
          currency: event.data.currency,
          paidAt: new Date(event.data.paid_at)
        }
      });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Paystack webhook error:', error);
    res.sendStatus(500);
  }
});

// @route   POST /api/payments/webhook/stripe
// @desc    Stripe webhook handler
// @access  Public
router.post('/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) return res.sendStatus(400);

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { programId, userId } = session.metadata;

    // Check if already processed
    const existing = await Enrollment.findOne({ 'paymentDetails.reference': session.id });
    if (existing) return res.sendStatus(200);

    const user = await User.findById(userId);
    if (!user) return res.sendStatus(200);

    await Enrollment.create({
      program: programId,
      user: userId,
      studentInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || ''
      },
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentDetails: {
        provider: 'stripe',
        reference: session.id,
        amount: session.amount_total / 100,
        currency: session.currency,
        paidAt: new Date()
      }
    });
  }

  res.sendStatus(200);
});

// @route   GET /api/payments/config
// @desc    Get payment configuration (public keys)
// @access  Public
router.get('/config', (req, res) => {
  res.json({
    paystack: {
      publicKey: process.env.PAYSTACK_PUBLIC_KEY || null,
      enabled: !!process.env.PAYSTACK_SECRET_KEY
    },
    stripe: {
      publicKey: process.env.STRIPE_PUBLIC_KEY || null,
      enabled: !!process.env.STRIPE_SECRET_KEY
    }
  });
});

module.exports = router;
