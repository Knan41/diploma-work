const express = require('express');
const db = require('../db');
const { authRequired, adminOnly } = require('../middleware/auth');

const router = express.Router();

const slugify = (t) =>
  t
    .toLowerCase()
    .replace(/ə/g, 'e').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ü/g, 'u')
    .replace(/ç/g, 'c').replace(/ş/g, 's').replace(/ğ/g, 'g')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const toCategory = (r) => ({ id: r.id, value: r.value, label: r.label });

// GET /api/categories
router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM categories ORDER BY id').all().map(toCategory));
});

// POST /api/categories  { label }  (admin)
router.post('/', authRequired, adminOnly, (req, res) => {
  const label = String((req.body || {}).label || '').trim();
  if (label.length < 2) return res.status(400).json({ message: 'Kateqoriya adı ən azı 2 simvol olmalıdır' });
  const value = slugify(label);
  if (!value) return res.status(400).json({ message: 'Kateqoriya adı düzgün deyil' });
  if (db.prepare('SELECT id FROM categories WHERE value = ? OR label = ? COLLATE NOCASE').get(value, label))
    return res.status(409).json({ message: 'Bu kateqoriya artıq var' });
  const info = db.prepare('INSERT INTO categories (value, label) VALUES (?, ?)').run(value, label);
  res.status(201).json(toCategory(db.prepare('SELECT * FROM categories WHERE id = ?').get(info.lastInsertRowid)));
});

// DELETE /api/categories/:id  (admin; maşını olan kateqoriya silinmir)
router.delete('/:id', authRequired, adminOnly, (req, res) => {
  const row = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ message: 'Kateqoriya tapılmadı' });
  if (db.prepare('SELECT id FROM cars WHERE category = ?').get(row.value))
    return res.status(400).json({ message: 'Bu kateqoriyada maşınlar var, əvvəlcə onları başqa kateqoriyaya keçirin' });
  db.prepare('DELETE FROM categories WHERE id = ?').run(row.id);
  res.json({ message: 'Kateqoriya silindi' });
});

module.exports = router;
