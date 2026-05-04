const User = require("../../model/userSchema");
const Booking = require("../../model/BookingSchema");
const cloudinary = require("../../config/cloudinary");

const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.cookies["userId"];
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
  } catch (error) {
    res.status(500).json({ message: "Error updating profile picture" });
  }
};

const saveTrip = async (req, res) => {
  try {
    const userId = req.cookies["userId"];
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
  } catch (error) {
    res.status(500).json({ message: "Error saving trip" });
  }
};

const getSavedTrips = async (req, res) => {
  try {
    const userId = req.cookies["userId"];
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const savedTrips = await User.findById(userId)
      .select("savedTrips")
      .populate("savedTrips");
    res.json(savedTrips.savedTrips);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching saved trips" });
  }
};

const removeSavedTrip = async (req, res) => {
  try {
    const userId = req.cookies["userId"];
    const tripId = req.params.tripId;

    await User.findByIdAndUpdate(
      userId,
      { $pull: { savedTrips: tripId } },
      { new: true },
    );
    res.status(200).json({ message: "Trip removed from saved trips" });
  } catch (error) {
    return res.status(500).json({ message: "Error removing saved trip" });
  }
};

const getBookedTrips = async (req, res) => {
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
};

module.exports = {
  updateProfilePicture,
  saveTrip,
  getSavedTrips,
  removeSavedTrip,
  getBookedTrips,
};
