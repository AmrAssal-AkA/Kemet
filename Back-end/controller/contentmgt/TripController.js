const trip = require("../../model/tripSchema");
const cloudinary = require("../../config/cloudinary");

function getUploadedFiles(req) {
  if (Array.isArray(req.files)) return req.files;
  if (req.file) return [req.file];
  return [];
}

function getFileSource(file) {
  return file?.buffer || file?.path;
}

function getFirstValue(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function toBoolean(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return Boolean(value);
}

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function getTripFields(body) {
  const guideAvailable = toBoolean(body.guideAvailable);
  const guidefees = toNumber(body.guidefees, 0);
  const basePrice = toNumber(getFirstValue(body.basePrice, body.price), 0);
  const explicitFinalPrice = getFirstValue(body.finalPrice);
  const finalPrice =
    explicitFinalPrice !== undefined
      ? toNumber(explicitFinalPrice, basePrice)
      : (guideAvailable ? basePrice + guidefees : basePrice) * 1.14;

  return {
    name: getFirstValue(body.name, body.title),
    city: body.city,
    AdvantureType: getFirstValue(body.AdvantureType, body.AdventureType, body.category),
    AdvantureDescription: getFirstValue(
      body.AdvantureDescription,
      body.AdventureDescription,
      body.description,
    ),
    description: getFirstValue(body.description, body.AdvantureDescription, body.AdventureDescription),
    basePrice,
    finalPrice,
    duration: toNumber(body.duration, 0),
    location: body.location,
    guideAvailable,
    guidefees,
    guestCapacity: toNumber(body.guestCapacity, 0),
  };
}

function hasRequiredTripFields(fields) {
  return (
    fields.name &&
    fields.city &&
    fields.AdvantureType &&
    fields.AdvantureDescription &&
    fields.description &&
    fields.basePrice &&
    fields.duration &&
    fields.location
  );
}

async function uploadTripImages(files) {
  return Promise.all(
    files.map(async (file) => {
      const result = await cloudinary.uploadImage(getFileSource(file), "trip_images");
      return {
        imageUrl: result.secure_url,
        cloudinaryId: result.public_id,
      };
    }),
  );
}

// create trip
const createTrip = async (req, res) => {
  const tripFields = getTripFields(req.body);
  const uploadedFiles = getUploadedFiles(req);

  if (uploadedFiles.length === 0) {
    return res.status(400).json({ message: "Please upload an image" });
  }

  if (!hasRequiredTripFields(tripFields)) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  try {
    const image = await uploadTripImages(uploadedFiles);

    const newTrip = new trip({
      ...tripFields,
      image,
    });
    await newTrip.save();

    res.status(201).json({ message: "Trip created successfully", trip: newTrip });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//get all trips
const getAllTrips = async (req, res) => {
  try {
    const allTrips = await trip.find();
    res.status(201).json(allTrips);
  } catch (error) {
    res.status(500).json({ message: "Server Error ", error: error.message });
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
    res.status(500).json({ message: "Server Error ", error: error.message });
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
    res.status(500).json({ message: "Server Error ", error: error.message });
  }
};

//update by id
const updateTripById = async (req, res) => {
  try {
    const existingTrip = await trip.findById(req.params.id);
    if (!existingTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const updateData = getTripFields({
      name: existingTrip.name,
      city: existingTrip.city,
      category: existingTrip.category || existingTrip.get?.("category"),
      AdvantureType: existingTrip.AdvantureType,
      AdvantureDescription: existingTrip.AdvantureDescription,
      description: existingTrip.description,
      price: existingTrip.price || existingTrip.get?.("price"),
      basePrice: existingTrip.basePrice,
      finalPrice: existingTrip.finalPrice,
      duration: existingTrip.duration,
      location: existingTrip.location,
      guideAvailable: existingTrip.guideAvailable,
      guidefees: existingTrip.guidefees,
      guestCapacity: existingTrip.guestCapacity,
      ...req.body,
    });

    const uploadedFiles = getUploadedFiles(req);
    if (uploadedFiles.length > 0) {
      updateData.image = await uploadTripImages(uploadedFiles);
    }

    const tripById = await trip.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      message: "Trip updated successfully",
      trip: tripById,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  createTrip,
  getAllTrips,
  getTripById,
  DeleteTripById,
  updateTripById,
};
