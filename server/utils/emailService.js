const nodemailer = require('nodemailer');

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'joshua.stokes@ethereal.email', // Generated ethereal user
        pass: '5R1c1y1y1y1y1y1y1y' // Generated ethereal password (placeholder)
    }
});

// Generate test account if not provided (for development)
const initEmailService = async () => {
    try {
        const testAccount = await nodemailer.createTestAccount();
        transporter.options.auth.user = testAccount.user;
        transporter.options.auth.pass = testAccount.pass;
        console.log('Email Service Initialized with Ethereal Account:');
        console.log(`User: ${testAccount.user}`);
        console.log(`Pass: ${testAccount.pass}`);
    } catch (err) {
        console.error('Failed to create test account:', err);
    }
};

// Initialize on startup
initEmailService();

const sendResultEmail = async (studentEmail, studentName, resultData) => {
    try {
        const info = await transporter.sendMail({
            from: '"Result Management System" <admin@school.com>', // sender address
            to: studentEmail, // list of receivers
            subject: "Your Result Has Been Published", // Subject line
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #2563eb; text-align: center;">Result Published</h2>
                    <p>Dear <strong>${studentName}</strong>,</p>
                    <p>Your result for <strong>${resultData.semester}</strong> has been published.</p>
                    
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Summary</h3>
                        <p><strong>CGPA:</strong> ${resultData.cgpa}</p>
                        <p><strong>Total Marks:</strong> ${resultData.subjects.reduce((acc, sub) => acc + sub.marks, 0)}</p>
                    </div>

                    <p>Please login to your student dashboard to view the full detailed transcript.</p>
                    
                    <a href="http://localhost:5173" style="display: block; width: 200px; margin: 20px auto; padding: 10px; background-color: #2563eb; color: white; text-align: center; text-decoration: none; border-radius: 5px;">View Full Result</a>
                    
                    <p style="font-size: 12px; color: #6b7280; text-align: center; margin-top: 30px;">
                        This is an automated email. Please do not reply.
                    </p>
                </div>
            `,
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        return null;
    }
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, userName, resetUrl) => {
    try {
        const info = await transporter.sendMail({
            from: '"Result Management System" <admin@school.com>',
            to: email,
            subject: "Password Reset Request",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #2563eb; text-align: center;">Password Reset</h2>
                    <p>Dear <strong>${userName}</strong>,</p>
                    <p>We received a request to reset your password. Click the button below to set a new password:</p>
                    
                    <a href="${resetUrl}" style="display: block; width: 200px; margin: 20px auto; padding: 12px; background-color: #2563eb; color: white; text-align: center; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                    
                    <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                        <p style="margin: 0; color: #92400e;"><strong>⚠️ Important:</strong> This link will expire in 1 hour.</p>
                    </div>
                    
                    <p>If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
                    
                    <p style="font-size: 12px; color: #6b7280; text-align: center; margin-top: 30px;">
                        This is an automated email. Please do not reply.
                    </p>
                </div>
            `,
        });

        console.log("Password reset email sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return info;
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw error;
    }
};

module.exports = { sendResultEmail, sendPasswordResetEmail };

