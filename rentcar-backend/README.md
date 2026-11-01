# Rent a Car — Backend

Node.js + Express + SQLite + JWT. Ayrıca baza proqramı quraşdırmaq lazım deyil (baza `data/rentcar.db` faylıdır).

## İşə salmaq

Əvvəlcə kompüterdə **Node.js (LTS, 22.13 və ya daha yeni)** quraşdırılmalıdır: https://nodejs.org

Baza üçün Node-un daxili SQLite modulundan istifadə olunur, ona görə Python və ya əlavə build alətləri lazım deyil. Terminalda `node -v` yazıb versiyanı yoxlaya bilərsən.

```bash
cd rentcar-backend
npm install        # yalnız bir dəfə
npm run seed       # test məlumatlarını yaradır (15 maşın: 5 hibrid, 5 elektrik, 5 sport)
npm run dev        # serveri başladır -> http://localhost:5000
```

- `npm run seed` istənilən vaxt bazanı ilkin vəziyyətə qaytarır (demo-dan əvvəl faydalıdır).
- Server işləyəndə terminalı bağlama. Frontend üçün **ayrıca ikinci terminal** aç.
- Yoxlamaq üçün brauzerdə aç: http://localhost:5000/api/cars
- Marka ilə axtarış: http://localhost:5000/api/cars?search=tesla
- Kateqoriya ilə: http://localhost:5000/api/cars?category=sport

## Maşın şəkilləri

Hər maşın üçün avtomatik şəkil yaradılır (`public/images/` qovluğunda). Real foto qoymaq istəyirsənsə:

1. Şəkli internetdən yüklə (məs. Google Images və ya Wikimedia Commons).
2. Adını bu formada dəyiş və `public/images/` qovluğuna at: `bmw-m4.jpg`, `tesla-model-y.jpg`, `toyota-prius.jpg` və s. (`npm run seed` bütün adları terminalda göstərir). Format: jpg, png və ya webp.
3. `npm run seed` işlət. Bu, real şəkli tapıb avtomatik istifadə edəcək.

Başqa üsul: admin paneldən maşını redaktə edib `image` sahəsinə şəklin tam linkini yaz.

Şəkillər `http://localhost:5000/images/...` ünvanından verilir və API cavablarında artıq tam ünvanla gəlir, frontend-də birbaşa `<img src={car.image} />` yazmaq kifayətdir.

## Test hesabları

| Rol | Email | Parol |
|---|---|---|
| Admin | `.env` faylındakı `ADMIN_EMAIL` | `.env` faylındakı `ADMIN_PASSWORD` |
| İstifadəçi | user@rentcar.az | user123 |
| İstifadəçi | leyla@rentcar.az | user123 |

## Token necə işləyir

Login/Register cavabında `token` qayıdır. Qorunan ünvanlara sorğuda bu header göndərilir:

```
Authorization: Bearer <token>
```

Frontend-də token Redux-da (`authSlice`) və `localStorage`-də saxlanır, RTK Query `baseQuery` hər sorğuya özü əlavə edir.

## API siyahısı

Əsas ünvan: `http://localhost:5000/api`

### Auth
| Metod | Ünvan | Göndərilən (body) | Kim |
|---|---|---|---|
| POST | `/auth/register` | `{ name, email, password }` | hamı |
| POST | `/auth/login` | `{ email, password }` | hamı |
| GET | `/auth/me` | — | giriş etmiş |
| PUT | `/auth/profile` | `{ name?, password? }` | giriş etmiş |

Cavab (register/login): `{ token, user: { id, name, email, role } }`

### Maşınlar
| Metod | Ünvan | Body / Query | Kim |
|---|---|---|---|
| GET | `/cars` | query: `search` (marka və ya model adı), `brand`, `category`, `fuel`, `transmission`, `minPrice`, `maxPrice`, `available` | hamı |
| GET | `/cars/brands` | — | hamı |
| GET | `/cars/:id` | — | hamı |
| GET | `/cars/:id/booked-dates` | — | hamı |
| POST | `/cars` | `{ brand, model, year, pricePerDay, fuel?, transmission?, seats?, category?, image?, description?, engine?, horsepower?, acceleration?, available? }` | admin |
| PUT | `/cars/:id` | yuxarıdakı sahələrdən istənilənləri | admin |
| DELETE | `/cars/:id` | — | admin |

Maşın obyekti: `{ id, brand, model, year, pricePerDay, fuel, transmission, seats, category, image, description, engine, horsepower, acceleration, available }`

`engine` mühərrikin mətni (məs. `"2.5L hibrid"`), `horsepower` at gücü, `acceleration` 0-100 km/s sürətlənmə (saniyə). Bu üçü detal səhifəsində göstərilir.

İcazə verilən dəyərlər:
- `fuel`: `petrol`, `diesel`, `hybrid`, `electric`
- `transmission`: `automatic`, `manual`
- `category`: `hybrid`, `electric`, `sport`

### Rezervasiyalar
| Metod | Ünvan | Body | Kim |
|---|---|---|---|
| POST | `/bookings` | `{ carId, startDate, endDate }` (format `YYYY-MM-DD`) | giriş etmiş |
| GET | `/bookings/my` | — | giriş etmiş (öz sifarişləri) |
| PATCH | `/bookings/:id/cancel` | — | sahibi (yalnız `pending` olanı) |
| GET | `/bookings` | query: `status?` | admin |
| PATCH | `/bookings/:id/status` | `{ status }` | admin |

`status` dəyərləri: `pending` (gözləyir), `approved` (təsdiqlənib), `cancelled` (ləğv edilib)

Qiymət avtomatik hesablanır: `gün sayı × günlük qiymət` (başlama və bitmə günü daxil). Tarixlər üst-üstə düşsə `409` xətası qayıdır.

Rezervasiya obyekti: `{ id, carId, userId, startDate, endDate, totalPrice, status, createdAt, car: {...}, user: {...} }`

### İstifadəçilər (yalnız admin)
| Metod | Ünvan | Body |
|---|---|---|
| GET | `/users` | — |
| PATCH | `/users/:id/role` | `{ role: "user" \| "admin" }` |
| DELETE | `/users/:id` | — |

### Statistika (yalnız admin)
`GET /stats` → `{ totalCars, availableCars, totalUsers, totalBookings, pendingBookings, approvedBookings, cancelledBookings, revenue }`

## Xəta cavabları

Hər xəta bu formatda qayıdır: `{ "message": "Xəta mətni" }`

| Kod | Mənası |
|---|---|
| 400 | Göndərilən məlumat düzgün deyil |
| 401 | Giriş edilməyib / token etibarsızdır |
| 403 | Admin icazəsi yoxdur |
| 404 | Tapılmadı |
| 409 | Konflikt (email artıq var, tarixlər məşğuldur) |

## RTK Query nümunəsi (frontend üçün)

```ts
// src/services/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Car', 'Booking', 'User'],
  endpoints: (build) => ({
    getCars: build.query<Car[], Record<string, string> | void>({
      query: (params) => ({ url: '/cars', params: params ?? undefined }),
      providesTags: ['Car'],
    }),
    login: build.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    createBooking: build.mutation<Booking, { carId: number; startDate: string; endDate: string }>({
      query: (body) => ({ url: '/bookings', method: 'POST', body }),
      invalidatesTags: ['Booking'],
    }),
  }),
});

export const { useGetCarsQuery, useLoginMutation, useCreateBookingMutation } = api;
```

## Qovluq strukturu

```
src/
  server.js           giriş nöqtəsi
  db.js               baza və cədvəllər
  seed.js             test məlumatları
  middleware/auth.js  token yoxlama, admin yoxlama
  routes/             auth, cars, bookings, users, stats
```

## Deploy (sonda)

Render.com-da Web Service kimi yerləşdirmək olar. Mühit dəyişəni: `JWT_SECRET` (uzun təsadüfi mətn). Başlatma əmri: `npm start`. Qeyd: pulsuz planda fayl sistemi sıfırlana bilər, ona görə deploy-dan sonra bir dəfə seed işlətmək lazım ola bilər (bunu birlikdə edərik).
