const User = require("../../model/userSchema");
const Booking = require("../../model/BookingSchema");
const cloudinary = require("../../config/cloudinary");

const getAuthenticatedUserId = (req) => req.user?.id || req.user?._id || req.user?.userId;

const updateProfilePicture = async (req, res, nxt) => {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const Picture = req.file.path;
    const result = await cloudinary.uploader.upload(Picture, {
      folder: "profile_pictures",
    });

    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          profilePictureURL: {
            imageUrl: result.secure_url,
            cloudinaryId: result.public_id,
          },
        },
      },
      { new: true },
    );
    res.status(200).json({ message: "Profile picture updated successfully" });
  } catch (err) {
    nxt(err);
  }
};

const saveTrip = async (req, res, nxt) => {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const tripId = req.params.tripId;
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedTrips: tripId } },
      { new: true },
    );
    res.status(200).json({ message: "Trip saved successfully" });
  } catch (err) {
    nxt(err);
  }
};

const getSavedTrips = async (req, res, nxt) => {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const savedTrips = await User.findById(userId)
      .select("savedTrips")
      .populate("savedTrips");
    res.json(savedTrips.savedTrips);
  } catch (err) {
    nxt(err);
  }
};

const removeSavedTrip = async (req, res, nxt) => {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const tripId = req.params.tripId;

    await User.findByIdAndUpdate(
      userId,
      { $pull: { savedTrips: tripId } },
      { new: true },
    );
    res.status(200).json({ message: "Trip removed from saved trips" });
  } catch (err) {
    nxt(err);
  }
};

const getBookedTrips = async (req, res, nxt) => {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const getBookedTrips = async () => {
    try {
      const bookedTrips = await Booking.find({ userId: userId });
      res.json(bookedTrips);
    } catch (err) {
      nxt(err);
    }
  };
  getBookedTrips();
};

module.exports = {
  updateProfilePicture,
  saveTrip,
  getSavedTrips,
  removeSavedTrip,
  getBookedTrips,
};
