const offer = require("../../model/offeringSchema");
const cloudinary = require("../../config/cloudinary");

function getUploadedFiles(req) {
    if (req.file) return [req.file];
    return Array.isArray(req.files) ? req.files : [];
}

function getFileSource(file) {
    return file?.buffer || file?.path;
}

// Create Offering Post
const createOffers = async (req, res) => {
    const {title, city ,description, reviews, price} = req.body;
    const files = getUploadedFiles(req);

    if (!title || !city || !description || !price) {
        return res.status(400).json({message: "Please fill all required offering fields: title, city, description, and price"});
    }
    if (files.length === 0) {
        return res.status(400).json({message: "Please upload at least one image"});
    }
    try {
    const imageResult = await Promise.all(files.map((file) => cloudinary.uploadImage(getFileSource(file), "offers_images")));
    const offering = new offer({
          title,
          city,
          description,
          reviews: reviews || "",
          price,
          images: imageResult.map((result) => ({
            imageUrl: result.secure_url,
            cloudinaryId: result.public_id,
          })),
        });
        await offering.save();
    res.status(201).json({message: "Offer Created"});
    } catch (error) {
    res.status(500).json({message: "Server Error" , error: error.message});
    }
};

// Get All Offering Posts
const getAllOffers = async (req, res) => {
    try {
        const allOfferings = await offer.find();
        res.status(200).json({allOfferings});
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

// Get Single Offering Post
const getOneOfferById = async (req, res) => {
    const {Offerings} = req.params;
    try {
        const offerByOne = await offer.findById(Offerings);
        if (!offerByOne) {
        return res.status(404).json({message: "Offer not found."});
        }
        res.status(200).json(offerByOne);
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
};

// Update Offering Post
const updateOffersById = async (req, res) => {
    const {title, city, description, reviews, price} = req.body;
    const files = getUploadedFiles(req);
    try {
        const updateData = {};

        if (title !== undefined) updateData.title = title;
        if (city !== undefined) updateData.city = city;
        if (description !== undefined) updateData.description = description;
        if (reviews !== undefined) updateData.reviews = reviews;
        if (price !== undefined) updateData.price = price;

        if (files.length > 0) {
            const imageResult = await Promise.all(files.map((file) => cloudinary.uploadImage(getFileSource(file), "offers_images")));
            updateData.images = imageResult.map((result) => ({
                imageUrl: result.secure_url,
                cloudinaryId: result.public_id,
            }));
        }

        const offerUpdate = await offer.findByIdAndUpdate(
        req.params.id,
        updateData,
        {new: true, runValidators: true},
        );
        if (!offerUpdate) {
        return res.status(404).json({message: "Offer not found"});
        }
        res.status(200).json({message: "Offer updated successfully", offering: offerUpdate});
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
};

// Delete Offering Post
const deleteOffersById = async (req, res) => {
    const {offeringg} = req.params;
    try {
        const offerDelete = await offer.findByIdAndDelete(offeringg);
        if (!offerDelete) {
        return res.status(404).json({message: "Offer not found"});
        }
        res.status(200).json({message: "Offer deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
};

module.exports = {createOffers, getAllOffers, getOneOfferById, updateOffersById, deleteOffersById};
