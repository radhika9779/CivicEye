# CivicEye

AI-Powered Civic Intelligence & Women's Safety Platform.
"Report it. Track it. Stay Safe."

## Quick start

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`:
- **Cloud Postgres (recommended for a hackathon):** paste your connection string into `DATABASE_URL` (e.g. from [neon.tech](https://neon.tech)). It takes priority over the `DB_*` fields below it.
- **Local Postgres:** leave `DATABASE_URL` unset and fill in `DB_NAME` / `DB_USER` / `DB_PASSWORD` / `DB_HOST` / `DB_PORT` for your local install.

Then seed and run:

```bash
npm run seed   # creates wards, demo users, 15 issues, 10 safety reports, 6 safe locations
npm run dev    # starts on http://localhost:5000
```

Demo logins (printed at the end of the seed script too):

| Role | Email | Password |
|---|---|---|
| Admin | admin@civiceye.in | Admin@123 |
| Ward Officer | officer@civiceye.in | Officer@123 |
| Citizen | citizen1@test.in | Test@123 |
| Citizen | citizen2@test.in | Test@123 |

### 2. Frontend

In a second terminal:

```bash
cd client
npm install
npm run dev    # starts on http://localhost:5173
```

Open `http://localhost:5173` — the Vite dev server proxies `/api` and `/uploads` requests straight through to the backend on port 5000, so you don't need to configure CORS or a base URL for local dev.

### 3. Try the demo flow

1. Log in as `citizen1@test.in` → tap **+ Report Issue** → fill the 3-step form → watch the AI severity gauge animate in.
2. Log in as `admin@civiceye.in` → **Dashboard** → click any issue row → **Assign to Me** → change status to **Resolved**.
3. Back as a citizen → **Safety** tab → **Check Route Safety** → tap two points on the map → see the route safety score and reasons.
4. Press the floating red **SOS** button (or the big one on the Safety Home hero) → confirm → it broadcasts live to any admin dashboard open in another tab via Socket.io.

## Stack

- **Frontend:** React 18 + Vite, Tailwind, React Router, React Leaflet + Leaflet.heat, Recharts, Zustand, Socket.io-client, React Hot Toast
- **Backend:** Node + Express, PostgreSQL + Sequelize, JWT auth, Multer, Socket.io, express-validator

## Notes

- Photo uploads are stored locally in `server/uploads/` and served at `/uploads/<filename>`. This resets if you redeploy without a persistent disk — fine for a hackathon demo, but swap for cloud storage if you need uploads to survive a redeploy.
- The route safety scorer uses straight-line interpolation between your two tapped points (no external routing/directions API), since none was wired in. It's an honest simplification, not a placeholder — the backend scoring logic itself is fully real.
