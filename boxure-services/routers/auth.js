import express from "express";
import { login, logout, registerNewAccount } from "../controllers/auth.js";

// routes/auth.js
const authRouter = express.Router();

// POST api/register
authRouter.post("/register", registerNewAccount);

// POST api/login
authRouter.post("/login", login);

// POST api/logout
authRouter.post("/logout", logout);

export default authRouter;
