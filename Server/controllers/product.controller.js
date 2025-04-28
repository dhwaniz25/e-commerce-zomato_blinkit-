const productModel = require("../models/product.model");
const mongoose = require("mongoose");

//Create Product
exports.createProductController = async (req, res, next) => {
  try {
    const {
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    } = req.body;
    if (
      !name ||
      !image[0] ||
      !category[0] ||
      !subCategory[0] ||
      !unit ||
      !price ||
      !discount ||
      !description
    ) {
      return res.status(400).json({
        message:
          "Please provide name, image, category, subCategory, unit, stock, price, discount, description, more_details",
      });
    }

    const product = new productModel({
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    });

    const saveProduct = await product.save();
    return res.status(200).json({
      message: "Successfully created product",
      data: saveProduct,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("Error occured while creating product", error.message);
    return res.status(500).json({
      message: "Error 500 occured while creating product",
      error: true,
      success: false,
    });
  }
};

//Fetch Product
// exports.getProductController = async (req, res, next) => {
//   try {
//     let { page, limit, search } = req.body;

//     if (!page) {
//       page = 1;
//     }
//     if (!limit) {
//       limit = 10;
//     }
//     const skip = (page - 1) * limit;

//     const query = search
//       ? {
//           $text: {
//             $search: search,
//           },
//         }
//       : {};

//     const [data, totalCount] = await Promise.all([
//       productModel.find(query).sort({ createdAt: 1 }).skip(skip).limit(limit), //In descending Order
//     ]);
//     productModel.countDocuments(query);

//     return res.status(200).json({
//       message: "Successfully fetched products",
//       data: data,
//       totalCount: totalCount,
//       totalNoOfPage: Math.ceil(totalCount / limit),
//       error: false,
//       success: true,
//     });
//   } catch (error) {
//     console.log("Error occured while fetching products", error.message);
//     return res.status(500).json({
//       message: "Error 500 occured while fetching products",
//       error: true,
//       success: false,
//     });
//   }
// };

//Fetch Product
exports.getProductController = async (req, res, next) => {
  try {
    let { page, limit, search } = req.body;

    if (!page) page = 1;
    if (!limit) limit = 10;

    const skip = (page - 1) * limit;

    const query = search ? { $text: { $search: search } } : {};

    const [data, totalCount] = await Promise.all([
      productModel
        .find(query)
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .populate("category subCategory"),
      productModel.countDocuments(query),
    ]);

    return res.status(200).json({
      message: "Successfully fetched products",
      data: data,
      totalCount: totalCount,
      totalNoOfPage: Math.ceil(totalCount / limit),
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    return res.status(500).json({
      message: error.message || "Error occurred while fetching products",
      error: true,
      success: false,
    });
  }
};

//Fetch Product By Category Id
exports.getProductByCategoryController = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({
        message: "Id not found",
        error: true,
        success: false,
      });
    }
    const product = await productModel
      .find({
        category: { $in: id },
      })
      .limit(15);

    return res.status(200).json({
      message:
        "Successfully fetched products by category id, Category Product List",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log(
      "Error occured while fetching product by category",
      error.message
    );
    return res.status(500).json({
      message: "Error 500 occured while fetching product by category",
      error: true,
      success: false,
    });
  }
};

//Fetch Product By categoryId & SubCategoryId
exports.getProductByCategoryAndSubCategoryController = async (
  req,
  res,
  next
) => {
  try {
    const { categoryId, subCategoryId, page, limit } = req.body;
    if (!categoryId || !subCategoryId) {
      return res.status(400).json({
        message: "Error occured , Please provide categoryId & subCategoryId",
        error: true,
        success: false,
      });
    }
    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }

    const query = {
      category: { $in: categoryId },
      subCategory: { $in: subCategoryId },
    };

    const skip = (page - 1) * limit;

    const [data, countData] = await Promise.all([
      productModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      productModel.countDocuments(query),
    ]);

    return res.status(200).json({
      message: "Successfully fetched products by category & subcategory",
      data: data,
      totalCount: countData,
      page: page,
      limit: limit,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log(
      "Error occured while fetching product by category & subcategory",
      error.message
    );
    return res.status(500).json({
      message:
        "Error 500 occured while fetching product by category & subcategory",
      error: true,
      success: false,
    });
  }
};

//Fetch Product Details
exports.getProductDetails = async (req, res, next) => {
  try {
    const { productId } = req.body;
    console.log("Backend received productId:", productId);
    const product = await productModel.findOne({ _id: productId });
    console.log("Found product:", product);
    return res.status(200).json({
      message: "Successfully fetched product details",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("Error occured while fetching product details", error.message);
    return res.status(500).json({
      message: "Error 500 occured while fetching product details",
      error: true,
      success: false,
    });
  }
};

//Update Product Details
exports.updateProductDetails = async (req, res, next) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({
        message: "Product Id not found",
        error: true,
        success: false,
      });
    }

    const updateProduct = await productModel.updateOne(
      { _id: _id },
      {
        ...req.body,
      }
    );

    return res.status(200).json({
      message: "Successfully updated product",
      data: updateProduct,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("Error occured while updating product details", error.message);
    return res.status(500).json({
      message: "Error 500 occured while updating product details",
      error: true,
      success: false,
    });
  }
};

//Delete Product Details
exports.deleteProductDetails = async (req, res, next) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({
        message: "Id not found for deleting product",
        error: true,
        success: false,
      });
    }
    const deleteProduct = await productModel.deleteOne({ _id: _id });
    return res.status(200).json({
      message: "Successfully deleted product details",
      data: deleteProduct,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("Error occured while deleting product details", error.message);
    return res.status(500).json({
      message: "Error 500 occured while deleting product details",
      error: true,
      success: false,
    });
  }
};

exports.searchProduct = async (req, res, next) => {
  try {
    let { search, page, limit } = req.body;
    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }

    const query = search
      ? {
          $text: {
            $search: search,
          },
        }
      : {};

    const skip = (page - 1) * limit;

    const [data, dataCount] = await Promise.all([
      productModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category subCategory"),
      productModel.countDocuments(query),
    ]);

    return res.status(200).json({
      message: "Successfully searched product",
      data: data,
      totalCount: dataCount,
      totalPage: Math.ceil(dataCount / limit),
      page: page,
      limit: limit,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("Error occured while searching product", error.message);
    return res.status(500).json({
      message: "Error 500 occured while searching product",
      error: true,
      success: false,
    });
  }
};
