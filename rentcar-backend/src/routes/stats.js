const express = require('express');
const db = require('../db');
const { authRequired, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/stats  (admin dashboard)
router.get('/', authRequired, adminOnly, (req, res) => {
  const count = (sql) => db.prepare(sql).get().n;
  res.json({
    totalCars: count('SELECT COUNT(*) n FROM cars'),
    availableCars: count('SELECT COUNT(*) n FROM cars WHERE available = 1'),
    totalUsers: count('SELECT COUNT(*) n FROM users'),
    totalBookings: count('SELECT COUNT(*) n FROM bookings'),
    pendingBookings: count("SELECT COUNT(*) n FROM bookings WHERE status = 'pending'"),
    approvedBookings: count("SELECT COUNT(*) n FROM bookings WHERE status = 'approved'"),
    cancelledBookings: count("SELECT COUNT(*) n FROM bookings WHERE status = 'cancelled'"),
    revenue: db.prepare("SELECT COALESCE(SUM(total_price), 0) n FROM bookings WHERE status = 'approved'").get().n,
  });
});

module.exports = router;
