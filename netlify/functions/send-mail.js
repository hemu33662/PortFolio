const nodemailer = require('nodemailer');

exports.handler = async function (event) {
    // Only allow POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        // Parse the body
        const data = JSON.parse(event.body);
        const { name, email, subject, message } = data;

        // Validation
        if (!name || !email || !message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ status: 'error', message: 'Missing fields' })
            };
        }

        // Configure Nodemailer (Dynamic SMTP)
        // Defaults to Gmail if not specified, but allows overrides
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Send Email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "hemanth.nitm@gmail.com", // Destination
            replyTo: email,
            subject: 'Portfolio Message: ' + (subject || 'No Subject'),
            html: `
                <h3>New Contact Message</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
            `
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ status: 'success', message: 'Mail sent successfully' })
        };

    } catch (error) {
        console.error("Mail Error:", error); // Logs to Netlify Function logs
        return {
            statusCode: 500,
            body: JSON.stringify({
                status: 'error',
                message: 'Failed to send email. Check function logs for details.',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            })
        };
    }
};
