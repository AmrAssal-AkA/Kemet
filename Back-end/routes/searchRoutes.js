const express = require("express");
const router = express.Router();
const Trip = require("../model/tripSchema");

router.get("/search", (req, res) => {
  let { location, duration, travelers = 1, AdvantureType } = req.query;

  if (!location || !duration) {
    return res
      .status(400)
      .json({ error: "Missing required query parameters: location and duration" });
  }
  location = location.trim();
  duration = duration.trim();

  const travelerCount = parseInt(travelers);
  if (isNaN(travelers) || parseInt(travelers) <= 0) {
    return res
      .status(400)
      .json({
        error: "Invalid travelers parameter. It must be a positive integer.",
      });
  }

  const fliters = {
    location: { $regex: location, $options: "i" },
    duration: { $regex: duration, $options: "i" },
    travelers: { $gte: travelerCount},
  };
  if (AdvantureType) {
    fliters.AdvantureType = AdvantureType;
  }

  Trip.find(fliters)
    .then((trips) => {
      res.json(trips);
    })
    .catch((err) => {
      console.error("Error searching trips:", err);
      res.status(500).json({ error: "Internal server error" });
    });
});

module.exports = router;
