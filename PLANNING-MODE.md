# Planning Mode — Design Spec

*Written 2026-04-21. Status: design only, not yet built.*

---

## The Core Idea

The app currently has two mental modes mixed into one view:

- **Exploration** — "What's possible for a student with this profile? What are the dependencies? What do I need to decide?"
- **Commitment** — "What am I actually putting on the schedule? What have I covered? What's left?"

These serve different moments in the planning process. Exploration comes first (browse the catalog, understand the paths); commitment comes second (build the actual four-year plan). Mixing them creates a cluttered interface where neither works well.

**Solution:** Add a "My Plan" tab alongside the existing "Course Catalog" tab. Same grid skeleton, different interaction model.

---

## Tab Structure (after change)

| Tab | Purpose | Interaction |
|-----|---------|-------------|
| **Course Catalog** | Browse everything possible for this student profile | Read-only; click for details |
| **My Plan** | Build the actual schedule | Click to select/deselect courses |
| **Critical Paths** | Prereq chain visualization | Read-only |
| **Deadlines** | Time-sensitive decisions | Read-only |

The current "Four-year plan" tab is renamed "Course Catalog." Nothing else about it changes.

---

## My Plan — Detailed Design

### Pre-Population (what's locked in on load)

When the Plan tab opens, courses that are already determined are auto-added as **locked** (non-removable, shown in a distinct locked-in green):

- Current-year courses for each sequence the student is in:
  - Math at `state.mathLevel`
  - Science at `state.scienceLevel`
  - Language at `state.langLevel` for `state.language`
  - English for `state.currentGrade` (9→Eng9, 10→Eng10, 11→Eng11)
  - History for `state.currentGrade` (9→Global Perspectives, 10→US History; 11–12 have choices)
  - Health, if `state.currentGrade === 9`
  - Winterim (every year, all grades)
- Past-year courses (already completed, shown as completed/grayed)

Everything else is open for the student to choose.

### Interaction Model

- **Click a non-locked course card** → adds to plan (shows as "planned" with green styling)
- **Click again** → removes from plan
- **Locked courses** → not clickable; always in the plan

In cells with many options (Grade 12 English electives, History electives, etc.), the existing collapsible elective-group widget still works — clicking an item inside it adds that course to the plan.

### Cell Display in Plan View

Instead of showing ALL catalog courses for a grade+dept (as the catalog tab does), the Plan view shows:

1. **Locked courses** — full card, green lock styling, no click
2. **Planned courses** — full card, "planned" styling
3. **A faint "+ add" slot** at the bottom of each cell — clicking opens a small inline picker showing only courses that are:
   - Valid for this grade (displayGrade() === this grade)
   - In this department row
   - Have their prereqs satisfied by the current plan
   - Haven't already been added

This is cleaner than showing every possible course dimly in the background.

### Capacity Indicator

Each year column header gets a small slot counter below the year label:

```
Grade 11 — 2028–29
●●●●●○  5 / 6 slots
```

**Slot counting rules:**
- 1 yearlong course = 1 slot
- 2 semester courses (1 fall + 1 spring) = 1 slot
- 1 semester course alone = 0.5 slot
- Maximum: 6 slots per year (7th slot is special — TA program or advisor approval)

The counter turns amber at 5.5 and red at 6+. It doesn't block selection — it warns.

### "What's Left" — Persistent Footer Strip

A strip pinned to the bottom of the Plan view. One pill per graduation requirement. Updates live as courses are added/removed.

```
English ✓ 4yr  |  History ✓ 2cr  |  Math (3/4yr)  |  Science (2/3yr)
Language ✓ 2yr  |  Arts 1/3 ⚠  |  Religion 0/2 ⚠  |  Health ✓  |  Comm. Eng ⚠
```

**Pill states:**
- ✓ green — requirement fully met by the current plan
- Amber partial — progress made, more needed
- Red ⚠ — nothing planned yet, requirement not on track

**Clicking a pill** highlights the courses in the grid that satisfy it (similar to interest highlighting). So clicking "Arts 1/3" dims everything except arts courses and shows where they fit.

---

## State Model

### Plan state (new)

```js
const plan = new Set();  // Set of course IDs the student has committed to
const lockedCourses = new Set();  // Auto-populated from profile; can't be removed
```

### Updated getCourseStatus()

Add a new priority level in the status chain:

```js
if (lockedCourses.has(course.id)) return 'locked-in';   // committed, non-removable
if (plan.has(course.id))          return 'planned';       // committed, removable
```

Existing statuses (required, recommended, decision, unique, deadline, completed, locked) continue to work in catalog mode.

### Persistence

Use `localStorage` with key `oes-plan-v1`. Serialize as a JSON array of course IDs.

```js
// Save
localStorage.setItem('oes-plan-v1', JSON.stringify([...plan]));

// Load
const saved = JSON.parse(localStorage.getItem('oes-plan-v1') || '[]');
saved.forEach(id => plan.add(id));
```

Plan does NOT persist across profile changes (if the student changes grade or math level, the locked courses change, so the old plan may be invalid). On profile change: clear plan, re-seed locked courses, prompt "Your plan was reset because your profile changed."

---

## Prereq Enforcement in Plan Mode

When a student tries to add course X, check:

```js
function canPlan(courseId) {
  const course = getCourseById(courseId);
  return (course.prereqs || []).every(prereqId =>
    plan.has(prereqId) || lockedCourses.has(prereqId) || isCompleted(getCourseById(prereqId))
  );
}
```

If prereqs aren't met: show a tooltip "Requires [prereq name] — add that first." Don't block the click outright (some prereqs are advisory), but show a warning state.

---

## What Makes This Tractable

Most of the infrastructure already exists:

- `displayGrade()` already knows where each course fits in the student's sequence ✓
- `isCompleted()` already knows what's already done ✓
- The grid skeleton (rows, cells, semester halves) already works ✓
- The interest highlighting system (data-ring, interest-match) provides the model for plan highlighting ✓
- The grad requirements panel already knows the requirements ✓

New pieces needed:
1. `plan` Set + `lockedCourses` Set in state
2. `seedLockedCourses()` — called on init and on profile change
3. `getCourseStatus()` — new `planned` and `locked-in` cases
4. `renderPlanGrid()` — variant of `renderGrid()` with click-to-plan cells
5. `buildPlanCell()` — shows locked + planned + "+ add" slot
6. `renderWhatsleft()` — the footer strip
7. New CSS: `.status-planned`, `.status-locked-in`, `.capacity-bar`, `.whats-left-strip`

---

## Scope Decisions (locked in)

- **Single scenario only** (no A/B comparison) — call the tab "My Plan" not "Scenario"
- **No suggested future path** — future years start empty; student builds manually
- **Warn, don't block** on capacity overrun and weak prereqs
- **localStorage persistence** — no server, no sharing
- **Reset on profile change** — simpler than trying to reconcile

## Out of Scope (possible future)

- Multiple named scenarios
- "Suggest a path" button based on interests
- Shareable URL (encode plan as URL hash)
- Print-optimized plan view
- AP exam count enforcement (could add later; data is already in course tags)
