const exporess = require("express");
const router = exporess.Router();

const User = require("../model/userSchema");
const Booking = require("../model/bookingSchema");


router.get("/BookedTrips", (req,res) => {
    const userId = req.cookies["userId"];
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const getBookedTrips = async () => {
        try {
            const bookedTrips = await Booking.find({ userId: userId });
            res.json(bookedTrips);
        } catch (error) {
            res.status(500).json({ message: "Error fetching booked trips" });
        }
    };
    getBookedTrips();
});


router.get("/savedTrips",async (req, res) => {
    try{
    const userId = req.cookies["userId"];
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
            const user = await User.findById(userId).populate("savedTrips");
            res.json(user.savedTrips);
        }catch(error){
                res.status(500).json({ message: "Error fetching saved trips" });
        }
    }
);

router.post("/saveTrip/:tripId", async (req, res) => {
    try{
        const userId = req.cookies["userId"];
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const tripId = req.params.tripId;
    await User.findByIdAndUpdate(
            userId,
            { $addToSet: { savedTrips: tripId } },
            { new: true }
        );
        res.status(200).json({ message: "Trip saved successfully" });
    }catch(error){
        res.status(500).json({ message: "Error saving trip" });
    }
}
);

router.delete("/removeSavedTrip/:tripId" , async (req, res) => {
    try{
        const userId = req.cookies["userId"];
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
    await User.findByIdAndUpdate(
        userId,
        { $pull: { savedTrips: req.params.tripId } },
        { new: true }
    );
    res.status(200).json({ message: "Trip removed from saved trips" });
    }catch(error){
        res.status(500).json({ message: "Error removing trip from saved trips" });
    }
});
module.exports = router;