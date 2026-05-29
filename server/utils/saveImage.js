import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS = path.join(__dirname, "..", "uploads");

export function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS)) fs.mkdirSync(UPLOADS, { recursive: true });
}

/** Save base64 data URL or return http(s) URL as-is */
export async function resolveImageUrl(input) {
  if (!input || typeof input !== "string") return null;
  if (input.startsWith("http://") || input.startsWith("https://")) return input;
  if (!input.startsWith("data:image")) return input;

  ensureUploadsDir();
  const match = input.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!match) return null;
  const ext = match[1] === "jpeg" ? "jpg" : match[1];
  const buf = Buffer.from(match[2], "base64");
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = path.join(UPLOADS, name);
  fs.writeFileSync(filePath, buf);
  return `/uploads/${name}`;
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
