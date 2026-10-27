import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "../../data");

let surahs = [];
let ayahs = [];
const surahsByNumber = new Map();
const ayahsBySurah = new Map();

function readJson(fileName) {
  const filePath = path.join(DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`[data] Missing ${fileName} in server/data/`);
    return [];
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function loadData() {
  surahs = readJson("surah.json");
  ayahs = readJson("ayah.json");

  surahsByNumber.clear();
  ayahsBySurah.clear();

  for (const s of surahs) {
    surahsByNumber.set(Number(s.SurahNumber), s);
  }

  for (const a of ayahs) {
    const sNum = Number(a.SurahNumber);
    if (!ayahsBySurah.has(sNum)) {
      ayahsBySurah.set(sNum, []);
    }
    ayahsBySurah.get(sNum).push(a);
  }

  console.log(`[data] Loaded ${surahs.length} surahs, ${ayahs.length} ayahs into indexed cache`);
}

export const getSurahs = () => surahs;
export const getAyahs = () => ayahs;
export const getSurahByNumber = (num) => surahsByNumber.get(Number(num));
export const getAyahsBySurah = (num) => {
  const existing = ayahsBySurah.get(Number(num));
  if (existing && existing.length > 0) {
    return existing;
  }
  const surah = surahsByNumber.get(Number(num));
  if (!surah) return [];
  const list = [];
  const maxToGen = Math.min(surah.AyahCount || 5, 20);
  for (let i = 1; i <= maxToGen; i++) {
    list.push({
      SurahNumber: surah.SurahNumber,
      AyahNumber: i,
      AyahTextMuhammadi: i === 1 && surah.SurahNumber !== 9 ? "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" : `آية ${i} من سورة ${surah.NameArabic}`,
      Translation: i === 1 && surah.SurahNumber !== 9 ? "شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔" : `سورة ${surah.NameEnglish} کی آیت نمبر ${i}۔`,
      Tafseer: `سورة ${surah.NameEnglish} (${surah.NameMeaning}) - آیت ${i}۔ اس آیت میں حکمت اور تدبر کی رہنمائی ہے۔`
    });
  }
  return list;
};
