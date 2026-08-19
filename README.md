# ResQ — Disaster Intelligence & Response Support System

ResQ is a production-oriented, dark-mode web platform for disaster intelligence and emergency response coordination. It aggregates live incident signals, classifies them by priority, renders them on an interactive city map, and gives command-center operators the tooling to triage, dispatch, and log rescues in real time.

Built with **TanStack Start** (full-stack React), **Vite**, **Tailwind CSS v4**, and **Leaflet**.

---

## Features

- **Overview dashboard** — Summary cards for active alerts, high-priority rescues, resolved incidents, and connected sources, backed by a live ingestion feed.
- **Live Feeds** — Real-time stream of incoming emergency posts from connected sources, with per-incident triage actions.
- **City Map** — Leaflet-based emergency map with priority-color-coded markers across the city; markers update as new signals arrive.
- **Heatmap** — Density view of incident activity to spot emerging hotspots.
- **Incident Logs** — Searchable, filterable record of all incidents and their resolution states.
- **Dispatch Center** — Operator workspace for assigning and tracking response units.
- **Incident Triage** — Modal-driven status transitions (e.g. open → dispatched → resolved) per incident.
- **AI-assisted classification** — Server-side classifier that scores incoming signals and assigns severity.
- **Offline Mesh Mode** — Simulated mesh network mode for degraded-connectivity response scenarios.
- **Scenario presets** — Bundled demo scenarios (e.g. flood, multi-hazard) that drive deterministic simulated incident streams.
- **SITREP export** — One-click generation of a Situation Report (PDF) for the active command context.

## Tech Stack

| Layer              | Technology                                          |
| ------------------ | --------------------------------------------------- |
| Framework          | TanStack Start (TanStack Router + React 19)         |
| Build tool         | Vite                                                |
| Styling            | Tailwind CSS v4 (utility-first, dark theme)         |
| Maps               | Leaflet + react-leaflet                             |
| Data fetching      | TanStack Query                                      |
| Forms / validation | react-hook-form + zod                               |
| Charts             | Recharts                                            |
| PDF export         | jsPDF                                               |
| Server             | Node.js (Nitro) via TanStack Start server functions |

## Getting Started

### Prerequisites

- Node.js 20+ and npm

### Install

```sh
npm install
```

### Run the dev server

```sh
npm run dev
```

The app is served at `http://localhost:3000` with hot module replacement.

### Production build

```sh
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/        # UI components (sidebar, stat cards, map, live feed, modals)
├── context/           # React contexts (demo scenario, offline mesh)
├── hooks/             # Shared hooks (ingestion feed, simulators)
├── lib/               # Domain logic (incidents, ops, classification, SITREP export)
├── routes/            # TanStack Router file-based routes
├── server.ts          # SSR server entry
└── styles.css         # Global styles + design tokens
```

## Design System

The interface uses a dark command-center aesthetic:

- **Surfaces** — deep navy backgrounds (`#0B1117`) with subtle elevated cards (`#151E28`)
- **Accent** — Operational Blue (`#2563eb`) for primary actions and emphasis
- **Semantic colors** — red / amber / yellow / blue / green reserved strictly for emergency severity states
- **Typography** — Inter for body text with monospace micro-labels for telemetry-style readouts

## Available Scripts

| Script              | Description                                |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Start the development server               |
| `npm run build`     | Create a production build                  |
| `npm run build:dev` | Create a development-mode production build |
| `npm run preview`   | Preview the production build locally       |
| `npm run lint`      | Run ESLint across the codebase             |
| `npm run format`    | Format the codebase with Prettier          |

## License

Proprietary. All rights reserved.
