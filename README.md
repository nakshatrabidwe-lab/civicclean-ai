# CivicClean AI 🌿

AI-powered civic issue reporting for citizens and intelligent task management for municipal teams.

---

## Project Structure

```
civicclean-ai/
├── package.json              ← root (npm workspaces, concurrently)
│
├── frontend/                 ← React + Vite
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx           ← React Router (/, /citizen/*, /admin/*)
│       ├── index.css         ← design tokens + reset
│       ├── LandingPage.jsx   ← portal selector
│       │
│       ├── portals/
│       │   ├── citizen/      ← Citizen Portal shell + sub-pages
│       │   └── admin/        ← Municipal Admin Portal shell + sub-pages
│       │
│       └── shared/
│           ├── components/
│           │   ├── Button/   ← Button.jsx + Button.module.css
│           │   ├── Input/    ← Input.jsx  + Input.module.css
│           │   ├── Badge/    ← Badge.jsx  + Badge.module.css
│           │   └── index.js  ← barrel export
│           └── hooks/
│               └── useApi.js ← axios wrapper hook
│
└── backend/                  ← Node.js + Express
    ├── package.json
    ├── .env.example
    └── src/
        ├── index.js          ← Express app entry
        └── routes/
            ├── reports.js    ← CRUD for civic reports
            ├── users.js      ← citizen profile stub
            └── admin.js      ← admin stats stub
```

---

## Quick Start

```bash
# 1. Install all workspace dependencies
npm install

# 2. Set up backend environment
cp backend/.env.example backend/.env

# 3. Run both dev servers simultaneously
npm run dev
```

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:5173      |
| Backend  | http://localhost:3001      |
| Health   | http://localhost:3001/api/health |

---

## Routes

### Frontend (React Router)
| Path            | Portal                   |
|-----------------|--------------------------|
| `/`             | Landing / Portal selector |
| `/citizen`      | Citizen Dashboard        |
| `/citizen/report` | Report an Issue        |
| `/citizen/track`  | Track Community Issues |
| `/citizen/profile` | Profile              |
| `/admin`        | Admin Overview           |
| `/admin/queue`  | Issue Queue              |
| `/admin/analytics` | Analytics             |
| `/admin/teams`  | Teams & Dispatch         |
| `/admin/settings` | Settings               |

### Backend (Express)
| Method | Path              | Description          |
|--------|-------------------|----------------------|
| GET    | /api/health       | Health check         |
| GET    | /api/reports      | List reports         |
| POST   | /api/reports      | Submit new report    |
| GET    | /api/reports/:id  | Get single report    |
| PATCH  | /api/reports/:id  | Update report        |
| DELETE | /api/reports/:id  | Delete report        |
| GET    | /api/users/me     | Current user profile |
| GET    | /api/admin/stats  | Dashboard stats      |

---

## Using Shared Components

```jsx
import { Button, Input, Badge } from '@shared/components'

<Button variant="primary" size="md" loading={false}>Submit</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="danger">Delete</Button>

<Input label="Location" hint="Enter street address" leftIcon="📍" />
<Input label="Email" error="Invalid email address" />

<Badge variant="success">Resolved</Badge>
<Badge variant="warning">In Progress</Badge>
<Badge variant="error">Urgent</Badge>
```

---

## Next Steps

- [ ] Add auth (JWT or session) with protected routes
- [ ] Swap in-memory store for MongoDB / PostgreSQL
- [ ] Build out Citizen Report form with AI category suggestion
- [ ] Build out Admin Issue Queue with filtering & assignment
- [ ] Add map view (Leaflet / Mapbox) for issue locations
- [ ] Add real-time updates (Socket.io) for status changes
