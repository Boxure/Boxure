const express = require('express');
const router = express.Router();
const { redis } = require('../db');

// Add item to cart
router.post('/:userId/add', async (req, res) => {
  const { userId } = req.params;
  const item = req.body;
  await redis.rpush(`cart:${userId}`, JSON.stringify(item));
  res.sendStatus(200);
});

// Get cart items
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const items = await redis.lrange(`cart:${userId}`, 0, -1);
  res.json(items.map(JSON.parse));
});

// Remove item from cart
router.post('/:userId/remove', async (req, res) => {
  const { userId } = req.params;
  const { itemId } = req.body;
  const items = await redis.lrange(`cart:${userId}`, 0, -1);
  const updated = items.filter(i => JSON.parse(i).id !== itemId);
  await redis.del(`cart:${userId}`);
  if (updated.length) await redis.rpush(`cart:${userId}`, ...updated);
  res.sendStatus(200);
});

module.exports = router;