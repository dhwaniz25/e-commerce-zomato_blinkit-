const cartProductModel = require("../models/cartproduct.model");
const orderModel = require("../models/order.model");
const userModel = require("../models/user.model");
const mongoose = require("mongoose");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
require("dotenv").config();

//Cash On Delivery
exports.cashOnDeliveryPaymentController = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { list_items, totalAmt, addressId, subTotalAmt } = req.body;

    const payload = list_items.map((el) => {
      return {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: el.productId._id,
        product_details: {
          name: el.productId.name,
          image: el.productId.image,
        },
        paymentId: "",
        payment_status: "CASH ON DELIVERY",
        delivery_address: addressId,
        subTotalAmt: subTotalAmt,
        totalAmt: totalAmt,
      };
    });

    const generatedOrder = await orderModel.insertMany(payload);

    // remove from cart because order generated successfull
    const removeCartItems = await cartProductModel.deleteMany({
      userId: userId,
    });

    //update it in user section that the cart is update as order is already generated
    const updateInUser = await userModel.updateOne(
      { _id: userId },
      {
        shopping_cart: [],
      }
    );

    return res.status(200).json({
      message: "Successfully created order",
      data: generatedOrder,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("Error occured while performing cash payment", error.message);
    return res.status(500).json({
      message: "Error 500 occured while performing cash payment",
      error: true,
      success: false,
    });
  }
};

const priceWithDiscount = (price, dis = 1) => {
  const discountAmount = Math.ceil((Number(price) * Number(dis)) / 100);
  const actualPrice = Number(price) - Number(discountAmount);
  return actualPrice;
};

exports.priceWithDiscount = priceWithDiscount;

// Online Payment Controller
exports.paymentController = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { list_items, totalAmt, addressId, subTotalAmt } = req.body;

    const user = await userModel.findById(userId);

    const line_items = list_items.map((item) => {
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.productId.name,
            images: item.productId.image,
            metadata: {
              productId: item.productId._id,
            },
          },
          unit_amount:
            priceWithDiscount(item.productId.price, item.productId.discount) *
            100, // Important: Stripe expects amount in paise (smallest currency unit)
        },
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
        },
        quantity: item.quantity,
      };
    });

    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      metadata: {
        userId: userId,
        addressId: addressId,
      },
      line_items: line_items,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };
    const session = await stripe.checkout.sessions.create(params);

    return res.status(200).json(session);
  } catch (error) {
    console.log("Error occurred while performing payment", error.message);
    return res.status(500).json({
      message: "Error 500 occurred while performing payment",
      error: true,
      success: false,
    });
  }
};

//http://localhost:8080/api/order/webhook

const getOrderProductItems = async ({
  lineItems,
  userId,
  addressId,
  paymentId,
  payment_status,
}) => {
  const productList = [];

  if (lineItems?.data?.length) {
    for (const item of lineItems.data) {
      const product = await stripe.products.retrieve(item.price.product);

      const payload = {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: product.metadata.productId,
        product_details: {
          name: product.name,
          image: product.images[0] || null, // Using first image if available
        },
        paymentId: paymentId, // Using the payment_intent from session
        payment_status: payment_status, // Using status from session
        delivery_address: addressId, // Using addressId from session metadata
        subTotalAmt: Number(item.amount_total / 100),
        totalAmt: Number(item.amount_total / 100),
        quantity: item.quantity,
      };

      productList.push(payload);
    }
  }

  return productList;
};

exports.webhookStripe = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody || req.body,
      sig,
      endpointSecret
    );
  } catch (err) {
    console.error(`Webhook signature verification failed:`, err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`Received event type: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;

        // Only process if payment was successful
        if (session.payment_status === "paid") {
          const lineItems = await stripe.checkout.sessions.listLineItems(
            session.id
          );

          const orderProduct = await getOrderProductItems({
            lineItems: lineItems,
            userId: session.metadata.userId,
            addressId: session.metadata.addressId,
            paymentId: session.payment_intent,
            payment_status: session.payment_status,
          });

          const order = await orderModel.insertMany(orderProduct);

          if (order.length > 0) {
            await userModel.findByIdAndUpdate(session.metadata.userId, {
              shopping_cart: [],
            });
            await cartProductModel.deleteMany({
              userId: session.metadata.userId,
            });
          }
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getOrderDetailsController = async (req, res, next) => {
  try {
    const userId = req.userId;
    const orderlist = await orderModel
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address");
    return res.status(200).json({
      message: "Successfully fetched order details",
      data: orderlist,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("Error occured while fetching order details", error.message);
    return res.status(500).json({
      message: "Error 500 occured while fetching order details",
      error: true,
      success: false,
    });
  }
};
