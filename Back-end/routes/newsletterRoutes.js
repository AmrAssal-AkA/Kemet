const express = require('express');
const router = express.Router();
const newsletter = require('../model/newsletterSchema');
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

router.post('/subscribe',async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try{
        const newSubscriber = new newsletter({ email });
        await newSubscriber.save();

        const response = {
            message: 'Subscription successful',
            subscriber: newSubscriber
        }
        return res.status(201).json(response);

    }catch(error){
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email already subscribed' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/subscribers', authenticate, authorize("admin"), async (req, res) => {
    try {
        const subscribers = await newsletter.find();
        return res.status(200).json(subscribers);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
})





module.exports = router;