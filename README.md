# StayFinder

StayFinder is a full-stack long-term rental marketplace. Tenants can discover homes, filter listings, save favourites, and contact owners directly. Property owners can create listings with photos and videos, manage their profile, and publish without brokerage.

## Project Overview

StayFinder uses a React/Vite frontend, an Express API, MongoDB/Mongoose persistence, JWT authentication, and Cloudinary media storage with a local development fallback.

The main user journey is:

1. A visitor browses verified-style rental listings by city, type, BHK, furnishing, budget, or text search.
2. A user registers or logs in. The JWT is stored in the browser and sent with protected API requests.
3. A user can update their profile, choose Tenant or Property Owner, upload a profile photo, or capture one with the camera.
4. An owner opens Owner Dashboard, enters property details, selects amenities, uploads photos, and optionally uploads up to two property videos.
5. The API validates the request, uploads media to Cloudinary when configured, stores media URLs with the property, and returns the new listing.
6. Visitors open a property modal to inspect photos, play videos, view amenities and rental details, and contact the owner after login.

## Features

### Tenant experience

- Home page with hero area, featured listings, city discovery, and rental search.
- Filters for city, property type, BHK, furnishing, price range, and free-text search.
- Property cards with image navigation, ratings, location, rent, and furnishing details.
- Property detail modal with photos, video playback, amenities, deposit, lease term, and owner contact actions.
- Wishlist actions for saving and removing properties.
- Contact page and informational About page.

### Authentication and profiles

- Registration and login with bcrypt password hashing and JWT tokens.
- Protected routes for profile, wishlist, owner dashboard, property creation, and enquiry tracking.
- Profile fields for name, phone, date of birth, gender, address, city, occupation, bio, and role.
- Profile photo Gallery upload, browser camera capture, preview, save, and delete.

### Owner experience

- Owner role selection in the profile.
- Dashboard showing listed properties, views, enquiries, and average rating.
- Property creation form with title, city, locality, rent, deposit, area, type, BHK, furnishing, lease, contact, description, and amenities.
- Multiple property image upload with previews and remove controls.
- Property video upload beside the Photos control with previews, remove controls, `video/*` filtering, and a maximum of two videos per property.
- Owner-specific property listing and deletion actions.

## Technology Choices

- **React 19**: component-based interactive UI with state for filters, forms, authentication, modals, previews, and navigation.
- **Vite**: fast development server, JSX build pipeline, and production bundle generation.
- **Express 5**: small HTTP API with route-level middleware and a single serverless-compatible app export.
- **MongoDB and Mongoose**: document storage for flexible rental data, user profiles, wishlists, enquiries, and media URL arrays.
- **JWT and bcryptjs**: stateless authenticated requests and secure password hashing.
- **Multer**: multipart parsing for binary image and video uploads without converting large files to Base64.
- **Cloudinary**: durable production media storage and CDN delivery. Images use Cloudinary `resource_type: image`; property videos use `resource_type: video`.
- **Local upload fallback**: when Cloudinary credentials are absent in development, media is written to `server/uploads` so the full flow can still be tested.
- **Vercel**: deployment configuration exposes the Express app through `api/index.js`, rewrites `/api/*`, and serves the Vite `dist` output.

## Project Structure

```text
stayfinder/
├── api/index.js                 # Vercel serverless entrypoint
├── server/
│   ├── index.js                 # Local API startup and optional in-memory DB
│   ├── app.js                   # Express app, CORS, DB middleware, routes, static files
│   ├── config/
│   │   ├── cloudinary.js        # Cloudinary configuration
│   │   └── db.js                # Mongoose connection cache
│   ├── middleware/auth.js        # JWT protection middleware
│   ├── models/                  # User, Property, ContactMessage schemas
│   ├── routes/                  # Auth, users, properties, wishlist, contact APIs
│   ├── utils/
│   │   ├── saveImage.js         # Cloudinary/local media resolution
│   │   └── formatProperty.js    # Stable API property shape
│   ├── seed.js                  # Optional demo data seeding
│   └── uploads/                 # Local fallback media directory
├── src/
│   ├── App.jsx                  # Main UI, pages, inline components, and styles
│   ├── services/api.js          # Fetch wrapper, API base URL, and token helper
│   ├── main.jsx                 # React entrypoint
│   └── index.css                # Global stylesheet
├── public/                      # Static public assets
├── package.json                 # Scripts and dependencies
├── vite.config.js               # Vite React config and dev API proxy
├── vercel.json                  # Vercel build, rewrite, and function config
└── README.md
```

## Environment Variables

Create a `.env` file in the project root. Never commit real secrets.

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stayfinder
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173

# Required for production Cloudinary uploads
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Optional when the frontend and API are hosted on different origins
# VITE_API_URL=https://your-api-domain.example.com

# Optional local demo data
SEED_DB=false
```

For local development, `CLIENT_URL=http://localhost:5173` is correct. After deploying the combined frontend and API to Vercel, change it in Vercel to your real URL, for example `CLIENT_URL=https://stayfinder.vercel.app` without a trailing slash. `VITE_API_URL` is compiled into the frontend; leave it empty for same-origin Vercel deployment. During `vite preview`, the client automatically uses `http://localhost:5000` so the preview can talk to the local API. During Vite development, `/api` and `/uploads` are proxied to port 5000.

### MongoDB Atlas production value

The production database is MongoDB Atlas. In Vercel, set `MONGODB_URI` to the Atlas driver connection string, not the local development value:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/stayfinder
```

Create the Atlas database user, allow the Vercel deployment to connect in Atlas Network Access, and URL-encode special characters in the database password. Never commit the Atlas username or password to GitHub.

## Installation and Development

Requirements: Node.js 18 or newer and npm.

```bash
npm install
npm run dev
```

This starts:

- Frontend: `http://localhost:5173`
- API: `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`

The local server uses `mongodb-memory-server` when `MONGODB_URI` is missing or points to local MongoDB and `NODE_ENV` is not production. For persistent data, use MongoDB Atlas or a local MongoDB instance.

Run each side separately when needed:

```bash
npm run dev:client
npm run dev:server
```

Optional PowerShell seed run:

```powershell
$env:SEED_DB='true'
npm run dev
```

## Upload Flow

### Profile photo

1. The user chooses Gallery or Camera in the profile screen.
2. Gallery creates a browser preview URL. Camera captures a frame into a JPEG file.
3. `buildProfileFormData` sends the file as multipart field `photo`.
4. The user profile route validates the upload and calls the media helper.
5. Cloudinary stores the image when configured; otherwise the local fallback stores it under `server/uploads`.
6. The returned URL is saved in the User document and rendered in the profile/avatar UI.

### Property images and videos

1. The owner selects image files in the Photos control and video files in the adjacent Property Video control.
2. The browser shows local previews before submission. Images are sent as repeated `images` fields; videos are sent as repeated `videos` fields.
3. Multer parses the multipart request in `POST /api/properties`.
4. The route accepts up to 10 images and 2 videos. Each image must have an image MIME type and each video must have a video MIME type. The total per-file limit is 100 MB.
5. `resolveImageList` uploads images with Cloudinary resource type `image`.
6. `resolveVideoList` uploads videos with Cloudinary resource type `video`.
7. If Cloudinary is not configured, both media types use the local `server/uploads` fallback.
8. The Property document stores `images: [url]` and `videos: [url]`.
9. `formatProperty` returns both arrays to the frontend. The detail modal renders images and native HTML video players with controls.

Use Cloudinary in production because videos are too large and expensive to manage reliably on an application server filesystem. The local fallback exists for development and basic offline testing.

## API Endpoints

- `GET /api/health` — API health check.
- `POST /api/auth/register` — create an account.
- `POST /api/auth/login` — authenticate and return a JWT.
- `GET /api/auth/me` — read the authenticated user.
- `GET /api/properties` — list available properties with filters.
- `GET /api/properties/mine` — list the authenticated owner's properties.
- `GET /api/properties/:id` — read a property and increment views.
- `POST /api/properties` — protected multipart property creation with `images` and `videos`.
- `DELETE /api/properties/:id` — protected owner deletion.
- `POST /api/properties/:id/enquiry` — record a tenant enquiry.
- `GET /api/users/profile` — read the authenticated profile.
- `PUT /api/users/profile` — update profile fields and photo.
- `GET /api/wishlist` — read saved properties.
- `POST /api/wishlist/:propertyId` — save a property.
- `DELETE /api/wishlist/:propertyId` — remove a saved property.
- `POST /api/contact` — send a contact message.

## Data Model Summary

`User` stores account credentials and the profile object, including the role and photo URL.

`Property` stores rental details, owner reference, owner contact, amenities, image URLs, video URLs, rating fields, view/enquiry counters, availability, and timestamps.

`ContactMessage` stores messages submitted through the support form.

Media is stored as URLs rather than binary data in MongoDB. This keeps database documents small and lets Cloudinary/CDN delivery handle media traffic.

## Production Build and Preview

Build the frontend:

```bash
npm run build
```

Preview the built frontend locally:

```bash
npm run preview
```

For the preview to load listings and create properties, keep the API running in another terminal:

```bash
npm run dev:server
```

The preview URL is `http://localhost:4173`. The frontend automatically targets port 5000 on that port. A missing backend produces a clear API connection message instead of a generic failed fetch.

## Vercel Deployment

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. In **Vercel Project Settings -> Environment Variables**, add these production values:

	- `MONGODB_URI` — MongoDB Atlas `mongodb+srv://...` connection string.
	- `JWT_SECRET` — long random production secret, different from the local development value.
	- `CLIENT_URL` — deployed Vercel URL, for example `https://stayfinder.vercel.app`.
	- `CLOUDINARY_CLOUD_NAME` — Cloudinary production cloud name.
	- `CLOUDINARY_API_KEY` — Cloudinary production API key.
	- `CLOUDINARY_API_SECRET` — Cloudinary production API secret.

	Apply the variables to the **Production** environment. Do not upload `.env` to GitHub and do not place secrets in frontend `VITE_*` variables.
4. Use the default build command `npm run build` and output directory `dist`.
5. Deploy and verify `https://your-domain/api/health`.
6. Register an owner account, select Property Owner, upload a test image and short video, and open the property detail modal to verify playback.

`api/index.js` exports the Express app as a serverless function. `vercel.json` rewrites `/api/*` to that function and serves the built frontend. `CLIENT_URL` must match the deployed frontend origin for CORS.

The frontend and backend deploy together under the same Vercel domain. The frontend calls same-origin `/api` routes in production, while Vercel routes those requests to `api/index.js`. Cloudinary stores uploaded images and videos because Vercel serverless filesystems are temporary.

## Validation Checklist

```bash
npm run build
npm run lint
```

Manual smoke test:

1. Start the frontend and API.
2. Register or log in.
3. Open Profile and save a photo using Gallery or Camera.
4. Set the profile role to Property Owner.
5. Open My Properties and choose Add Property.
6. Add at least one photo and optionally one short video.
7. Submit the property and confirm it appears in the property list.
8. Open the property and play the uploaded video.
9. Test wishlist, owner contact, deletion, and logout.

## Troubleshooting

### Failed to fetch while listing a property

Ensure the API is running with `npm run dev:server`. If using `npm run preview`, the API must still run separately on port 5000. For a separate deployed API, set `VITE_API_URL` before building the frontend.

### Cloudinary upload error

Check all three Cloudinary variables. The API key and secret must belong to the same Cloudinary cloud. For local testing, removing the variables intentionally activates the local upload fallback.

### MongoDB connection error

Set a valid `MONGODB_URI`, check network access for MongoDB Atlas, and confirm the database user has permission to read and write.

### Camera does not open

Use HTTPS or localhost and grant browser camera permission. Some privacy-focused browsers block camera access until site permissions are changed.

### CORS error

Set `CLIENT_URL` to the exact frontend origin, including protocol and port. Local development uses `http://localhost:5173`; local production preview uses `http://localhost:4173`.

## Design and Engineering Notes

The interface uses a property-search visual language: strong photography, restrained cards, responsive grids, compact form controls, clear owner actions, and modal detail inspection. React state is kept close to each workflow so previews, filters, authentication, and modal visibility update without unnecessary page reloads.

The API separates authentication, user, property, wishlist, and contact concerns into route modules. `formatProperty` prevents database implementation details from leaking into the frontend. The media helper centralizes Cloudinary and local storage decisions so image and video upload behavior remains consistent.

For a larger production system, the next improvements would be signed direct-to-Cloudinary uploads, background video processing, stronger schema validation, rate limiting, pagination, secure httpOnly cookies, automated tests, and splitting the large `App.jsx` into feature components.
