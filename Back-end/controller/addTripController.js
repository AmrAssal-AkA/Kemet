const trip = require("../model/tripSchema");



const createTrip = async (req, res) => {
  const { name, city, category, description, price, duration, location } =
    req.body;

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
    let imageUrl = null;

    if (req.file) {
      imageUrl = req.file.path; 
    }

    const newTrip = new trip({
      name,
      city,
      category,
      description,
      price,
      duration,
      location,
      imageUrl,
    });

    await newTrip.save();

    res.status(201).json({
      message: "Trip created successfully",
      trip: newTrip,
    });
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//get all trips
const getAllTrips = async (req, res) => {
  try {
    const allTrips = await trip.find();
    res.status(201).json(allTrips);
  } catch (error) {
    res.status(500).json({ message: "Server Error " });
  }
};

//get by name
const getTripByName = async (req, res) => {
  const { name } = req.params;
  try {
    const tripByName = await trip.findOne({ name: name });
    if (!tripByName) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.status(201).json(tripByName);
  } catch (error) {
    res.status(500).json({ message: "Server Error " });
  }
};

//delete by name
const DeletTripByName = async (req, res) => {
  const { name } = req.params;
  try {
    const tripByName = await trip.findOneAndDelete({ name: name });
    if (!tripByName) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.status(201).json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error " });
  }
};

//update by name
const updataTripByName = async (req, res) => {
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

    // Add image URL if image was uploaded
    if (req.file && req.file.path) {
      updateData.imageUrl = req.file.path;
    }

    const tripByName = await trip.findOneAndUpdate(
      {
        name: req.params.name,
      },
      updateData,
      { new: true },
    );

    if (!tripByName) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.status(201).json({
      message: "Trip updated successfully",
      trip: tripByName,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createTrip,
  getAllTrips,
  getTripByName,
  DeletTripByName,
  updataTripByName,
};
