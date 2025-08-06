const express = require('express');
const router  = express.Router();
const client  = require('../db');

// GET all
router.get('/', (req, res) => {
  client.query('SELECT * FROM messages', (err, result) => {
    if (err) {
      console.error('Error fetching messages:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(result.rows);
  });
});

// POST new (with realtime emit)
router.post('/', (req, res) => {
  const { sender_id, recipient_id, content } = req.body;
  client.query(
    'INSERT INTO messages (sender_id, recipient_id, content) VALUES ($1,$2,$3) RETURNING *',
    [sender_id, recipient_id, content],
    (err, result) => {
      if (err) {
        console.error('Error inserting message:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      const msg = result.rows[0];
      const io  = req.app.get('io');
      io.to(`user:${recipient_id}`).emit('new_message', msg);
      io.to(`user:${sender_id}`   ).emit('new_message', msg);
      res.status(201).json(msg);
    }
  );
});

// GET by id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  client.query('SELECT * FROM messages WHERE id = $1', [id], (err, result) => {
    if (err) {
      console.error('Error fetching message:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(result.rows[0]);
  });
});

module.exports = router;