import { createClient } from "@supabase/supabase-js";
import { client } from "../db.js"; // Import the database client

// GET /api/items
export const getItems = (req, res) => {
  client.query("SELECT * FROM items", (err, result) => {
    if (err) {
      console.error("Error executing query", err);
      return res.status(500).send("Error fetching items");
    }
    res.json(result.rows);
  });
};

// GET /api/items/:id
export const getItemById = (req, res) => {
  const { id } = req.params;
  client.query("SELECT * FROM items WHERE id = $1", [id], (err, result) => {
    if (err) {
      console.error("Error executing query", err);
      return res.status(500).send("Error fetching item");
    }
    if (result.rows.length === 0) {
      return res.status(404).send("Item not found");
    }
    res.json(result.rows[0]);
  });
};

// POST /api/items
export const insertItem = (req, res) => {
  const { name, description, price, quantity, image_url, owner } = req.body;
  client.query(
    "INSERT INTO items (name, description, price, quantity, image_url, owner) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [name, description, price, quantity, image_url, owner],
    (err, result) => {
      if (err) {
        console.error("Error inserting item", err);
        return res.status(500).send("Error inserting item");
      }
      res.status(201).json(result.rows[0]);
    },
  );
};

export async function isAuthenticated(req, res, next) {
  // Create Supabase client here, after env vars are loaded
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
  );

  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: error.message ? error.message + "Token verification failed" : "Token verification failed" });
  }
}
