require("dotenv").config();

const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {

    console.log("EMAIL_USER:", process.env.EMAIL_USER);

    

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: html
    });

    console.log(
        "Email sent successfully:",
        info.messageId
    );
};

module.exports = sendEmail;