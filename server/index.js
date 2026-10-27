import path from "path";
import fs from "fs";
import express from "express";
import { fileURLToPath } from "url";
import app from "./src/app.js";
import { loadData } from "./src/services/quranData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const HOST = "0.0.0.0";

// Load JSON files once at startup so requests don't re-read the disk.
loadData();

const clientRoot = path.resolve(__dirname, "../client");
const clientDist = path.resolve(__dirname, "../client/dist");

async function startServer() {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        root: clientRoot,
        server: {
          middlewareMode: true,
          host: HOST,
          port: PORT,
        },
        appType: "spa",
      });

      // Use vite's connect instance as middleware
      app.use(vite.middlewares);

      // Serve index.html transformed by Vite for any client-side routes
      app.use("*", async (req, res, next) => {
        if (req.originalUrl.startsWith("/api")) return next();
        try {
          const indexHtmlPath = path.resolve(clientRoot, "index.html");
          if (!fs.existsSync(indexHtmlPath)) {
            return next();
          }
          let template = fs.readFileSync(indexHtmlPath, "utf-8");
          template = await vite.transformIndexHtml(req.originalUrl, template);
          res.status(200).set({ "Content-Type": "text/html" }).end(template);
        } catch (e) {
          vite.ssrFixStacktrace(e);
          next(e);
        }
      });
      console.log("[vite] Dev middleware active");
    } catch (err) {
      console.warn("[vite] Could not initialize Vite dev middleware:", err.message);
    }
  }

  // Fallback to static dist if exists
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.use("*", (req, res, next) => {
      if (req.originalUrl.startsWith("/api")) return next();
      res.sendFile(path.resolve(clientDist, "index.html"));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`Quran App server running on http://${HOST}:${PORT}`);
  });
}

startServer();
