const express = require('express');
const db = require('../db');
const { authRequired, adminOnly } = require('../middleware/auth');

const router = express.Router();
router.use(authRequired, adminOnly);

const toUser = (r) => ({ id: r.id, name: r.name, email: r.email, role: r.role, createdAt: r.created_at });

// GET /api/users
router.get('/', (req, res) => {
  res.json(db.prepare('SELECT id, name, email, role, created_at FROM users ORDER BY id').all().map(toUser));
});

// PATCH /api/users/:id/role   { role: 'user' | 'admin' }
router.patch('/:id/role', (req, res) => {
  const { role } = req.body || {};
  if (!['user', 'admin'].includes(role))
    return res.status(400).json({ message: "role: 'user' və ya 'admin' olmalıdır" });
  if (Number(req.params.id) === req.user.id)
    return res.status(400).json({ message: 'Öz rolunuzu dəyişə bilməzsiniz' });
  const info = db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.id);
  if (!info.changes) return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
  res.json(toUser(db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id)));
});

// DELETE /api/users/:id
router.delete('/:id', (req, res) => {
  if (Number(req.params.id) === req.user.id)
    return res.status(400).json({ message: 'Öz hesabınızı silə bilməzsiniz' });
  const info = db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  if (!info.changes) return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
  res.json({ message: 'İstifadəçi silindi' });
});

module.exports = router;
