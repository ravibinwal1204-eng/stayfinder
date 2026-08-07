import mongoose from "mongoose";

const globalCache = globalThis;

if (!globalCache._mongoose) {
  globalCache._mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/stayfinder";
  mongoose.set("strictQuery", true);

  if (globalCache._mongoose.conn) {
    return globalCache._mongoose.conn;
  }

  if (!globalCache._mongoose.promise) {
    globalCache._mongoose.promise = mongoose.connect(uri).then((m) => {
      console.log("MongoDB connected:", uri.replace(/\/\/.*@/, "//***@"));
      return m;
    });
  }

  globalCache._mongoose.conn = await globalCache._mongoose.promise;
  return globalCache._mongoose.conn;
}
