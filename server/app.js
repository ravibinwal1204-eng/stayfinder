import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import { ensureUploadsDir } from "./utils/saveImage.js";
import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

ensureUploadsDir();

function getAllowedOrigins() {
  const origins = ["http://localhost:5173", "http://localhost:4173"];
  if (process.env.CLIENT_URL) origins.push(process.env.CLIENT_URL);
  if (process.env.VERCEL_URL) origins.push(`https://${process.env.VERCEL_URL}`);
  return [...new Set(origins)];
}

app.use(
  cors({
    origin: getAllowedOrigins(),
    credentials: true,
  })
);
app.use(express.json({ limit: "12mb" }));

// Keep serving legacy local uploads for images saved before Cloudinary migration
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure MongoDB is connected before handling API requests (serverless-safe)
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "StayFinder API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/contact", contactRoutes);

// Serve Vite build in production when running as a standalone server
const distPath = path.join(__dirname, "..", "dist");
app.use(express.static(distPath));
app.get(/^(?!\/api).*/, (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) res.status(404).json({ success: false, message: "Not found" });
  });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message || "Server error" });
});

export default app;
