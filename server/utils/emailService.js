const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send enrollment confirmation email
exports.sendEnrollmentConfirmation = async (enrollment, program) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"Pristine Education" <${process.env.EMAIL_USER}>`,
    to: enrollment.studentInfo?.email || enrollment.user?.email,
    subject: `Enrollment Confirmation - ${program.title}`,
    html: `
      <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #003B73 0%, #0FA776 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Pristine Education</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #003B73;">Welcome to ${program.title}!</h2>
          <p style="color: #333; line-height: 1.6;">
            Dear ${enrollment.studentInfo?.firstName || 'Student'},
          </p>
          <p style="color: #333; line-height: 1.6;">
            Thank you for enrolling in our program. We're excited to have you join us on this learning journey!
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0FA776; margin-top: 0;">Program Details</h3>
            <p><strong>Program:</strong> ${program.title}</p>
            <p><strong>Duration:</strong> ${program.duration}</p>
            <p><strong>Delivery Mode:</strong> ${program.deliveryMode}</p>
          </div>
          <p style="color: #333; line-height: 1.6;">
            Our team will reach out to you shortly with more details about the program schedule and materials.
          </p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}" style="background: #003B73; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">
              Visit Our Website
            </a>
          </div>
        </div>
        <div style="background: #003B73; padding: 20px; text-align: center;">
          <p style="color: white; margin: 0; font-size: 14px;">
            © ${new Date().getFullYear()} Pristine Education. All rights reserved.
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

// Send contact form notification
exports.sendContactNotification = async (contact) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"Pristine Education Website" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `New Contact Form Submission - ${contact.inquiryType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #003B73;">New Contact Form Submission</h2>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
          <p><strong>Name:</strong> ${contact.name}</p>
          <p><strong>Email:</strong> ${contact.email}</p>
          <p><strong>Phone:</strong> ${contact.phone || 'N/A'}</p>
          <p><strong>Organization:</strong> ${contact.organization || 'N/A'}</p>
          <p><strong>Inquiry Type:</strong> ${contact.inquiryType}</p>
          <p><strong>Subject:</strong> ${contact.subject}</p>
          <p><strong>Message:</strong></p>
          <p style="background: white; padding: 15px; border-radius: 5px;">${contact.message}</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};
