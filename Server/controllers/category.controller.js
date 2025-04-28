const categoryModel = require("../models/category.model");
const subCategoryModel = require("../models/subCategory.model");
const productModel = require("../models/product.model");

//Add Category or Create Category
exports.addCategoryController = async (req, res, next) => {
  try {
    const { name, image } = req.body;
    if (!name || !image) {
      return res.status(400).json({
        message: "Error occured, Please provide name and image",
        error: true,
        success: false,
      });
    }
    const addCategory = new categoryModel({ name, image });
    const saveCategory = await addCategory.save();
    if (!saveCategory) {
      return res.status(500).json({
        message: "Error occured, category not saved",
        error: true,
        success: false,
      });
    }
    return res.status(200).json({
      message: "Successfully created category",
      data: saveCategory,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("Error occured while adding category", error.message);
    return res.status(500).json({
      message: "Error 500 occured while adding category",
      error: true,
      success: false,
    });
  }
};

//Fetch Category or Get Category
exports.getCategoryController = async (req, res, next) => {
  try {
    const data = await categoryModel.find().sort({ createdAt: 1 });
    return res.status(200).json({
      message: "Successfully fetched all categories",
      data: data,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log(
      "Error occured while getting category controller",
      error.message
    );
    return res.status(500).json({
      message: "Error 500 occured while getting category controller",
      error: true,
      success: false,
    });
  }
};

//Update Category or Edit Category
exports.updateCategoryController = async (req, res, next) => {
  try {
    const { _id, name, image } = req.body;
    const update = await categoryModel.updateOne(
      {
        _id: _id,
      },
      {
        name: name,
        image: image,
      }
    );
    return res.status(200).json({
      message: "Successfully updated category",
      data: update,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("Error occured while updating category", error.message);
    return res.status(500).json({
      message: "Error 500 occured while updating category",
      error: true,
      success: false,
    });
  }
};

//Delete Category
exports.deleteCategoryController = async (req, res, next) => {
  try {
    const { _id } = req.body;

    const checkSubCategory = await subCategoryModel
      .find({
        category: {
          $in: [_id],
        },
      })
      .countDocuments();

    const checkProduct = await productModel
      .find({
        category: {
          $in: [_id],
        },
      })
      .countDocuments();

    if (checkSubCategory > 0 || checkProduct > 0) {
      return res.status(400).json({
        message: "Error occured, Category already in use cannot delete it",
        error: true,
        success: false,
      });
    }

    const deleteCategory = await categoryModel.deleteOne({ _id: _id });

    return res.status(200).json({
      message: "Successfully deleted category",
      data: deleteCategory,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("Error occured while deleting category", error.message);
    return res.status(500).json({
      message: "Error 500 occured while deleting category",
      error: true,
      success: false,
    });
  }
};
