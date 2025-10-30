# Curse Map Hackathon

A frontend-only, vibe-coding project to visualize the most common curse in the 20 largest countries. The map will glow/highlight a country and display the curse in the original language plus its English translation.

## Quickstart (temporary, before tooling)
- Serve statically with any dev server while we scaffold components:
  - Python: `python -m http.server 8000` (then open http://localhost:8000)
  - Node: `npx serve .`
- Core contract: everything reads from `data/curses.json`.

We’ll add framework-specific commands here as each app is added.

## Architecture (big picture)
- Single-page frontend, data-driven.
- Two primary surfaces:
  1) Map surface: interactive world map that glows/highlights countries and emits selection events.
  2) Detail surface: shows the country’s curse in original script + English translation and related metadata.
- Integration boundary: Web Components (Custom Elements) to allow any framework/UI lib.
  - Map exports `<curse-map src="/data/curses.json"></curse-map>`
  - Detail panel exports `<curse-detail></curse-detail>`
  - Events/props are plain DOM APIs so React/Vue/Svelte/Solid or Vanilla can interop.

### Component contract
- `<curse-map>`
  - Attributes: `src` (string, URL to data JSON)
  - Events: `countryselect` → `detail.dispatchEvent(new CustomEvent('countryselect', { detail: { country_code } }))`
  - Visual: glow/highlight on hover, focus, or selection.
- `<curse-detail>`
  - Methods: `setCountry(data: CurseEntry)`
  - Listens for `countryselect` on document and updates itself.

## Data contract (`data/curses.json`)
A flat array of entries for the top-20-by-population countries.

```json
[
  {
    "country_code": "CHN",          
    "country_name": "China",
    "population_rank": 1,            
    "local_script": "…",            
    "transliteration": "…",         
    "english": "…",                 
    "normalized_intensity": 0.72,    
    "nsfw": true,                    
    "rtl": false,                    
    "notes": "context, usage, tone",
    "sources": ["https://…"],       
    "last_verified": "2025-10-30"   
  }
]
```

Guidelines:
- `country_code`: ISO-3166-1 alpha-3 (e.g., USA, CHN, IND, IDN, PAK, NGA, BRA, RUS, JPN, MEX, …).
- Include `rtl` for right-to-left scripts (e.g., Arabic, Urdu, Persian, Hebrew) to set `dir="rtl"`.
- `normalized_intensity` is a 0–1 heuristic for glow strength/heatmap.
- `nsfw: true` enables a blur/censor toggle in UI.

## Rendering rules
- Map glow strength is proportional to `normalized_intensity`.
- On hover: soft glow + tooltip with `local_script`.
- On select (click/tap): strong glow + side panel updates with `local_script` and `english`.
- Fallbacks: if `local_script` missing, show `transliteration`; if both missing, show `english` only.
- Respect `rtl` by setting container `dir="rtl"`.

## Safety/UX toggles
- Censor switch (default ON) blurs curse text until clicked.
- “Show transliteration” toggle for languages with non-Latin scripts.
- Mobile: tap-to-select; desktop: hover preview + click select.

## Suggested repo layout
```
/README.md
/data/curses.json               # canonical dataset
/public/index.html              # simple host page wiring components
/apps/map/                      # your friend’s map implementation (any framework)
  └─ dist/curse-map.js          # web component build output
/apps/detail/                   # detail panel implementation (any framework)
  └─ dist/curse-detail.js       # web component build output
```

### `public/index.html` wiring (example)
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Curse Map</title>
    <script type="module" src="/apps/map/dist/curse-map.js"></script>
    <script type="module" src="/apps/detail/dist/curse-detail.js"></script>
    <style>
      body { margin: 0; font-family: system-ui, sans-serif; }
      main { display: grid; grid-template-columns: 2fr 1fr; height: 100vh; }
      curse-map { border-right: 1px solid #222; }
    </style>
  </head>
  <body>
    <main>
      <curse-map src="/data/curses.json"></curse-map>
      <curse-detail></curse-detail>
    </main>
  </body>
</html>
```

## Collaboration rules (lightweight)
- Keep `data/curses.json` valid JSON; prefer ISO-3 codes and include a `sources` URL.
- Each app/framework compiles to a single web component in its `dist/` folder.
- No backend; everything must work over static hosting.

## Roadmap
- [ ] Create initial `data/curses.json` (top 20 countries with sources)
- [ ] Implement `<curse-map>` (hover glow, select, emit `countryselect`)
- [ ] Implement `<curse-detail>` (censor toggle, rtl support, transliteration)
- [ ] Wire `public/index.html` and verify E2E
- [ ] Add theming (dark/neon glow) and smooth transitions
- [ ] Add simple CI to validate JSON schema

---
We’ll expand this README with concrete build/run commands once each component’s tooling is chosen.
