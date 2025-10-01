// app.js
import cors from "cors";
import "dotenv/config";
import express from "express";
import session from "express-session";

import authRouter from "./routers/auth.js";
import cartRouter from "./routers/cart.js";
import itemsRouter from "./routers/items.js";
import userRouter from "./routers/user.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

app.use("/api/items", itemsRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);

app.listen(5000, () => {
  console.log("Backend is running on port 5000 at http://localhost:5000");
});
