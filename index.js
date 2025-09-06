import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import path from "path";
import bcrypt from 'bcrypt';
import { fileURLToPath } from "url";
import { log } from "console";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "SynergySphere",
  password: "1472",
  port: 5432,
});
db.connect();

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "forms.html"));
});

app.post("/register", async (req, res) => {
  const email = req.body.em;
  const password = req.body.pass;
  const username = req.body.un;
  const name = req.body.n;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (checkResult.rows.length > 0) {
      return res.json({ success: false, message: "Email already exists. Try logging in." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (username, password, email, name) VALUES ($1, $2, $3, $4)",
      [username, hashedPassword, email, name]
    );

    console.log("New user created");
    res.json({ success: true, message: "User registered successfully." });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.em;
  const password = req.body.pass;

  try {
    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userResult.rows.length === 0) {
      return res.json({ success: false, message: "Invalid email or password." });
    }

    const user = userResult.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.json({ success: false, message: "Invalid email or password." });
    }
    console.log("User logged in:", user.username);
    res.json({ success: true, message: "Login successful.", username: user.username });
  } 
  catch (err) {
    console.error(err);
    res.json({ success: false, message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
