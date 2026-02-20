/**
 * Vercel entry: serves backend API + frontend static app.
 * Only used when VERCEL=1; local dev runs backend and frontend separately.
 */
import path from "path";
import { fileURLToPath } from "url";
import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { default: app } = await import("./backend/dist/src/index.js");

// Serve frontend static files and SPA fallback (after API routes)
app.use(express.static(path.join(__dirname, "frontend/dist")));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
});

export default app;
