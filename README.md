# AI SEO Audit Tool — Frontend

React + Vite front-end for the AI SEO Audit ecosystem. Provides an SEO Checker landing page, a dedicated report page per audited URL, and a trio of workflow tools (Content analyzer, Meta Tag generator, Keyword analyzer).

## Features

- **`/` SEO Checker** — Public landing page with hero, feature grid, URL form, and animated loading steps. Submits then immediately navigates to `/audit/<url>` where results render in place.
- **`/audit/:url`** — Dedicated report page with sticky audit header, score hero, HTML page summary, To-Do list, and a 10-tab "Checks" surface (Meta, Quality, Others, Links, Server, External, Advanced, Suggestions, Meta Tags, Technical).
- **`/content`** — Content SEO analyzer with live Google search preview.
- **`/meta-tags`** — Meta tag generator with live Google + social previews and rendered HTML.
- **`/keywords`** — Keyword cloud + density bar chart, target-keyword tracking.
- Single 30+-icon SVG sprite (replaceable) — no emoji icons.
- Side-by-side **form / live preview** layout on every tool page.

## Tech Stack

- React 19
- React Router 7
- Vite 8
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- axios for HTTP
- Custom CSS theme tokens (`--primary`, `--success`, etc.) in `src/index.css`

## Project Structure

```
frontend/
├── public/                 # Static assets (favicons)
├── src/
│   ├── components/         
│   │   ├── WebsiteAuditor.jsx     # Landing page
│   │   ├── AuditPage.jsx          # /audit/:url result page
│   │   ├── AuditReport.jsx        # The 10-tab checks report
│   │   ├── ContentAnalyzer.jsx    # /content
│   │   ├── MetaTagGenerator.jsx   # /meta-tags
│   │   ├── KeywordAnalyzer.jsx    # /keywords
│   │   ├── UrlOptimizer.jsx       # (legacy; route removed)
│   │   ├── Suggestions.jsx
│   │   └── Icons.jsx              # 30+ SVG icon components
│   ├── App.jsx                    # Routes
│   ├── App.css
│   ├── index.css                  # Global theme + custom CSS
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── .env                           # Environment variables (NOT in git)
└── .env.example                   # Safe template (in git)
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and adjust if needed:

```bash
cp .env.example .env
```

Key variables (all must be prefixed `VITE_` to be exposed to the client):
- `VITE_API_URL` — Backend base URL (default `http://localhost:8000`)
- `VITE_PORT` — Dev server port (default `5173`)
- `VITE_APP_NAME` — App display name

### 3. Run dev server

```bash
npm run dev
```

The dev server proxies all `/api/*` calls to `VITE_API_URL`.

### 4. Build for production

```bash
npm run build
npm run preview       # serve the production bundle locally
```

### 5. Lint

```bash
npm run lint
```

## Routes

| Path                  | Component            | Purpose                          |
| --------------------- | -------------------- | -------------------------------- |
| `/`                   | `WebsiteAuditor`     | SEO Checker landing              |
| `/audit/:url`         | `AuditPage`          | Audit results page (URL-decoded) |
| `/content`            | `ContentAnalyzer`    | Content SEO analyzer             |
| `/meta-tags`          | `MetaTagGenerator`   | Meta tag generator               |
| `/keywords`           | `KeywordAnalyzer`    | Keyword density analyzer         |

## Talking to the Backend

The Vite dev server proxies `/api/*` to `VITE_API_URL`. In production, either:
- Serve the built `dist/` from the same domain as the backend, or
- Configure CORS on the backend to whitelist your frontend origin and call `VITE_API_URL` directly.

Used endpoints:
- `POST /api/audit/` — Full SEO audit
- `POST /api/analyze/` — Content analysis
- `POST /api/meta-tags/` — Meta tag generator
- `POST /api/keywords/` — Keyword density

## Environment Variables

| Var            | Default                | Description                       |
| -------------- | ---------------------- | --------------------------------- |
| `VITE_API_URL` | `http://localhost:8000`| Backend base URL (proxied via `/api`) |
| `VITE_PORT`    | `5173`                 | Vite dev server port              |
| `VITE_APP_NAME`| `SEO Pro`              | Display name                      |
| `VITE_APP_VERSION` | `1.0.0`            | App version                       |

## License

MIT
