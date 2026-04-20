# OES Upper School Course Planner

## Project Overview

An interactive web app to help a parent plan their 9th-grade son's course trajectory at Oregon Episcopal School (OES) in Portland, OR. The student has strong interests in STEM and World Languages, a moderate-to-strong appetite for challenge, and loose ideas about college direction.

The goal is a practical planning tool — not just a display — that lets the parent explore options, understand dependencies, see decision deadlines, and think through tradeoffs interactively.

---

## Student Profile

- **Current grade:** 9th (2026–27 school year)
- **Interests:** STEM / Math & Science, World Languages
- **Academic pace:** Between "push him" and "balanced"
- **College direction:** A few loose ideas, still forming
- **Key insight:** Math placement this year is the single most consequential decision. The CS sequence also requires early commitment to reach advanced courses.

---

## Source Document

The full curriculum guide is `Curriculum_Guide-April_2026.pdf` — a 64-page OES Upper School Curriculum Guide for 2026–27. Key sections:
- Pages 4–8: Graduation requirements and four-year plan
- Pages 9–15: Academic policies (honors, TA program, AP exams, add/drop)
- Pages 16–59: Course descriptions by department
- Pages 60–63: Student life, athletics, support

---

## What We've Established So Far

### Analysis from prior conversation:

**Math is the critical path.** The sequence is:
`Algebra → Geometry → Advanced Algebra (or with Proofs H) → Precalculus (or with Proofs H) → AP Calc AB → AP Calc BC`
- To reach AP Calc BC by 12th grade, he needs to be in Geometry now (or ahead of it)
- Advanced Algebra with Proofs (H) requires A average + teacher rec
- Unlocking Linear Algebra (H) and Multivariable Calculus (H) senior year requires the Calc BC path
- These two courses are college-level and rare at high school level

**Computer Science requires early commitment.**
`Python I → Python II (H) → Python III: Data Science (H) → Machine Learning (H) / Algorithms (H)`
- Machine Learning requires Python III + AP Calc AB
- Must start Python I by 10th grade to reach Machine Learning senior year
- If he doesn't start until 11th, the most interesting courses are inaccessible

**World Languages — stay the course.**
- 2 years required; 3–4 strongly recommended for selective colleges
- Path to AP French or AP Spanish requires Level 4
- HLC/HCC (Spanish) in senior year = honors + Community Engagement project simultaneously

**Key deadlines:**
- TA application: May 1 of junior year (11th grade)
- Inquiry in Arts proposal: End of junior year (if relevant)
- World Religions must be completed before any other Religion & Philosophy course
- AP exam limits: Grade 9 = none; Grade 10 = 1; Grades 11–12 = 2 + OES AP courses

**Unique OES opportunities worth highlighting:**
1. Science Inquiry Project (SIP) — every core science year, public showcase, feeds Aardvark Expo
2. Teaching Assistant Program — grades 11–12, application required, can be 7th class
3. HLC/HCC Spanish — service learning at Vose Elementary, counts as CE project
4. Social Innovation & Entrepreneurship — senior spring, real social venture
5. Multivariable Calculus (H) — rarely offered at high school, requires Calc BC path
6. Linear Algebra (H) — college-level, fall of senior year
7. Machine Learning (H) — requires Python III + Calc AB
8. Mechanical Systems Engineering / Process Design Engineering — greenhouse/food systems

---

## App Vision

### Core concept
A four-column year-by-year planner (Grade 9–12) where the parent can:
1. **Set the student's current math placement** and see how it cascades through future years
2. **Toggle interests** (CS, advanced science, language depth, arts) and see which courses become available or locked
3. **See warnings** when a choice closes off a later opportunity
4. **See deadlines** prominently — things that must happen this year or next to keep options open
5. **Explore course details** on click/hover

### Recommended app structure

**Section 1: Student profile panel**
- Input: Current math level (dropdown: Algebra / Geometry / Advanced Algebra / Precalculus)
- Input: Language (Chinese / French / Spanish) and current level
- Toggles: Interest areas (Deep STEM / CS track / Language depth / Arts)
- This drives which paths are highlighted vs grayed out

**Section 2: Four-year course grid**
- Four columns (Grade 9 / 10 / 11 / 12)
- Rows by department: English, History, Math, Science, World Language, Religion & Philosophy, Arts, CS/Electives
- Cards show: course name, honors/AP indicator, prereqs, notes
- Color coding:
  - Gray/neutral = required, locked in
  - Amber/yellow = key decision point, choose wisely
  - Green = unique OES opportunity
  - Red = act now / deadline risk
  - Blue = recommended for this student's profile
  - Dimmed/strikethrough = locked out given current choices

**Section 3: Dependency / critical path view**
- A visual showing chains: e.g. "To reach Machine Learning → must take Python I by 10th grade → must take Python II (H) fall of 11th → Python III spring of 11th → ML available fall/spring of 12th"
- Similar chains for Math and Language
- Highlight which chains are currently "at risk" vs "on track"

**Section 4: Decision timeline / deadlines**
- Chronological list of things that must be decided by a specific point
- E.g. "Before 10th grade registration (April 2027): Decide on math track, decide whether to start CS"
- "By May 1 of 11th grade: TA application if interested"

**Section 5: Community Engagement tracker (optional)**
- 60 hours on campus + 20 off (or 40+40)
- Two projects required
- Which courses count as Social Impact (Community Engagement projects)

---

## Courses Data

All course data is in `courses-data.js`. Key fields:
- `id`, `name`, `department`, `grade` (array of eligible grades), `semester` (fall/spring/yearlong)
- `honors` (boolean), `ap` (boolean), `socialImpact` (boolean)
- `prereqs` (array of course IDs)
- `unlocks` (array of course IDs this enables)
- `tags`: `['required', 'decision', 'unique', 'deadline', 'stem', 'language', 'cs']`
- `notes` (short advisory note for this student)
- `deadlineNote` (if there's a time-sensitive action)

---

## File Structure

```
oes-planner/
├── README.md              ← This file (context for Claude Code)
├── index.html             ← Main app
├── courses-data.js        ← All course data structured for the app
├── planner.js             ← App logic (state, filtering, dependency graph)
├── styles.css             ← Styling
└── DECISIONS.md           ← Log of design decisions made
```

---

## Design Principles

- **Parent-facing, not student-facing.** Tone is informational and advisory, not gamified.
- **Actionable over comprehensive.** Surface what matters for *this* student's profile, not every possible course.
- **Warnings before it's too late.** Deadline risks should be visually prominent, not buried.
- **No frameworks.** Vanilla HTML/CSS/JS only — easy to open in any browser, no build step.
- **Printable.** The four-year grid should be printable as a single-page reference.

---

## Key Policies to Encode

From the curriculum guide:

- Grade 9: 7 courses. Grades 10–12: 6 courses. (7th course needs approval)
- Grade 9 fall: pass/fail grading
- AP exams: Grade 9 = none; Grade 10 = 1 max; Grades 11–12 = 2 + enrolled OES AP courses
- TA application deadline: May 1 of junior year
- World Religions must precede all other R&P courses; cannot take concurrently
- Honors courses: require teacher rec + demonstrated record; 45 min HW per class session
- Students must earn C- or higher to progress in math sequence
- Extracurricular: 2/year in grades 9–10; 1/year in grades 11–12
- Community Engagement: 60 hrs on campus + 20 off (or 40+40); 2 projects; unpaid; nonprofit
- Winterim required every year
- All grade-level trips required at start of year; seniors have end-of-year trip too
