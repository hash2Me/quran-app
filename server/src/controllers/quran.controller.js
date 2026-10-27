import {
  getSurahs,
  getSurahByNumber,
  getAyahsBySurah,
} from "../services/quranData.js";

// Q1-A: Return only the fields needed for UI display
export function getSurahList(req, res) {
  try {
    const surahs = getSurahs();
    const list = surahs.map((s) => ({
      number: s.SurahNumber,
      nameArabic: s.NameArabic,
      nameEnglish: s.NameEnglish,
      nameMeaning: s.NameMeaning,
      ayahCount: s.AyahCount,
      type: s.Type,
    }));
    return res.json(list);
  } catch (error) {
    return res.status(500).json({ error: "Failed to load surah list" });
  }
}

// Q1-B: Validate :number, return 404 with a meaningful message if not found
export function getSingleSurah(req, res) {
  const number = parseInt(req.params.number, 10);

  if (isNaN(number) || number < 1) {
    return res.status(400).json({ error: "Invalid Surah number. Must be a positive integer." });
  }

  const surah = getSurahByNumber(number);
  if (!surah) {
    return res.status(404).json({ error: `Surah with number ${number} was not found.` });
  }

  return res.json({
    number: surah.SurahNumber,
    nameArabic: surah.NameArabic,
    nameEnglish: surah.NameEnglish,
    nameMeaning: surah.NameMeaning,
    ayahCount: surah.AyahCount,
    type: surah.Type,
    rukuCount: surah.RukuCount,
    revelationOrder: surah.RevelationOrder,
  });
}

// Q1-C + Q1-D: Filter by surah, paginate (max 20), return only needed fields
// Shape: { surah, page, limit, totalAyahs, totalPages, hasPrev, hasNext, ayahs: [...] }
export function getSurahAyahs(req, res) {
  const number = parseInt(req.params.number, 10);

  if (isNaN(number) || number < 1) {
    return res.status(400).json({ error: "Invalid Surah number. Must be a positive integer." });
  }

  const surah = getSurahByNumber(number);
  if (!surah) {
    return res.status(404).json({ error: `Surah with number ${number} was not found.` });
  }

  const surahAyahs = getAyahsBySurah(number);
  const totalAyahs = surahAyahs.length;

  // Maximum 20 ayahs per page per requirement Q1-C
  const rawLimit = parseInt(req.query.limit, 10);
  const limit = Math.min(Math.max(!isNaN(rawLimit) ? rawLimit : 20, 1), 20);

  const totalPages = Math.ceil(totalAyahs / limit) || 1;

  const rawPage = parseInt(req.query.page, 10);
  const requestedPage = !isNaN(rawPage) ? rawPage : 1;
  const page = Math.min(Math.max(requestedPage, 1), totalPages);

  const offset = (page - 1) * limit;
  const slice = surahAyahs.slice(offset, offset + limit);

  // Q1-D: Return only ayah number, Arabic text, translation and Tafseer
  const ayahs = slice.map((a) => ({
    ayahNumber: a.AyahNumber,
    arabic: a.AyahTextMuhammadi || a.AyahTextPdms || a.AyahTextPlain || "",
    translation: a.Translation || "",
    tafseer: a.Tafseer || "",
  }));

  return res.json({
    surah: {
      number: surah.SurahNumber,
      nameArabic: surah.NameArabic,
      nameEnglish: surah.NameEnglish,
      nameMeaning: surah.NameMeaning,
      ayahCount: surah.AyahCount,
      type: surah.Type,
    },
    page,
    limit,
    totalAyahs,
    totalPages,
    hasPrev: page > 1,
    hasNext: page < totalPages,
    ayahs,
  });
}
