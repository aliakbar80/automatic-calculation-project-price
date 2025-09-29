# Project Pricing (Iran)

Full-stack app to estimate software project pricing in Iran.

## Tech Stack
- Backend: NestJS, TypeORM (SQLite), Swagger, HttpModule
- Frontend: Next.js (App Router), React Query, TailwindCSS (RTL), Vazirmatn font

## Monorepo Structure
- `backend/`: NestJS API
- `frontend/`: Next.js UI

## Backend Setup
```bash
cd backend
npm i
npm run start
# API: http://localhost:3000
# Swagger: http://localhost:3000/docs
```
Notes:
- SQLite file `app.db` is created on start; entities are synced and seeds run automatically.
- Endpoints
  - `GET /config[?projectType=webapp|shop|cms|erp|mobile|saas|landing|crm]`
  - `POST /calculate` payload includes
    - projectType, scale, technologies[], pagesOrModules, specialFeatures[]
    - delivery, complexity, risk, profitMargin
    - usdRate (optional, auto-fetched if omitted)
  - `GET /market/usd` returns live USD→IRR (best-effort)

## Frontend Setup
```bash
cd frontend
npm i
npm run dev
# UI: http://localhost:8080 (if configured) or default Next port
```
Environment variable (optional):
```bash
# frontend/.env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## Usage
1) Start backend, verify Swagger at `/docs`.
2) Start frontend, open the UI.
3) Select project type/scale and options; submit to see pricing breakdown.

## Features
- Dynamic coefficients and base prices via database seeds
- Live USD rate when `usdRate` is not provided
- Filtering of technologies/features by project type
- Persian RTL UI with dark/light theme following system

## Development
- Lint/format via project defaults
- Update seeds in `backend/src/pricing/seed.ts`
- Update tech/feature filters in `backend/src/pricing/pricing.service.ts`

## Notes
- External market APIs are best-effort; consider replacing with a stable local provider in production.
- Pricing model is adjustable: base USD, multipliers, and caps are in `PricingService`.
