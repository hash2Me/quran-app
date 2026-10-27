import React from "react";

// Q2-C & Q3: Previous and Next controls in a Flexbox row.
// Disabled appropriately on first group (page 1) and last group (page == totalPages).
export default function Pagination({ data, onPageChange }) {
  if (!data || data.totalPages <= 1) {
    return null;
  }

  const { page, totalPages, totalAyahs, hasPrev, hasNext } = data;

  const handlePrev = () => {
    if (hasPrev) {
      onPageChange(page - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onPageChange(page + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav className="pagination" aria-label="Ayah Pagination">
      <button
        type="button"
        className="pagination-btn"
        disabled={!hasPrev}
        onClick={handlePrev}
      >
        &larr; <span>Previous</span>
      </button>

      <div className="pagination-info">
        <span className="pagination-pages">
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </span>
        <span className="pagination-total">
          ({totalAyahs} Ayahs in this Surah)
        </span>
      </div>

      <button
        type="button"
        className="pagination-btn"
        disabled={!hasNext}
        onClick={handleNext}
      >
        <span>Next</span> &rarr;
      </button>
    </nav>
  );
}
