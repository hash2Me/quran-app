import { useEffect, useState, useRef } from "react";
import { fetchSurahs, fetchAyahs } from "./services/api.js";
import SurahList from "./components/SurahList.jsx";
import AyahList from "./components/AyahList.jsx";
import Pagination from "./components/Pagination.jsx";

export default function App() {
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [ayahData, setAyahData] = useState(null); // server response for current page
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const readerRef = useRef(null);

  // Q2-A: Load Surah list once on mount
  useEffect(() => {
    fetchSurahs()
      .then((data) => {
        setSurahs(data);
        setError("");
      })
      .catch((e) => setError(e.message));
  }, []);

  // Q2-B / Q2-C: Fetch ayahs from GET API when surah or page changes
  useEffect(() => {
    if (!selectedSurah) return;
    setLoading(true);
    setError("");
    fetchAyahs(selectedSurah, page)
      .then((data) => {
        setAyahData(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [selectedSurah, page]);

  const handleSelectSurah = (number) => {
    setSelectedSurah(number);
    setPage(1);
    setAyahData(null);

    // Smooth scroll down to reader on mobile/desktop
    setTimeout(() => {
      if (readerRef.current) {
        readerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-container">
          <div>
            <h1>Quran &amp; Tafseer</h1>
            <p className="header-tagline">Explore Surahs, Ayahs, Translations &amp; Tafseer</p>
          </div>
          {selectedSurah && (
            <button
              type="button"
              className="scroll-top-btn"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Browse Surahs
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {error && <div className="error">{error}</div>}

        <SurahList
          surahs={surahs}
          selected={selectedSurah}
          onSelect={handleSelectSurah}
        />

        {selectedSurah && (
          <section className="reader" ref={readerRef}>
            <AyahList data={ayahData} loading={loading} />
            <Pagination data={ayahData} onPageChange={setPage} />
          </section>
        )}
      </main>
    </div>
  );
}
