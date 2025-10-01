import express from "express";
import { getUser } from "../controllers/user.js";

// routes/user.js
const userRouter = express.Router();

// GET /api/user
userRouter.get("/", getUser);

export default userRouter;
