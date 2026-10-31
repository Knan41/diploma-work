require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./db');

const fs = require('fs');
const path = require('path');
const { carSvg } = require('./carArt');

const imgDir = path.join(__dirname, '..', 'public', 'images');
fs.mkdirSync(imgDir, { recursive: true });
const bodyTypes = ['sedan', 'sedan', 'sedan', 'suv', 'suv', 'sedan', 'suv', 'suv', 'suv', 'sedan', 'coupe', 'coupe', 'coupe', 'coupe', 'coupe'];
const slugOf = (brand, model) => `${brand} ${model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// public/images/ qovluğunda real şəkil (jpg, png, webp) varsa onu işlədir, yoxdursa avtomatik təsvir yaradır
function carImage(c, i) {
  const slug = slugOf(c[0], c[1]);
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    if (fs.existsSync(path.join(imgDir, `${slug}.${ext}`))) return `/images/${slug}.${ext}`;
  }
  fs.writeFileSync(path.join(imgDir, `${slug}.svg`), carSvg({ brand: c[0], model: c[1], category: c[7], type: bodyTypes[i] }));
  return `/images/${slug}.svg`;
}

// [brand, model, year, price, fuel, transmission, seats, category, available, description, engine, horsepower, acceleration]
const cars = [
  // --- HİBRİD ---
  ['Toyota', 'Prius', 2022, 55, 'hybrid', 'automatic', 5, 'hybrid', 1, 'Ən qənaətcil hibrid, şəhər içində çox az yanacaq sərf edir.', '1.8L hibrid', 122, 10.5],
  ['Toyota', 'Camry Hybrid', 2023, 75, 'hybrid', 'automatic', 5, 'hybrid', 1, 'Sakit sürüş, geniş salon və az sərfiyyat.', '2.5L hibrid', 208, 7.6],
  ['Hyundai', 'Sonata Hybrid', 2022, 70, 'hybrid', 'automatic', 5, 'hybrid', 1, 'Müasir dizayn və rahat biznes sinif hibrid sedan.', '2.0L hibrid', 192, 8.8],
  ['Kia', 'Niro Hybrid', 2023, 65, 'hybrid', 'automatic', 5, 'hybrid', 0, 'Kompakt hibrid krossover, ailə üçün praktik seçim.', '1.6L hibrid', 139, 10.8],
  ['Lexus', 'RX 450h', 2022, 140, 'hybrid', 'automatic', 5, 'hybrid', 1, 'Lüks hibrid SUV, yüksək rahatlıq və sakitlik.', '3.5L V6 hibrid', 308, 7.7],
  // --- ELEKTRİK ---
  ['Tesla', 'Model 3', 2023, 160, 'electric', 'automatic', 5, 'electric', 1, 'Tam elektrik sedan, sürətli və texnoloji.', 'Elektrik mühərrik', 283, 6.1],
  ['Tesla', 'Model Y', 2023, 180, 'electric', 'automatic', 5, 'electric', 1, 'Elektrik SUV, geniş salon və uzun yürüş məsafəsi.', 'Elektrik mühərrik', 299, 6.9],
  ['Hyundai', 'Ioniq 5', 2023, 140, 'electric', 'automatic', 5, 'electric', 1, 'Futuristik dizayn və sürətli şarj imkanı.', 'Elektrik mühərrik', 229, 7.4],
  ['Kia', 'EV6', 2023, 145, 'electric', 'automatic', 5, 'electric', 1, 'Güclü və sürətli elektrik krossover.', 'Elektrik mühərrik', 229, 7.3],
  ['BMW', 'i4', 2023, 200, 'electric', 'automatic', 5, 'electric', 1, 'Premium elektrik sedan, BMW sürüş zövqü ilə.', 'Elektrik mühərrik', 335, 5.7],
  // --- SPORT ---
  ['Ford', 'Mustang GT', 2022, 220, 'petrol', 'manual', 4, 'sport', 1, 'Əfsanəvi V8 mühərrik, klassik amerikan sport avtomobili.', '5.0L V8', 450, 4.4],
  ['Chevrolet', 'Camaro SS', 2022, 210, 'petrol', 'automatic', 4, 'sport', 0, 'Güclü V8 və aqressiv dizayn.', '6.2L V8', 455, 4.0],
  ['Dodge', 'Challenger R/T', 2022, 200, 'petrol', 'automatic', 5, 'sport', 1, 'Geniş salonlu muscle car, güclü və möhtəşəm səs.', '5.7L V8 HEMI', 375, 5.2],
  ['BMW', 'M4', 2023, 320, 'petrol', 'automatic', 4, 'sport', 1, 'Yüksək performanslı kupe, yarış xarakterli sürüş.', '3.0L Twin-Turbo R6', 473, 4.1],
  ['Porsche', '911 Carrera', 2022, 450, 'petrol', 'automatic', 4, 'sport', 1, 'Sport avtomobillərin simvolu, dəqiq idarəetmə və sürət.', '3.0L Twin-Turbo Boxer', 379, 4.2],
];

const addDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

db.exec('DELETE FROM messages; DELETE FROM bookings; DELETE FROM cars; DELETE FROM users; DELETE FROM sqlite_sequence;');

const insUser = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
insUser.run('Admin', 'admin@rentcar.az', bcrypt.hashSync('admin123', 10), 'admin');
insUser.run('Əli Məmmədov', 'user@rentcar.az', bcrypt.hashSync('user123', 10), 'user');
insUser.run('Leyla Həsənova', 'leyla@rentcar.az', bcrypt.hashSync('user123', 10), 'user');

const insCar = db.prepare(
  `INSERT INTO cars (brand, model, year, price_per_day, fuel, transmission, seats, category, image, description, engine, horsepower, acceleration, available)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
);
cars.forEach((c, i) => insCar.run(c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], carImage(c, i), c[9], c[10], c[11], c[12], c[8]));

// [userId, carId, startOffset, endOffset, status]
const bookings = [
  [2, 2, 2, 5, 'pending'],
  [2, 7, 10, 12, 'approved'],
  [3, 11, 1, 4, 'approved'],
  [3, 1, 7, 9, 'pending'],
  [2, 8, 15, 18, 'cancelled'],
];
const insBooking = db.prepare(
  'INSERT INTO bookings (user_id, car_id, start_date, end_date, total_price, status) VALUES (?, ?, ?, ?, ?, ?)'
);
bookings.forEach(([u, c, s, e, status]) => {
  const price = cars[c - 1][3];
  insBooking.run(u, c, addDays(s), addDays(e), price * (e - s + 1), status);
});

console.log('\nReal şəkil qoymaq üçün şəkli public/images qovluğuna bu adla at (jpg, png və ya webp), sonra npm run seed işlət:');
cars.forEach((c) => console.log('  ' + slugOf(c[0], c[1]) + '.jpg'));
console.log('\nSeed tamamlandı: 3 istifadəçi, 15 maşın, 5 rezervasiya');
console.log('Admin:  admin@rentcar.az / admin123');
console.log('İstifadəçi: user@rentcar.az / user123');
