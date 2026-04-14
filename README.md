# Team Skill Matrix Graph

An interactive **team skill graph** built with Next.js and TypeScript.  
It visualizes **who knows what and at what level**, and helps identify **skill overlaps and gaps** across a team.

---

## Demo / Preview

- Live Demo: _[Add deployed URL here]_
- Repository: _[Add GitHub URL here]_
- Screenshots:
  - _[Add graph screenshot]_
  - _[Add detail panel screenshot]_
  - _[Add controls/summary screenshot]_

---

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **React Flow** (`@xyflow/react`) for graph rendering
- **Zustand** for state management
- **Tailwind CSS** for styling
- **localStorage** (via Zustand persist) for client-side persistence
- **Dagre** for automatic graph layout
- **Framer Motion** for node entry animations
- **Sonner** for toast notifications
- **Vitest + jsdom** for smoke verification tests

---

## Features

### Core Features

- Two node types:
  - **Person**
  - **Skill**
- Distinct node visuals for each type.
- Directed edges from **person -> skill**.
- Proficiency levels on edges:
  - `learning`
  - `familiar`
  - `expert`
- Automatic graph layout on initial load using Dagre to reduce overlap.

### Node Interaction

- Clicking a **Person** node opens a detail panel with:
  - person details
  - related skills + proficiency
- Clicking a **Skill** node opens a detail panel with:
  - skill details
  - related people + proficiency

### CRUD Operations

- **Create**
  - Add person (name, optional role)
  - Add skill (name, optional category)
  - Add connection (person, skill, proficiency)
- **Update**
  - Edit person (name, role)
  - Edit skill (name, category)
- **Delete**
  - Delete node (automatically removes connected edges)
  - Delete connection
  - Confirmation prompts for delete actions

### Persistence

- Graph state is persisted in `localStorage`.
- State restores after page refresh.
- Seed data is loaded **only when no persisted state exists**.

### UI / UX

- Clean dark glass-style dashboard.
- Left sidebar for insights and controls.
- Main graph area optimized for visibility.
- Search input to quickly find matching people/skills.
- Summary panel with:
  - total people
  - total skills
  - most common skills
  - skill gaps

### Stretch Features (Implemented)

- Highlight mode:
  - selecting a person highlights related skills
  - selecting a skill highlights related people
- Edge color coding by proficiency.
- Node entry and node removal animations.
- Summary analytics (counts, common skills, gaps).

---

## Seed Data

The app includes preloaded seed data for:

- People
- Skills
- Connections (with proficiency)

Seed data is used on first load only.  
If persisted data exists in `localStorage`, that state is used instead.

---

## How to Run Locally

```bash
git clone <repo-url>
cd <project-folder>
npm install
npm run dev
```

Open `http://localhost:3000`.

---

## Verification

### Automated

```bash
npm run verify
```

Runs:

- `npm run lint`
- `npm run test` (Vitest smoke checks)

Smoke coverage includes:

- create person/skill/connection
- edit person/skill
- delete node (+ related edges)
- delete connection
- persistence write check

### Manual Checklist

- [ ] Add person, skill, and connection
- [ ] Click person node -> verify related skills + levels
- [ ] Click skill node -> verify related people + levels
- [ ] Edit person and skill data
- [ ] Delete node and verify connected edges are removed
- [ ] Delete one connection only
- [ ] Refresh and confirm persisted state restoration

---

## Project Structure

- `app/` - page/layout and global app shell
- `components/` - graph, custom nodes, controls, summary, detail panel
- `store/` - Zustand store and state actions
- `lib/` - seed data and shared domain types/constants

---

## Design Decisions

- **React Flow**: best fit for interactive node-edge visualization and custom node rendering.
- **Zustand + persist**: lightweight global state with simple localStorage integration.
- **Frontend-only architecture**:
  - fast iteration
  - no backend dependency
  - ideal for assignment scope and local demo
- **Dagre layout**: predictable initial structure, while still allowing manual drag positioning.

---

## Assignment Requirement Coverage

- [x] Graph view (distinct nodes, edges, proficiency labels, initial layout)
- [x] Node interaction (person/skill detail panel with relationships)
- [x] CRUD operations (create, update, delete for nodes/connections)
- [x] Persistence (localStorage restore + seed-on-empty behavior)
- [x] Stretch features (highlighting, color coding, animations, summary analytics)

---

## Known Issues / Improvements

- Could add full end-to-end browser tests (Playwright/Cypress) for UI-level regression safety.
- Could add inline tooltip icons for first-time users in addition to current helper text.
- If `Unknown env config "devdir"` appears in your environment, remove `npm_config_devdir` from shell config (external to this project).

---

## Submission Links

- GitHub Repo: _[Add GitHub repo URL]_
- Live Demo: _[Add deployment URL]_
