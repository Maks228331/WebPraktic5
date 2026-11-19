const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = 3000;

const db = new Database(path.join(__dirname, 'tasks.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL
  )
`);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/tasks', (req, res) => {
  const tasks = db.prepare('SELECT id, title FROM tasks ORDER BY id ASC').all();
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';

  if (!title) {
    return res.status(400).json({ error: 'Назва завдання не може бути порожньою' });
  }

  const result = db.prepare('INSERT INTO tasks (title) VALUES (?)').run(title);
  const newTask = db.prepare('SELECT id, title FROM tasks WHERE id = ?').get(result.lastInsertRowid);

  res.status(201).json(newTask);
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Некоректний ID завдання' });
  }

  const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Завдання не знайдено' });
  }

  res.json({ message: 'Завдання видалено', id });
});

app.listen(PORT, () => {
  console.log(`Сервер запущено: http://localhost:${PORT}`);
});