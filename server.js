const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;
const SECRET_KEY = "secret123";

app.use(express.json());
app.use(cors());

const users = [
  { username: "amna", password: "amna123" },
  { username: "iqra", password: "iqra123" },
];

let events = [];

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

app.get("/api/events", authenticate, (req, res) => {
  res.json(events.filter((event) => event.username === req.user.username));
});

app.post("/api/events", authenticate, (req, res) => {
  const { name, date, category } = req.body;
  if (!name || !date || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newEvent = {
    id: Date.now(),
    name,
    date,
    category,
    username: req.user.username,
  };
  events.push(newEvent);
  res.status(201).json(newEvent);
});

app.delete("/api/events/:id", authenticate, (req, res) => {
  events = events.filter(
    (event) =>
      event.id !== parseInt(req.params.id) ||
      event.username !== req.user.username
  );
  res.json({ message: "Event deleted" });
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
