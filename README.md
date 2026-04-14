# Team Skill Matrix Graph

Next.js + TypeScript + Zustand + React Flow app for managing people, skills, and proficiency relationships.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Automated Verification

Run all automated checks:

```bash
npm run verify
```

This runs:

- ESLint (`npm run lint`)
- Vitest smoke checks (`npm run test`)

## Manual Smoke Checklist

Use this before submission/review:

- [ ] Create a person with name and optional role.
- [ ] Create a skill with name and optional category.
- [ ] Create a connection between person and skill with a proficiency.
- [ ] Click a person node and verify details panel shows related skills + proficiency.
- [ ] Click a skill node and verify details panel shows related people + proficiency.
- [ ] Edit person name/role and confirm graph label updates.
- [ ] Edit skill name/category and confirm graph label updates.
- [ ] Delete a node and confirm related edges are removed.
- [ ] Delete a connection and confirm only that link is removed.
- [ ] Refresh page and verify all changes persist from localStorage.

## UX Notes

- Proficiency meanings:
  - Learning = beginner
  - Familiar = working knowledge
  - Expert = strong expertise
- A connection is a link between one person and one skill.

## NPM Warning (`devdir`)

If you see `Unknown env config "devdir"`, it is coming from your shell environment (not project files).

You can clear it in your current shell:

```bash
unset npm_config_devdir
```

To remove permanently, delete that export from your shell config (`~/.zshrc`, `~/.zprofile`, or equivalent), then restart your terminal.
