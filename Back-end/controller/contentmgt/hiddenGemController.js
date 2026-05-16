const hiddenG = require("../../model/hiddenGemSchema");
const cloudinary = require("../../config/cloudinary");

function getUploadedFiles(req) {
    if (req.file) return [req.file];
    return Array.isArray(req.files) ? req.files : [];
}

function getFileSource(file) {
    return file?.buffer || file?.path;
}

// Create Hidden Gem Post
const createHiddenGem = async (req, res) => {
    const placeName = req.body.placeName || req.body.PlaceName;
    const description = req.body.description || req.body.Description;
    const files = getUploadedFiles(req);

    if (!placeName || !description) {
        return res.status(400).json({message: "Please fill the Hidden Gem Post"});
    }
    if (files.length === 0) {
        return res.status(400).json({message: "Please upload at least one image"});
    }
    try {
    const imageResult = await Promise.all(files.map((file) => cloudinary.uploadImage(getFileSource(file), "hiddenGem_images")));
    const hidden = new hiddenG({
        placeName,
        description,
      images: imageResult.map((result) => ({
        imageUrl: result.secure_url,
        cloudinaryId: result.public_id,
      })),
    });
    await hidden.save();
    res.status(200).json({message: "Hidden Gem Created"});
    } catch (error) {
    res.status(500).json({message: "Server Error" , error: error.message});
    }
};

// Get All Hidden Gem Posts
const getAllHiddenGem = async (req, res) => {
    try {
        const allHiddenGem = await hiddenG.find();
        res.status(200).json({allHiddenGem});
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

// Get Single Hidden Gem Post
const getOneHiddenGemById = async (req, res) => {
    const {HiddenId} = req.params;
    try {
        const hiddenByOne = await hiddenG.findById(HiddenId);
        if (!hiddenByOne) {
        return res.status(404).json({message: "Hidden Gem Post not found."});
        }
        res.status(200).json(hiddenByOne);
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
};

// Update Hidden Gem Post
const updateHiddenGemById = async (req, res) => {
    const {PlaceName, Description} = req.body;
    try {
        const hiddenGemUpdate = await hiddenG.findByIdAndUpdate(
        req.params.id,
        {PlaceName, Description},
        {new: true},
        );
        if (!hiddenGemUpdate) {
        return res.status(404).json({message: "Hidden Gem not found"});
        }
        res.status(200).json({message: "Hidden Gem updated successfully"});
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
};

// Delete Hidden Gem Post
const deleteHiddenGemById = async (req, res) => {
    const {hiddensId} = req.params;
    try {
        const hiddenDelete = await hiddenG.findByIdAndDelete(hiddensId);
        if (!hiddenDelete) {
        return res.status(404).json({message: "Hidden Gem Post not found"});
        }
        res.status(200).json({message: "Hidden Gem deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
};

module.exports = {createHiddenGem, getAllHiddenGem, getOneHiddenGemById, updateHiddenGemById, deleteHiddenGemById};
