const express = require("express");
const router = express.Router();
const {sendEmail, newsletterSubscriptionTemplate, newsletterTemplate } = require("../services/miling")
const Newsletter = require("../model/newsletterShema");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const logger = require("../services/logger");


router.post("/subscribe", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    try {
        const existingSubscription = await Newsletter.findOne({ email });
        if (existingSubscription) {
            return res.status(400).json({ error: "You are already subscribed" });
        }
        const newSubscription = new Newsletter({ email });
        await newSubscription.save();
        const htmlContent = newsletterSubscriptionTemplate(email);
        await sendEmail({
            to: email,
            subject: "Welcome to Kemet Travel Newsletter!",
            html: htmlContent,
        }, res);
        res.status(201).json({ message: "You have been subscribed successfully!" });
    } catch (error) {
        console.error("Error subscribing to newsletter:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/send", authenticate, authorize("admin"), async (req, res) => {
    const { subject, content } = req.body;
    if (!subject || !content) {
        return res.status(400).json({ error: "Subject and content are required" });
    }
    try {
        const subscribers = await Newsletter.find({});
        const emailPromises = subscribers.map(subscriber => {
            const htmlContent = newsletterTemplate(subscriber.email, content);
            return sendEmail({
                to: subscriber.email,
                subject,
                html: htmlContent,
            }, res);
        });
        await Promise.all(emailPromises);
        res.status(200).json({ message: "Newsletter sent to all subscribers!" });
    }catch (error) {
        logger.error("Error sending newsletter:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/unsubscribe",authenticate, authorize("user"), async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    try {
        const result = await Newsletter.deleteOne({ email });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Email not found in subscription list" });
        }
        await sendEmail({
            to: email,
            subject: "You have been unsubscribed from Kemet Travel Newsletter",
            text: "You have successfully unsubscribed from our newsletter. We're sorry to see you go!",
            html: `<p>You have successfully unsubscribed from our newsletter. We're sorry to see you go!</p>`,
        }, res);
        res.status(200).json({ message: "You have been unsubscribed successfully!" });
    } catch (error) {
        console.error("Error unsubscribing from newsletter:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router;