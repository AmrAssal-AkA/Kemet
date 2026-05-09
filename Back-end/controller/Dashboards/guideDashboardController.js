const User = require("../../model/userSchema");
const Guide = require("../../model/guideSchema");
const Trip = require("../../model/tripSchema");

const setGuideSchedule = async (req, res) => {
    try {
        const {dayofweek, startTime, endTime} = req.body;
        const guide = await User.findOne({user: req.user.userId});
        if (!guide) {
            return res.status(404).json({ message: "Guide not found" });
        }

        guide.AvailabilityTime.push({ dayofweek, startTime, endTime });
        await guide.save();
        res.json({ message: "Guide schedule updated successfully" });
    }catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
}


const guideRequiredTrips = async (req, res, nxt) => {
    try {
        const guideOrdered = await Trip.findOne({guideAvailable: true});
        res.json({ guideOrdered });
    } catch (err) {
        nxt(err);
    }
}

const guideFee = async (req, res, nxt) => {
    try{
        const getGuideFee = await Trip.findOne({guideAvailable: true}, {guideFee: 1, _id: 0}); 
        res.json({ getGuideFee });
    }catch (err) {
        nxt(err);
    }
}


module.exports = {
    setGuideSchedule,
    guideRequiredTrips,
    guideFee
}