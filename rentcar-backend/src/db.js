const { DatabaseSync } = require('node:sqlite'); // Node-un daxili SQLite-ı, ayrıca quraşdırma lazım deyil
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'rentcar.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    price_per_day REAL NOT NULL,
    fuel TEXT NOT NULL DEFAULT 'petrol',
    transmission TEXT NOT NULL DEFAULT 'automatic',
    seats INTEGER NOT NULL DEFAULT 5,
    category TEXT NOT NULL DEFAULT 'hybrid',
    image TEXT,
    description TEXT,
    engine TEXT,
    horsepower INTEGER,
    acceleration REAL,
    available INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    car_id INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    total_price REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','cancelled')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Köhnə baza varsa, yeni sütunları avtomatik əlavə edir
const carCols = db.prepare('PRAGMA table_info(cars)').all().map((c) => c.name);
if (!carCols.includes('engine')) db.exec('ALTER TABLE cars ADD COLUMN engine TEXT');
if (!carCols.includes('horsepower')) db.exec('ALTER TABLE cars ADD COLUMN horsepower INTEGER');
if (!carCols.includes('acceleration')) db.exec('ALTER TABLE cars ADD COLUMN acceleration REAL');

const userCols = db.prepare('PRAGMA table_info(users)').all().map((c) => c.name);
if (!userCols.includes('phone')) db.exec('ALTER TABLE users ADD COLUMN phone TEXT');

module.exports = db;
