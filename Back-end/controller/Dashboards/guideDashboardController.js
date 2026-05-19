const User = require("../../model/userSchema");
const Guide = require("../../model/guideSchema");
const Trip = require("../../model/tripSchema");
const Booking = require("../../model/BookingSchema");

const findAuthenticatedUser = async (req) => {
    if (req.user.id) {
        return User.findById(req.user.id);
    }

    return User.findOne({ userId: req.user.userId });
};

const formatTripSchedule = (tripSchedule) => {
    if (!tripSchedule?.date) return undefined;

    const date = new Date(tripSchedule.date);
    const dateText = Number.isNaN(date.getTime())
        ? ""
        : date.toISOString().slice(0, 10);
    const timeText = [tripSchedule.startTime, tripSchedule.endTime]
        .filter(Boolean)
        .join(" - ");

    return [dateText, timeText].filter(Boolean).join(" ");
};

const setGuideSchedule = async (req, res) => {
    try {
        const {dayofweek, startTime, endTime} = req.body;
        const user = await findAuthenticatedUser(req);

        if (!user || user.role !== "guide") {
            return res.status(404).json({ message: "Guide not found" });
        }

        const guide = await Guide.findOneAndUpdate(
            { userId: user._id },
            { $setOnInsert: { userId: user._id, role: "guide" } },
            { new: true, upsert: true, setDefaultsOnInsert: true },
        );

        if (!guide) {
            return res.status(404).json({ message: "Guide not found" });
        }

        guide.AvailabilityTime.push({ dayofweek, startTime, endTime });
        await guide.save();
        res.json({ message: "Guide schedule updated successfully" });
    }catch {
        res.status(500).json({ error: "Server Error" });
    }
}


const guideRequiredTrips = async (req, res, nxt) => {
    try {
        const user = await findAuthenticatedUser(req);

        if (!user || user.role !== "guide") {
            return res.status(404).json({ message: "Guide not found" });
        }

        const guide = await Guide.findOne({ userId: user._id });
        if (!guide) {
            return res.json({ bookings: [] });
        }

        const bookings = await Booking.find({ assignedGuide: guide._id })
            .populate({
                path: "trip",
                model: "trips",
                select: "name title city location price basePrice finalPrice",
            })
            .populate("userId", "name email");

        res.json({
            bookings: bookings.map((booking) => {
                const bookingObject = booking.toObject();
                const scheduleText = formatTripSchedule(bookingObject.tripSchedule);

                return {
                    ...bookingObject,
                    ...(scheduleText ? { date: scheduleText, tripDate: scheduleText } : {}),
                };
            }),
        });
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
