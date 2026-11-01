const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { signToken, authRequired } = require('../middleware/auth');

const router = express.Router();
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, email, password, phone } = req.body || {};
  if (!name || name.trim().length < 2)
    return res.status(400).json({ message: 'Ad ən azı 2 simvol olmalıdır' });
  if (!email || !emailRe.test(email))
    return res.status(400).json({ message: 'Email düzgün deyil' });
  if (!phone || !/^\+?[0-9\s()-]{7,20}$/.test(phone.trim()))
    return res.status(400).json({ message: 'Əlaqə nömrəsi düzgün deyil' });
  if (!password || password.length < 6)
    return res.status(400).json({ message: 'Parol ən azı 6 simvol olmalıdır' });

  const mail = email.trim().toLowerCase();
  if (db.prepare('SELECT id FROM users WHERE email = ?').get(mail))
    return res.status(409).json({ message: 'Bu email artıq qeydiyyatdadır' });

  const hash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare("INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, 'user', ?)")
    .run(name.trim(), mail, hash, phone.trim());

  const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ token: signToken(user.id), user });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ message: 'Email və parol daxil edin' });

  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase());
  if (!row || !bcrypt.compareSync(password, row.password))
    return res.status(401).json({ message: 'Email və ya parol yanlışdır' });

  const user = { id: row.id, name: row.name, email: row.email, role: row.role };
  res.json({ token: signToken(user.id), user });
});

// GET /api/auth/me
router.get('/me', authRequired, (req, res) => {
  res.json(req.user);
});

// PUT /api/auth/profile  (ad və/və ya parol dəyiş)
router.put('/profile', authRequired, (req, res) => {
  const { name, password } = req.body || {};
  if (name !== undefined) {
    if (name.trim().length < 2)
      return res.status(400).json({ message: 'Ad ən azı 2 simvol olmalıdır' });
    db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name.trim(), req.user.id);
  }
  if (password !== undefined) {
    if (password.length < 6)
      return res.status(400).json({ message: 'Parol ən azı 6 simvol olmalıdır' });
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(bcrypt.hashSync(password, 10), req.user.id);
  }
  const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(req.user.id);
  res.json(user);
});

// DELETE /api/auth/me  { password }  (istifadəçi öz hesabını silir; admin silə bilməz)
router.delete('/me', authRequired, (req, res) => {
  if (req.user.role === 'admin')
    return res.status(403).json({ message: 'Admin hesabı silinə bilməz' });
  const { password } = req.body || {};
  if (!password) return res.status(400).json({ message: 'Təsdiq üçün parolu daxil edin' });
  const row = db.prepare('SELECT password FROM users WHERE id = ?').get(req.user.id);
  if (!row || !bcrypt.compareSync(password, row.password))
    return res.status(401).json({ message: 'Parol yanlışdır' });
  db.prepare('DELETE FROM users WHERE id = ?').run(req.user.id);
  res.json({ message: 'Hesab silindi' });
});

module.exports = router;
