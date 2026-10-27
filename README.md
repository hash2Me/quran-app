# Quran / Tafseer App (CSC336 Lab Starter)

React (Vite) frontend + Node/Express backend.

## Setup
1. Download `surah.json` and `ayah.json` from the Drive link in the exam paper and put them in `server/data/`.
2. `npm run install:all`
3. `npm run dev`
   - Server: http://localhost:5000  (check http://localhost:5000/api/health)
   - Client: http://localhost:5173  (Vite proxies `/api` to the server)

## Structure
```
server/
  index.js                          starts the server
  data/                             surah.json + ayah.json go here (server side only)
  src/
    app.js                          express setup, middleware, error handling
    routes/quran.routes.js          route definitions
    controllers/quran.controller.js request handlers (TODO: Q1 A-D)
    services/quranData.js           loads and caches JSON files from disk
client/
  src/
    App.jsx                         top-level state + layout
    services/api.js                 all fetch() calls
    components/
      SurahList.jsx                 Surah grid (TODO: Q2A, CSS Grid)
      AyahList.jsx                  Ayah display (TODO: Q2B)
      Pagination.jsx                Previous / Next (TODO: Q2C, Flexbox)
    styles/index.css                layout + responsive styles (TODO: Q3)
```
