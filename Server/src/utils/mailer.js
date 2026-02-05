const nodemailer = require('nodemailer');

// Mock transporter for demo/development if no env vars
// In a real app, use:
/*
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
*/

// For this hackathon/demo, we'll simulate the "Concept" of sending email
// unless the user provides credentials. We will log it clearly.
// OR we can use Ethereal (fake SMTP service) for real proof.

const sendBinFullAlert = async (bin) => {
    console.log(`\n[EMAIL SERVICE] 📧 PREPARING ALERT FOR BIN: ${bin._id}`);

    // Simulate content
    const subject = `⚠️ ALERT: Smart Bin at ${bin.location} is ${bin.fillLevel}% FULL`;
    const text = `
    URGENT NOTICE
    -------------
    Bin ID: ${bin._id}
    Location: ${bin.location || 'Main Street'}
    Current Fill Level: ${bin.fillLevel}%
    Status: ${bin.status}

    Action Required: Please dispatch collection team immediately.
    `;

    console.log(`[EMAIL SERVICE] ------------------------------------------------`);
    console.log(`[EMAIL SERVICE] To: municipality@city.gov, officer@locality.com`);
    console.log(`[EMAIL SERVICE] Subject: ${subject}`);
    console.log(`[EMAIL SERVICE] Body: ${text}`);
    console.log(`[EMAIL SERVICE] ------------------------------------------------\n`);

    // Actual sending logic if env vars existed
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: "municipality@city.gov", // Mock recipient
                subject: subject,
                text: text
            });
            console.log("[EMAIL SERVICE] ✅ Sent via Nodemailer");
        } catch (error) {
            console.error("[EMAIL SERVICE] ❌ Failed to send real email:", error.message);
        }
    } else {
        console.log("[EMAIL SERVICE] (Skipped real send: No EMAIL_USER/EMAIL_PASS in .env)");
    }
};

module.exports = { sendBinFullAlert };
