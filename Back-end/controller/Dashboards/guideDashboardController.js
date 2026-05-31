const User = require("../../model/userSchema");
const Guide = require("../../model/guideSchema");
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

const formatTripDate = (tripDate) => {
    if (!tripDate) return undefined;

    const date = new Date(tripDate);
    return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
};

const confirmedStatusQuery = /^confirmed$/i;
const cancelledStatusQuery = /^cancell?ed$/i;

const firstValue = (...values) =>
    values.find((value) => value !== undefined && value !== null && value !== "");

const getFirstTrip = (trip) => {
    if (Array.isArray(trip)) return trip[0] || null;
    return trip || null;
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
            return res.json({ bookings: [], assignedBookings: [] });
        }

        const bookings = await Booking.find({
            assignedGuide: guide._id,
            status: { $not: cancelledStatusQuery },
        })
            .populate({
                path: "trip",
                model: "trips",
                select: "name title city location guidefees",
            })
            .populate("userId", "name email");

        const assignedBookings = bookings.map((booking) => {
            const bookingObject = booking.toObject();
            const trip = getFirstTrip(bookingObject.trip);
            const tripDateText = formatTripDate(bookingObject.tripDate);
            const scheduleText = formatTripSchedule(bookingObject.tripSchedule);
            const displayDate = tripDateText || scheduleText || null;
            const guideFee = firstValue(trip?.guidefees, bookingObject.guideFee);
            const city = firstValue(trip?.city, bookingObject.city);

            return {
                ...bookingObject,
                city,
                guideFee,
                date: displayDate,
                tripDate: displayDate,
            };
        });

        res.json({
            bookings: assignedBookings,
            assignedBookings,
        });
    } catch (err) {
        nxt(err);
    }
}

const guideFee = async (req, res, nxt) => {
    try{
        const user = await findAuthenticatedUser(req);

        if (!user || user.role !== "guide") {
            return res.status(404).json({ message: "Guide not found" });
        }

        const guide = await Guide.findOne({ userId: user._id });
        if (!guide) {
            return res.json({
                confirmedBookingsCount: 0,
                confirmedBookings: 0,
                totalGuideProfit: 0,
                guideRevenue: 0,
                currency: "EGP",
            });
        }

        const confirmedBookings = await Booking.find({
            assignedGuide: guide._id,
            status: confirmedStatusQuery,
        }).select("guideFee");

        const totalGuideProfit = confirmedBookings.reduce(
            (total, booking) => total + Number(booking.guideFee || 0),
            0,
        );

        res.json({
            confirmedBookingsCount: confirmedBookings.length,
            confirmedBookings: confirmedBookings.length,
            totalGuideProfit,
            guideRevenue: totalGuideProfit,
            currency: "EGP",
        });
    }catch (err) {
        nxt(err);
    }
}


module.exports = {
    setGuideSchedule,
    guideRequiredTrips,
    guideFee
}
