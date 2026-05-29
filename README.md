# StayFinder — Full Stack Rental Marketplace

StayFinder is a full-stack sample application (React + Express + MongoDB) that lets users find and list long-term rental properties. It demonstrates authentication (JWT), profile management including photo uploads, property creation with image handling, and a simple owner dashboard.

This README documents how to run the project, how images are handled, the architecture and data flows, recommended next steps for production, and a comprehensive set of interview talking points and questions you can use when presenting this project.

---

## Highlights of the current codebase

- Frontend: single-file React app at `src/App.jsx` with all UI screens (home, profile, owner dashboard, create property).
- Backend: Express API at `server/` with routes for auth, users, properties, wishlist and contact.
- Image uploads: the backend accepts base64 Data URLs and saves them to `server/uploads/` via `server/utils/saveImage.js`.
- Dev convenience: if `MONGODB_URI` is not provided, the server will start a local in-memory MongoDB automatically (mongodb-memory-server) for development.
- Seeding: sample seeding is opt-in via `SEED_DB=true` to avoid accidental fake listings.

---

## Quick start (development)

Requirements:

- Node.js 18+
- npm
- (Optional) Local MongoDB or Atlas account

Install and run:

```bash
npm install
npm run dev
```

- Frontend: http://localhost:5173/
- Backend: http://localhost:5000/
- Health check: `GET http://localhost:5000/api/health`

If you prefer to run only one side:

```bash
npm run dev:client   # start only frontend (Vite)
npm run dev:server   # start only backend (nodemon)
```

To seed demo data (optional):

Windows CMD:

```cmd
set SEED_DB=true && npm run dev
```

PowerShell:

```powershell
$env:SEED_DB='true'
npm run dev
```

---

## How image uploads work (profile & property images)

1. Frontend: when the user picks a file (Gallery) or captures via camera, the image is converted in the browser to a Base64 data URL.
2. The image data URL is included in the JSON body when saving a profile or creating a property.
3. Backend: `server/utils/saveImage.js` checks if the image string starts with `data:`. If so:
   - It decodes the base64 payload, writes a file into `server/uploads/` with a unique filename, and returns a URL path (e.g., `/uploads/abcd.jpg`).
   - If the image is already an `http`/`https` URL, it is kept as-is.
4. The backend persists the stored image URLs in the `User` or `Property` documents in MongoDB.

Notes & limits:

- The server accepts JSON bodies up to ~12MB (`express.json({ limit: '12mb' })`). For production choose multipart uploads or direct-to-cloud storage (S3, Cloudinary, etc.).
- Uploaded images are served statically by Express from `/uploads`.

---

## UI changes made in this iteration

- The `Upload` button that performed the same action as `Gallery` was removed and replaced by a `Delete` button shown only when a profile photo exists.
- The `Delete` button clears the profile photo and persists the deletion via `PUT /api/users/profile`.
- The small quick-view popup that appeared as a tiny floating white card has been disabled. Property cards and featured slides no longer open that quick modal.

---

## Selected API endpoints

- `POST /api/auth/register` — register (name, email, password, confirmPassword)
- `POST /api/auth/login` — login (email, password) → returns `token`
- `GET /api/auth/me` — get authenticated user profile
- `GET /api/properties` — list properties
- `POST /api/properties` — create property (authenticated)
- `PUT /api/users/profile` — save profile (photo can be `data:` URL or external URL)

---

## Data model overview

- `User` — { name, email, passwordHash, profile: { phone, role, photo, dob, gender, address, city, occupation } }
- `Property` — { title, description, city, location, price, images: [urls], owner, ownerName, amenities, available }

Relationships:

- `Property.owner` references the `User` that created it.
- Property creation saves the owner link so that owner-specific actions work correctly.

---

## How to delete a profile photo

1. Open `Profile` while logged in.
2. If a photo exists, click `Delete` below the avatar.
3. The UI removes the avatar and sends `PUT /api/users/profile` with `photo: null`.

---

## Why the quick-view popup was removed

- It caused inconsistent UX and looked like a small floating white card in some screens.
- A dedicated detail page is a cleaner long-term solution, so the app now keeps browsing/listing simple.

---

## Suggested production improvements

- Move image uploads to a cloud provider (S3, Cloudinary) with signed URL upload flows.
- Use HTTPS and secure, httpOnly cookies for JWTs to reduce XSS risk.
- Add input validation, rate limiting, request size limits, and file type checks.
- Add pagination for property lists and index search fields in MongoDB.
- Split `src/App.jsx` into components and use React Router for page navigation.

---

## Interview talking points

1. Project overview — what the app does and the primary user journeys.
2. Stack choices — React + Vite frontend, Express backend, MongoDB storage.
3. Auth flow — JWTs, token storage in localStorage, protected API routes.
4. Image handling — base64-in-JSON uploads for the sample app, saved to `server/uploads/`.
5. Backend design — user and property models, owner relationship, protected routes.
6. Dev workflow — in-memory DB fallback, opt-in seed data via `SEED_DB=true`.
7. UX changes — remove duplicate upload button, add Delete, disable the quick popup.
8. Production considerations — cloud storage, security, pagination, and route organization.

---

## Manual test flow

1. Run `npm run dev`.
2. Register or log in.
3. Open `Profile` → use `Gallery` or `Camera` → save profile.
4. If a photo exists, click `Delete` to remove it.
5. Set role to `owner`, open `Owner Dashboard`, create a property, and verify it appears in the list.

---

## Troubleshooting

- `Cannot reach server` — make sure the backend is running with `npm run dev:server`.
- MongoDB errors — set `MONGODB_URI` to a reachable MongoDB instance or let the dev server use the in-memory fallback.
- Camera denied — allow camera permission in browser settings; Brave may block it by default.

---

## Useful commands

```bash
npm install
npm run dev
npm run dev:client
npm run dev:server
npm run build
npm run preview
```

---

If you want, I can next:

- split `src/App.jsx` into modular components and add React Router,
- switch uploads to multipart/form-data and integrate Cloudinary,
- or build a dedicated property detail page instead of the old quick popup.
