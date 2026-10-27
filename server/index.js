import app from "./src/app.js";
import { loadData } from "./src/services/quranData.js";

const PORT = process.env.PORT || 5000;

// Load JSON files once at startup so requests don't re-read the disk.
loadData();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
