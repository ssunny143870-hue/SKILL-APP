# Materials Library UI

A premium learning library interface for engineering students.

## Files

- `index.html` — Home dashboard with featured quick access and overview.
- `materials.html` — Materials library page with search, filters, and PDF cards.
- `styles.css` — Modern glassmorphism-inspired styling.
- `materials.json` — Source data for all PDF materials.
- `script.js` — Loads `materials.json`, applies search/filter logic, and handles card actions.

## Run locally

### Option 1: Open directly

Open `index.html` in your browser. The interface is fully static and works without a server.

### Option 2: Use a local server

If you want a better experience, run a simple static server.

#### With Python 3

1. Open a terminal in this folder.
2. Run:

```powershell
python -m http.server 8000
```

3. Open `http://localhost:8000` in your browser.

#### With VS Code Live Server

Install the Live Server extension and click **Go Live**.

## Notes

This demo provides the UI structure, search/filter interactions, and navigation flow. PDF opening, bookmarking, and downloading are simulated and can be connected to a backend later.