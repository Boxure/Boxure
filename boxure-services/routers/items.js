import express from "express";
import { getItemById, getItems, insertItem, isAuthenticated } from "../controllers/items.js";

// routes/items.js
const itemRouter = express.Router();

// GET /api/items
itemRouter.get("/", getItems);

// GET /api/items/:id
itemRouter.get("/:id", getItemById);

// POST /api/items
itemRouter.post("/", isAuthenticated, insertItem);

export default itemRouter;
