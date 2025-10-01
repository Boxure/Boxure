import { redis } from "../db.js";

// POST /api/:userId/add
export async function addItemToCart(req, res) {
  const { userId } = req.params;
  const item = req.body;
  await redis.rpush(`cart:${userId}`, JSON.stringify(item));
  res.sendStatus(200);
}

// GET /api/:userId
export async function getCartItems(req, res) {
  const { userId } = req.params;
  const items = await redis.lrange(`cart:${userId}`, 0, -1);
  res.json(items.map(JSON.parse));
}

// DELETE /api/:userId/remove
export async function removeItem(req, res) {
  const { userId } = req.params;
  const { itemId } = req.body;
  const items = await redis.lrange(`cart:${userId}`, 0, -1);
  const updated = items.filter((i) => JSON.parse(i).id !== itemId);
  await redis.del(`cart:${userId}`);
  if (updated.length) await redis.rpush(`cart:${userId}`, ...updated);
  res.sendStatus(200);
}
