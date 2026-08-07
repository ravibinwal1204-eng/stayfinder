import fs from "fs";
import path from "path";
import { Buffer } from "buffer";
import { PassThrough } from "stream";
import { fileURLToPath } from "url";
import { cloudinary, configureCloudinary, isCloudinaryConfigured } from "../config/cloudinary.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS = path.join(__dirname, "..", "uploads");

export function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS)) fs.mkdirSync(UPLOADS, { recursive: true });
}

async function uploadToCloudinary(input, resourceType = "image") {
  if (!configureCloudinary()) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }

  if (typeof input === "string") {
    const result = await cloudinary.uploader.upload(input, {
      folder: "stayfinder",
      resource_type: resourceType,
    });
    return result.secure_url;
  }

  if (input && typeof input === "object" && Buffer.isBuffer(input.buffer)) {
    return new Promise((resolve, reject) => {
      const stream = new PassThrough();
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "stayfinder",
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      stream.end(input.buffer);
      stream.pipe(uploadStream);
    });
  }

  throw new Error(`Unsupported ${resourceType} input for Cloudinary upload.`);
}

async function saveLocally(input) {
  ensureUploadsDir();

  if (typeof input === "string") {
    const match = input.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!match) return null;
    const ext = match[1] === "jpeg" ? "jpg" : match[1];
    const buf = Buffer.from(match[2], "base64");
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    fs.writeFileSync(path.join(UPLOADS, name), buf);
    return `/uploads/${name}`;
  }

  if (input && typeof input === "object" && Buffer.isBuffer(input.buffer)) {
    const ext = path.extname(input.originalname || "").slice(1) || "jpg";
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    fs.writeFileSync(path.join(UPLOADS, name), input.buffer);
    return `/uploads/${name}`;
  }

  return null;
}

/** Save media to Cloudinary when configured, otherwise fall back to local storage. */
export async function resolveMediaUrl(input, resourceType = "image") {
  if (!input) return null;
  if (typeof input === "string") {
    if (input.startsWith("http://") || input.startsWith("https://")) return input;
    if (!input.startsWith("data:image")) return input;
  }

  if (isCloudinaryConfigured()) {
    return uploadToCloudinary(input, resourceType);
  }

  // Local fallback for development without Cloudinary credentials
  console.warn(`Cloudinary not configured — saving ${resourceType} locally to server/uploads/`);
  return saveLocally(input);
}

export async function resolveImageUrl(input) {
  return resolveMediaUrl(input, "image");
}

export async function resolveImageList(images) {
  if (!Array.isArray(images)) return [];
  const out = [];
  for (const img of images) {
    const url = await resolveImageUrl(img);
    if (url) out.push(url);
  }
  return out;
}

export async function resolveVideoList(videos) {
  if (!Array.isArray(videos)) return [];
  const out = [];
  for (const video of videos) {
    const url = await resolveMediaUrl(video, "video");
    if (url) out.push(url);
  }
  return out;
}
