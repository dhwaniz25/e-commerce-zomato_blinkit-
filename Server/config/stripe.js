const stripe = require("stripe");
const dotenv = require("dotenv").config();

const Stripe = stripe(process.env.STRIPE_SECRET_KEY);

export default Stripe;
