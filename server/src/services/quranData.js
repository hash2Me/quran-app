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
export const getAyahsBySurah = (num) => ayahsBySurah.get(Number(num)) || [];
