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

## Final project structure

Top-level layout (important files & folders):

```
stayfinder/
├── server/                 # Express API and backend
│   ├── index.js            # API entrypoint + DB bootstrap & in-memory fallback
│   ├── config/db.js        # Mongoose connection
│   ├── models/             # Mongoose models (User, Property, ContactMessage)
│   ├── routes/             # Route handlers (auth, users, properties, wishlist, contact)
│   ├── middleware/         # auth middleware (JWT protect)
│   ├── utils/              # helpers (saveImage, formatProperty)
│   ├── seed.js             # optional sample data (opt-in via SEED_DB)
│   └── uploads/            # saved image files served statically
├── src/                    # React frontend (Vite)
│   ├── App.jsx             # Single-file demo app (pages, components inline)
│   ├── services/api.js     # API wrapper + token helpers
│   ├── main.jsx            # React entrypoint
│   └── App.css             # Styles
├── .env.example
├── package.json
└── vite.config.js
```

## Development & deployment workflow

Local development:

1. Install deps:

```bash
npm install
```
2. Copy environment and edit `.env` if needed:

```bash
copy .env.example .env
# set MONGODB_URI, JWT_SECRET, CLIENT_URL etc.
```
3. Run app (both frontend + backend):

```bash
npm run dev
```

Notes:
- If no `MONGODB_URI` is provided the server starts an ephemeral in-memory MongoDB (development convenience).
- To seed demo data: `set SEED_DB=true && npm run dev` (Windows CMD) or set `$env:SEED_DB='true'` on PowerShell.

Build & production preview:

```bash
npm run build
npm run preview
```

GitHub / CI notes:
- Keep `mongodb-memory-server` as a dev/test-only dependency used in CI for integration tests.
- For production, configure `MONGODB_URI` to a managed MongoDB (Atlas) and disable in-memory fallback.

## How StayFinder differs from similar demo projects

- Dev-first ergonomics: in-memory MongoDB fallback and opt-in seed data make contributor setup trivial and reproducible.
- Simple image strategy for sample apps: client converts chosen/captured images to Base64 data URLs, server `saveImage` utility decodes and stores files under `server/uploads/`. This keeps the demo self-contained (no external cloud services required).
- Focus on owner-tenant direct connection: UI and backend link `Property.owner` to `User` and show owner contact after login — encourages direct listings without brokers.
- Lightweight single-file React app: `src/App.jsx` keeps the demo compact and easy to inspect; intended for interviews and quick walkthroughs rather than production-scale structure.

## Next recommended improvements (optional)

- Split `src/App.jsx` into components and add React Router for separate pages (improves maintainability).
- Replace base64-in-JSON uploads with multipart/form-data and integrate direct-to-cloud uploads (S3/Cloudinary) for production.
- Add pagination, indexing, and server-side filtering for large datasets.

If you'd like, I can implement any of the recommended improvements—tell me which one to start with and I'll implement it.
