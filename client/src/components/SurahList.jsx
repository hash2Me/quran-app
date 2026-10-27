import React, { useState, useMemo } from "react";

// Q2-A & Q3: Render surahs inside a CSS Grid container with search and filters.
export default function SurahList({ surahs, selected, onSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredSurahs = useMemo(() => {
    if (!surahs) return [];
    return surahs.filter((s) => {
      const matchesType =
        filterType === "all" ||
        (s.type && s.type.toLowerCase() === filterType.toLowerCase());

      if (!matchesType) return false;

      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase().trim();
      const numMatch = String(s.number).includes(term);
      const enMatch = s.nameEnglish && s.nameEnglish.toLowerCase().includes(term);
      const arMatch = s.nameArabic && s.nameArabic.includes(term);
      const meaningMatch = s.nameMeaning && s.nameMeaning.toLowerCase().includes(term);

      return numMatch || enMatch || arMatch || meaningMatch;
    });
  }, [surahs, searchTerm, filterType]);

  if (!surahs || surahs.length === 0) {
    return <p className="loading-notice">Loading surahs...</p>;
  }

  return (
    <section className="surah-section">
      <div className="section-header">
        <h2>Surahs ({surahs.length})</h2>
        <span className="section-hint">Select a Surah to read its Ayahs</span>
      </div>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.25rem", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ flex: "1 1 240px", position: "relative" }}>
          <input
            type="text"
            aria-label="Search Surahs"
            placeholder="Search by name, number, or meaning..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 0.9rem",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "0.95rem",
              outline: "none",
              backgroundColor: "#ffffff",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
            }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9ca3af",
                fontWeight: "bold",
                fontSize: "1rem"
              }}
            >
              ✕
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["all", "meccan", "medinan"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilterType(t)}
              style={{
                padding: "0.45rem 0.9rem",
                borderRadius: "20px",
                border: filterType === t ? "1px solid #15803d" : "1px solid #e5e7eb",
                backgroundColor: filterType === t ? "#15803d" : "#ffffff",
                color: filterType === t ? "#ffffff" : "#4b5563",
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer",
                textTransform: "capitalize",
                transition: "all 0.2s ease"
              }}
            >
              {t === "all" ? `All (${surahs.length})` : t}
            </button>
          ))}
        </div>
      </div>

      {filteredSurahs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2.5rem", color: "#6b7280", background: "#ffffff", borderRadius: "8px", border: "1px dashed #d1d5db" }}>
          No Surahs matching "{searchTerm}". Try clearing your search.
        </div>
      ) : (
        <div className="surah-grid">
          {filteredSurahs.map((s) => {
            const isSelected = selected === s.number;
            const typeClass = s.type ? s.type.toLowerCase() : "";
            return (
              <div
                key={s.number}
                className={`surah-card ${isSelected ? "selected" : ""}`}
                onClick={() => onSelect(s.number)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(s.number);
                  }
                }}
              >
                <div className="surah-card-header">
                  <span className="surah-number">{s.number}</span>
                  <span className={`surah-type ${typeClass}`}>
                    {s.type}
                  </span>
                </div>

                <div className="surah-card-body">
                  <span className="surah-name-english">{s.nameEnglish}</span>
                  <span className="surah-name-arabic">{s.nameArabic}</span>
                </div>

                <div className="surah-card-footer">
                  <span className="surah-meaning">{s.nameMeaning}</span>
                  <span className="surah-ayah-count">{s.ayahCount} Ayahs</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
