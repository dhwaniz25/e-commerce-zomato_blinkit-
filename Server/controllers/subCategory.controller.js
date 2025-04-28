const subCategoryModel = require("../models/subCategory.model");

//Create SubCategory or Add SubCategory
exports.addSubCategoryController = async (req, res, next) => {
  try {
    const { name, image, category } = req.body;
    if (!name && !image && !category) {
      return res.status(400).json({
        message: "Please provide name, image, category",
        error: true,
        success: false,
      });
    }

    const payload = {
      name,
      image,
      category,
    };

    const createSubCategory = new subCategoryModel(payload);
    const save = await createSubCategory.save();

    return res.status(200).json({
      message: "Successfully created sub category",
      data: save,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("Error occured while adding sub category", error.message);
    return res.status(500).json({
      message: "Error 500 occured while adding sub-category",
      error: true,
      success: false,
    });
  }
};

//Fetch SubCategory or Get SubCategory, but only here we have used POST method i.e. because we need to limit the items per page, by adding pagination to it.
exports.getSubCategoryController = async (req, res, next) => {
  try {
    const data = await subCategoryModel
      .find()
      .sort({ createdAt: 1 })
      .populate("category");
    return res.status(200).json({
      message: "Successfully fetched all sub category",
      data: data,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log(
      "Error occured while fetching sub category data",
      error.message
    );
    return res.status(500).json({
      message: "Error occured while fetching sub category data",
      error: true,
      success: false,
    });
  }
};

//Update SubCategory or Edit SubCategory
exports.updateSubCategoryController = async (req, res, next) => {
  try {
    const { _id, name, image, category } = req.body;
    const checkSub = await subCategoryModel.findById(_id);
    if (!checkSub) {
      return res.status(400).json({
        message: "This id does not exists",
        error: true,
        success: false,
      });
    }
    const updateSubCategory = await subCategoryModel.findByIdAndUpdate(_id, {
      name,
      image,
      category,
    });

    return res.status(200).json({
      message: "Successfully updated sub category",
      data: updateSubCategory,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log(
      "Error occured while updating the sub category data",
      error.message
    );
    return res.status(500).json({
      message: "Error 500 occured while updating sub category data",
      error: true,
      success: false,
    });
  }
};

exports.deleteSubCategoryController = async (req, res, next) => {
  try {
    const { _id } = req.body;
    console.log("ID which is to be deleted", _id);
    const deleteSub = await subCategoryModel.findByIdAndDelete(_id);
    return res.status(200).json({
      message: "Successfully deleted sub category",
      data: deleteSub,
      error: true,
      success: false,
    });
  } catch (error) {
    console.log("Error occured while deleting sub category", error.message);
    return res.status(500).json({
      message: "Error 500 occured while deleting sub category",
      error: true,
      success: false,
    });
  }
};
