const cloudinary = require('cloudinary');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const uploadImageFromBuffer = async (fileBuffer, options = {}) => {
    try {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: options.folder || 'Kemet',
                    use_filename: true,
                    unique_filename: false,
                    ...options
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            ).end(fileBuffer);
        });
    } catch (error) {
        throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
};


const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw new Error(`Cloudinary delete failed: ${error.message}`);
    }
};


const uploadImage = async (req, res)=> {
    try{
        const image = req.body.image;
        if(!image){
            return res.status(400).json({message: "No image provided"});
        }
        const uploadImageRes = await cloudinary.uploader.upload(image, {
            folder: 'Kemet',
            use_filename: true,
            unique_filename: false,
        });
        res.status(201).json({message: "Image uploaded successfully", url: uploadImageRes.secure_url
        })
    }catch(error){
        console.error("Error uploading image:", error);
        res.status(500).json({message: "Server Error"});
    }
}


const testCloudinaryConnection = async ()=> {
    try{
        await cloudinary.config().cloud_name; 
        console.log("Cloudinary connection successful");
    }catch(error){
        console.error("Cloudinary connection failed:", error.message);
    }
}


testCloudinaryConnection();

module.exports = {
    uploadImage,
    uploadImageFromBuffer,
    deleteImage
};