// OES Course Planner — App Logic
// Reads from courses-data.js (COURSES, CRITICAL_PATHS, DEADLINES, GRADUATION_REQUIREMENTS)

// ── STATE ─────────────────────────────────────────────────────────────────

const state = {
  mathLevel: 'geometry',
  language: 'spanish',
  langLevel: 2,
  interests: {
    stem: true,
    cs: false,
    lang: true,
    arts: false,
  },
  selectedCourseId: null,
};

// ── DEPARTMENT ROW DEFINITIONS ────────────────────────────────────────────

const DEPT_ROWS = [
  { key: 'English',           label: 'English' },
  { key: 'History',           label: 'History' },
  { key: 'Math',              label: 'Math' },
  { key: 'Science',           label: 'Science' },
  { key: 'CS',                label: 'CS' },
  { key: 'World Languages',   label: 'Languages' },
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
  'algebra':  'math-algebra',
  'geometry': 'math-geometry',
  'advalg':   'math-advalg',
  'advalg-h': 'math-advalg-proofs',
  'precalc':  'math-precalc',
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

// ── STATUS COMPUTATION ─────────────────────────────────────────────────────
// Determines the display status of a course given current state

function getCourseStatus(course) {
  const tags = course.tags || [];

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
  const tags = course.tags || [];
  const id = course.id;

  if (state.interests.stem && tags.includes('stem')) return true;
  if (state.interests.cs && tags.includes('cs')) return true;
  if (state.interests.lang && tags.includes('language')) return true;

  // Specific recommendations for this student
  if (state.interests.stem) {
    if (['math-advalg-proofs', 'math-precalc-proofs', 'math-calc-ab', 'math-calc-bc',
         'sci-chem-h', 'sci-bio-h', 'sci-advphys-mech', 'sci-engineering'].includes(id)) return true;
  }

  return false;
}

// ── DISPLAY GRADE COMPUTATION ─────────────────────────────────────────────
// Returns the grade column where this course should appear.
// Uses min(course.grades) but bumps forward when prereqs aren't finishable
// until the same or later grade. Accounts for fall→spring same-year sequencing.

// Courses whose prereqs allow co-enrollment (e.g. "in or have taken Chemistry")
const COENROLL_OK = new Set(['sci-blc-arts', 'sci-blc-pnw', 'sci-advphys-thermo']);

function displayGrade(course) {
  // Math: anchor the entire sequence to the student's current grade (9).
  // Both honors and standard tracks land in the same column so the parent
  // sees the alternatives side-by-side, not staggered across years.
  if (course.department === 'Math' && MATH_GRADE_OFFSET[course.id] !== undefined) {
    const currentCourseId = MATH_LEVEL_TO_COURSE[state.mathLevel];
    const currentOffset = MATH_GRADE_OFFSET[currentCourseId] ?? 1;
    const courseOffset = MATH_GRADE_OFFSET[course.id];
    const rawGrade = 9 + (courseOffset - currentOffset);
    const minGrade = Math.min(...course.grades);
    const maxGrade = Math.max(...course.grades);
    return Math.min(Math.max(rawGrade, minGrade), maxGrade);
  }

  // World Languages: anchor the sequence to the student's current level (state.langLevel).
  // A Level-2 student sees their current course in Grade 9 and subsequent levels in Gr 10/11/12.
  if (course.department === 'World Languages' && LANG_LEVEL_FOR_COURSE[course.id] !== undefined) {
    const courseLevel = LANG_LEVEL_FOR_COURSE[course.id];
    const rawGrade = 9 + (courseLevel - state.langLevel);
    const minGrade = Math.min(...course.grades);
    const maxGrade = Math.max(...course.grades);
    return Math.min(Math.max(rawGrade, minGrade), maxGrade);
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

  // Clamp to the course's own eligible grade range
  const maxGrade = Math.max(...course.grades);
  return Math.min(effectiveGrade, maxGrade);
}

// ── GRID RENDERING ─────────────────────────────────────────────────────────

function renderGrid() {
  const gridBody = document.getElementById('grid-body');
  if (!gridBody) return;

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

    // Four grade cells
    [9, 10, 11, 12].forEach(grade => {
      const cell = document.createElement('div');
      cell.className = 'cell';

      const gradeCourses = deptCourses.filter(c => {
        if (!c.grades.includes(grade)) return false;
        // Show each course only in its computed display grade (prereq-aware)
        if (displayGrade(c) !== grade) return false;
        // Filter World Languages to selected language only
        if (!isChosenLanguageCourse(c)) return false;
        return true;
      });

      if (gradeCourses.length === 0) {
        cell.innerHTML = '<div class="empty-cell"></div>';
      } else {
        const electives = gradeCourses.filter(c => c.tags.includes('senior-elective'));
        const regular = gradeCourses.filter(c => !c.tags.includes('senior-elective'));

        regular.forEach(course => cell.appendChild(buildCourseCard(course)));

        if (electives.length > 0) {
          cell.appendChild(buildElectiveGroup(electives));
        }
      }

      row.appendChild(cell);
    });

    gridBody.appendChild(row);
  });
}

function buildCourseCard(course) {
  const status = getCourseStatus(course);
  const card = document.createElement('div');
  card.className = `course-card status-${status}`;
  card.dataset.courseId = course.id;

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
  return card;
}

function buildElectiveGroup(electives) {
  const group = document.createElement('div');
  group.className = 'elective-group';
  group.dataset.expanded = 'false';

  const header = document.createElement('div');
  header.className = 'elective-group-header';
  header.innerHTML = `
    <span class="elective-group-title">Senior Electives</span>
    <span class="elective-group-meta">choose 2 · ${electives.length} options</span>
    <span class="elective-group-toggle">▼</span>
  `;

  const list = document.createElement('div');
  list.className = 'elective-group-list hidden';

  electives.forEach(course => {
    const item = document.createElement('div');
    item.className = 'elective-item';
    item.textContent = course.name + (course.semester === 'fall' ? ' (fall)' : course.semester === 'spring' ? ' (spring)' : '');
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
  if (step.grade === 9) return 'current';

  if (step.courseId) {
    const course = getCourseById(step.courseId);
    if (course && isLockedOut(course)) return 'at-risk';
    if (course && isCompleted(course)) return 'completed';
  }

  // CS path: at-risk if CS track not enabled and grade is future
  if (path.id === 'path-ml' && !state.interests.cs && step.grade > 9) return 'at-risk';

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
  ['grid', 'paths', 'deadlines'].forEach(v => {
    document.getElementById(`view-${v}`).classList.toggle('hidden', v !== viewName);
    document.getElementById(`tab-${v}`).classList.toggle('active', v === viewName);
  });
}

// ── SIDEBAR TOGGLE ──────────────────────────────────────────────────────────

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
}

// ── PROFILE CHANGE HANDLERS ─────────────────────────────────────────────────

function bindProfileControls() {
  document.getElementById('math-level')?.addEventListener('change', e => {
    state.mathLevel = e.target.value;
    updateMathHint();
    renderGrid();
    renderPaths();
  });

  document.getElementById('language')?.addEventListener('change', e => {
    state.language = e.target.value;
    updateLangHint();
    renderGrid();
  });

  document.getElementById('lang-level')?.addEventListener('change', e => {
    state.langLevel = parseInt(e.target.value);
    updateLangHint();
    renderGrid();
    renderPaths();
  });

  document.getElementById('toggle-stem')?.addEventListener('change', e => {
    state.interests.stem = e.target.checked;
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
    'algebra': 'Start here → Geometry → Advanced Algebra path',
    'geometry': 'On track. Push for Advanced Algebra with Proofs (H) in 10th for best path.',
    'advalg': 'Standard path to AP Calc AB senior year.',
    'advalg-h': 'Honors path open → Precalc with Proofs → AP Calc BC + Linear Algebra + Multivariable',
    'precalc': 'AP Calc AB senior year is likely.',
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
  renderGrid();
  renderPaths();
  renderDeadlines();
  renderRequirements();
  bindProfileControls();
  updateMathHint();
  updateLangHint();
}

document.addEventListener('DOMContentLoaded', init);
