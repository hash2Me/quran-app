import React from "react";

// Q2-A & Q3: Render surahs inside a CSS Grid container.
// Uses div for cards and span for inline details (number, type, name, counts).
export default function SurahList({ surahs, selected, onSelect }) {
  if (!surahs || surahs.length === 0) {
    return <p className="loading-notice">Loading surahs...</p>;
  }

  return (
    <section className="surah-section">
      <div className="section-header">
        <h2>Surahs ({surahs.length})</h2>
        <span className="section-hint">Select a Surah to read its Ayahs</span>
      </div>

      <div className="surah-grid">
        {surahs.map((s) => {
          const isSelected = selected === s.number;
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
                <span className={`surah-type ${s.type.toLowerCase()}`}>
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
    </section>
  );
}
