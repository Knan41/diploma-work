# RENTCAR: Avtomobil Kirayə Sayti

Bakıda fəaliyyət göstərən avtomobil kirayə xidməti üçün tam işlək veb-sayt. İstifadəçilər maşınlara baxır, filtr edir və rezerv edir; admin isə maşınları, rezervasiyaları, istifadəçiləri, kateqoriyaları və mesajları idarə edir.

## Texnologiyalar

**Frontend** (`rent-a-car-fronted`)

- React, TypeScript, Vite
- Tailwind CSS 4
- Redux Toolkit və RTK Query
- React Router
- i18next (Azərbaycan və ingilis dili)

**Backend** (`rentcar-backend`)

- Node.js, Express
- SQLite (Node-un daxili `node:sqlite` modulu, ayrıca baza proqramı lazım deyil)
- JWT ilə giriş (7 gün), parollar bcrypt ilə saxlanılır

## İmkanlar

**İstifadəçi**

- Qeydiyyat (ad, email, əlaqə nömrəsi, parol) və giriş
- Maşınlara baxış, axtarış, marka və kateqoriya ilə filtr
- Maşının ətraflı səhifəsi, tutulmuş tarixlərin göstərilməsi
- Rezervasiya (tarix toqquşması yoxlanılır, gün sayına görə qiymət hesablanır)
- Rezervasiyalarım, gözləyən rezervasiyanı ləğv etmək
- Profil (ad, parol) və öz hesabını silmək
- Əlaqə formu, dil seçimi (AZ / EN)

**Admin**

- Dashboard (statistika)
- Maşınlar: əlavə etmə (şəkil yükləmə), dəyişmə (maşın səhifəsində), silmə, mövcudluq
- Kateqoriyaları əlavə etmək və silmək
- Rezervasiyalar: statusu dəyişmək (istifadəçinin ləğv etdiyini bərpa etmək olmaz)
- İstifadəçilər: siyahı, rol, silmə
- Əlaqə formundan gələn mesajlar
- Admin maşın icarəyə götürə bilmir və öz hesabını silə bilmir

## Rollar

| Rol     | İcazələr                                               |
| ------- | ------------------------------------------------------ |
| Qonaq   | Maşınlara baxmaq, əlaqə forması, qeydiyyat və giriş    |
| `user`  | Qonağın hamısı + rezervasiya, rezervasiyalarım, profil |
| `admin` | `/admin` paneli və idarəetmə əməliyyatları             |

## Qovluq strukturu

```
rent-a-car-fronted/src
  components/   layout (Navbar, Footer, AdminLayout), cars, auth, ui
  pages/        istifadəçi səhifələri və pages/admin
  store/        store.ts, slices/ (auth), api/ (RTK Query)
  locales/      az.json, en.json
  utils/        token və xəta yardımçıları
rentcar-backend/src
  routes/       auth, cars, bookings, users, stats, messages, categories
  middleware/   JWT və rol yoxlaması
  db.js, seed.js, server.js
```

## Lokal işə salmaq

Node.js **22.13 və ya daha yeni** lazımdır (`node -v` ilə yoxla). İki ayrı terminal aç.

**1. Backend**

```bash
cd rentcar-backend
cp .env.example .env
npm install
npm start                 # http://localhost:5000
```

Baza boşdursa, `npm start` 15 maşını və admin hesabını özü yükləyir. Admin məlumatı `.env`-dəki `ADMIN_EMAIL` və `ADMIN_PASSWORD`-dən götürülür. Bazanı sıfırlamaq üçün: `npm run seed`.

**2. Frontend**

```bash
cd rent-a-car-fronted
npm install
npm run dev               # http://localhost:5173
```

**Backend**

| Ad | Məna |
| --- | --- |
| `PORT` | Server portu (defolt 5000) |
| `JWT_SECRET` | Token üçün gizli söz. Yazmasan server özü təsadüfi açar yaradıb `data` qovluğunda saxlayır; internetə qoyanda Render-də özün yaz |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Admin hesabı (seed zamanı yaranır) |
| `CLIENT_URL` | Frontend ünvanı (CORS üçün). Boş olsa hamıya açıqdır |

**Frontend**

| Ad | Məna |
| --- | --- |
| `VITE_API_URL` | Backend ünvanı, məs. `https://rentcar.onrender.com/api`. Boş olsa `http://localhost:5000/api` |

## Sessiya

Token 7 gün işləyir. Müddət bitəndə sayt istifadəçini avtomatik çıxarır və yenidən daxil olmağı xahiş edir.
