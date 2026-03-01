# AfricaDeck — Setup Guide

## Quick Start

```bash
# 1. Install all dependencies
npm run install:all

# 2. Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys

# 3. Start both frontend and backend
npm run dev
```

The frontend runs on `http://localhost:3000` and the backend API on `http://localhost:4000`.

## Project Structure

```
africadeck/
├── frontend/          # React + Vite + Tailwind dashboard
│   ├── src/
│   │   ├── App.jsx    # Main dashboard component (all widgets)
│   │   ├── main.jsx   # React entry point
│   │   └── index.css  # Tailwind + custom styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/           # Express API server
│   ├── src/
│   │   └── server.js  # API routes & data source proxying
│   ├── .env.example
│   └── package.json
└── package.json       # Root scripts (runs both)
```

## Data Sources

### Free (No API Key Required)
| Source | Data | Endpoint |
|--------|------|----------|
| USGS | Earthquakes in Africa | `/api/earthquakes` |
| Open-Meteo | Weather for major cities | `/api/weather` |
| GDELT | Africa news articles | `/api/news` |
| ReliefWeb | Health & humanitarian alerts | `/api/health-alerts` |

### Requires Registration (Free)
| Source | Data | Endpoint |
|--------|------|----------|
| ACLED | Armed conflict events | `/api/conflicts` |
| exchangerate.host | African currency rates | `/api/currencies` |

### Planned Integrations
- **ACAPS** — Crisis severity index
- **INFORM** — Risk index for humanitarian crises
- **FEWS NET** — Food security early warning
- **Africa CDC** — Disease surveillance
- **African Development Bank** — Economic indicators
- **FlightRadar24** — Aviation tracking
- **MarineTraffic** — Maritime AIS data

## Deploying

```bash
# Build frontend for production
npm run build

# Deploy frontend/dist to Vercel, Netlify, or any static host
# Deploy backend to Railway, Render, or any Node.js host
```

## Adding New Widgets

1. Create a data generator function in `App.jsx`
2. Add state management with `useState`
3. Create the widget JSX inside the dashboard grid
4. (Optional) Add a backend API route in `server.js`

## License

MIT — Built for Africa, by Africa.
