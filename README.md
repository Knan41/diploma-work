# RENTCAR: Avtomobil Kirayə Sayti (Diplom işi)

Bakıda fəaliyyət göstərən avtomobil kirayə xidməti üçün tam işlək veb-sayt. İstifadəçilər maşınlara baxır, filtr edir və rezerv edir; admin isə maşınları, rezervasiyaları, istifadəçiləri, kateqoriyaları və mesajları idarə edir.

## Texnologiyalar

**Frontend** (`rent-a-car-fronted`)
- React 19, TypeScript, Vite
- Tailwind CSS 4
- Redux Toolkit (auth state) və RTK Query (bütün API sorğuları)
- React Router (qorunan və admin route-lar)
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

| Rol | İcazələr |
|---|---|
| Qonaq | Maşınlara baxmaq, əlaqə forması, qeydiyyat və giriş |
| `user` | Qonağın hamısı + rezervasiya, rezervasiyalarım, profil |
| `admin` | `/admin` paneli və idarəetmə əməliyyatları |

Rollar həm frontend-də (`ProtectedRoute`), həm backend-də (`authRequired`, `adminOnly`) yoxlanılır. Rol hər sorğuda bazadan oxunur.

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
cp .env.example .env      # Windows-da faylı kopyalayıb adını .env qoy, sonra içini doldur
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

## Ayarlar (mühit dəyişənləri)

**Backend (`rentcar-backend/.env`)**

| Ad | Məna |
|---|---|
| `PORT` | Server portu (defolt 5000) |
| `JWT_SECRET` | Token üçün gizli söz (mütləq özün yaz) |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Admin hesabı (seed zamanı yaranır) |
| `CLIENT_URL` | Frontend ünvanı (CORS üçün). Boş olsa hamıya açıqdır |

**Frontend (`rent-a-car-fronted/.env`)**

| Ad | Məna |
|---|---|
| `VITE_API_URL` | Backend ünvanı, məs. `https://rentcar.onrender.com/api`. Boş olsa `http://localhost:5000/api` |

## İnternetə qoymaq: Backend Render-də, Frontend Vercel-də

**1. Backend (Render)**
1. https://render.com-da GitHub ilə daxil ol, **New → Blueprint** seç və bu repo-nu göstər (kökdəki `render.yaml` hər şeyi özü qurur).
   Əl ilə qurmaq istəsən: **New → Web Service**, Root Directory `rentcar-backend`, Build `npm install`, Start `npm start`.
2. Environment bölməsində doldur: `ADMIN_EMAIL`, `ADMIN_PASSWORD` (və lazım olsa `ADMIN_NAME`). `JWT_SECRET` Blueprint ilə avtomatik yaranır.
3. Deploy bitəndə `https://ad.onrender.com/api/cars` aç, maşınlar görünməlidir.

**2. Frontend (Vercel)**
1. https://vercel.com-da **Add New → Project**, repo-nu seç.
2. **Root Directory:** `rent-a-car-fronted` (Framework avtomatik Vite tanınır).
3. **Environment Variables:** `VITE_API_URL` = `https://ad.onrender.com/api`
4. **Deploy** et. `vercel.json` səhifə yenilənəndə `/cars/1` kimi ünvanların işləməsini təmin edir.

**3. Birləşdirmək**
Render-də `CLIENT_URL` dəyişəninə Vercel ünvanını yaz (məs. `https://sayt.vercel.app`, sonda `/` olmadan) və backend-i yenidən başlat.

**Render pulsuz planı haqqında:**
- 15 dəqiqə sorğu olmasa server yatır, ilk sorğu 30 ilə 60 saniyə çəkə bilər. Təqdimatdan əvvəl saytı bir dəfə aç.
- Fayl sistemi müvəqqətidir: server yenidən başlayanda və ya yenidən deploy olanda baza və sonradan yüklənmiş şəkillər silinir. Baza boş qaldığı üçün avtomatik yenidən demo məlumatlarla və admin hesabı ilə yaranır. Qeydiyyatdan keçmiş istifadəçilər isə itir.
- Daimi saxlama üçün Render-in pullu diski lazımdır (mount yeri `rentcar-backend/data`, `DB_PATH` dəyişəni ilə).

## Sessiya

Token 7 gün işləyir. Müddət bitəndə sayt istifadəçini avtomatik çıxarır və yenidən daxil olmağı xahiş edir.
