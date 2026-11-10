const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('../db');

// JWT_SECRET (.env) verilməyibsə, server təsadüfi açar yaradır və data qovluğunda saxlayır
function loadSecret() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  const file = path.join(__dirname, '..', '..', 'data', '.jwt-secret');
  try {
    const saved = fs.readFileSync(file, 'utf8').trim();
    if (saved) return saved;
  } catch {
    // fayl hələ yoxdur
  }
  const generated = crypto.randomBytes(32).toString('hex');
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, generated, { mode: 0o600 });
  } catch {
    // yazmaq alınmasa, açar yalnız bu işə salınma üçün qalır
  }
  return generated;
}

const SECRET = loadSecret();

function signToken(userId) {
  return jwt.sign({ id: userId }, SECRET, { expiresIn: '7d' });
}

// Token yoxlayir, istifadecini req.user-e yazir
function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Giriş tələb olunur', code: 'AUTH' });

  try {
    const payload = jwt.verify(token, SECRET);
    const user = db
      .prepare('SELECT id, name, email, role FROM users WHERE id = ?')
      .get(payload.id);
    if (!user) return res.status(401).json({ message: 'İstifadəçi tapılmadı', code: 'AUTH' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Token etibarsızdır və ya vaxtı bitib', code: 'AUTH' });
  }
}

function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Bu əməliyyat yalnız admin üçündür' });
  }
  next();
}

module.exports = { signToken, authRequired, adminOnly, SECRET };
