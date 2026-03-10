const nodeMiller = require("nodemailer");

const transporter = nodeMiller.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

model.exports = {transporter}