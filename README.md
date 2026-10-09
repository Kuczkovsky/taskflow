# TaskFlow ✦

**Plan. Focus. Ship.** A modern, responsive task manager built with React, TypeScript and Vite.

TaskFlow is a portfolio-friendly MVP focused on a polished dark-mode UI and practical task management. It runs entirely in your browser — **no backend, accounts or database are required in v1**.

## Features

- Create, edit, complete and delete tasks
- High, medium and low priorities
- Optional descriptions and due dates
- Filter by all, in progress or completed
- Search tasks by title or description
- Sort by newest or priority
- Live dashboard counters and completion progress
- Automatic persistence using browser `localStorage`
- Responsive dark interface with accessible control labels

## Tech stack

- **React 18** — UI components and state
- **TypeScript** — type-safe task model
- **Vite 6** — development server and build
- **Lucide React** — icons
- **CSS** — custom design system and responsive layout
- **localStorage** — browser-based persistence

## Getting started

Requires Node.js **20.19+ or 22.12+** (recommended for Vite 6 as well).

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

The static production build is generated in `dist/`.

## Project structure

```text
taskflow/
├── src/
│   ├── App.tsx         # Task UI and state logic
│   ├── main.tsx        # React entry point
│   └── styles.css      # Dark theme and responsive styling
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## How it works

Tasks are stored locally in the browser under the key `taskflow.tasks.v1`. Four example tasks are shown on the first visit. Any updates are saved automatically. Clearing browser storage removes your changes.

> **Current MVP scope:** Single-device, single-browser usage. There is no server, cloud sync, authentication, or shared workspace yet. The interface is in English.

## Roadmap

- [ ] Add automated component tests
- [ ] Add task categories and tags
- [ ] Add drag-and-drop ordering
- [ ] Add a Node.js/Express REST API
- [ ] Store tasks in PostgreSQL
- [ ] Add authentication and cross-device sync

## Deploy

This is a static React app. Deploy the built `dist/` folder to Netlify, Vercel or GitHub Pages. For GitHub Pages hosted in a project repository, configure Vite's `base` to match the repository subpath before building.

## License

MIT — see [LICENSE](LICENSE).
