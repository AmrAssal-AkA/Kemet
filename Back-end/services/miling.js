const nodeMiller = require("nodemailer");

const transporter = nodeMiller.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
    
  },
});


const sendEmail = async ({ to, subject, html, text }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: text || "",
      html: html,
    });
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; 
  }
};

module.exports = { sendEmail };
