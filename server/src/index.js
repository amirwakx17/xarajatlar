import express from "express";
import cookieParser from "cookie-parser";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import authRoutes from "./routes/auth.js";
import categoriesRoutes from "./routes/categories.js";
import summaryRoutes from "./routes/summary.js";
import transactionsRoutes from "./routes/transactions.js";
import { requireAuth } from "./auth.js";
import { deleteExpired } from "./models/session.js";
import { ensureDemoData } from "./seed.js";
import "./db.js";

const serverRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const distDir = path.resolve(serverRoot, "..", "client", "dist");
const port = Number(process.env.PORT) || 4000;

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

deleteExpired();
if (ensureDemoData()) {
  console.log("Bo'sh baza aniqlandi: demo hisob va namuna yozuvlar yaratildi.");
}

app.get("/api/healthz", (req, res) => {
  res.type("text/plain").send("ok");
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", requireAuth, transactionsRoutes);
app.use("/api/categories", requireAuth, categoriesRoutes);
app.use("/api/summary", requireAuth, summaryRoutes);

app.use("/api", (req, res) => {
  res.status(404).json({ error: "not_found" });
});

if (existsSync(distDir)) {
  app.use(express.static(distDir, { index: false }));
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    res.sendFile(path.join(distDir, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.type("text/plain").send("API ishlamoqda. Frontend uchun: npm run dev");
  });
}

app.use((err, req, res, next) => {
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ error: "invalid_json" });
  }
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "server_error" });
});

app.listen(port, () => {
  console.log(`Server ishga tushdi: http://localhost:${port}`);
});
