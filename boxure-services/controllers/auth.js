import { client } from "../db.js"; // Import the database client

// POST api/register
export const registerNewAccount = (req, res) => {
  const { email, username, password } = req.body;
  client.query(
    "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *",
    [username, password, email],
    (err, result) => {
      if (err) {
        console.error("Error inserting user", err);
        return res.status(500).json({ message: "Error registering user" });
      }
      res.json({ message: "User registered", user: result.rows[0] });
    },
  );
};

// POST api/login
export const login = (req, res) => {
  const { emailOrUser, password } = req.body;
  client.query(
    "SELECT * FROM users WHERE (email = $1 OR username = $1) AND password = $2",
    [emailOrUser, password],
    (err, result) => {
      if (err) {
        console.error("Error logging in", err);
        return res.status(500).json({ message: "Error logging in" });
      }
      if (result.rows.length > 0) {
        req.session.user = result.rows[0];
        res.json({ message: "Login successful", user: result.rows[0] });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    },
  );
};

// POST api/logout
export const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
};
