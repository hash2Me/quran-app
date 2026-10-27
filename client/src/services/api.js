// All server communication lives here. fetch() with GET only.

async function request(url) {
  const res = await fetch(url);
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}

export const fetchSurahs = () => request("/api/surahs");

export const fetchSurah = (number) => request(`/api/surahs/${number}`);

export const fetchAyahs = (number, page = 1, limit = 20) =>
  request(`/api/surahs/${number}/ayahs?page=${page}&limit=${limit}`);
