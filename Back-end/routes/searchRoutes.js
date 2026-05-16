const express = require("express");
const router = express.Router();
const Trip = require("../model/tripSchema");


router.get("/search", (req, res) => {
     const { location, date, travelers = 1, category } = req.query;
      
     if (!location || !date) {
         return res.status(400).json({ error: "Missing required query parameters: location and date" });
     }



        const fliters = {location: location, duration: date, travelers: { $gte: parseInt(travelers) } };
        if (category) {
            fliters.category = category;
        }

        Trip.find(fliters)
            .then((trips) => {
                res.json(trips);
            })
            .catch((err) => {
                console.error("Error searching trips:", err);
                res.status(500).json({ error: "Internal server error" });
            });
})


module.exports = router;