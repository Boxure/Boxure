import express from "express";
import { addItemToCart, getCartItems, removeItem } from "../controllers/cart.js";

const cartRouter = express.Router();

// Add item to cart
cartRouter.post("/:userId/add", addItemToCart);

// Get cart items
cartRouter.get("/:userId", getCartItems);

// Remove item from cart
cartRouter.post("/:userId/remove", removeItem);

export default cartRouter;
