# 📖 Student Viva & Modification Guide: Quran & Tafseer App
**Web Technologies (CSC336) — Step-by-Step Practical Manual**

Welcome! This guide is written specifically for you as a student. If your professor or lab examiner asks you:
- *"Where is this data coming from?"*
- *"Show me how the API works"*
- *"Change the Surah grid to 3 fixed columns right now"*
- *"Change the page limit to 10 Ayahs instead of 20"*

...this document tells you **exactly what to do, where to do it, and how to explain it**.

---

## 📑 Table of Contents
1. [The Big Picture: How the App Works](#1-the-big-picture)
2. [Project Folder Structure](#2-project-folder-structure)
3. [The Backend: APIs & Controller](#3-the-backend-apis--controller)
4. [The Frontend: Components & State](#4-the-frontend-components--state)
5. [CSS Grid & Flexbox: Changing Columns & Layout](#5-css-grid--flexbox-changing-columns--layout)
6. [Live Viva Modifications (Practice These!)](#6-live-viva-modifications)
7. [Examiner Q&A Cheat Sheet](#7-examiner-qa-cheat-sheet)

---

## 1. The Big Picture

```
┌────────────────────────────────────────────────────────┐
│                   Browser (React)                      │
│   • SurahList: shows cards in a CSS Grid               │
│   • AyahList: shows Arabic, Translation & Tafseer      │
│   • Pagination: Prev / Next buttons                    │
└──────────────────────────┬─────────────────────────────┘
                           │ fetch("/api/...")
                           ▼
┌────────────────────────────────────────────────────────┐
│               Node.js + Express Server                 │
│   • server/src/routes/quran.routes.js (Route URLs)     │
│   • server/src/controllers/quran.controller.js (Logic) │
│   • server/src/services/quranData.js (Cache & Loader)  │
└──────────────────────────┬─────────────────────────────┘
                           │ reads at startup
                           ▼
┌────────────────────────────────────────────────────────┐
│                   server/data/                         │
│   • surah.json (metadata for all 114 Surahs)           │
│   • ayah.json (Arabic text, Urdu translation, Tafseer) │
└────────────────────────────────────────────────────────┘
```

**Key Principle required by the exam paper:**
> *The frontend NEVER imports `surah.json` or `ayah.json` directly. Everything is loaded on the server disk once at startup, and the frontend fetches small, optimized pieces via HTTP GET requests.*

---

## 2. Project Folder Structure

Here is what every file does in plain words:

```
quran-app/
│
├── package.json               <-- Root configuration (starts everything on port 3000)
├── STUDENT_VIVA_GUIDE.md      <-- This guide!
│
├── server/                    <-- BACKEND (Node.js & Express)
│   ├── index.js               <-- Starts the server on port 3000, connects Vite in dev
│   ├── data/
│   │   ├── surah.json         <-- Database file: list of 114 Surahs
│   │   └── ayah.json          <-- Database file: Ayahs with text, translation, Tafseer
│   └── src/
│       ├── app.js             <-- Express app setup, cors(), error handling
│       ├── routes/
│       │   └── quran.routes.js       <-- Defines the API URLs (/api/surahs, etc.)
│       ├── controllers/
│       │   └── quran.controller.js   <-- [IMPORTANT] Business logic for Q1 (A, B, C, D)
│       └── services/
│           └── quranData.js          <-- Reads JSON files from disk into memory (Map/Array)
│
└── client/                    <-- FRONTEND (React & Vite)
    ├── index.html             <-- HTML entry point
    └── src/
        ├── App.jsx            <-- Main parent component: holds state (selectedSurah, page)
        ├── services/
        │   └── api.js         <-- Helper functions with fetch() calls to the backend
        ├── components/
        │   ├── SurahList.jsx  <-- [Q2-A] Grid of Surah cards + Search bar
        │   ├── AyahList.jsx   <-- [Q2-B] Displays Arabic text, Translation & Tafseer
        │   └── Pagination.jsx <-- [Q2-C] Flexbox Previous & Next buttons
        └── styles/
            └── index.css      <-- [Q3] CSS Grid (.surah-grid) & Flexbox (.pagination)
```

---

## 3. The Backend: APIs & Controller

All backend request logic lives in **`server/src/controllers/quran.controller.js`**.

### The 3 APIs:

| Route | Method | Purpose | Exam Question |
|---|---|---|---|
| `/api/surahs` | GET | Returns all 114 Surahs (only displayed fields) | Question 1-A |
| `/api/surahs/:number` | GET | Returns single Surah by number (e.g. `/api/surahs/1`) | Question 1-B |
| `/api/surahs/:number/ayahs?page=1&limit=20` | GET | Returns paginated Ayahs (max 20 per request) | Question 1-C & 1-D |

### How to test them right in your browser:
Open your browser and navigate to:
- `http://localhost:3000/api/health` -> should show `{"status":"ok"}`
- `http://localhost:3000/api/surahs` -> returns the array of 114 Surahs
- `http://localhost:3000/api/surahs/1` -> returns Surah Al-Fatihah
- `http://localhost:3000/api/surahs/1/ayahs?page=1&limit=5` -> returns first 5 Ayahs of Al-Fatihah

---

## 4. The Frontend: Components & State

In React, data flows from the top down (**`App.jsx`** -> child components).

### How `App.jsx` controls everything:
In `client/src/App.jsx`:
```javascript
const [surahs, setSurahs] = useState([]);         // All surahs from /api/surahs
const [selectedSurah, setSelectedSurah] = useState(null); // e.g. 1 (Al-Fatihah)
const [ayahData, setAyahData] = useState(null);   // Response containing { ayahs, page, totalPages }
const [page, setPage] = useState(1);              // Current page number (1, 2, 3...)
```

1. **When page first opens (`useEffect` #1)**:
   Calls `fetchSurahs()` -> stores the 114 Surahs in `surahs` -> renders `<SurahList />`.
2. **When user clicks a Surah card**:
   Runs `handleSelectSurah(number)` -> sets `selectedSurah = number` and resets `page = 1`.
3. **When `selectedSurah` or `page` changes (`useEffect` #2)**:
   Calls `fetchAyahs(selectedSurah, page)` -> stores response in `ayahData` -> renders `<AyahList />` and `<Pagination />`.

---

## 5. CSS Grid & Flexbox: Changing Columns & Layout

All styling lives in **`client/src/styles/index.css`**.

### Question 3 Requirement:
- **CSS Grid** is used for two-dimensional multi-item layout (the Surah Cards).
- **Flexbox** is used for one-dimensional layouts (Pagination bar, header, card header).

### How to Change the Columns of Surah Cards:
Find `.surah-grid` in `client/src/styles/index.css` around **line 2**:

#### 1. Current Auto-Fill Responsive Grid:
```css
.surah-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}
```
*What this means*: It automatically fills as many columns as will fit on the user's screen, with a minimum card width of 240px.

#### 2. Change to Exactly 3 Columns:
```css
.surah-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
  gap: 1rem;
}
```

#### 3. Change to Exactly 4 Columns:
```css
.surah-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 equal columns */
  gap: 1.25rem;
}
```

#### 4. Change to Exactly 2 Columns:
```css
.surah-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 equal columns */
  gap: 1rem;
}
```

---

## 6. Live Viva Modifications (Practice These!)

During your viva, the examiner will likely say: *"Open file X and change Y right in front of me."*
Here is the cheat-sheet for the most common requests:

---

### Task 1: "Change pagination from 20 Ayahs per page to 10"
- **File**: `server/src/controllers/quran.controller.js`
- **Location**: Line 69 (inside `getSurahAyahs` function)
- **Change**:
```javascript
// BEFORE:
const limit = Math.min(Math.max(!isNaN(rawLimit) ? rawLimit : 20, 1), 20);

// AFTER (change 20 to 10):
const limit = Math.min(Math.max(!isNaN(rawLimit) ? rawLimit : 10, 1), 10);
```
- **Also in Client**: `client/src/services/api.js` line 16:
```javascript
// Change default limit from 20 to 10:
export const fetchAyahs = (number, page = 1, limit = 10) =>
  request(`/api/surahs/${number}/ayahs?page=${page}&limit=${limit}`);
```

---

### Task 2: "Display the Revelation Order on each Surah Card"
1. **Backend**: Open `server/src/controllers/quran.controller.js` line 11 (inside `getSurahList`):
```javascript
const list = surahs.map((s) => ({
  number: s.SurahNumber,
  nameArabic: s.NameArabic,
  nameEnglish: s.NameEnglish,
  nameMeaning: s.NameMeaning,
  ayahCount: s.AyahCount,
  type: s.Type,
  revelationOrder: s.RevelationOrder, // <-- ADD THIS LINE
}));
```

2. **Frontend**: Open `client/src/components/SurahList.jsx` inside the card body or footer:
```jsx
<span className="surah-revelation">Rev: #{s.revelationOrder}</span>
```

---

### Task 3: "Change the Surah card background color when selected"
- **File**: `client/src/styles/index.css`
- **Search for**: `.surah-card.selected`
```css
.surah-card.selected {
  border: 2px solid #2563eb;       /* Change from green to blue */
  background: #eff6ff;             /* Light blue background */
}
```

---

### Task 4: "Make the Arabic font bigger or smaller"
- **File**: `client/src/styles/index.css`
- **Search for**: `.ayah-arabic`
```css
.ayah-arabic {
  font-size: 2.2rem; /* Increase from 1.95rem to 2.2rem */
  line-height: 2.5;
}
```

---

### Task 5: "Change the Next / Previous buttons text"
- **File**: `client/src/components/Pagination.jsx`
```jsx
// Change:
<button className="pagination-btn">Previous</button>
// To:
<button className="pagination-btn">← Back</button>
```

---

## 7. Examiner Q&A Cheat Sheet

### Q1: "Why don't we just import `ayah.json` in React directly using `import ayahs from './ayah.json'`?"
> **Answer**: *"`ayah.json` is a huge file containing thousands of verses. If we import it in React, the browser would have to download multiple megabytes on initial page load, which would destroy mobile performance and waste user data. In our architecture, the server loads `ayah.json` once into RAM, and only sends small chunks of up to 20 Ayahs over the network using pagination."*

### Q2: "How does pagination prevent crashing if a user requests page 999?"
> **Answer**: *"In `quran.controller.js`, we calculate `totalPages = Math.ceil(totalAyahs / limit)`. Then we constrain the requested page with `Math.min(Math.max(requestedPage, 1), totalPages)`. So if someone requests page 999 on a 7-verse Surah, it safely clamps to page 1 and returns the correct data without crashing."*

### Q3: "What happens if a user enters an invalid Surah number like `/api/surahs/999`?"
> **Answer**: *"The controller checks `const surah = getSurahByNumber(number)`. If it returns null, the server sends an HTTP 404 status with `{ error: 'Surah with number 999 was not found.' }`. If the user passes non-numeric text like `/api/surahs/abc`, it returns HTTP 400 with `{ error: 'Invalid Surah number' }`."*

### Q4: "Explain the difference between CSS Grid and Flexbox in your application."
> **Answer**:
> - *"We used **CSS Grid** for `.surah-grid` because it is a **two-dimensional** layout with both rows and columns that automatically adapts cards across screen widths."*
> - *"We used **Flexbox** for `.pagination` and header elements because they are **one-dimensional** (either a horizontal row or vertical stack) where we need simple alignment like `justify-content: space-between`."*

### Q5: "Where are `<div>` vs `<span>` tags used and why?"
> **Answer**:
> - *"Per HTML semantic rules and exam Question 3, **`<div>`** is a block-level element used for structural layout sections (cards, banner containers, grid rows).*
> - *"**`<span>`** is an inline element used inside blocks for inline metadata that does not start on a new line (Surah number circle, type badge, ayah count label)."*

---
*Good luck with your viva! You have full mastery of this project.*
