const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { authRequired, adminOnly } = require('../middleware/auth');

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

const toMessage = (r) => ({ id: r.id, name: r.name, message: r.message, userId: r.user_id, createdAt: r.created_at });

// POST /api/messages  { name, message }  (giriş məcburi deyil)
router.post('/', (req, res) => {
  const { name, message } = req.body || {};
  if (!name || name.trim().length < 2) return res.status(400).json({ message: 'Ad ən azı 2 simvol olmalıdır' });
  if (!message || message.trim().length < 3) return res.status(400).json({ message: 'Mesaj çox qısadır' });

  let userId = null;
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) {
    try { userId = jwt.verify(header.slice(7), SECRET).id; } catch { /* qonaq kimi davam */ }
  }
  const info = db
    .prepare('INSERT INTO messages (name, message, user_id) VALUES (?, ?, ?)')
    .run(name.trim(), message.trim(), userId);
  res.status(201).json(toMessage(db.prepare('SELECT * FROM messages WHERE id = ?').get(info.lastInsertRowid)));
});

// GET /api/messages  (admin)
router.get('/', authRequired, adminOnly, (req, res) => {
  res.json(db.prepare('SELECT * FROM messages ORDER BY id DESC').all().map(toMessage));
});

// DELETE /api/messages/:id  (admin)
router.delete('/:id', authRequired, adminOnly, (req, res) => {
  const info = db.prepare('DELETE FROM messages WHERE id = ?').run(req.params.id);
  if (!info.changes) return res.status(404).json({ message: 'Mesaj tapılmadı' });
  res.json({ message: 'Mesaj silindi' });
});

module.exports = router;
