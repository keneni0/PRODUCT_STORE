/**
 * Vercel entry: serves backend API + frontend static app.
 * Only used when VERCEL=1; local dev runs backend and frontend separately.
 */
import path from "path";
import { fileURLToPath } from "url";
import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// On Vercel, skip loading backend if critical env vars are missing (avoids crash at import)
const isVercel = process.env.VERCEL === "1";
const hasRequiredEnv =
  process.env.DATABASE_URL && (process.env.CLERK_SECRET_KEY || process.env.CLERK_PUBLISHABLE_KEY);

let app;
if (isVercel && !hasRequiredEnv) {
  app = express();
  app.use(express.json());
  app.all("/api/*", (req, res) => {
    res.status(503).json({
      error: "FUNCTION_INVOCATION_FAILED",
      message: "Server not configured.",
      hint: "Set DATABASE_URL, CLERK_SECRET_KEY, and CLERK_PUBLISHABLE_KEY in Vercel → Project Settings → Environment Variables (Production + Preview), then redeploy.",
    });
  });
  app.use(express.static(path.join(__dirname, "frontend/dist")));
  app.get("*", (req, res) => {
    try {
      res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
} else {
  try {
    const backend = await import("./backend/dist/src/index.js");
    app = backend.default;
    app.use(express.static(path.join(__dirname, "frontend/dist")));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      try {
        res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
      } catch (e) {
        next(e);
      }
    });
  } catch (err) {
    console.error("Serverless function failed to load:", err);
    app = express();
    app.use(express.json());
    app.all("*", (req, res) => {
      const msg = err?.message || String(err);
      const hint =
        msg.includes("Database") || msg.includes("DATABASE_URL")
          ? "Set DATABASE_URL, CLERK_SECRET_KEY, and CLERK_PUBLISHABLE_KEY in Vercel → Project Settings → Environment Variables (Production + Preview)."
          : "Check Vercel Function logs and ensure all env vars are set.";
      res.status(503).json({
        error: "FUNCTION_INVOCATION_FAILED",
        message: "Server failed to start.",
        hint,
        detail: isVercel ? msg : undefined,
      });
    });
  }
}

// On Vercel, wrap so any sync throw returns 500 instead of crashing the function
const handler = isVercel
  ? (req, res) => {
      try {
        app(req, res);
      } catch (e) {
        console.error("Request handler error:", e);
        if (!res.headersSent) res.status(500).json({ error: "Internal Server Error", message: e?.message });
      }
    }
  : app;

export default handler;
