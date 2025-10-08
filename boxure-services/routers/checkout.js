import express from "express";
import { createStripeCheckoutSession, getStripeSessionDetails } from "../controllers/checkout.js";

const checkoutRouter = express.Router();

// POST /api/checkout/create-checkout-session
checkoutRouter.post("/create-checkout-session", createStripeCheckoutSession);

checkoutRouter.get("/session-details", getStripeSessionDetails);

export default checkoutRouter;
