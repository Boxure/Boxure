// app.js
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const itemsRouter = require('./routers/items');
const authRouter = require('./routers/auth'); 
const userRouter = require('./routers/user');
const cartRouter = require('./routers/cart');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use('/api/items', itemsRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);

app.listen(5000, () => {
  console.log('Backend is running on http://localhost:5000');
});
