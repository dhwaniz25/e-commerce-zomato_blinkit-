const cartProductModel = require("../models/cartproduct.model");
const userModel = require("../models/user.model");

exports.addToCartController = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({
        message: "Product Id not found",
        error: true,
        success: false,
      });
    }

    const checkItemCart = await cartProductModel.findOne({
      userId: userId,
      productId: productId,
    });
    if (checkItemCart) {
      return res.status(400).json({
        message: "Product already exists in cart",
      });
    }

    const cartItem = new cartProductModel({
      productId: productId,
      quantity: 1,
      userId: userId,
    });

    const save = await cartItem.save();

    const updateCartUser = await userModel.updateOne(
      { _id: userId },
      {
        $push: {
          //for pushing i.e. adding data(productId) to user's shopping cart
          shopping_cart: productId,
        },
      }
    );

    return res.status(200).json({
      message: "Successfully added product to cart",
      data: save,
      updateUser: updateCartUser,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log(
      "Error occured while adding product to the cart",
      error.message
    );
    return res.status(500).json({
      message: "Error 500 occured while adding product to the cart",
      error: true,
      success: false,
    });
  }
};

exports.getCartItemController = async (req, res, next) => {
  try {
    const userId = req.userId;
    const cartItem = await cartProductModel
      .find({
        userId: userId,
      })
      .populate("productId");

    return res.status(200).json({
      message: "Successfully fetch cart items by productId",
      data: cartItem,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("Error occured while getting cart items", error.message);
    return res.status(500).json({
      message: "Error 500 occured while getting cart items",
      error: true,
      success: false,
    });
  }
};

exports.updateCartItemQtyController = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { _id, qty } = req.body;
    if (!_id || !qty) {
      return res.status(400).json({
        message: "Id not found, quantity not found",
        error: true,
        success: false,
      });
    }
    const updateCartItem = await cartProductModel.updateOne(
      {
        _id: _id,
        userId: userId,
      },
      {
        quantity: qty,
      }
    );
    return res.status(200).json({
      message: "Successfully updated cart",
      data: updateCartItem,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log(
      "Error occured while updating cart item quantity",
      error.message
    );
    return res.status(500).json({
      message: "Error 500 occured while updating cart item quantity",
      error: true,
      success: false,
    });
  }
};

exports.deleteCartItemQtyController = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { _id } = req.body;
    if (!_id) {
      return res.status(500).json({
        message: "Id not found",
        error: true,
        success: false,
      });
    }
    const deleteCartItem = await cartProductModel.deleteOne({ _id: _id , userId:userId});
    return res.status(200).json({
      message: "Successfully deleted the product",
      data: deleteCartItem,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("Error occured while deleting cart item", error.message);
    return res.status(500).json({
      message: "Error 500 occured while deleting cart item",
      error: true,
      success: false,
    });
  }
};
