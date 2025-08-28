// routes/user.js
const express = require('express');
const router = express.Router();
const client = require('../db'); // Import the database client

// GET /api/user
router.get('/', (req, res) => {
  client.query('SELECT * FROM users', (err, result) => {
    if (err) {
      console.error('Error executing query', err);
      return res.status(500).send('Error fetching users');
    }
    res.json(result.rows);
  });
});

module.exports = router;