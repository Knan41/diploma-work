const jwt = require('jsonwebtoken');
const db = require('../db');

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
if (!process.env.JWT_SECRET) {
  console.warn('Diqqət: JWT_SECRET təyin edilməyib. Saytı internetə qoyanda .env-də öz gizli sözünü yaz.');
}

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

module.exports = { signToken, authRequired, adminOnly };
