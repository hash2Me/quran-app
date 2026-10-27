import { Router } from "express";
import {
  getSurahList,
  getSingleSurah,
  getSurahAyahs,
} from "../controllers/quran.controller.js";

const router = Router();

router.get("/surahs", getSurahList);                // Q1-A
router.get("/surahs/:number", getSingleSurah);      // Q1-B
router.get("/surahs/:number/ayahs", getSurahAyahs); // Q1-C, Q1-D  (?page=1&limit=20)

export default router;
