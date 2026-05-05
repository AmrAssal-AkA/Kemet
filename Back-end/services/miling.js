const nodeMiller = require("nodemailer");

const transporter = nodeMiller.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const verifyEmailTemplate = (name, verifyURL) => `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #decb00;">Welcome to Kemet Travel, ${name}!</h2>
    <p>Thank you for registering. Please verify your email by clicking the button below:</p>
    <a href="${verifyURL}" style="background-color: #decb00; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
    <p>If you did not create an account, please ignore this email.</p>
    <p>Best regards,<br>Kemet Travel Team</p>
  </div>
`;

const resetPasswordTemplate = (name, resetURL) => `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #decb00;">Password Reset Request</h2>
    <p>Hello ${name},</p>
    <p>We received a request to reset your password. Please click the button below to reset it:</p>
    <a href="${resetURL}" style="display: inline-block; background-color: #decb00; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
    <p>If you did not request a password reset, please ignore this email.</p>
    <p>Best regards,<br>Kemet Travel Team</p>
  </div>
`;

const GoogleSignInTemplate = (name) => `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #decb00;">Google Sign-In Successful</h2>
    <p>Hello ${name},</p>
    <p>You have successfully signed in with Google. If this wasn't you, please secure your account immediately.</p>
    <p>Best regards,<br>Kemet Travel Team</p>
  </div>
`;

const BookingConfirmationTemplate = (name, bookingDetails) => `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #decb00;">Booking Confirmation</h2>
    <p>Hello ${name},</p>
    <p>Your booking has been confirmed. Here are your booking details:</p>
    <ul>
      <li>Destination: ${bookingDetails.destination}</li>
      <li>Flight: ${bookingDetails.flight}</li>
      <li>Hotel: ${bookingDetails.hotel}</li>
      <li>Travel Dates: ${bookingDetails.travelDates}</li>
      <li>Number of Travelers: ${bookingDetails.travelers}</li>
      <li>Total Price: ${bookingDetails.totalPrice}</li>
    </ul>
    <p>Thank you for choosing Kemet Travel!</p>
    <p>Best regards,<br>Kemet Travel Team</p>
  </div>
`;



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

module.exports = { sendEmail , verifyEmailTemplate, resetPasswordTemplate, GoogleSignInTemplate, BookingConfirmationTemplate};
