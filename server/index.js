import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import { ensureUploadsDir } from "./utils/saveImage.js";
import { seedIfEmpty } from "./seed.js";
import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

ensureUploadsDir();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "12mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "StayFinder API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/contact", contactRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message || "Server error" });
});

async function start() {
  let mongod;
  // Start an in-memory MongoDB when explicitly requested or when the configured
  // MONGODB_URI points to the default localhost instance and we're running in dev.
  const shouldUseMemory = ( !process.env.MONGODB_URI || process.env.MONGODB_URI.includes('127.0.0.1:27017') || process.env.MONGODB_URI.includes('localhost:27017') ) && process.env.NODE_ENV !== "production";
  if (shouldUseMemory) {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    mongod = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongod.getUri();
    console.log("Using in-memory MongoDB:", process.env.MONGODB_URI);
  }

  await connectDB();

  // Only seed samples when explicitly enabled via env var SEED_DB=true
  if (process.env.SEED_DB === "true") {
    await seedIfEmpty();
  }

  const server = app.listen(PORT, () => {
    console.log(`StayFinder API → http://localhost:${PORT}`);
    console.log(`Health check → http://localhost:${PORT}/api/health`);
  });

  // Graceful shutdown: stop in-memory mongod when present
  process.on("SIGINT", async () => {
    server.close(() => {
      console.log("Server closed");
    });
    if (mongod) {
      await mongod.stop();
      console.log("Stopped in-memory MongoDB");
    }
    process.exit(0);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
