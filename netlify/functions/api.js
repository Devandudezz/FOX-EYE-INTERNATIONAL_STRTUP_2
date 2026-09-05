// FOX EYE INTERNATIONAL - Netlify Function for Contact Form API
// This replaces the Express server.js for serverless deployment

const nodemailer = require('nodemailer');

// Dynamic CORS handler for Netlify
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
};

// Handle preflight requests
const handleCors = (req, res) => {
  if (req.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }
};

// Main contact form handler
exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const { clientName, contactEmail, caseType, urgencyLevel, caseBrief } = JSON.parse(event.body);

    // Basic Validation
    if (!clientName || !contactEmail || !caseBrief) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: "Required parameters (clientName, contactEmail, caseBrief) are missing."
        })
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: "Invalid email address format."
        })
      };
    }

    // Generate Reference ID
    const refCode = "FX-" + Math.floor(100000 + Math.random() * 900000);

    // Configure SMTP Transporter
    const smtpConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
      },
      connectionTimeout: 10000,
      socketTimeout: 10000,
      logger: false,
      debug: process.env.SMTP_DEBUG === 'true'
    };

    const transporter = nodemailer.createTransport(smtpConfig);

    // Mail 1: Agency Notification
    const agencyMailOptions = {
      from: `"FOX EYE INTERNATIONAL" <${process.env.SMTP_USER}>`,
      to: process.env.AGENCY_NOTIFICATION_EMAIL,
      subject: `[NEW INQUIRY] Ref: ${refCode} - Urgency: ${urgencyLevel ? urgencyLevel.toUpperCase() : 'STANDARD'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
          <h2 style="color: #ffaa00; border-bottom: 2px solid #ffaa00; padding-bottom: 10px; margin-top: 0;">New Survey Inquiry Registered</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee; width: 35%;">Reference ID:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${refCode}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Client Name:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${clientName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Contact Email:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${contactEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Category:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${caseType || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Urgency Level:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${urgencyLevel || 'Standard'}</td>
            </tr>
          </table>
          <h3 style="color: #333;">Case Details / Survey Briefing:</h3>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; border-left: 4px solid #ffaa00; font-family: monospace; white-space: pre-wrap; word-wrap: break-word;">${caseBrief}</div>
        </div>
      `
    };

    // Mail 2: Client Acknowledgement
    const clientMailOptions = {
      from: `"FOX EYE INTERNATIONAL" <${process.env.SMTP_USER}>`,
      to: contactEmail,
      subject: `Acknowledgement: Survey Registered (Ref: ${refCode})`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; background-color: #1b2431; color: #f3f4f6; border-radius: 8px; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.15);">
          <div style="text-align: center; border-bottom: 1px solid #243041; padding-bottom: 20px; margin-bottom: 20px;">
            <h2 style="color: #ffaa00; margin: 0; text-transform: uppercase; letter-spacing: 2px;">FOX EYE INTERNATIONAL</h2>
            <small style="color: #9ba4b3; letter-spacing: 1px;">DETECTIVE AGENCY AND MEDIA PRIVATE LTD.</small>
          </div>
          
          <p>Dear ${clientName},</p>
          
          <p>This message confirms that we have successfully received your case survey inquiry. A reference record has been opened in our secure systems.</p>
          
          <div style="background-color: #243041; border: 1px solid #2d3d52; padding: 20px; border-radius: 6px; margin: 25px 0; text-align: center;">
            <small style="color: #9ba4b3; display: block; margin-bottom: 5px; text-transform: uppercase; font-weight: bold; font-family: monospace;">Case Reference Code</small>
            <strong style="color: #ffaa00; font-size: 24px; font-family: monospace; letter-spacing: 1px;">${refCode}</strong>
          </div>
          
          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>Our senior intake investigator is reviewing your inquiry details under strict attorney-client confidentiality rules.</li>
            <li>A secure communications officer will contact you shortly via the channel you selected to schedule a private consultation.</li>
          </ul>
          
          <p style="margin-top: 30px; border-top: 1px solid #243041; padding-top: 20px; font-size: 12px; color: #9ba4b3; text-align: center;">
            This is an automated acknowledgment. Please do not reply directly to this address. All files are encrypted under standard security parameters.
          </p>
        </div>
      `
    };

    try {
      // Send both emails
      await Promise.all([
        transporter.sendMail(agencyMailOptions),
        transporter.sendMail(clientMailOptions)
      ]);

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          message: "Inquiry received successfully. Confirmation email sent.",
          refCode: refCode
        })
      };
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: "Failed to send confirmation email. Please try again.",
          error: process.env.NODE_ENV === 'development' ? emailError.message : undefined
        })
      };
    }

  } catch (error) {
    console.error("Handler error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        message: "Internal server error. Please try again.",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};
