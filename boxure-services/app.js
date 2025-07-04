// app.js
const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const client = new Client({
  user: 'postgres',
  host: 'db',
  database: 'test_db',
  password: 'yourpassword',
  port: 5432,
});

client.connect();

app.get('/api/users', (req, res) => {
  client.query('SELECT * FROM users', (err, result) => {
    if (err) {
      console.error('Error executing query', err);
      return res.status(500).send('Error fetching users');
    }
    res.json(result.rows);
  });
});


app.post('/api/register', (req, res) => {
  const { email, username, password } = req.body;
  client.query(
    'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *',
    [username, password, email],
    (err, result) => {
      if (err) {
        console.error('Error inserting user', err);
        return res.status(500).json({ message: 'Error registering user' });
      }
      res.json({ message: 'User registered', user: result.rows[0] });
    }
  );
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  client.query(
    'SELECT * FROM users WHERE email = $1 AND password = $2',
    [email, password],
    (err, result) => {
      if (err) {
        console.error('Error logging in', err);
        return res.status(500).json({ message: 'Error logging in' });
      }
      if (result.rows.length > 0) {
        res.json({ message: 'Login successful', user: result.rows[0] });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    }
  );
});

app.get('/api/items', (req, res) => {
  client.query('SELECT * FROM items', (err, result) => {
    if (err) {
      console.error('Error executing query', err);
      return res.status(500).send('Error fetching items');
    }
    res.json(result.rows);
  });
});

app.get('/api/items/:id', (req, res) => {
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

app.post('/api/items', (req, res) => {
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

module.exports = app;
