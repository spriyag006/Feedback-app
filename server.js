const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Database ----------
const db = new Database(process.env.DB_PATH || 'feedback.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// ---------- Middleware ----------
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------- API ----------

// Get all feedback (newest first)
app.get('/api/feedback', (req, res) => {
  const rows = db
    .prepare('SELECT id, name, rating, message, created_at FROM feedback ORDER BY id DESC')
    .all();
  res.json(rows);
});

// Add feedback
app.post('/api/feedback', (req, res) => {
  const name = String(req.body.name || '').trim();
  const message = String(req.body.message || '').trim();
  const rating = Number(req.body.rating);

  if (!name || name.length > 50) {
    return res.status(400).json({ error: 'Name is required (max 50 characters).' });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be a whole number from 1 to 5.' });
  }
  if (!message || message.length > 500) {
    return res.status(400).json({ error: 'Message is required (max 500 characters).' });
  }

  const result = db
    .prepare('INSERT INTO feedback (name, rating, message) VALUES (?, ?, ?)')
    .run(name, rating, message);

  const created = db.prepare('SELECT * FROM feedback WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(created);
});

// Summary stats
app.get('/api/stats', (req, res) => {
  const row = db
    .prepare('SELECT COUNT(*) AS total, ROUND(AVG(rating), 1) AS average FROM feedback')
    .get();
  res.json({ total: row.total, average: row.average || 0 });
});

// Health check (useful for Render)
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Feedback app running on port ${PORT}`);
});