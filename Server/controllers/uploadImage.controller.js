const uploadImageCloudinary = require("../utils/uploadImageCloudinary");

exports.uploadImageController = async (req, res, next) => {
  try {
    const file = req.file;
    console.log("Upload Image file", file);

    const uploadImage = await uploadImageCloudinary(file);
    
    return res.status(200).json({
      message: "Successfully uploaded image",
      data: uploadImage,
      error: true,
      succes: false,
    });
  } catch (error) {
    console.log("Error occured while uploading image", error.message);
    return res.status(500).json({
      message: "Error 500 occured while uploading image",
      error: true,
      success: false,
    });
  }
};
