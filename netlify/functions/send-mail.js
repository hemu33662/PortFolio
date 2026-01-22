const nodemailer = require('nodemailer');

exports.handler = async function (event, context) {
    // Only allow POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        // Parse the body (either JSON or URL-encoded/FormData from fetch)
        // Note: fetch() with FormData sends multipart, but Netlify Functions 
        // handle body parsing best if we send JSON or parsed fields.
        // For simplicity with validate.js, we will parse the JSON body.

        const data = JSON.parse(event.body);
        const { name, email, subject, message } = data;

        // Validation
        if (!name || !email || !message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ status: 'error', message: 'Missing fields' })
            };
        }

        // Configure Nodemailer (Gmail SMTP)
        // These vars must be set in Netlify Environment Variables
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Send Email
        await transporter.sendMail({
            from: process.env.EMAIL_USER, // Sender address
            to: "hemanth.nitm@gmail.com", // Destination (Your Email)
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
        console.error("Mail Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ status: 'error', message: 'Failed to send email' })
        };
    }
};
