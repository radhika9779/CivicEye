# CivicEye : AI-Powered Civic Issue Reporting & Women's Safety Platform

 -Report civic problems. Track resolution. Stay safe — all in one platform.

## Problem Statement

India has 4,000+ urban local bodies. Citizens have no transparent way to report civic issues and track them. Officers respond to whoever shouts loudest - not what is most dangerous. Women have no data-driven tool to assess route safety or send a quick SOS.

CivicEye solves this with three pillars:
- Structured issue reporting with AI-based priority triage
- Real-time officer dashboard for transparent accountability
- Women's safety module with SOS alerts and route safety scoring

---

## Features

**Citizen Side**
- Report civic issues with GPS auto-capture and reverse geocoding
- Upload a photo, select category, report anonymously if needed
- AI Severity Score (0–10) calculated instantly on every submission
- Community upvoting — more upvotes means higher AI priority
- Real-time status updates without page refresh
- Full status timeline: Open → Assigned → In Progress → Resolved

**Admin / Officer Side**
- Dashboard with live stats, category charts, and daily trend graphs
- Issue management table with filters by status, category, severity, ward
- One-click officer assignment with automatic ward routing by GPS
- Status updates with resolution notes and timestamps
- Live SOS alert feed from citizens

**Women's Safety Module**
- SOS Button — always visible on every page, one tap sends live GPS to admin instantly
- Route Safety Checker — scores a path from 0 to 100 based on nearby incident reports
- Report Unsafe Area — anonymous crowdsourced safety reporting
- Safety Heat Map — visual map showing incident density by area
- Nearby Safe Locations — nearest police booths, hospitals, shelters sorted by distance

---

## How the AI Scoring Works

The scoring engine is rule-based and fully explainable. Every score has a visible reason shown to the citizen.

Scoring factors:
- Category base score: Sewage = 8.0, Pothole = 6.0, Streetlight = 4.0
- Keywords like "dangerous", "emergency", "child" add +2.0 each
- Keywords like "broken", "overflow", "flood" add +1.0 each
- Keywords like "minor" or "small" subtract 0.5
- Each community upvote adds 0.3 points (capped at +2.0 total)
- Final score is clamped between 0 and 10

Severity labels:
- 9.0 to 10.0 — CRITICAL
- 7.0 to 8.9 — HIGH
- 4.0 to 6.9 — MEDIUM
- 0.0 to 3.9 — LOW

---

## How Route Safety Scoring Works

Starts at 100. Deductions are applied based on crowd-reported incidents within 300 metres of the route.

- Harassment report: -12 per incident
- Poor lighting: -8 per incident
- Unsafe area report: -6 per incident
- Maximum deduction capped at -70

Bonus: +5 for each nearby police booth or hospital within 500 metres (max +15)

Distance is calculated using the Haversine formula.

---

## Tech Stack

- Frontend: React.js 18, Vite, Tailwind CSS
- State Management: Zustand
- Maps: Leaflet.js, react-leaflet, leaflet.heat
- Charts: Recharts
- HTTP Client: Axios with JWT interceptor
- Real-time: Socket.io
- Backend: Node.js, Express.js
- Database: PostgreSQL (hosted on Neon) + Sequelize ORM
- Auth: JWT + bcryptjs
- File Uploads: Multer
- Security: Helmet, CORS

---

## Project Structure

```
main/
├── client/                   # React frontend (Vite)
│   └── src/
│       ├── api/              # Axios API call functions
│       ├── components/       # Reusable UI components
│       ├── hooks/            # useGeolocation, useSocket, useSOSTrigger
│       ├── pages/            # citizen, admin, safety, auth pages
│       ├── store/            # Zustand stores — auth, issues, socket
│       └── utils/            # geocode, formatters, categoryConfig
│
└── server/                   # Node.js + Express backend
    ├── config/               # database.js, socket.js
    ├── controllers/          # auth, issues, admin, safety, users
    ├── middleware/           # auth, role, upload
    ├── models/               # User, Ward, Issue, Upvote, SafetyReport, SOSAlert, SafeLocation
    ├── routes/               # Express routers
    ├── seeders/              # Demo data seeder
    ├── services/             # severity.service.js, routeSafety.service.js
    └── uploads/              # Local photo storage
```


## Getting Started

**Prerequisites:** Node.js 18+, npm, a Neon account (free tier works)

**1. Clone the repo**
```bash
git clone https://github.com/radhika9779/CivicEye.git
cd CivicEye
```

**2. Setup Backend**
```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:
```
PORT=5000
NODE_ENV=development
DATABASE_URL=your_neon_connection_string_here
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:5173
```

To get your Neon connection string: Neon Dashboard → Your Project → Connection Details → copy the connection string.

```bash
npm run seed        # Creates all tables and loads demo data
npm run dev         # Starts server on http://localhost:5000
```

**3. Setup Frontend**
```bash
cd client
npm install
```

Create a `.env` file inside the `client` folder:
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

```bash
npm run dev         # Starts on http://localhost:5173
```

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@civiceye.in | Admin@123 |
| Ward Officer | officer@civiceye.in | Officer@123 |
| Citizen 1 | citizen1@test.in | Test@123 |
| Citizen 2 | citizen2@test.in | Test@123 |

---

## Seeded Ward Data (Mumbai)

| Ward | Lat Range | Lon Range |
|------|-----------|-----------|
| Andheri West | 19.11 – 19.15 | 72.82 – 72.86 |
| Bandra West | 19.04 – 19.08 | 72.82 – 72.86 |
| Dadar | 19.01 – 19.04 | 72.83 – 72.87 |

---

## Real-time Events (Socket.io)

| Event | Who Receives It | When |
|-------|----------------|------|
| new_issue | All connected clients | When a citizen submits a report |
| issue_updated | All connected clients | On status or severity change |
| sos_alert | Admin room only | When SOS is triggered |

---

## Current Status

Done:
- Full citizen issue reporting flow with GPS and photo
- AI severity scoring engine — explainable, rule-based
- Auto ward routing by GPS bounding box
- JWT authentication with 3 roles (citizen, officer, admin)
- Admin dashboard with stats, charts, issue management
- Officer assignment and status tracking with resolution notes
- Community upvoting with live AI score recalculation
- Real-time updates via Socket.io
- SOS alert — one tap, GPS to admin instantly
- Route safety scoring algorithm
- Anonymous unsafe area reporting
- Safety heat map
- Nearby safe locations sorted by distance

Roadmap:
- Auto-escalation when officer does not act within SLA
- Cloudinary integration for cloud photo storage
- Redis caching for upvote counts
- Email notifications to ward officers on assignment
- Push notifications for citizens



