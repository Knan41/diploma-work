# RENTCAR: Frontend

React 19 + TypeScript + Vite + Tailwind CSS + Redux Toolkit (RTK Query) + React Router + i18next.

Layihənin tam təsviri, quraşdırma və internetə qoyma təlimatı üçün kökdəki [README.md](../README.md) faylına bax.

## Əmrlər

```bash
npm install      # paketləri qurur
npm run dev      # inkişaf serveri: http://localhost:5173
npm run build    # istehsal versiyası (dist/)
npm run preview  # build-i yoxlamaq üçün
npm run lint     # kod yoxlaması (ESLint)
```

## Ayar

Backend ünvanı `VITE_API_URL` ilə verilir (`.env.example`-a bax). Verilməsə `http://localhost:5000/api` istifadə olunur.

## Struktur

- `src/pages`: səhifələr (`pages/admin`: admin paneli)
- `src/components`: layout, maşın kartı, qorunan route, ümumi komponentlər
- `src/store`: Redux store, `slices/authSlice.ts`, `api/` (RTK Query endpoint-ləri)
- `src/locales`: `az.json`, `en.json` tərcümələri
- `src/utils`: token və xəta yardımçıları
