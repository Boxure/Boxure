import { client } from "../db.js"; // Import the database client

// GET /api/user
export const getUser = (req, res) => {
  client.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.error("Error executing query", err);
      return res.status(500).send("Error fetching users");
    }
    res.json(result.rows);
  });
};
