const addressModel = require("../models/address.model");
const userModel = require("../models/user.model");

exports.addAddressController = async (req, res, next) => {
  try {
    const userId = req.userId; //middleware
    const { address_line, city, state, pincode, country, mobile } = req.body;
    const createAddress = new addressModel({
      address_line,
      city,
      state,
      pincode,
      country,
      mobile,
      userId: userId,
    });
    const saveAddress = await createAddress.save();

    const addUserAddressId = await userModel.findByIdAndUpdate(userId, {
      $push: {
        address_details: saveAddress._id,
      },
    });

    return res.status(200).json({
      message: "Successfully created address",
      data: saveAddress,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("Error occured while adding address", error.message);
    return res.status(500).json({
      message: "Error 500 occured while adding address",
      error: true,
      success: false,
    });
  }
};

exports.getAddressController = async (req, res, next) => {
  try {
    const userId = req.userId;
    const data = await addressModel
      .find({ userId: userId })
      .sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Successfully fetched address",
      data: data,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("Error occured while fetching the address", error.message);
    return res.status(500).json({
      message: "Error 500 occured while fetching the address",
      error: true,
      success: false,
    });
  }
};

exports.updateAddressController = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { _id, address_line, city, state, country, pincode, mobile } =
      req.body;
    const updateAddress = await addressModel.updateOne(
      { _id: _id, userId: userId },
      {
        address_line,
        city,
        state,
        country,
        pincode,
        mobile,
      }
    );
    return res.status(200).json({
      message: "Successfully updated address",
      data: updateAddress,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("Error occured while updating address", error.message);
    return res.status(500).json({
      message: "Error 500 occured while updating address",
      error: true,
      success: false,
    });
  }
};

exports.deleteAddressController = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { _id } = req.body;

    const disableAddress = await addressModel.updateOne(
      {
        _id: _id,
        userId: userId,
      },
      {
        status: false,
      }
    );
    return res.status(200).json({
      message: "Successfully deleted address",
      data: disableAddress,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("Error occured while deleting address", error.message);
    return res.status(500).json({
      message: "Error 500 occured while deleting address",
      error: true,
      success: false,
    });
  }
};
