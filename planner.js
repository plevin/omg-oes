// OES Course Planner — App Logic
// Reads from courses-data.js (COURSES, CRITICAL_PATHS, DEADLINES, GRADUATION_REQUIREMENTS)

// ── STATE ─────────────────────────────────────────────────────────────────

const state = {
  currentGrade: 9,        // Student's current grade (9–12)
  mathLevel: 'geometry',
  scienceLevel: 'physics-1d', // Current science placement
  language: 'spanish',
  langLevel: 2,
  interests: {
    stem:       true,
    cs:         false,
    english:    false,
    humanities: false,
    lang:       true,
    arts:       false,
  },
  selectedCourseId: null,
};

// School year for the student's 9th-grade year (used to label columns)
const BASE_SCHOOL_YEAR = 2026; // i.e. 2026–27

function schoolYear(grade) {
  const offset = grade - state.currentGrade;
  const start = BASE_SCHOOL_YEAR + offset;
  return `${start}–${String(start + 1).slice(-2)}`;
}

const PLAN_LABELS = {
  9:  'Four-year plan',
  10: 'Three-year plan',
  11: 'Two-year plan',
  12: 'Final year plan',
};

// ── TOAST ─────────────────────────────────────────────────────────────────

function showToast(message, type = 'error') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  // Trigger transition
  requestAnimationFrame(() => toast.classList.add('toast-visible'));
  setTimeout(() => {
    toast.classList.remove('toast-visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, 4500);
}

// ── DEPARTMENT ROW DEFINITIONS ────────────────────────────────────────────

const DEPT_ROWS = [
  { key: 'English',           label: 'English' },
  { key: 'History',           label: 'History' },
  { key: 'Math',              label: 'Math' },
  { key: 'Science',           label: 'Science' },
  { key: 'CS',                label: 'CS' },
  { key: 'World Languages',   label: 'Languages' },
  { key: 'Arts',              label: 'Arts' },
  { key: 'Religion & Philosophy', label: 'Religion' },
  { key: 'Health',            label: 'Health / PE' },
  { key: 'Interdisciplinary', label: 'Interdisciplinary' },
  { key: 'Special',           label: 'Special' },
];

// ── MATH LEVEL ORDERING ───────────────────────────────────────────────────

const MATH_ORDER = {
  'algebra': 0,
  'geometry': 1,
  'advalg': 2,
  'advalg-h': 3,
  'precalc': 4,
  'precalc-h': 5,
  'calc-ab': 6,
  'calc-bc': 7,
};

// Maps state.mathLevel to the course id of the student's current course
const MATH_LEVEL_TO_COURSE = {
  'algebra':   'math-algebra',
  'geometry':  'math-geometry',
  'advalg':    'math-advalg',
  'advalg-h':  'math-advalg-proofs',
  'precalc':   'math-precalc',
  'precalc-h': 'math-precalc-proofs',
  'calc-ab':   'math-calc-ab',
  'calc-bc':   'math-calc-bc',
};

// Sequential order of math courses for "completed" detection
const MATH_COURSE_ORDER = {
  'math-algebra': 0,
  'math-geometry': 1,
  'math-advalg': 2,
  'math-advalg-proofs': 3,
  'math-precalc': 4,
  'math-precalc-proofs': 5,
  'math-calc-ab': 6,
  'math-calc-bc': 7,
  'math-linear-alg': 8,
  'math-multivariable': 9,
};

// Years-after-Algebra offset for each math course.
// Parallel paths (standard vs honors) share the same offset so they appear in the same column.
// Used to anchor the math grid to the student's actual current year.
const MATH_GRADE_OFFSET = {
  'math-algebra': 0,
  'math-geometry': 1,
  'math-advalg': 2,       // Grade 10 for standard Geometry student
  'math-advalg-proofs': 2, // Grade 10 — same year, honors option
  'math-stats': 2,
  'math-precalc': 3,       // Grade 11
  'math-precalc-proofs': 3,
  'math-ap-stats': 3,
  'math-calc-ab': 4,       // Grade 12
  'math-calc-bc': 4,
  'math-linear-alg': 4,
  'math-multivariable': 4,
};

// ── SCIENCE LEVEL ORDERING ────────────────────────────────────────────────

// Years-after-Physics offset for the core science sequence courses.
// Only the required-sequence courses are here; electives (Engineering, Marine, etc.)
// continue to use the default prereq-based displayGrade logic.
// Both Physics tracks (1D and 2D) are at offset 0 since they're both grade-9 placements.
const SCIENCE_GRADE_OFFSET = {
  'sci-physics-1d': 0,
  'sci-physics-2d': 0,
  'sci-chemistry':  1,
  'sci-chem-h':     1,
  'sci-biology':    2,
  'sci-bio-h':      2,
};

// Maps state.scienceLevel to a sequence offset (parallel to SCIENCE_GRADE_OFFSET)
const SCIENCE_LEVEL_OFFSET = {
  'physics-1d': 0,
  'physics-2d': 0,
  'chemistry':  1,
  'biology':    2,
  'advanced':   3,
};

// Maps state.scienceLevel to the course ids that represent the student's current science course
const SCIENCE_LEVEL_TO_COURSES = {
  'physics-1d': ['sci-physics-1d'],
  'physics-2d': ['sci-physics-2d'],
  'chemistry':  ['sci-chemistry', 'sci-chem-h'],
  'biology':    ['sci-biology', 'sci-bio-h'],
  'advanced':   [],
};

// Language level for each course in the world language sequence.
// Value = the level at which a student is taking this course.
// Used to anchor the language grid to the student's current level (state.langLevel),
// so Spanish II shows in grade 9 for a Level-2 student, etc.
const LANG_LEVEL_FOR_COURSE = {
  'lang-spanish1': 1,
  'lang-spanish2': 2,
  'lang-spanish3': 3,
  'lang-spanish4': 4,
  'lang-ap-spanish': 5,
  'lang-hlc': 5,
  'lang-french2': 2,
  'lang-french3': 3,
  'lang-french4': 4,
  'lang-ap-french': 5,
  'lang-chinese2': 2,
  'lang-chinese3': 3,
  'lang-chinese4': 4,
  'lang-chinese5': 5,
};

// ── EFFECTIVE TAGS ────────────────────────────────────────────────────────
// Returns a course's stored tags augmented with implicit department-based
// interest tags. This avoids having to manually add 'english' or 'humanities'
// to every individual course entry in the data file.

function getEffectiveTags(course) {
  const tags = [...(course.tags || [])];
  // All English-department courses are 'english' interest
  if (course.department === 'English') tags.push('english');
  // History and Religion & Philosophy are 'humanities' interest
  if (course.department === 'History' ||
      course.department === 'Religion & Philosophy') tags.push('humanities');
  return tags;
}

// ── STATUS COMPUTATION ─────────────────────────────────────────────────────
// Determines the display status of a course given current state

function getCourseStatus(course) {
  const tags = getEffectiveTags(course);

  // Completed math courses shown distinctly
  if (isCompleted(course)) return 'completed';

  // Check if locked out based on profile
  if (isLockedOut(course)) return 'locked';

  // Priority: deadline > decision > unique > recommended > required
  if (tags.includes('deadline')) return 'deadline';
  if (tags.includes('decision')) return 'decision';
  if (tags.includes('unique')) return 'unique';

  // Check if recommended based on interests
  if (isRecommended(course)) return 'recommended';

  return 'required';
}

function isCompleted(course) {
  if (course.department === 'Math') {
    const currentCourseId = MATH_LEVEL_TO_COURSE[state.mathLevel];
    if (!currentCourseId) return false;
    const currentOrder = MATH_COURSE_ORDER[currentCourseId] ?? -1;
    const courseOrder = MATH_COURSE_ORDER[course.id] ?? 999;
    return courseOrder < currentOrder;
  }
  if (course.department === 'Science' && SCIENCE_GRADE_OFFSET[course.id] !== undefined) {
    const currentSciOffset = SCIENCE_LEVEL_OFFSET[state.scienceLevel] ?? 0;
    const courseOffset = SCIENCE_GRADE_OFFSET[course.id];
    return courseOffset < currentSciOffset;
  }
  if (course.department === 'World Languages') {
    const courseLevel = LANG_LEVEL_FOR_COURSE[course.id];
    if (courseLevel === undefined) return false;
    // Course is completed if student's current level is strictly beyond it
    return state.langLevel > courseLevel;
  }
  return false;
}

// Returns true if this course belongs to the chosen language
function isChosenLanguageCourse(course) {
  if (course.department !== 'World Languages') return true;
  const lang = state.language;
  if (lang === 'spanish') {
    return course.id.startsWith('lang-spanish') || course.id === 'lang-hlc' || course.id === 'lang-ap-spanish';
  }
  if (lang === 'french') {
    return course.id.startsWith('lang-french') || course.id === 'lang-ap-french';
  }
  if (lang === 'chinese') {
    return course.id.startsWith('lang-chinese');
  }
  return true;
}

function isLockedOut(course) {
  const id = course.id;
  const level = MATH_ORDER[state.mathLevel];

  // Honors math path — lock only when genuinely unreachable in remaining years.
  // A student in Geometry (9th) can still reach the full honors sequence:
  //   10th: Adv Alg Proofs  →  11th: Precalc Proofs  →  12th: Calc BC / Linear Alg / Multivariable
  // A student in Algebra (9th) cannot — only 3 more years and they'd land at Precalc.

  if (id === 'math-advalg-proofs') {
    // Prereq is Geometry. Lock only if below Geometry.
    return level < MATH_ORDER['geometry'];
  }
  if (id === 'math-precalc-proofs') {
    // Needs Adv Alg Proofs path, which requires Geometry first.
    return level < MATH_ORDER['geometry'];
  }
  if (id === 'math-calc-ab' || id === 'math-calc-bc' || id === 'math-linear-alg' || id === 'math-multivariable') {
    // Algebra 9th graders can only reach Precalculus by senior year — Calc AB/BC are unreachable.
    // Geometry and above have a viable path to Calc AB (or BC via the honors track).
    return level < MATH_ORDER['geometry'];
  }

  // Machine Learning: any 9th grader can reach Calc AB by 12th grade, so don't lock by math level.
  // Instead mark it at-risk in the critical paths view when CS track is off.

  return false;
}

function isRecommended(course) {
  const tags = getEffectiveTags(course);
  const id = course.id;

  if (state.interests.stem       && tags.includes('stem'))       return true;
  if (state.interests.cs         && tags.includes('cs'))         return true;
  if (state.interests.english    && tags.includes('english'))    return true;
  if (state.interests.humanities && tags.includes('humanities')) return true;
  if (state.interests.lang       && tags.includes('language'))   return true;
  if (state.interests.arts       && tags.includes('arts'))       return true;

  // Specific recommendations for this student
  if (state.interests.stem) {
    if (['math-advalg-proofs', 'math-precalc-proofs', 'math-calc-ab', 'math-calc-bc',
         'sci-chem-h', 'sci-bio-h', 'sci-advphys-mech', 'sci-engineering'].includes(id)) return true;
  }

  return false;
}

// ── PLAN STATE ────────────────────────────────────────────────────────────
// plan: courses the student has explicitly added to their schedule
// lockedCourses: auto-seeded from profile; cannot be removed

const plan = new Map(); // Map<courseId, grade> — grade is the year the student plans to take it
const lockedCourses = new Set();

// Maps language + level to the canonical current course ID
const LANG_CURRENT_COURSE_ID = {
  spanish: { 1:'lang-spanish1', 2:'lang-spanish2', 3:'lang-spanish3', 4:'lang-spanish4', 5:'lang-ap-spanish' },
  french:  { 2:'lang-french2',  3:'lang-french3',  4:'lang-french4',  5:'lang-ap-french' },
  chinese: { 2:'lang-chinese2', 3:'lang-chinese3', 4:'lang-chinese4', 5:'lang-chinese5'  },
};

function seedLockedCourses() {
  lockedCourses.clear();

  // Current math course
  const mathId = MATH_LEVEL_TO_COURSE[state.mathLevel];
  if (mathId) lockedCourses.add(mathId);

  // Current science course (standard/first track; student may be in honors instead)
  const sciIds = SCIENCE_LEVEL_TO_COURSES[state.scienceLevel] || [];
  if (sciIds[0]) lockedCourses.add(sciIds[0]);

  // Current language course
  const langId = LANG_CURRENT_COURSE_ID[state.language]?.[state.langLevel];
  if (langId) lockedCourses.add(langId);

  // English: grades 9–11 are fixed; grade 12 is student-chosen electives
  const engForGrade = { 9: 'eng9', 10: 'eng10', 11: 'eng11' };
  const engId = engForGrade[state.currentGrade];
  if (engId) lockedCourses.add(engId);

  // History: grades 9–10 are fixed; grades 11–12 are elective choices
  const histForGrade = { 9: 'hist-global', 10: 'hist-us' };
  const histId = histForGrade[state.currentGrade];
  if (histId) lockedCourses.add(histId);

  // Health (required in grade 9 — all students have taken or are taking it)
  // Always lock it so it counts toward grad-requirement credits regardless of
  // current grade. displayGrade() clamps it to grade 9, so it only appears
  // in the grid column for 9th graders; for older students it's invisible
  // but still contributes its credit to renderWhatsLeft().
  lockedCourses.add('health');

  // Winterim — happens every year; lock it in each year's Special cell
  lockedCourses.add('winterim');

  // Remove any manually-planned courses that are now locked
  for (const id of lockedCourses) plan.delete(id);
}

// Some prereq IDs in courses-data.js are abstract/group IDs that don't correspond
// to a single real course — they're satisfied by any of the listed concrete courses.
// e.g. 'sci-physics' means "any Physics Foundation course" (1D or 2D).
const PREREQ_ALIASES = {
  'sci-physics': ['sci-physics-1d', 'sci-physics-2d'],
};

// Resolve a prereq ID to the concrete IDs that can satisfy it.
function resolvePrereq(prereqId) {
  return PREREQ_ALIASES[prereqId] ?? [prereqId];
}

// forGrade: the year the student wants to take courseId. When provided,
// a planned prereq is only valid if it is scheduled BEFORE that year.
// Locked courses (current year) always count as satisfied.
function canPlan(courseId, forGrade = null) {
  const course = getCourseById(courseId);
  if (!course) return false;
  return (course.prereqs || []).every(prereqId => {
    const candidates = resolvePrereq(prereqId);
    return candidates.some(cid => {
      if (lockedCourses.has(cid)) return true;               // taking it now ✓
      const prereq = getCourseById(cid);
      if (prereq && isCompleted(prereq)) return true;        // already done ✓
      if (plan.has(cid)) {
        if (forGrade === null) return true;                  // no timing context — permissive
        return plan.get(cid) < forGrade;                     // must be scheduled BEFORE
      }
      return false;
    });
  });
}

// Return the names of prereqs that are missing or not yet scheduled
// before forGrade, for use in error messages.
function missingPrereqs(courseId, forGrade) {
  const course = getCourseById(courseId);
  if (!course) return [];
  return (course.prereqs || []).flatMap(prereqId => {
    const candidates = resolvePrereq(prereqId);
    const satisfied = candidates.some(cid => {
      if (lockedCourses.has(cid)) return true;
      const prereq = getCourseById(cid);
      if (prereq && isCompleted(prereq)) return true;
      if (plan.has(cid) && plan.get(cid) < forGrade) return true;
      return false;
    });
    if (satisfied) return [];
    // Return the name of the first real candidate for the error message
    const first = candidates.map(getCourseById).find(Boolean);
    return first ? [first.name] : [prereqId];
  });
}

function togglePlan(courseId) {
  if (lockedCourses.has(courseId)) return;
  plan.delete(courseId); // remove only; adding is done via buildAddSlot with grade
  savePlan();
  renderPlanGrid();
}

function savePlan() {
  try {
    localStorage.setItem('oes-plan-v1', JSON.stringify([...plan.entries()]));
  } catch(e) {
    showToast("Your plan couldn't be saved — storage may be full or unavailable in private browsing.");
  }
}

function loadPlan() {
  try {
    const saved = JSON.parse(localStorage.getItem('oes-plan-v1') || '[]');
    plan.clear();
    // Support both new format [[id, grade], ...] and legacy [id, ...]
    saved.forEach(entry => {
      if (Array.isArray(entry)) plan.set(entry[0], entry[1]);
      // else: legacy string IDs — skip (grade unknown, will need re-planning)
    });
  } catch(e) {
    plan.clear();
    showToast("Your saved plan couldn't be loaded — it may be corrupted. Starting fresh.");
  }
}

function validatePlanAfterProfileChange() {
  const broken = [];
  for (const [id] of plan) {
    if (!canPlan(id)) {
      const c = getCourseById(id);
      if (c) broken.push(c.name);
    }
  }
  if (broken.length > 0) {
    const names = broken.length <= 2
      ? broken.join(' and ')
      : broken.slice(0, 2).join(', ') + ` and ${broken.length - 2} more`;
    showToast(`Profile change broke prereqs for: ${names}. Review your plan.`, 'warning');
  }
}

function refreshPlanForProfileChange() {
  seedLockedCourses();
  validatePlanAfterProfileChange();
  savePlan();
  if (!document.getElementById('view-plan')?.classList.contains('hidden')) {
    renderPlanGrid();
  }
}

// Counts academic slot-load for a grade year (excludes Special dept)
// 1 yearlong = 1 slot; 1 semester course = 0.5 slot; max 6 (7th requires approval)
function computeCapacity(grade) {
  let slots = 0;
  // Locked courses — use displayGrade to determine which year they count
  for (const id of lockedCourses) {
    const c = getCourseById(id);
    if (!c || c.department === 'Special') continue;
    if (displayGrade(c) !== grade) continue;
    slots += c.semester === 'yearlong' ? 1 : 0.5;
  }
  // Planned courses — use the recorded grade from plan Map
  for (const [id, planGrade] of plan) {
    const c = getCourseById(id);
    if (!c || c.department === 'Special') continue;
    if (planGrade !== grade) continue;
    slots += c.semester === 'yearlong' ? 1 : 0.5;
  }
  return slots;
}

function capacityDots(slots, max = 6) {
  const full  = Math.floor(slots);
  const half  = (slots % 1) >= 0.5 ? 1 : 0;
  const empty = Math.max(0, max - full - half);
  return '●'.repeat(full) + (half ? '◐' : '') + '○'.repeat(empty);
}

// ── PLAN RENDERING ────────────────────────────────────────────────────────

function renderPlanGrid() {
  const header = document.getElementById('plan-grid-header');
  const body   = document.getElementById('plan-grid-body');
  if (!header || !body) return;

  const grades = [];
  for (let g = state.currentGrade; g <= 12; g++) grades.push(g);

  document.getElementById('plan-grid-container')
    ?.style.setProperty('--grid-cols', grades.length);

  // ── Header with capacity bars ──────────────────────────────────────────
  header.innerHTML = '<div class="grid-corner"></div>';
  grades.forEach(grade => {
    const slots = computeCapacity(grade);
    const colorClass = slots >= 6 ? 'capacity-red' : slots >= 5.5 ? 'capacity-amber' : '';
    const col = document.createElement('div');
    col.className = 'grade-label';
    col.innerHTML = `
      Grade ${grade} <span class="grade-year">${schoolYear(grade)}</span>
      <div class="capacity-bar ${colorClass}" title="${slots} of 6 slots used">
        ${capacityDots(slots)} <span class="capacity-num">${slots}/6</span>
      </div>`;
    header.appendChild(col);
  });

  // ── Plan body ──────────────────────────────────────────────────────────
  body.innerHTML = '';

  DEPT_ROWS.forEach(deptDef => {
    const deptCourses = COURSES.filter(c => c.department === deptDef.key);
    if (deptCourses.length === 0) return;

    const row = document.createElement('div');
    row.className = 'grid-row';

    const label = document.createElement('div');
    label.className = 'row-label';
    label.textContent = deptDef.label;
    row.appendChild(label);

    grades.forEach(grade => {
      row.appendChild(buildPlanCell(deptDef.key, grade, deptCourses));
    });

    body.appendChild(row);
  });

  renderWhatsLeft();
}

function buildPlanCell(dept, grade, deptCourses) {
  const cell = document.createElement('div');
  cell.className = 'cell plan-cell';

  // Locked courses in this dept+grade
  // Winterim special-case: show in EVERY grade year (it's annual)
  const lockedHere = [...lockedCourses]
    .map(id => getCourseById(id))
    .filter(c => {
      if (!c || c.department !== dept) return false;
      if (c.id === 'winterim') return c.grades.includes(grade);
      return displayGrade(c) === grade;
    });

  // Manually planned courses in this dept+grade — use recorded grade from Map
  const plannedHere = [...plan.entries()]
    .filter(([id, planGrade]) => planGrade === grade)
    .map(([id]) => getCourseById(id))
    .filter(c => c && c.department === dept);

  lockedHere.forEach(c  => cell.appendChild(buildPlanCard(c, 'locked-in')));
  plannedHere.forEach(c => cell.appendChild(buildPlanCard(c, 'planned')));

  // "+ add" slot — only show if there are unplanned options for this dept+grade
  const addSlot = buildAddSlot(dept, grade, deptCourses);
  if (addSlot) cell.appendChild(addSlot);

  if (lockedHere.length === 0 && plannedHere.length === 0 && !addSlot) {
    cell.innerHTML = '<div class="empty-cell"></div>';
  }

  return cell;
}

function buildPlanCard(course, status) {
  const card = document.createElement('div');
  card.className = `course-card plan-card status-${status}`;
  card.dataset.courseId = course.id;

  const name = document.createElement('div');
  name.className = 'card-name';
  name.textContent = course.name;
  card.appendChild(name);

  if (course.honors) card.appendChild(makeBadge('H', 'honors'));
  if (course.ap)     card.appendChild(makeBadge('AP', 'ap'));

  if (course.semester !== 'yearlong') {
    const sem = document.createElement('div');
    sem.className = 'card-sem';
    sem.textContent = { fall: 'fall', spring: 'spring', 'fall-spring': 'fall or spring' }[course.semester] ?? course.semester;
    card.appendChild(sem);
  }

  if (status === 'locked-in') {
    const icon = document.createElement('span');
    icon.className = 'card-lock-icon';
    icon.title = 'Current placement — cannot be removed';
    icon.textContent = '🔒';
    card.appendChild(icon);
    card.addEventListener('click', () => showDetail(course.id));
  } else {
    card.addEventListener('click', () => togglePlan(course.id));
  }

  return card;
}

function buildAddSlot(dept, grade, deptCourses) {
  const eligible = (deptCourses || COURSES.filter(c => c.department === dept)).filter(c => {
    if (plan.has(c.id) || lockedCourses.has(c.id)) return false;
    if (c.id === 'winterim') return false;
    // Math, Science, and Language sequences are placement-anchored: displayGrade()
    // offsets the course to the right year based on the student's current level.
    // For all other departments the student freely chooses which year to take the
    // course, so we just check whether it's offered in that grade.
    if (dept === 'Math' || dept === 'Science' || dept === 'World Languages') {
      return displayGrade(c) === grade;
    }
    return c.grades.includes(grade);
  });

  if (eligible.length === 0) return null;

  const slot = document.createElement('div');
  slot.className = 'add-slot';

  const btn = document.createElement('button');
  btn.className = 'add-slot-btn';
  btn.textContent = `+ add`;

  const picker = document.createElement('div');
  picker.className = 'add-slot-picker hidden';

  // Populate picker items
  eligible.sort((a, b) => a.name.localeCompare(b.name)).forEach(c => {
    const item = document.createElement('div');
    const warn = !canPlan(c.id, grade);
    item.className = `add-slot-item${warn ? ' prereq-warn' : ''}`;
    const semLabel = { fall: '· fall', spring: '· spring', 'fall-spring': '· fall or spring', yearlong: '' }[c.semester] ?? '';
    item.innerHTML = `<span class="add-item-name">${c.name}</span><span class="add-item-meta">${semLabel}${warn ? ' ⚠ prereq' : ''}</span>`;
    item.addEventListener('click', e => {
      e.stopPropagation();
      if (!canPlan(c.id, grade)) {
        const missing = missingPrereqs(c.id, grade).join(', ');
        showToast(`Add prerequisite first: ${missing || 'a required prior course'}.`, 'warning');
        picker.classList.add('hidden');
        return;
      }
      plan.set(c.id, grade); // record which year the student is planning this course
      savePlan();
      picker.classList.add('hidden');
      renderPlanGrid();
    });
    picker.appendChild(item);
  });

  btn.addEventListener('click', e => {
    e.stopPropagation();
    document.querySelectorAll('.add-slot-picker:not(.hidden)').forEach(p => {
      if (p !== picker) p.classList.add('hidden');
    });
    picker.classList.toggle('hidden');
    if (!picker.classList.contains('hidden')) {
      setTimeout(() => document.addEventListener('click', () => picker.classList.add('hidden'), { once: true }), 0);
    }
  });

  slot.appendChild(btn);
  slot.appendChild(picker);
  return slot;
}

// ── WHAT'S LEFT FOOTER ────────────────────────────────────────────────────

function renderWhatsLeft() {
  const container = document.getElementById('whats-left');
  if (!container) return;

  container.innerHTML = '';

  // Credit totals by department (locked + planned)
  const credits = {};
  for (const id of [...lockedCourses, ...plan.keys()]) {
    const c = getCourseById(id);
    if (!c) continue;
    const dept = c.department;
    credits[dept] = (credits[dept] || 0) + (c.semester === 'yearlong' ? 1 : 0.5);
  }

  const reqs = [
    { dept: 'English',               label: 'English',   required: 4,   unit: 'yr'  },
    { dept: 'History',               label: 'History',   required: 2,   unit: 'cr'  },
    { dept: 'Math',                  label: 'Math',      required: 3,   unit: 'yr'  },
    { dept: 'Science',               label: 'Science',   required: 3,   unit: 'yr'  },
    { dept: 'World Languages',       label: 'Language',  required: 2,   unit: 'yr'  },
    { dept: 'Arts',                  label: 'Arts',      required: 1.5, unit: 'cr'  },
    { dept: 'Religion & Philosophy', label: 'Religion',  required: 2,   unit: 'cr'  },
    { dept: 'Health',                label: 'Health',    required: 1,   unit: 'cr'  },
  ];

  reqs.forEach(req => {
    const have = credits[req.dept] || 0;
    const met  = have >= req.required;
    const partial = have > 0 && !met;

    const pill = document.createElement('div');
    pill.className = `req-pill ${met ? 'req-met' : partial ? 'req-partial' : 'req-missing'}`;
    pill.innerHTML = met
      ? `<span class="pill-label">${req.label}</span><span class="pill-check">✓ ${have}${req.unit}</span>`
      : `<span class="pill-label">${req.label}</span><span class="pill-count">${have}/${req.required}${req.unit}</span>`;
    container.appendChild(pill);
  });
}

// ── DISPLAY GRADE COMPUTATION ─────────────────────────────────────────────
// Returns the grade column where this course should appear.
// Uses min(course.grades) but bumps forward when prereqs aren't finishable
// until the same or later grade. Accounts for fall→spring same-year sequencing.

// Courses whose prereqs allow co-enrollment (e.g. "in or have taken Chemistry")
const COENROLL_OK = new Set(['sci-blc-arts', 'sci-blc-pnw', 'sci-advphys-thermo']);

function displayGrade(course) {
  // Math: anchor the entire sequence to the student's current grade.
  // Both honors and standard tracks land in the same column so the parent
  // sees the alternatives side-by-side, not staggered across years.
  // We do NOT clamp to course.grades minGrade — that would push accelerated students'
  // current course into the wrong column. We only cap at grade 12.
  if (course.department === 'Math' && MATH_GRADE_OFFSET[course.id] !== undefined) {
    const currentCourseId = MATH_LEVEL_TO_COURSE[state.mathLevel];
    const currentOffset = MATH_GRADE_OFFSET[currentCourseId] ?? 1;
    const courseOffset = MATH_GRADE_OFFSET[course.id];
    const rawGrade = state.currentGrade + (courseOffset - currentOffset);
    return Math.min(rawGrade, 12);
  }

  // Science: anchor core sequence (Physics → Chemistry → Biology) to the student's placement.
  // Same approach as Math: no minGrade clamp; allow courses to appear in early columns
  // for students who are ahead of the standard grade-9-starts-physics track.
  if (course.department === 'Science' && SCIENCE_GRADE_OFFSET[course.id] !== undefined) {
    const currentSciOffset = SCIENCE_LEVEL_OFFSET[state.scienceLevel] ?? 0;
    const courseOffset = SCIENCE_GRADE_OFFSET[course.id];
    const rawGrade = state.currentGrade + (courseOffset - currentSciOffset);
    return Math.min(rawGrade, 12);
  }

  // World Languages: anchor the sequence to the student's current level and current grade.
  if (course.department === 'World Languages' && LANG_LEVEL_FOR_COURSE[course.id] !== undefined) {
    const courseLevel = LANG_LEVEL_FOR_COURSE[course.id];
    const rawGrade = state.currentGrade + (courseLevel - state.langLevel);
    return Math.min(rawGrade, 12);
  }

  const minGrade = Math.min(...course.grades);
  if (COENROLL_OK.has(course.id)) return minGrade;

  let effectiveGrade = minGrade;

  for (const prereqId of (course.prereqs || [])) {
    const prereq = getCourseById(prereqId);
    if (!prereq) continue;
    const prereqMin = Math.min(...prereq.grades);

    // A fall-semester prereq can be completed before a spring-semester course
    // in the same academic year — no bump needed.
    const prereqFallCourseSpring =
      prereq.semester === 'fall' &&
      (course.semester === 'spring' || course.semester === 'fall-spring');

    if (prereqFallCourseSpring && prereqMin === minGrade) continue;

    // Otherwise the course must start AFTER the prereq's first offering.
    if (prereqMin >= effectiveGrade) {
      effectiveGrade = prereqMin + 1;
    }
  }

  // Clamp to the course's own eligible grade range.
  // Also ensure the course doesn't appear in a grade column before the student's
  // current grade — electives available to grades 9-12 should show in the current
  // year for a 10th or 11th grader, not in the (already-past) grade-9 column.
  const maxGrade = Math.max(...course.grades);
  return Math.min(Math.max(effectiveGrade, state.currentGrade), maxGrade);
}

// ── GRID RENDERING ─────────────────────────────────────────────────────────

function renderGrid() {
  const gridBody = document.getElementById('grid-body');
  if (!gridBody) return;

  // Grades to display: student's current grade through Grade 12
  const grades = [];
  for (let g = state.currentGrade; g <= 12; g++) grades.push(g);

  // Sync column count to CSS so header and rows stay aligned
  const numCols = grades.length;
  document.querySelector('#view-grid .grid-container')?.style.setProperty('--grid-cols', numCols);

  gridBody.innerHTML = '';

  DEPT_ROWS.forEach(deptDef => {
    const deptCourses = COURSES.filter(c => c.department === deptDef.key);
    if (deptCourses.length === 0) return;

    const row = document.createElement('div');
    row.className = 'grid-row';

    // Row label
    const label = document.createElement('div');
    label.className = 'row-label';
    label.textContent = deptDef.label;
    row.appendChild(label);

    // One cell per remaining grade
    grades.forEach(grade => {
      const cell = document.createElement('div');
      cell.className = 'cell';

      const isArtsRow = deptDef.key === 'Arts';
      const isArtsLaterYear = isArtsRow && grade > state.currentGrade;

      const gradeCourses = deptCourses.filter(c => {
        // For sequence-anchored departments, skip catalog grade range check —
        // displayGrade() anchors the course to the student's actual placement year,
        // which may differ from the catalog minGrade for accelerated students.
        const isSequenceDept = ['Math', 'World Languages', 'Science'].includes(c.department);
        if (!isSequenceDept && !c.grades.includes(grade)) return false;

        // Arts courses: in the current grade show everything available so far;
        // in later grade columns show only newly-unlocked (prereq-gated) courses.
        // A compact "↺ recurring" chip covers the continuing open-entry options.
        if (isArtsRow) {
          if (grade === state.currentGrade) return displayGrade(c) <= grade;
          return displayGrade(c) === grade;
        }

        // Show each course only in its computed display grade (prereq-aware)
        if (displayGrade(c) !== grade) return false;
        // Filter World Languages to selected language only
        if (!isChosenLanguageCourse(c)) return false;
        return true;
      });

      // Arts later-year columns: always show the "recurring" chip even if nothing new
      if (isArtsLaterYear) {
        const chip = document.createElement('div');
        chip.className = 'arts-recurring-note';
        chip.textContent = `↺ arts electives available each year`;
        cell.appendChild(chip);
      }

      if (gradeCourses.length === 0) {
        if (!isArtsLaterYear) cell.innerHTML = '<div class="empty-cell"></div>';
      } else if (isArtsRow && !isArtsLaterYear) {
        // ── Arts current-year cell: semester-split elective widgets + yearlong card.
        //    Too many courses to show as individual cards; split into Fall/Spring
        //    widgets so the student can see the semester structure at a glance.
        const yearlong  = gradeCourses.filter(c => c.semester === 'yearlong');
        const fallGroup = gradeCourses.filter(c => c.semester === 'fall' || c.semester === 'fall-spring');
        const springGroup = gradeCourses.filter(c => c.semester === 'spring');

        yearlong.forEach(c => cell.appendChild(buildCourseCard(c)));

        const semRow = document.createElement('div');
        semRow.className = 'cell-semesters';

        if (fallGroup.length > 0) {
          const half = makeSemHalf('Fall');
          half.appendChild(buildElectiveGroup(fallGroup, { title: 'Arts Options', chooseN: 1 }));
          semRow.appendChild(half);
        }
        if (springGroup.length > 0) {
          const half = makeSemHalf('Spring');
          // If only a few spring options, show them as individual cards instead of a widget
          if (springGroup.length <= 3) {
            springGroup.forEach(c => half.appendChild(buildCourseCard(c)));
          } else {
            half.appendChild(buildElectiveGroup(springGroup, { title: 'Arts Options', chooseN: 1 }));
          }
          semRow.appendChild(half);
        }
        cell.appendChild(semRow);
      } else {
        const electives = gradeCourses.filter(c => c.tags.includes('senior-elective'));
        const regular   = gradeCourses.filter(c => !c.tags.includes('senior-elective'));

        // ── 1. Yearlong courses (no semester label — they're the required backbone)
        regular.filter(c => c.semester === 'yearlong')
               .forEach(c => cell.appendChild(buildCourseCard(c)));

        // ── 2. Semester courses: fall half | spring half
        //    When a half has more than 2 courses they're elective choices —
        //    collapse them into a compact group widget to prevent the row from
        //    growing to hundreds of pixels (e.g. History grade 11).
        const fallReg   = regular.filter(c => c.semester === 'fall' || c.semester === 'fall-spring');
        const springReg = regular.filter(c => c.semester === 'spring');

        if (fallReg.length > 0 || springReg.length > 0) {
          const semRow = document.createElement('div');
          semRow.className = 'cell-semesters';
          if (fallReg.length > 0) {
            const half = makeSemHalf('Fall');
            if (fallReg.length > 2) {
              half.appendChild(buildElectiveGroup(fallReg, { title: 'Electives', chooseN: 1 }));
            } else {
              fallReg.forEach(c => half.appendChild(buildCourseCard(c)));
            }
            semRow.appendChild(half);
          }
          if (springReg.length > 0) {
            const half = makeSemHalf('Spring');
            if (springReg.length > 2) {
              half.appendChild(buildElectiveGroup(springReg, { title: 'Electives', chooseN: 1 }));
            } else {
              springReg.forEach(c => half.appendChild(buildCourseCard(c)));
            }
            semRow.appendChild(half);
          }
          cell.appendChild(semRow);
        }

        // ── 3. Senior electives — one full-width collapsible widget.
        //    Courses sorted: yearlong → fall/either → spring.
        if (electives.length > 0) {
          const sorted = [
            ...electives.filter(c => c.semester === 'yearlong'),
            ...electives.filter(c => c.semester !== 'spring' && c.semester !== 'yearlong'),
            ...electives.filter(c => c.semester === 'spring'),
          ];
          cell.appendChild(buildElectiveGroup(sorted));
        }
      }

      row.appendChild(cell);
    });

    gridBody.appendChild(row);
  });

  // Apply dynamic overlays after all cards are in the DOM
  markCurrentCourses();
  updateInterestHighlights();
}

// Creates a half-column (fall or spring) with a header label.
function makeSemHalf(label) {
  const div = document.createElement('div');
  div.className = 'cell-half';
  const lbl = document.createElement('div');
  lbl.className = 'sem-label';
  lbl.textContent = label;
  div.appendChild(lbl);
  return div;
}

function buildCourseCard(course) {
  const status = getCourseStatus(course);
  const card = document.createElement('div');
  card.className = `course-card status-${status}`;
  card.dataset.courseId = course.id;
  card.dataset.tags = getEffectiveTags(course).join(' ');
  card.dataset.dept = course.department;

  if (status !== 'locked' && status !== 'completed') {
    card.addEventListener('click', () => showDetail(course.id));
  }

  const name = document.createElement('div');
  name.className = 'card-name';
  name.textContent = course.name;
  card.appendChild(name);

  const badges = document.createElement('div');
  badges.className = 'card-badges';

  if (status === 'completed') badges.appendChild(makeBadge('✓', 'completed'));
  if (course.honors) badges.appendChild(makeBadge('H', 'honors'));
  if (course.ap) badges.appendChild(makeBadge('AP', 'ap'));
  if (course.socialImpact) badges.appendChild(makeBadge('SI', 'si'));

  card.appendChild(badges);

  // Semester tag — only for semester courses, not yearlong
  if (course.semester && course.semester !== 'yearlong') {
    const semTag = document.createElement('div');
    semTag.className = 'card-sem';
    const semLabels = { fall: 'fall', spring: 'spring', 'fall-spring': 'fall or spring' };
    semTag.textContent = semLabels[course.semester] || course.semester;
    card.appendChild(semTag);
  }

  return card;
}

function buildElectiveGroup(electives, { title = 'Senior Electives', chooseN = 2 } = {}) {
  const group = document.createElement('div');
  group.className = 'elective-group';
  group.dataset.expanded = 'false';

  const header = document.createElement('div');
  header.className = 'elective-group-header';
  header.innerHTML = `
    <span class="elective-group-title">${title}</span>
    <span class="elective-group-meta">choose ${chooseN} · ${electives.length} options</span>
    <span class="elective-group-toggle">▼</span>
  `;

  const list = document.createElement('div');
  list.className = 'elective-group-list hidden';

  electives.forEach(course => {
    const item = document.createElement('div');
    item.className = 'elective-item';
    const semSuffix = { fall: ' (fall)', spring: ' (spring)', 'fall-spring': ' (fall or spring)' }[course.semester] ?? '';
    const honorsSuffix = course.honors ? ' — H' : course.ap ? ' — AP' : '';
    item.textContent = course.name + honorsSuffix + semSuffix;
    item.addEventListener('click', e => { e.stopPropagation(); showDetail(course.id); });
    list.appendChild(item);
  });

  header.addEventListener('click', () => {
    const expanded = group.dataset.expanded === 'true';
    group.dataset.expanded = String(!expanded);
    list.classList.toggle('hidden', expanded);
    group.querySelector('.elective-group-toggle').textContent = expanded ? '▼' : '▲';
  });

  group.appendChild(header);
  group.appendChild(list);
  return group;
}

function makeBadge(text, type) {
  const b = document.createElement('span');
  b.className = `badge badge-${type}`;
  b.textContent = text;
  return b;
}

// ── CRITICAL PATHS VIEW ─────────────────────────────────────────────────────

function renderPaths() {
  const container = document.getElementById('paths-container');
  if (!container) return;

  container.innerHTML = '';

  CRITICAL_PATHS.forEach(path => {
    const card = document.createElement('div');
    const isAtRisk = computePathRisk(path);
    card.className = `path-card ${isAtRisk ? 'at-risk' : 'on-track'}`;

    card.innerHTML = `
      <div class="path-title">${path.name}</div>
      <div class="path-description">${path.description}</div>
      <div class="path-steps" id="steps-${path.id}"></div>
    `;

    const stepsEl = card.querySelector(`#steps-${path.id}`);
    path.steps.forEach((step, i) => {
      const stepEl = document.createElement('div');
      stepEl.className = 'path-step';

      const circleStatus = getStepStatus(step, path);
      stepEl.innerHTML = `
        <div class="step-content">
          <div class="step-grade">Gr ${step.grade}</div>
          <div class="step-circle ${circleStatus}">${step.grade}</div>
          <div class="step-name">${step.courseId ? getCourseById(step.courseId)?.name || step.note : '—'}</div>
          <div class="step-note">${step.note}</div>
        </div>
      `;

      if (i < path.steps.length - 1) {
        stepEl.insertAdjacentHTML('beforeend', '<div class="step-arrow">→</div>');
      }

      stepsEl.appendChild(stepEl);
    });

    container.appendChild(card);
  });
}

function computePathRisk(path) {
  if (path.id === 'path-calc-bc') {
    return MATH_ORDER[state.mathLevel] < MATH_ORDER['geometry'];
  }
  if (path.id === 'path-ml') {
    return !state.interests.cs;
  }
  return false;
}

function getStepStatus(step, path) {
  if (step.grade < state.currentGrade) return 'completed';
  if (step.grade === state.currentGrade) return 'current';

  if (step.courseId) {
    const course = getCourseById(step.courseId);
    if (course && isLockedOut(course)) return 'at-risk';
    if (course && isCompleted(course)) return 'completed';
  }

  // CS path: at-risk if CS track not enabled and grade is in the future
  if (path.id === 'path-ml' && !state.interests.cs && step.grade > state.currentGrade) return 'at-risk';

  return 'future';
}

// ── DEADLINES VIEW ─────────────────────────────────────────────────────────

function renderDeadlines() {
  const container = document.getElementById('deadlines-container');
  if (!container) return;

  container.innerHTML = '';

  // Sort: critical first
  const urgencyOrder = { critical: 0, high: 1, medium: 2 };
  const sorted = [...DEADLINES].sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);

  sorted.forEach(deadline => {
    const card = document.createElement('div');
    card.className = `deadline-card urgency-${deadline.urgency}`;
    card.innerHTML = `
      <div class="urgency-pill">${deadline.urgency}</div>
      <div class="deadline-when">${deadline.when}</div>
      <div class="deadline-action">${deadline.action}</div>
      <div class="deadline-detail">${deadline.detail}</div>
    `;
    container.appendChild(card);
  });

  // Update badge count
  const criticalCount = DEADLINES.filter(d => d.urgency === 'critical' || d.urgency === 'high').length;
  const badge = document.getElementById('deadline-count');
  if (badge) badge.textContent = criticalCount;
}

// ── DETAIL PANEL ────────────────────────────────────────────────────────────

function showDetail(courseId) {
  const course = getCourseById(courseId);
  if (!course) return;

  state.selectedCourseId = courseId;

  const panel = document.getElementById('detail-panel');
  const content = document.getElementById('detail-content');

  const status = getCourseStatus(course);

  // Build prereq names
  const prereqNames = (course.prereqs || [])
    .map(id => getCourseById(id)?.name || id)
    .join(', ') || 'None';

  // Build unlocks
  const unlockNames = (course.unlocks || [])
    .map(id => getCourseById(id)?.name || id);

  const badges = [];
  if (course.honors) badges.push('<span class="badge badge-honors">Honors</span>');
  if (course.ap) badges.push('<span class="badge badge-ap">AP</span>');
  if (course.socialImpact) badges.push('<span class="badge badge-si">Social Impact</span>');
  badges.push(`<span class="badge badge-${status}">${status}</span>`);

  let html = `
    <div class="detail-course-name">${course.name}</div>
    <div class="detail-dept">${course.department} · ${course.semester} · Grades ${course.grades.join(', ')}</div>
    <div class="detail-badges">${badges.join('')}</div>
  `;

  if (course.notes) {
    html += `<div class="detail-note">For this student: ${course.notes}</div>`;
  }

  if (course.deadlineNote) {
    html += `<div class="detail-deadline">⚠ ${course.deadlineNote}</div>`;
  }

  html += `
    <div class="detail-section">
      <div class="detail-section-label">Prerequisites</div>
      <div class="detail-section-body">${prereqNames}</div>
    </div>
  `;

  if (course.prereqNotes) {
    html += `
      <div class="detail-section">
        <div class="detail-section-label">Placement notes</div>
        <div class="detail-section-body">${course.prereqNotes}</div>
      </div>
    `;
  }

  if (unlockNames.length > 0) {
    html += `
      <div class="detail-section">
        <div class="detail-section-label">Unlocks</div>
        <div class="unlock-list">
          ${unlockNames.map(n => `<span class="unlock-chip">→ ${n}</span>`).join('')}
        </div>
      </div>
    `;
  }

  content.innerHTML = html;
  panel.classList.remove('hidden');
}

function closeDetail() {
  const panel = document.getElementById('detail-panel');
  panel.classList.add('hidden');
  state.selectedCourseId = null;
}

// ── VIEW SWITCHING ──────────────────────────────────────────────────────────

function switchView(viewName) {
  ['grid', 'plan', 'paths', 'deadlines'].forEach(v => {
    document.getElementById(`view-${v}`)?.classList.toggle('hidden', v !== viewName);
    document.getElementById(`tab-${v}`)?.classList.toggle('active', v === viewName);
  });
  if (viewName === 'plan') {
    seedLockedCourses();
    loadPlan();
    renderPlanGrid();
  }
}

// ── GRID HEADER & PLAN LABEL ─────────────────────────────────────────────────

function renderGridHeader() {
  const header = document.getElementById('grid-header');
  if (!header) return;

  const grades = [];
  for (let g = state.currentGrade; g <= 12; g++) grades.push(g);

  // Sync CSS column count on the catalog grid only
  document.querySelector('#view-grid .grid-container')?.style.setProperty('--grid-cols', grades.length);

  // Rebuild header: corner + one label per grade
  header.innerHTML = '<div class="grid-corner"></div>';
  grades.forEach(g => {
    const div = document.createElement('div');
    div.className = 'grade-label';
    div.innerHTML = `Grade ${g} <span class="grade-year">${schoolYear(g)}</span>`;
    header.appendChild(div);
  });
}

function updatePlanLabel() {
  const btn = document.getElementById('tab-grid');
  if (btn) btn.textContent = PLAN_LABELS[state.currentGrade] ?? 'Plan';
}

// ── SIDEBAR TOGGLE ──────────────────────────────────────────────────────────

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const collapsed = sidebar.classList.toggle('collapsed');
  localStorage.setItem('oes-sidebar-collapsed', collapsed ? '1' : '0');
  // On mobile, show/hide the backdrop overlay
  document.getElementById('sidebar-backdrop')
    ?.classList.toggle('visible', !collapsed && window.innerWidth <= 640);
}

// ── PROFILE CHANGE HANDLERS ─────────────────────────────────────────────────

function bindProfileControls() {
  document.getElementById('current-grade')?.addEventListener('change', e => {
    state.currentGrade = parseInt(e.target.value);
    renderGridHeader();
    updatePlanLabel();
    renderGrid();
    renderPaths();
    refreshPlanForProfileChange();
  });

  document.getElementById('math-level')?.addEventListener('change', e => {
    state.mathLevel = e.target.value;
    updateMathHint();
    renderGrid();
    renderPaths();
    refreshPlanForProfileChange();
  });

  document.getElementById('science-level')?.addEventListener('change', e => {
    state.scienceLevel = e.target.value;
    updateScienceHint();
    renderGrid();
    refreshPlanForProfileChange();
  });

  document.getElementById('language')?.addEventListener('change', e => {
    state.language = e.target.value;
    updateLangHint();
    renderGrid();
    refreshPlanForProfileChange();
  });

  document.getElementById('lang-level')?.addEventListener('change', e => {
    state.langLevel = parseInt(e.target.value);
    updateLangHint();
    renderGrid();
    renderPaths();
    refreshPlanForProfileChange();
  });

  document.getElementById('toggle-stem')?.addEventListener('change', e => {
    state.interests.stem = e.target.checked;
    renderGrid();
  });

  document.getElementById('toggle-english')?.addEventListener('change', e => {
    state.interests.english = e.target.checked;
    renderGrid();
  });

  document.getElementById('toggle-humanities')?.addEventListener('change', e => {
    state.interests.humanities = e.target.checked;
    renderGrid();
  });

  document.getElementById('toggle-cs')?.addEventListener('change', e => {
    state.interests.cs = e.target.checked;
    renderGrid();
    renderPaths();
  });

  document.getElementById('toggle-lang')?.addEventListener('change', e => {
    state.interests.lang = e.target.checked;
    renderGrid();
  });

  document.getElementById('toggle-arts')?.addEventListener('change', e => {
    state.interests.arts = e.target.checked;
    renderGrid();
  });
}

function updateMathHint() {
  const hints = {
    'algebra':   'Foundation → Geometry → Advanced Algebra. Reach AP Calc AB by senior year.',
    'geometry':  'Push for Advanced Algebra with Proofs (H) next year to unlock the full honors path.',
    'advalg':    'Standard track → Precalculus → AP Calc AB.',
    'advalg-h':  'Honors track open → Precalc with Proofs → AP Calc BC + Linear Algebra + Multivariable.',
    'precalc':   'AP Calc AB next year. Strong foundation for science and CS.',
    'precalc-h': 'Honors track → AP Calc BC, then Linear Algebra (H) + Multivariable Calc (H).',
    'calc-ab':   'AP Calc AB → BC next year opens Linear Algebra (H) + Multivariable Calc (H).',
    'calc-bc':   'Top math track. Linear Algebra (H) + Multivariable Calc (H) available this year.',
  };
  const el = document.getElementById('math-hint');
  if (el) el.textContent = hints[state.mathLevel] || '';
}

function updateLangHint() {
  const yearsToAP = Math.max(0, 4 - state.langLevel);
  const el = document.getElementById('lang-hint');
  if (!el) return;
  const apLabel = state.language === 'chinese' ? 'Chinese V (H)' :
                  state.language === 'french'  ? 'AP French' : 'AP Spanish or HLC/HCC';
  if (state.langLevel >= 4) {
    el.textContent = `${apLabel} accessible next year!`;
  } else if (yearsToAP === 0) {
    el.textContent = `${apLabel} accessible next year!`;
  } else {
    el.textContent = `${yearsToAP} more year${yearsToAP !== 1 ? 's' : ''} to reach ${apLabel}`;
  }
}

function updateScienceHint() {
  const hints = {
    'physics-1d': '1D track: algebraic tools. Most students placed here. Leads to Chemistry.',
    'physics-2d': '2D track: adds trig — stronger prep for Accelerated Chemistry & Advanced Physics.',
    'chemistry':  'In Chemistry. Biology next year, then advanced science electives open up.',
    'biology':    'In Biology. Advanced Molecular Bio, Chemistry, Physics available next year.',
    'advanced':   'Completed Physics, Chemistry & Biology. Focus on advanced electives.',
  };
  const el = document.getElementById('science-hint');
  if (el) el.textContent = hints[state.scienceLevel] || '';
}

// ── CURRENT-COURSE MARKER ─────────────────────────────────────────────────────
// Adds .current-placement to the card for the student's active math course
// and active language course so the grid shows a "▶ now" indicator.

function markCurrentCourses() {
  const gridBody = document.getElementById('grid-body');
  if (!gridBody) return;

  // Clear previous markers
  gridBody.querySelectorAll('.current-placement').forEach(el => el.classList.remove('current-placement'));

  // Current math course
  const currentMathId = MATH_LEVEL_TO_COURSE[state.mathLevel];
  if (currentMathId) {
    const card = gridBody.querySelector(`[data-course-id="${currentMathId}"]`);
    if (card) card.classList.add('current-placement');
  }

  // Current language course: find the course at exactly state.langLevel for the chosen language
  for (const [id, level] of Object.entries(LANG_LEVEL_FOR_COURSE)) {
    if (level === state.langLevel && id.startsWith(`lang-${state.language}`)) {
      const card = gridBody.querySelector(`[data-course-id="${id}"]`);
      if (card) card.classList.add('current-placement');
      break;
    }
  }

  // Current science courses (mark both standard and accelerated tracks)
  (SCIENCE_LEVEL_TO_COURSES[state.scienceLevel] || []).forEach(id => {
    const card = gridBody.querySelector(`[data-course-id="${id}"]`);
    if (card) card.classList.add('current-placement');
  });
}

// ── INTEREST HIGHLIGHTING ─────────────────────────────────────────────────────
// Applies color rings to courses matching active interests,
// and dims optional courses that don't match any active interest.

function updateInterestHighlights() {
  const gridBody = document.getElementById('grid-body');
  if (!gridBody) return;

  const anyActive = state.interests.stem || state.interests.cs || state.interests.english ||
                    state.interests.humanities || state.interests.lang || state.interests.arts;
  gridBody.classList.toggle('interest-active', anyActive);

  gridBody.querySelectorAll('.course-card').forEach(card => {
    const tags = (card.dataset.tags || '').split(' ');

    // Determine ring color by priority: cs > stem > english > humanities > lang > arts
    let ring = '';
    if      (state.interests.cs         && tags.includes('cs'))         ring = 'cs';
    else if (state.interests.stem       && tags.includes('stem'))       ring = 'stem';
    else if (state.interests.english    && tags.includes('english'))    ring = 'english';
    else if (state.interests.humanities && tags.includes('humanities')) ring = 'humanities';
    else if (state.interests.lang       && tags.includes('language'))   ring = 'lang';
    else if (state.interests.arts       && tags.includes('arts'))       ring = 'arts';

    card.classList.toggle('interest-match', !!ring);

    if (ring) {
      card.dataset.ring = ring;
    } else {
      delete card.dataset.ring;
    }
  });
}

// ── GRADUATION REQUIREMENTS PANEL ────────────────────────────────────────────

function renderRequirements() {
  const el = document.getElementById('req-list');
  if (!el) return;

  const reqs = [
    // Always satisfied by the required 9-12 sequence
    { label: 'English',         detail: '4 credits',            status: 'on-track' },
    { label: 'History',         detail: '2.5 credits',          status: 'on-track' },
    { label: 'Math',            detail: '3 credits min.',       status: 'on-track' },
    { label: 'Science',         detail: '3 credits',            status: 'on-track' },
    { label: 'Health',          detail: '1 credit · Grade 9',   status: 'on-track' },
    { label: 'Languages',       detail: '2 consecutive years',  status: 'on-track' },
    { label: 'Winterim',        detail: 'Every year',           status: 'on-track' },
    // Require active planning
    { label: 'Religion & Phil', detail: '2 semesters · plan timing',    status: 'plan' },
    { label: 'Arts',            detail: '1.5 credits · 3 courses',      status: 'plan' },
    { label: 'Community Eng',   detail: '2 projects · 80 hrs total',    status: 'plan' },
    { label: 'Extracurricular', detail: '2/yr (9-10) · 1/yr (11-12)',   status: 'plan' },
  ];

  el.innerHTML = reqs.map(r => `
    <div class="req-item req-${r.status}">
      <span class="req-icon">${r.status === 'on-track' ? '✓' : '·'}</span>
      <div class="req-text">
        <span class="req-label">${r.label}</span>
        <span class="req-detail">${r.detail}</span>
      </div>
    </div>
  `).join('');
}

// ── HELPERS ──────────────────────────────────────────────────────────────────

function getCourseById(id) {
  return COURSES.find(c => c.id === id);
}

// ── INIT ──────────────────────────────────────────────────────────────────────

function init() {
  const savedCollapsed = localStorage.getItem('oes-sidebar-collapsed');
  const isNarrow = window.innerWidth <= 900;
  const isMobile = window.innerWidth <= 640;
  // On mobile the sidebar is a fixed overlay — always start it closed so the
  // hamburger button is never buried underneath it on load.
  if (isMobile || savedCollapsed === '1' || (savedCollapsed === null && isNarrow)) {
    document.getElementById('sidebar')?.classList.add('collapsed');
  }
  loadPlan();
  seedLockedCourses();
  renderGridHeader();
  updatePlanLabel();
  renderGrid();
  renderPaths();
  renderDeadlines();
  renderRequirements();
  bindProfileControls();
  updateMathHint();
  updateScienceHint();
  updateLangHint();
}

document.addEventListener('DOMContentLoaded', init);
