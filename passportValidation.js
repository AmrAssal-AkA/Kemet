const {PassportValidation} = require("../../services/passportService");
 
const validatePassport = async (req, res) => {
  try {
    const {width, height, format, size} = req.imageMetadata;
 
    const result = PassportValidation({width, height, format, size});
 
    return res.status(200).json({message: true, validation: result});
  } catch (err) {
    console.error({message: "Passport validation error"});
    return res.status(500).json({success: false, error: "Internal server error"});
  }
};
 
module.exports = {validatePassport};
 