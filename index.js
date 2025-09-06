import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import path from "path";
import bcrypt from 'bcrypt';
import session from 'express-session';
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(session({
  secret: 'your-secret-key',  
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }   
}));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "SynergySphere",
  password: "1472",
  port: 5432,
});
db.connect();

function isLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/register");
  }
}

app.get("/", isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "forms.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
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
    res.redirect("/login");
  } catch (err) {
    console.error(err);
  }
});

app.post("/create-project", isLoggedIn, async (req, res) => {
  const { title, content } = req.body;
  const leader = req.session.user.username;
  const deadline = null; 

  try {
    await db.query(
      `INSERT INTO projects (topic, description, leader, deadline) VALUES ($1, $2, $3, $4)`,
      [title, content, leader, deadline]
    );
    res.redirect('/mypro.html'); 
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).send("Failed to create project");
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

    req.session.user = { id: user.id, username: user.username };

    console.log("User logged in:", user.username);
    res.redirect("/")
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Internal server error" });
  }
});

app.get("/api/myprojects", isLoggedIn, async (req, res) => {
  try {
    const username = req.session.user.username;
    const query = `
      FROM projects p
      JOIN users u ON p.leader = u.username
      WHERE p.leader = $1
      ORDER BY p.deadline;
    `;
    const result = await db.query(query, [username]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching my projects:", err);
    res.status(500).json({ error: "Failed to fetch my projects" });
  }
});

app.get("/api/teamprojects", isLoggedIn, async (req, res) => {
  try {
    const username = req.session.user.username;
    const query = `
      SELECT p.id, p.topic, p.deadline, u.name AS leader_name
      FROM projects p
      JOIN users u ON p.leader = u.username
      WHERE p.leader != $1
      ORDER BY p.deadline;
    `;
    const result = await db.query(query, [username]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching team projects:", err);
    res.status(500).json({ error: "Failed to fetch team projects" });
  }
});

app.get("/api/notes", async (req, res) => {
  try {
    const query = `
      SELECT tasks.id, tasks.text AS content, todo.topic AS title
      FROM tasks
      JOIN todo ON tasks.list = todo.id
      ORDER BY tasks.id DESC
    `;

    const result = await db.query(query);

    const notes = result.rows.map(row => ({
      title: row.title,
      content: row.content
    }));

    res.json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
