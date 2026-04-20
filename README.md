# OES Upper School Course Planner

An interactive four-year course planning tool for Oregon Episcopal School's Upper School, built for 9th–12th grade planning.

## What it does

- **Four-year grid** — courses organized by department and grade, color-coded by status (required, recommended, key decision, unique opportunity, deadline risk)
- **Student profile panel** — set current math placement and language level; toggle interests (Deep STEM, CS track, Language depth, Arts) to highlight relevant paths
- **Critical paths view** — visual chains showing the math sequence, CS sequence, and language track, with at-risk warnings when a path is in jeopardy
- **Deadlines tracker** — chronological list of time-sensitive decisions with urgency levels
- **Course detail panel** — click any course to see prerequisites, what it unlocks, and planning notes

## Design

- Vanilla HTML/CSS/JS — no build step, no dependencies, opens directly in a browser
- Single-page, all state in JS (no persistence needed)
- Printable four-year grid via `@media print`

## File structure

```
├── index.html        — app shell and sidebar
├── courses-data.js   — all course data, critical paths, deadlines
├── planner.js        — state management, rendering, filtering logic
├── styles.css        — layout and color system
├── DECISIONS.md      — design decision log
```

## Course data

All courses sourced from the OES Upper School Curriculum Guide. Key fields per course: department, eligible grades, semester, honors/AP flags, prerequisites, what the course unlocks, status tags, and planning notes.

## Color system

| Color | Meaning |
|-------|---------|
| Gray | Required — locked in |
| Blue | Recommended for this student's profile |
| Amber | Key decision point — choose carefully |
| Green | Unique OES opportunity |
| Red/orange | Act now — deadline risk |
| Dimmed | Locked out given current choices |
| Green tint + ✓ | Already completed |
