import React from "react";

// Q2-B & Q3: Display Quran text, Ayah number, translation and Tafseer
// with a clear visual hierarchy and structural div / inline span tags.
export default function AyahList({ data, loading }) {
  if (loading) {
    return (
      <div className="ayah-loading-state">
        <p>Loading Ayahs from server...</p>
      </div>
    );
  }

  if (!data || !data.ayahs || data.ayahs.length === 0) {
    return null;
  }

  const { surah, page, totalPages, totalAyahs, ayahs } = data;

  return (
    <div className="ayah-section">
      <div className="surah-banner">
        <div className="surah-banner-main">
          <h3>
            <span className="surah-badge">Surah {surah.number}</span>{" "}
            {surah.nameEnglish}
          </h3>
          <span className="surah-banner-arabic">{surah.nameArabic}</span>
        </div>
        <div className="surah-banner-meta">
          <span className="meta-item"><strong>Meaning:</strong> {surah.nameMeaning}</span>
          <span className="meta-separator">•</span>
          <span className="meta-item"><strong>Type:</strong> {surah.type}</span>
          <span className="meta-separator">•</span>
          <span className="meta-item"><strong>Total:</strong> {totalAyahs} Ayahs</span>
          <span className="meta-separator">•</span>
          <span className="meta-item page-pill">Page {page} of {totalPages}</span>
        </div>
      </div>

      <div className="ayah-list">
        {ayahs.map((item) => (
          <div className="ayah-card" key={item.ayahNumber}>
            <div className="ayah-card-top">
              <span className="ayah-badge">Ayah {item.ayahNumber}</span>
            </div>

            <div className="ayah-arabic" dir="rtl" lang="ar">
              {item.arabic}
            </div>

            <div className="ayah-content">
              {item.translation && (
                <div className="ayah-block translation-block">
                  <span className="block-label">Translation</span>
                  <div className="block-text translation-text" dir="rtl">
                    {item.translation}
                  </div>
                </div>
              )}

              {item.tafseer && (
                <div className="ayah-block tafseer-block">
                  <span className="block-label">Tafseer</span>
                  <div className="block-text tafseer-text" dir="rtl">
                    {item.tafseer}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
