// Foxeye Detective Agency - Node.js Express Mailer API
// Works with: localhost, cloudflared tunnels, and production domains

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration for all environments (local, cloudflare tunnels, production)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'http://127.0.0.1:3000',
];

// Add environment-specific origins
if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL);
if (process.env.CLOUDFLARE_TUNNEL_URL) allowedOrigins.push(process.env.CLOUDFLARE_TUNNEL_URL);
if (process.env.PRODUCTION_DOMAIN) allowedOrigins.push(process.env.PRODUCTION_DOMAIN);

// Allow all cloudflare tunnel subdomains dynamically
const dynamicCors = (req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow cloudflare tunnel URLs, localhost, and configured origins
  if (
    !origin || 
    origin.includes('localhost') || 
    origin.includes('127.0.0.1') ||
    origin.includes('.trycloudflare.com') ||
    origin.includes('cloudflareaccess.com') ||
    allowedOrigins.includes(origin) ||
    (process.env.PRODUCTION_DOMAIN && origin.includes(process.env.PRODUCTION_DOMAIN))
  ) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
};

app.use(dynamicCors);
app.use(express.json({ limit: '10mb' }));

// Main Client Inquiry Submission Endpoint
app.post('/api/contact-survey', async (req, res) => {
  const { clientName, contactEmail, caseType, urgencyLevel, caseBrief } = req.body;

  // Basic Validation
  if (!clientName || !contactEmail || !caseBrief) {
    return res.status(400).json({ 
      success: false, 
      message: "Required parameters (clientName, contactEmail, caseBrief) are missing." 
    });
  }

  // Generate Reference ID
  const refCode = "FX-" + Math.floor(100000 + Math.random() * 900000);

  // Configure SMTP Transporter with TLS/SSL handling for all environments
  const smtpConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    // Critical for cloudflare tunnels: disable strict certificate verification
    tls: {
      rejectUnauthorized: false, // Allow self-signed certificates in tunnels
      minVersion: 'TLSv1.2'      // Enforce minimum TLS version
    },
    // Connection pooling for better reliability
    pool: {
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 1000,
      rateLimit: 5
    },
    // Retry strategy for failed connections
    connectionTimeout: 10000,    // 10 second timeout
    socketTimeout: 10000,
    logger: true,
    debug: process.env.SMTP_DEBUG === 'true' // Enable logging if needed
  };

  const transporter = nodemailer.createTransport(smtpConfig);

  // Mail 1 Content: Sent to the Agency (Notification)
  const agencyMailOptions = {
    from: `"FOX EYE INTERNATIONAL" <${process.env.SMTP_USER}>`,
    to: process.env.AGENCY_NOTIFICATION_EMAIL, // Specific email to receive inquiries
    subject: `[NEW INQUIRY] Ref: ${refCode} - Urgency: ${urgencyLevel.toUpperCase()}`,
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
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${caseType}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Urgency Level:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${urgencyLevel}</td>
          </tr>
        </table>
        <h3 style="color: #333;">Case Details / Survey Briefing:</h3>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; border-left: 4px solid #ffaa00; font-family: monospace; white-space: pre-wrap;">${caseBrief}</div>
      </div>
    `
  };

  // Mail 2 Content: Sent to the Customer (Automated Acknowledgement)
  const clientMailOptions = {
    from: `"FOX EYE INTERNATIONAL" <${process.env.SMTP_USER}>`,
    to: contactEmail, // Client's email address
    subject: `Acknowledgement: Survey Registered (Ref: ${refCode})`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; background-color: #1b2431; color: #f3f4f6; border-radius: 8px; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.15);">
        <div style="text-align: center; border-bottom: 1px solid #243041; padding-bottom: 20px; margin-bottom: 20px;">
          <h2 style="color: #ffaa00; margin: 0; text-transform: uppercase; letter-spacing: 2px;">FOX EYE INTERNATIONAL</h2>
          <small style="color: #9ba4b3; letter-spacing: 1px;">FOX EYE INTERNATIONAL DETECTIVE AGENCY AND MEDIA PRIVATE LTD.</small>
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
    // Verify SMTP connection before sending (critical for tunnel reliability)
    try {
      await transporter.verify();
      console.log('✓ SMTP connection verified');
    } catch (verifyError) {
      console.warn('⚠ SMTP verification warning (continuing anyway):', verifyError.message);
    }

    // Send both emails concurrently with retry logic
    let retries = 2;
    let lastError;

    while (retries > 0) {
      try {
        await Promise.all([
          transporter.sendMail(agencyMailOptions),
          transporter.sendMail(clientMailOptions)
        ]);
        
        // Success — send response to client
        return res.status(200).json({ 
          success: true, 
          message: "Emails sent successfully.", 
          refCode: refCode 
        });
      } catch (sendError) {
        lastError = sendError;
        retries--;
        
        if (retries > 0) {
          console.warn(`⚠ Email send failed, retrying (${retries} attempts left):`, sendError.message);
          // Wait 2 seconds before retry
          await new Promise(r => setTimeout(r, 2000));
        }
      }
    }

    // All retries exhausted
    throw lastError;

  } catch (error) {
    console.error("❌ Nodemailer Service Error:", error.message);
    console.error("Stack:", error.stack);
    
    res.status(500).json({ 
      success: false, 
      message: "The mail dispatcher failed to transmit SMTP packet data.",
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});
// Serve frontend files
app.use(express.static(path.join(__dirname)));

// Serve website homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
// Start listening
app.listen(PORT, () => {
  console.log(`Mail API Server actively running on http://localhost:${PORT}`);
});
