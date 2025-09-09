# Arogya Rekha (Prototype)

"A Digital Health Record" — a responsive prototype for a Health Record Management System for migrant workers in Kerala (SIH Hackathon).

## Features
- Worker mobile simulation: language select, registration, QR Health ID
- Provider portal: login, QR scan simulation, patient records with add-new entry
- Health officials dashboard: Leaflet map, hotspots, metrics, trends via Chart.js
- Mobile-first with Bootstrap, localStorage state, demo data

## Tech Stack
- HTML5, CSS3, JavaScript
- Bootstrap 5, Leaflet.js, Chart.js, QRCode.js

## Run
Open `index.html` in a modern browser. No backend required.

If using a local server (optional):
- Python: `python -m http.server 8000`
- Node: `npx serve .`

## Demo Flow
1. Worker: `Worker Registration` → fill form → generate Health ID → see QR.
2. Provider: Login → `Open Scanner` → use `Scan` (uses selected worker or manual ID) → patient record → add new record.
3. Officials: `Health Officials` → map hotspots → change disease filter → see metrics and trends.

## Notes
- All data is stored in `localStorage` and seeded from `assets/data/sample-data.json`.
- Share/Save on Health ID is simulated.
- Map updates are simulated every 5 seconds.
