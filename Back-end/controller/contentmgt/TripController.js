const trip = require("../../model/tripSchema");
const cloudinary = require("../../services/cloudinary");

// create trip
const createTrip = async (req, res) => {
  const { name, city, category, description, price, duration, location } =
    req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Please upload an image" });
  }
  const imagepath = req.file.path;

  if (
    !name ||
    !city ||
    !category ||
    !description ||
    !price ||
    !duration ||
    !location
  ) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  try {
    const result = await cloudinary.uploadImage(imagepath, "trip_images");
    const newTrip = new trip({
      name,
      city,
      category,
      description,
      price,
      duration,
      location,
      imageUrl: result.secure_url || null,
      cloudinaryId: result.public_id,
    });
    await newTrip.save();

    res.status(201).json({
      message: "Trip created successfully",
      trip: newTrip,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" , error: error.message   });
  }
};

//get all trips
const getAllTrips = async (req, res) => {
  try {
    const allTrips = await trip.find();
    res.status(201).json(allTrips);
  } catch (error) {
    res.status(500).json({ message: "Server Error " , error: error.message   });
  }
};

//get by id
const getTripById = async (req, res) => {
  const { id } = req.params;
  try {
    const tripById = await trip.findById(id);
    if (!tripById) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.status(201).json(tripById);
  } catch (error) {
    res.status(500).json({ message: "Server Error " , error: error.message   });
  }
};

//delete by id
const DeleteTripById = async (req, res) => {
  const { id } = req.params;
  try {
    const tripById = await trip.findByIdAndDelete(id);
    if (!tripById) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.status(201).json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error " , error: error.message   });
  }
};

//update by id
const updateTripById = async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      city: req.body.city,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      duration: req.body.duration,
      location: req.body.location,
    };
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }
    const imagepath = req.file.path;

    const result = await cloudinary.uploadImage(imagepath, "trip_images");
    updateData.imageUrl = result.secure_url;
    updateData.cloudinaryId = result.public_id;

    const tripById = await trip.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );

    if (!tripById) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.status(201).json({
      message: "Trip updated successfully",
      trip: tripById,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message   });
  }
};

module.exports = {
  createTrip,
  getAllTrips,
  getTripById,
  DeleteTripById,
  updateTripById,
};