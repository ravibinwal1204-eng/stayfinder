import "dotenv/config";
import app from "./app.js";
import { seedIfEmpty } from "./seed.js";

const PORT = process.env.PORT || 5000;

async function start() {
  let mongod;
  const shouldUseMemory =
    (!process.env.MONGODB_URI ||
      process.env.MONGODB_URI.includes("127.0.0.1:27017") ||
      process.env.MONGODB_URI.includes("localhost:27017")) &&
    process.env.NODE_ENV !== "production";

  if (shouldUseMemory) {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    mongod = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongod.getUri();
    console.log("Using in-memory MongoDB:", process.env.MONGODB_URI);
  }

  if (process.env.SEED_DB === "true") {
    const { connectDB } = await import("./config/db.js");
    await connectDB();
    await seedIfEmpty();
  }

  const server = app.listen(PORT, () => {
    console.log(`StayFinder API → http://localhost:${PORT}`);
    console.log(`Health check → http://localhost:${PORT}/api/health`);
  });

  process.on("SIGINT", async () => {
    server.close(() => console.log("Server closed"));
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
