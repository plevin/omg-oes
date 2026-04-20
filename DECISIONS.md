# Design Decisions Log

This file captures decisions made about the app so Claude Code can continue without re-litigating them.

---

## Technology choices

**Vanilla HTML/CSS/JS — no frameworks, no build step.**
Rationale: Parent just needs to open a file in a browser. No npm install, no server. Easy to share, print, and maintain. Claude Code should keep this constraint.

**Single-page app, all state in JS.**
No localStorage needed — this is a planning session tool, not a persistent tracker.

**CSS custom properties for theming.**
Use a small set of variables at the root so the color scheme is easy to adjust. No Tailwind, no CSS-in-JS.

---

## App architecture

**Three main views/sections:**

1. **Profile panel** (top or sidebar) — sets the student's current situation
   - Math level selector (dropdown)
   - Language + current level (two dropdowns)  
   - Interest toggles: Deep STEM / CS Track / Language Depth / Arts
   - These drive the highlight/dim logic throughout the rest of the app

2. **Four-year grid** (main content) — the course plan
   - Columns: Grade 9 / 10 / 11 / 12
   - Rows: by department (English, History, Math, Science, Language, R&P, Arts, CS/Electives, Special)
   - Each course is a card with: name, honors/AP badge, status indicator
   - Click a card → detail panel slides in or expands inline
   - Color logic (see below)

3. **Sidebar panels** (right side or below grid):
   - Critical Paths view: shows the math/CS/language chains
   - Deadlines view: chronological list of must-act-by items
   - Toggle between these two panels

**Detail panel (on card click):**
Shows full course info: description, prereqs, what it unlocks, notes for this student, deadline if any.

---

## Color/status system for course cards

| Status | Color | Meaning |
|--------|-------|---------|
| `required` | Light gray | Locked in, no choice |
| `recommended` | Blue | Good fit for this student's profile |
| `decision` | Amber/yellow | Optional but high-stakes choice — decide carefully |
| `unique` | Green | Distinctive OES opportunity |
| `deadline` | Red/orange | Time-sensitive; window closing |
| `locked-out` | Dimmed, strikethrough | Not accessible given current choices |
| `on-track` | Blue with checkmark | In the plan and prereqs met |

A course can have multiple tags but the card shows one primary status (priority: locked-out > deadline > decision > recommended > required).

---

## Profile panel behavior

When the parent changes a setting:
- Math level → recomputes which math courses are accessible/locked in each year
- Language level → recomputes which language courses are accessible
- "Deep STEM" toggle → highlights advanced science + physics + engineering options
- "CS Track" toggle → highlights entire CS sequence + adds warning if starting late
- "Language Depth" toggle → highlights Level 4+ and AP/HLC

The grid updates immediately (no submit button). Smooth CSS transition on card status changes.

---

## Critical Paths view

Show each path as a horizontal chain of steps:
- Filled circle = completed/current
- Open circle = future step
- Gray circle = at-risk or locked

Paths to show (from CRITICAL_PATHS in courses-data.js):
1. AP Calculus BC path
2. AP Calculus AB path (shown if BC is unavailable)
3. Machine Learning path
4. AP Language path
5. Teaching Assistant path

For the math paths, show which one is currently achievable based on the profile panel settings.

---

## Deadlines view

Chronological list. Each item has:
- Urgency badge (critical / high / medium) in red/amber/gray
- When (e.g. "Spring of Grade 9 — NOW")
- Action (one line, bold)
- Detail (expandable paragraph)
- Links to affected courses (clicking highlights them in the grid)

Sort: critical first, then high, then medium.

---

## Printing

The four-year grid should print cleanly on one landscape page.
Add a `@media print` stylesheet that:
- Hides the sidebar, profile panel, and header
- Makes the grid full-width
- Removes hover states
- Keeps color coding (use borders not just backgrounds for print safety)
- Adds a small legend at the bottom

---

## Things NOT to build (scope limits)

- No authentication or user accounts
- No saving/loading plans (keep it session-only)
- No "build my schedule" auto-solver
- No mobile optimization beyond basic responsiveness
- No course catalog beyond what's in courses-data.js
- No Athletics detail (just note it as extracurricular requirement)
- No Arts course detail (not relevant to this student's profile)
- No full Religion & Philosophy depth (just enough to satisfy requirement)

---

## Open questions for Claude Code to resolve

1. **Layout:** Should the profile panel be a top bar or a left sidebar? 
   - Suggestion: collapsible left sidebar so the grid has maximum horizontal space.

2. **Grid row structure:** Should rows be strict departments, or should we merge small departments?
   - Suggestion: English / History / Math / Science / CS / Language / R&P + Arts (merged) / Special (Winterim, TA, CE)

3. **Course card size:** How much text to show on the card vs. in the detail panel?
   - Suggestion: Card shows name + badges only. All other info in detail panel on click.

4. **Mobile:** Basic responsiveness (stack columns) or desktop-only?
   - Suggestion: Desktop-first, but don't break on mobile — stack the four columns vertically.

5. **The dependency graph:** SVG arrows connecting cards, or just the critical paths list?
   - Suggestion: Start with just the critical paths list. SVG arrows between cards is complex and may clutter.
