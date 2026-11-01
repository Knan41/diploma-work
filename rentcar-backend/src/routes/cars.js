const express = require('express');
const db = require('../db');
const { authRequired, adminOnly } = require('../middleware/auth');

const router = express.Router();

const toCar = (r) => ({
  id: r.id,
  brand: r.brand,
  model: r.model,
  year: r.year,
  pricePerDay: r.price_per_day,
  fuel: r.fuel,
  transmission: r.transmission,
  seats: r.seats,
  category: r.category,
  image: r.image,
  description: r.description,
  engine: r.engine,
  horsepower: r.horsepower,
  acceleration: r.acceleration,
  available: !!r.available,
});

const FUELS = ['petrol', 'diesel', 'hybrid', 'electric'];
const TRANSMISSIONS = ['automatic', 'manual'];
const CATEGORIES = ['hybrid', 'electric', 'sport'];

function validateCar(body, partial = false) {
  const b = body || {};
  const need = (k) => !partial && (b[k] === undefined || b[k] === '');
  if (need('brand') || need('model') || need('year') || need('pricePerDay'))
    return 'brand, model, year və pricePerDay mütləqdir';
  if (b.pricePerDay !== undefined && !(Number(b.pricePerDay) > 0)) return 'Qiymət 0-dan böyük olmalıdır';
  if (b.year !== undefined && !(Number(b.year) >= 1990 && Number(b.year) <= 2100)) return 'İl düzgün deyil';
  if (b.horsepower != null && b.horsepower !== '' && !(Number(b.horsepower) > 0)) return 'At gücü düzgün deyil';
  if (b.acceleration != null && b.acceleration !== '' && !(Number(b.acceleration) > 0)) return 'Sürətlənmə düzgün deyil';
  if (b.fuel !== undefined && !FUELS.includes(b.fuel)) return `fuel: ${FUELS.join(', ')}`;
  if (b.transmission !== undefined && !TRANSMISSIONS.includes(b.transmission))
    return `transmission: ${TRANSMISSIONS.join(', ')}`;
  if (b.category !== undefined && !CATEGORIES.includes(b.category)) return `category: ${CATEGORIES.join(', ')}`;
  return null;
}

// GET /api/cars?search=&brand=&category=&fuel=&transmission=&minPrice=&maxPrice=&available=true
router.get('/', (req, res) => {
  const { search, brand, category, fuel, transmission, minPrice, maxPrice, available } = req.query;
  const where = [];
  const params = [];

  if (search) {
    where.push("(brand || ' ' || model) LIKE ?");
    params.push(`%${search.trim()}%`);
  }
  if (brand) { where.push('brand = ? COLLATE NOCASE'); params.push(brand); }
  if (category) { where.push('category = ?'); params.push(category); }
  if (fuel) { where.push('fuel = ?'); params.push(fuel); }
  if (transmission) { where.push('transmission = ?'); params.push(transmission); }
  if (minPrice) { where.push('price_per_day >= ?'); params.push(Number(minPrice)); }
  if (maxPrice) { where.push('price_per_day <= ?'); params.push(Number(maxPrice)); }
  if (available === 'true') where.push('available = 1');

  const sql = `SELECT * FROM cars ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY id DESC`;
  res.json(db.prepare(sql).all(...params).map(toCar));
});

// GET /api/cars/brands  (filtr üçün markalar)
router.get('/brands', (req, res) => {
  const rows = db.prepare('SELECT DISTINCT brand FROM cars ORDER BY brand').all();
  res.json(rows.map((r) => r.brand));
});

// GET /api/cars/:id
router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM cars WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ message: 'Maşın tapılmadı' });
  res.json(toCar(row));
});

// GET /api/cars/:id/booked-dates  (məşğul tarix aralıqları)
router.get('/:id/booked-dates', (req, res) => {
  const rows = db
    .prepare(
      `SELECT start_date, end_date FROM bookings
       WHERE car_id = ? AND status IN ('pending','approved') AND end_date >= date('now')
       ORDER BY start_date`
    )
    .all(req.params.id);
  res.json(rows.map((r) => ({ startDate: r.start_date, endDate: r.end_date })));
});

// POST /api/cars  (admin)
router.post('/', authRequired, adminOnly, (req, res) => {
  const err = validateCar(req.body);
  if (err) return res.status(400).json({ message: err });
  const b = req.body;
  const info = db
    .prepare(
      `INSERT INTO cars (brand, model, year, price_per_day, fuel, transmission, seats, category, image, description, engine, horsepower, acceleration, available)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      b.brand.trim(), b.model.trim(), Number(b.year), Number(b.pricePerDay),
      b.fuel || 'petrol', b.transmission || 'automatic', Number(b.seats) || 5,
      b.category || 'hybrid', b.image || null, b.description || null,
      b.engine || null, b.horsepower ? Number(b.horsepower) : null,
      b.acceleration ? Number(b.acceleration) : null,
      b.available === false ? 0 : 1
    );
  const row = db.prepare('SELECT * FROM cars WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(toCar(row));
});

// PUT /api/cars/:id  (admin)
router.put('/:id', authRequired, adminOnly, (req, res) => {
  const row = db.prepare('SELECT * FROM cars WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ message: 'Maşın tapılmadı' });
  const err = validateCar(req.body, true);
  if (err) return res.status(400).json({ message: err });

  const b = req.body;
  db.prepare(
    `UPDATE cars SET brand=?, model=?, year=?, price_per_day=?, fuel=?, transmission=?,
     seats=?, category=?, image=?, description=?, engine=?, horsepower=?, acceleration=?, available=? WHERE id=?`
  ).run(
    b.brand ?? row.brand, b.model ?? row.model, Number(b.year ?? row.year),
    Number(b.pricePerDay ?? row.price_per_day), b.fuel ?? row.fuel,
    b.transmission ?? row.transmission, Number(b.seats ?? row.seats),
    b.category ?? row.category, b.image ?? row.image, b.description ?? row.description,
    b.engine ?? row.engine, b.horsepower === undefined ? row.horsepower : (Number(b.horsepower) || null),
    b.acceleration === undefined ? row.acceleration : (Number(b.acceleration) || null),
    b.available === undefined ? row.available : b.available ? 1 : 0, row.id
  );
  res.json(toCar(db.prepare('SELECT * FROM cars WHERE id = ?').get(row.id)));
});

// DELETE /api/cars/:id  (admin)
router.delete('/:id', authRequired, adminOnly, (req, res) => {
  const info = db.prepare('DELETE FROM cars WHERE id = ?').run(req.params.id);
  if (!info.changes) return res.status(404).json({ message: 'Maşın tapılmadı' });
  res.json({ message: 'Maşın silindi' });
});

module.exports = router;
