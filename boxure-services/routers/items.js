// routes/items.js
const express = require('express');
const router = express.Router();
const client = require('../db'); // Import the database client


// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}


// GET /api/items
router.get('/', (req, res) => {
  client.query('SELECT * FROM items', (err, result) => {
    if (err) {
      console.error('Error executing query', err);
      return res.status(500).send('Error fetching items');
    }
    res.json(result.rows);
  });
});

// GET /api/items/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  client.query('SELECT * FROM items WHERE id = $1', [id], (err, result) => {
    if (err) {
      console.error('Error executing query', err);
      return res.status(500).send('Error fetching item');
    }
    if (result.rows.length === 0) {
      return res.status(404).send('Item not found');
    }
    res.json(result.rows[0]);
  });
});

// POST /api/items
router.post('/', isAuthenticated, (req, res) => {
  const { name, description, price, quantity, image_url } = req.body;
  client.query(
    'INSERT INTO items (name, description, price, quantity, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, description, price, quantity, image_url],
    (err, result) => {
      if (err) {
        console.error('Error inserting item', err);
        return res.status(500).send('Error inserting item');
      }
      res.status(201).json(result.rows[0]);
    }
  );
});

module.exports = router;