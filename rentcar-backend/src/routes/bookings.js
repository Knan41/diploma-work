const express = require('express');
const db = require('../db');
const { authRequired, adminOnly } = require('../middleware/auth');

const router = express.Router();

const BASE = `
  SELECT b.*, c.brand, c.model, c.image, c.price_per_day,
         u.name AS user_name, u.email AS user_email
  FROM bookings b
  JOIN cars c ON c.id = b.car_id
  JOIN users u ON u.id = b.user_id
`;

const toBooking = (r) => ({
  id: r.id,
  carId: r.car_id,
  userId: r.user_id,
  startDate: r.start_date,
  endDate: r.end_date,
  totalPrice: r.total_price,
  status: r.status,
  createdAt: r.created_at,
  car: { id: r.car_id, brand: r.brand, model: r.model, image: r.image, pricePerDay: r.price_per_day },
  user: { id: r.user_id, name: r.user_name, email: r.user_email },
});

const dateRe = /^\d{4}-\d{2}-\d{2}$/;
const today = () => new Date().toISOString().slice(0, 10);
const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000) + 1;

// POST /api/bookings   { carId, startDate, endDate }  (tarix formatı: YYYY-MM-DD)
router.post('/', authRequired, (req, res) => {
  const { carId, startDate, endDate } = req.body || {};
  if (!carId || !dateRe.test(startDate || '') || !dateRe.test(endDate || ''))
    return res.status(400).json({ message: 'carId, startDate və endDate (YYYY-MM-DD) lazımdır' });
  if (startDate < today())
    return res.status(400).json({ message: 'Başlama tarixi keçmişdə ola bilməz' });
  if (endDate < startDate)
    return res.status(400).json({ message: 'Bitmə tarixi başlama tarixindən əvvəl ola bilməz' });

  const car = db.prepare('SELECT * FROM cars WHERE id = ?').get(carId);
  if (!car) return res.status(404).json({ message: 'Maşın tapılmadı' });
  if (!car.available) return res.status(400).json({ message: 'Bu maşın hazırda mövcud deyil' });

  const clash = db
    .prepare(
      `SELECT id FROM bookings
       WHERE car_id = ? AND status IN ('pending','approved')
       AND start_date <= ? AND end_date >= ?`
    )
    .get(carId, endDate, startDate);
  if (clash)
    return res.status(409).json({ message: 'Bu maşın seçilmiş tarixlərdə artıq götürülüb' });

  const total = daysBetween(startDate, endDate) * car.price_per_day;
  const info = db
    .prepare('INSERT INTO bookings (user_id, car_id, start_date, end_date, total_price) VALUES (?, ?, ?, ?, ?)')
    .run(req.user.id, carId, startDate, endDate, total);

  res.status(201).json(toBooking(db.prepare(BASE + ' WHERE b.id = ?').get(info.lastInsertRowid)));
});

// GET /api/bookings/my  (özümün rezervasiyalarım)
router.get('/my', authRequired, (req, res) => {
  const rows = db.prepare(BASE + ' WHERE b.user_id = ? ORDER BY b.id DESC').all(req.user.id);
  res.json(rows.map(toBooking));
});

// PATCH /api/bookings/:id/cancel  (istifadəçi yalnız öz "pending" sifarişini ləğv edə bilər)
router.patch('/:id/cancel', authRequired, (req, res) => {
  const row = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  if (!row || row.user_id !== req.user.id)
    return res.status(404).json({ message: 'Rezervasiya tapılmadı' });
  if (row.status !== 'pending')
    return res.status(400).json({ message: 'Yalnız gözləyən rezervasiyanı ləğv etmək olar' });
  db.prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?").run(row.id);
  res.json(toBooking(db.prepare(BASE + ' WHERE b.id = ?').get(row.id)));
});

// GET /api/bookings?status=pending  (admin: hamısı)
router.get('/', authRequired, adminOnly, (req, res) => {
  const { status } = req.query;
  const rows = status
    ? db.prepare(BASE + ' WHERE b.status = ? ORDER BY b.id DESC').all(status)
    : db.prepare(BASE + ' ORDER BY b.id DESC').all();
  res.json(rows.map(toBooking));
});

// PATCH /api/bookings/:id/status   { status: 'approved' | 'cancelled' | 'pending' }  (admin)
router.patch('/:id/status', authRequired, adminOnly, (req, res) => {
  const { status } = req.body || {};
  if (!['pending', 'approved', 'cancelled'].includes(status))
    return res.status(400).json({ message: 'status: pending, approved və ya cancelled olmalıdır' });
  const row = db.prepare('SELECT id FROM bookings WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ message: 'Rezervasiya tapılmadı' });
  db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, row.id);
  res.json(toBooking(db.prepare(BASE + ' WHERE b.id = ?').get(row.id)));
});

module.exports = router;
