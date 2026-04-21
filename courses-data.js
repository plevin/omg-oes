// OES Upper School Course Data
// Structured for the interactive course planner
// Source: OES Upper School Curriculum Guide 2026-27

const COURSES = [

  // ── ENGLISH ──────────────────────────────────────────────────────────────

  { id: 'eng9', name: 'English 9', department: 'English', grades: [9],
    semester: 'yearlong', honors: false, ap: false, socialImpact: false,
    prereqs: [], unlocks: ['eng10'],
    tags: ['required'],
    notes: 'Fall semester is pass/fail — good time to experiment with study strategies.',
    deadlineNote: null },

  { id: 'eng10', name: 'English 10', department: 'English', grades: [10],
    semester: 'yearlong', honors: false, ap: false, socialImpact: false,
    prereqs: ['eng9'], unlocks: ['eng11'],
    tags: ['required'],
    notes: 'Focuses on character and voice; covers poetry, short stories, Shakespeare, and the novel.',
    deadlineNote: null },

  { id: 'eng11', name: 'English 11', department: 'English', grades: [11],
    semester: 'yearlong', honors: false, ap: false, socialImpact: false,
    prereqs: ['eng10'], unlocks: ['eng-senior'],
    tags: ['required'],
    notes: 'Capstone Literary Journalism Project (LJP). Required before senior electives.',
    deadlineNote: null },

  { id: 'eng-banned', name: 'Banned Books', department: 'English', grades: [12],
    semester: 'fall', honors: false, ap: false, socialImpact: false,
    prereqs: ['eng11'], unlocks: [],
    tags: ['senior-elective'],
    notes: 'Toni Morrison, Margaret Atwood. Analytical and creative responses.',
    deadlineNote: null },

  { id: 'eng-memoir', name: 'Memoir', department: 'English', grades: [12],
    semester: 'fall', honors: false, ap: false, socialImpact: false,
    prereqs: ['eng11'], unlocks: [],
    tags: ['senior-elective'],
    notes: null, deadlineNote: null },

  { id: 'eng-poetry', name: 'The Practice of Poetry', department: 'English', grades: [12],
    semester: 'fall-spring', honors: false, ap: false, socialImpact: false,
    prereqs: ['eng11'], unlocks: [],
    tags: ['senior-elective'],
    notes: 'Offered both fall and spring.', deadlineNote: null },

  { id: 'eng-shortstory', name: 'Short Story', department: 'English', grades: [12],
    semester: 'fall', honors: false, ap: false, socialImpact: false,
    prereqs: ['eng11'], unlocks: [],
    tags: ['senior-elective'],
    notes: null, deadlineNote: null },

  { id: 'eng-classics', name: 'Classics Through a New Lens', department: 'English', grades: [12],
    semester: 'fall', honors: false, ap: false, socialImpact: false,
    prereqs: ['eng11'], unlocks: [],
    tags: ['senior-elective'],
    notes: 'Homer, Euripides, Ovid — viewed through contemporary research.', deadlineNote: null },

  { id: 'eng-asian', name: 'Asian Literature', department: 'English', grades: [12],
    semester: 'spring', honors: false, ap: false, socialImpact: false,
    prereqs: ['eng11'], unlocks: [],
    tags: ['senior-elective'],
    notes: null, deadlineNote: null },

  { id: 'eng-feminist', name: 'Feminist Literature', department: 'English', grades: [12],
    semester: 'spring', honors: false, ap: false, socialImpact: false,
    prereqs: ['eng11'], unlocks: [],
    tags: ['senior-elective'],
    notes: null, deadlineNote: null },

  { id: 'eng-fairytales', name: 'Fairytales and Legends', department: 'English', grades: [12],
    semester: 'spring', honors: false, ap: false, socialImpact: false,
    prereqs: ['eng11'], unlocks: [],
    tags: ['senior-elective'],
    notes: null, deadlineNote: null },

  { id: 'eng-coming-of-age', name: 'Coming of Age', department: 'English', grades: [12],
    semester: 'spring', honors: false, ap: false, socialImpact: false,
    prereqs: ['eng11'], unlocks: [],
    tags: ['senior-elective'],
    notes: null, deadlineNote: null },

  // ── HISTORY & SOCIAL STUDIES ─────────────────────────────────────────────

  { id: 'hist-global', name: 'Global Perspectives', department: 'History', grades: [9],
    semester: 'yearlong', honors: false, ap: false, socialImpact: false,
    prereqs: [], unlocks: ['hist-us'],
    tags: ['required'],
    notes: 'Four themes: Authority, Beliefs, Climate Change, Diaspora.', deadlineNote: null },

  { id: 'hist-us', name: 'US History', department: 'History', grades: [10],
    semester: 'yearlong', honors: false, ap: false, socialImpact: false,
    prereqs: ['hist-global'], unlocks: ['hist-civics', 'hist-coldwar'],
    tags: ['required'],
    notes: 'Civil War in fall; social reformers and civil rights in spring.', deadlineNote: null },

  { id: 'hist-civics', name: 'Civics, Government & the Economy', department: 'History', grades: [11, 12],
    semester: 'fall-spring', honors: false, ap: false, socialImpact: false,
    prereqs: ['hist-us'], unlocks: [],
    tags: ['required'],
    notes: 'Required for 11th grade. Open to 12th grade for 2026-27.', deadlineNote: null },

  { id: 'hist-coldwar', name: 'The Cold War (H)', department: 'History', grades: [11, 12],
    semester: 'fall', honors: true, ap: false, socialImpact: false,
    prereqs: ['hist-us'], unlocks: [],
    tags: ['decision', 'stem'],
    notes: 'Strong analytical writing. Good pairing with STEM interests for context on 20th-century geopolitics.', deadlineNote: null },

  { id: 'hist-cult', name: 'Cult of Personality (H)', department: 'History', grades: [11, 12],
    semester: 'fall', honors: true, ap: false, socialImpact: false,
    prereqs: [], unlocks: [],
    tags: ['decision'],
    notes: 'Case study approach: Castro, Hitler, student-chosen dictator.', deadlineNote: null },

  { id: 'hist-global-issues', name: 'Global Issues', department: 'History', grades: [11, 12],
    semester: 'fall', honors: false, ap: false, socialImpact: true,
    prereqs: [], unlocks: [],
    tags: ['unique'],
    notes: 'Human rights, political strife, environmental sustainability. Social Impact class — counts as CE project.', deadlineNote: null },

  { id: 'hist-psych', name: 'Introduction to Psychology', department: 'History', grades: [11, 12],
    semester: 'fall-spring', honors: false, ap: false, socialImpact: false,
    prereqs: [], unlocks: [],
    tags: ['decision'],
    notes: 'Offered both fall and spring. Highly relevant to any health/pre-med interest.', deadlineNote: null },

  { id: 'hist-econ', name: 'Economics (H)', department: 'History', grades: [11, 12],
    semester: 'spring', honors: true, ap: false, socialImpact: false,
    prereqs: [], unlocks: [],
    tags: ['decision', 'stem'],
    notes: 'Heavy reading load; analytical focus. Good complement to STEM or business interests.', deadlineNote: null },

  { id: 'hist-anthro', name: 'Anthropology', department: 'History', grades: [11, 12],
    semester: 'spring', honors: false, ap: false, socialImpact: false,
    prereqs: [], unlocks: [],
    tags: [],
    notes: 'Students write their own ethnography.', deadlineNote: null },

  { id: 'hist-media', name: 'Media Studies', department: 'History', grades: [11, 12],
    semester: 'spring', honors: false, ap: false, socialImpact: false,
    prereqs: [], unlocks: [],
    tags: [],
    notes: 'Journalism, music, advertising through lens of ethics and business.', deadlineNote: null },

  { id: 'hist-debate', name: 'Advanced Debate', department: 'History', grades: [11, 12],
    semester: 'fall', honors: false, ap: false, socialImpact: false,
    prereqs: [],
    prereqNotes: 'Must have previously participated in Speech and Debate activity or extracurricular, or have instructor approval',
    unlocks: [],
    tags: ['decision'],
    notes: 'Lincoln-Douglas, Public Forum, Policy, and World Schools formats. Requires attending four interscholastic competitions. Includes independent study project on a critical/philosophical debate topic.',
    deadlineNote: null },

  // ── MATHEMATICS ──────────────────────────────────────────────────────────

  { id: 'math-algebra', name: 'Algebra', department: 'Math', grades: [9, 10],
    semester: 'yearlong', honors: false, ap: false, socialImpact: false,
    prereqs: [], unlocks: ['math-geometry'],
    tags: ['required'],
    notes: 'Lays groundwork. Fulfills prereq for Python I.', deadlineNote: null },

  { id: 'math-geometry', name: 'Geometry', department: 'Math', grades: [9, 10],
    semester: 'yearlong', honors: false, ap: false, socialImpact: false,
    prereqs: ['math-algebra'], unlocks: ['math-advalg', 'math-advalg-proofs'],
    tags: ['required'],
    notes: 'Typical 9th grade placement for students entering from OES MS.', deadlineNote: null },

  { id: 'math-advalg', name: 'Advanced Algebra', department: 'Math', grades: [10, 11],
    semester: 'yearlong', honors: false, ap: false, socialImpact: false,
    prereqs: ['math-geometry'], unlocks: ['math-precalc', 'math-stats'],
    tags: ['required'],
    notes: 'Standard path. Must earn C- or higher to advance.', deadlineNote: null },

  { id: 'math-advalg-proofs', name: 'Advanced Algebra with Proofs (H)', department: 'Math', grades: [10, 11],
    semester: 'yearlong', honors: true, ap: false, socialImpact: false,
    prereqs: ['math-geometry'],
    prereqNotes: 'Requires A average in Geometry + teacher recommendation',
    unlocks: ['math-precalc-proofs'],
    tags: ['required', 'decision', 'stem'],
    notes: 'Proof-based. Opens the path to Precalculus with Proofs → AP Calc BC → Linear Algebra + Multivariable Calc.',
    deadlineNote: 'DECISION: Must confirm math placement before 10th grade registration (spring of 9th grade).' },

  { id: 'math-precalc', name: 'Precalculus', department: 'Math', grades: [11, 12],
    semester: 'yearlong', honors: false, ap: false, socialImpact: false,
    prereqs: ['math-advalg'], unlocks: ['math-calc-ab', 'math-ap-stats'],
    tags: ['required'],
    notes: 'Standard path to AP Calc AB.', deadlineNote: null },

  { id: 'math-precalc-proofs', name: 'Precalculus with Proofs (H)', department: 'Math', grades: [11],
    semester: 'yearlong', honors: true, ap: false, socialImpact: false,
    prereqs: ['math-advalg-proofs'],
    prereqNotes: 'B average or higher in Advanced Algebra with Proofs, OR A average in Advanced Algebra + teacher rec',
    unlocks: ['math-calc-ab', 'math-calc-bc'],
    tags: ['required', 'decision', 'stem'],
    notes: 'Opens path to AP Calc BC. Foundations of differential calculus included.', deadlineNote: null },

  { id: 'math-calc-ab', name: 'AP Calculus AB', department: 'Math', grades: [11, 12],
    semester: 'yearlong', honors: true, ap: true, socialImpact: false,
    prereqs: ['math-precalc-proofs', 'math-precalc'],
    prereqNotes: 'Precalculus with Proofs (B+) OR Precalculus (A) + teacher rec',
    unlocks: ['math-calc-bc', 'math-linear-alg', 'cs-ml'],
    tags: ['decision', 'stem'],
    notes: 'Unlocks Machine Learning (H). AP exam available.', deadlineNote: null },

  { id: 'math-calc-bc', name: 'AP Calculus BC', department: 'Math', grades: [12],
    semester: 'yearlong', honors: true, ap: true, socialImpact: false,
    prereqs: ['math-precalc-proofs', 'math-calc-ab'],
    prereqNotes: 'Precalculus with Proofs (B+) + teacher rec, OR AP Calc AB (B+)',
    unlocks: ['math-linear-alg', 'math-multivariable'],
    tags: ['decision', 'stem', 'unique'],
    notes: 'Goal for STEM-interested students on honors path. AP exam available.',
    deadlineNote: 'Requires Precalculus with Proofs in 11th grade, which requires Adv Algebra with Proofs in 10th.' },

  { id: 'math-linear-alg', name: 'Linear Algebra (H)', department: 'Math', grades: [12],
    semester: 'fall', honors: true, ap: false, socialImpact: false,
    prereqs: ['math-precalc-proofs', 'math-calc-ab'],
    unlocks: ['math-multivariable'],
    tags: ['unique', 'stem'],
    notes: 'College-level. Vectors, matrices, linear transformations. Rarely offered at high school level.',
    deadlineNote: 'Only accessible if Calc BC path is followed.' },

  { id: 'math-multivariable', name: 'Multivariable Calculus (H)', department: 'Math', grades: [12],
    semester: 'spring', honors: true, ap: false, socialImpact: false,
    prereqs: ['math-calc-bc', 'math-linear-alg'],
    unlocks: [],
    tags: ['unique', 'stem'],
    notes: 'Extremely rare at high school level. Green\'s, Stokes\', Gauss\' theorems. Second-year college content.',
    deadlineNote: 'Requires BOTH Calc BC AND Linear Algebra. Only reachable via honors math path from 10th grade.' },

  { id: 'math-stats', name: 'Statistics', department: 'Math', grades: [10, 11, 12],
    semester: 'yearlong', honors: false, ap: false, socialImpact: false,
    prereqs: ['math-advalg'], unlocks: ['math-ap-stats'],
    tags: [],
    notes: 'Practical applications: finance, climate, social justice.', deadlineNote: null },

  { id: 'math-ap-stats', name: 'AP Statistics', department: 'Math', grades: [11, 12],
    semester: 'yearlong', honors: false, ap: true, socialImpact: false,
    prereqs: ['math-precalc', 'math-stats'],
    unlocks: [],
    tags: ['stem'],
    notes: 'Equivalent to one semester college Stats. Useful alongside CS.', deadlineNote: null },

  // ── COMPUTER SCIENCE ─────────────────────────────────────────────────────

  { id: 'cs-python1', name: 'Python I: Foundations', department: 'CS', grades: [10, 11, 12],
    semester: 'fall-spring', honors: false, ap: false, socialImpact: false,
    prereqs: ['math-algebra'],
    unlocks: ['cs-python2'],
    tags: ['decision', 'cs'],
    notes: 'Introduction to programming. Offered fall and spring.',
    deadlineNote: 'START HERE by 10th grade to keep Machine Learning accessible senior year.' },

  { id: 'cs-python2', name: 'Python II: Advanced Programming (H)', department: 'CS', grades: [10, 11, 12],
    semester: 'fall', honors: true, ap: false, socialImpact: false,
    prereqs: ['cs-python1'],
    prereqNotes: 'Python I, OR grades 11-12 with Precalculus + instructor permission',
    unlocks: ['cs-python3'],
    tags: ['cs', 'stem'],
    notes: 'Functions, classes, algorithms. Fall only.', deadlineNote: null },

  { id: 'cs-python3', name: 'Python III: Data Science (H)', department: 'CS', grades: [11, 12],
    semester: 'spring', honors: true, ap: false, socialImpact: false,
    prereqs: ['cs-python2'], unlocks: ['cs-algorithms', 'cs-ml'],
    tags: ['cs', 'stem'],
    notes: 'Pandas, Matplotlib, web scraping. Spring only.', deadlineNote: null },

  { id: 'cs-algorithms', name: 'Algorithms & Data Structures (H)', department: 'CS', grades: [11, 12],
    semester: 'fall', honors: true, ap: false, socialImpact: false,
    prereqs: ['cs-python3'], unlocks: [],
    tags: ['cs', 'stem'],
    notes: 'Big-O notation, sorting, graphs, dynamic programming. Fall only.', deadlineNote: null },

  { id: 'cs-ml', name: 'Machine Learning (H)', department: 'CS', grades: [12],
    semester: 'spring', honors: true, ap: false, socialImpact: false,
    prereqs: ['cs-python3', 'math-calc-ab'],
    unlocks: [],
    tags: ['cs', 'stem', 'unique'],
    notes: 'Neural networks, gradient descent, real-world datasets. Spring only. College-prep level.',
    deadlineNote: 'Requires Python III + AP Calc AB. Must start Python I by 10th grade and be on honors math path.' },

  // ── SCIENCE ───────────────────────────────────────────────────────────────

  { id: 'sci-physics-1d', name: 'Physics Foundation (1D)', department: 'Science', grades: [9],
    semester: 'yearlong', honors: false, ap: false, socialImpact: false,
    prereqs: [], unlocks: ['sci-chemistry', 'sci-chem-h'],
    tags: ['required'],
    prereqNotes: 'Placement by department based on transcript, teacher rec, and STEM diagnostic.',
    notes: 'One-dimensional track: algebraic tools only. Covers kinematics, dynamics, energy, and waves. Requires Science Inquiry Project (SIP). Most students are placed here.',
    deadlineNote: null },

  { id: 'sci-physics-2d', name: 'Physics Foundation (2D)', department: 'Science', grades: [9],
    semester: 'yearlong', honors: false, ap: false, socialImpact: false,
    prereqs: [], unlocks: ['sci-chemistry', 'sci-chem-h'],
    tags: ['required', 'decision', 'stem'],
    prereqNotes: 'Placement by department. Requires strong math background — trigonometry and systems of equations.',
    notes: 'Two-dimensional track: adds trigonometry and 2D vector analysis to the 1D content. Stronger preparation for Accelerated Chemistry and Advanced Physics. Requires Science Inquiry Project (SIP).',
    deadlineNote: null },

  { id: 'sci-chemistry', name: 'Chemistry', department: 'Science', grades: [10],
    semester: 'yearlong', honors: false, ap: false, socialImpact: false,
    prereqs: ['sci-physics'], unlocks: ['sci-biology', 'sci-bio-h', 'sci-advchem', 'sci-ecology', 'sci-blc-pnw', 'sci-blc-arts'],
    tags: ['required'],
    notes: 'SIP required. Foundational for all advanced science.', deadlineNote: null },

  { id: 'sci-chem-h', name: 'Accelerated Chemistry (H)', department: 'Science', grades: [10],
    semester: 'yearlong', honors: true, ap: false, socialImpact: false,
    prereqs: ['sci-physics'],
    prereqNotes: 'Placement by department only — not self-selected',
    unlocks: ['sci-biology', 'sci-bio-h', 'sci-advchem', 'sci-ecology', 'sci-blc-pnw', 'sci-blc-arts'],
    tags: ['decision', 'stem'],
    notes: 'Faster pace, greater depth. Placement by faculty based on record + student skills.',
    deadlineNote: null },

  { id: 'sci-biology', name: 'Biology', department: 'Science', grades: [11],
    semester: 'yearlong', honors: false, ap: false, socialImpact: false,
    prereqs: ['sci-chemistry'], unlocks: ['sci-advbio-mol', 'sci-marine', 'sci-ecology'],
    tags: ['required'],
    notes: 'SIP required.', deadlineNote: null },

  { id: 'sci-bio-h', name: 'Accelerated Biology (H)', department: 'Science', grades: [11],
    semester: 'yearlong', honors: true, ap: false, socialImpact: false,
    prereqs: ['sci-chemistry'],
    prereqNotes: 'Placement by department',
    unlocks: ['sci-advbio-mol', 'sci-marine', 'sci-ecology'],
    tags: ['decision', 'stem'],
    notes: 'Strong research focus; SIP required + submitted to Aardvark Expo.',
    deadlineNote: null },

  { id: 'sci-advbio-mol', name: 'Advanced Biology: Molecular Research (H)', department: 'Science', grades: [12],
    semester: 'fall', honors: true, ap: false, socialImpact: false,
    prereqs: ['sci-biology'],
    prereqNotes: 'Accelerated Bio or Bio with teacher permission',
    unlocks: [],
    tags: ['unique', 'stem'],
    notes: 'Gene expression, genetic modification, environmental DNA. Authentic scientific practices.',
    deadlineNote: null },

  { id: 'sci-ecology', name: 'Advanced Biology: Systems Ecology (H)', department: 'Science', grades: [12],
    semester: 'spring', honors: true, ap: false, socialImpact: false,
    prereqs: ['sci-chemistry'],
    prereqNotes: 'Co-requisite: Biology',
    unlocks: [],
    tags: ['unique', 'stem'],
    notes: 'Ecosystems, population dynamics, climate change through systems thinking.',
    deadlineNote: null },

  { id: 'sci-advchem', name: 'Advanced Chemistry: Organic Molecules (H)', department: 'Science', grades: [12],
    semester: 'fall', honors: true, ap: false, socialImpact: false,
    prereqs: ['sci-chemistry'], unlocks: [],
    tags: ['stem'],
    notes: 'Organic synthesis, functional groups, spectroscopy.', deadlineNote: null },

  { id: 'sci-advphys-mech', name: 'Advanced Physics: Mechanics (H)', department: 'Science', grades: [11, 12],
    semester: 'fall', honors: true, ap: false, socialImpact: false,
    prereqs: ['math-precalc'],
    prereqNotes: 'Any pre-calculus course',
    unlocks: ['sci-advphys-thermo'],
    tags: ['stem', 'unique'],
    notes: 'Newtonian mechanics with calculus and computational methods. Recommended for pre-med/engineering.',
    deadlineNote: null },

  { id: 'sci-advphys-thermo', name: 'Advanced Physics: Thermodynamics & Optics (H)', department: 'Science', grades: [12],
    semester: 'spring', honors: true, ap: false, socialImpact: false,
    prereqs: ['sci-advphys-mech', 'math-calc-ab'],
    prereqNotes: 'Mechanics + any calculus course; can co-enroll in AP Calc BC',
    unlocks: [],
    tags: ['stem'],
    notes: 'Laws of thermodynamics, heat engines, geometric optics.', deadlineNote: null },

  { id: 'sci-marine', name: 'Marine Science', department: 'Science', grades: [10, 11, 12],
    semester: 'fall-spring', honors: false, ap: false, socialImpact: false,
    prereqs: ['sci-biology'],
    prereqNotes: 'Any yearlong Biology course',
    unlocks: [],
    tags: [],
    notes: 'Oregon coast to Great Barrier Reef. Multi-disciplinary approach.', deadlineNote: null },

  { id: 'sci-engineering', name: 'Introduction to Engineering', department: 'Science', grades: [10, 11, 12],
    semester: 'fall-spring', honors: false, ap: false, socialImpact: false,
    prereqs: [], unlocks: [],
    tags: ['unique'],
    notes: 'Iterative design, prototyping, ethics. Available from grade 10. Offered both semesters.',
    deadlineNote: null },

  { id: 'sci-mech-eng', name: 'Mechanical Systems Engineering', department: 'Science', grades: [11, 12],
    semester: 'fall', honors: false, ap: false, socialImpact: true,
    prereqs: [], unlocks: [],
    tags: ['unique'],
    notes: 'Controlled environment agriculture in OES greenhouse. Hydroponics, food systems. Social Impact class.',
    deadlineNote: null },

  { id: 'sci-process-eng', name: 'Process Design Engineering', department: 'Science', grades: [11, 12],
    semester: 'spring', honors: false, ap: false, socialImpact: true,
    prereqs: [], unlocks: [],
    tags: ['unique'],
    notes: 'Aquaponics system design. Biology + chemistry + physics + engineering. Social Impact class.',
    deadlineNote: null },

  { id: 'sci-blc-arts', name: 'Better Living Through Chemistry: Visual Arts', department: 'Science', grades: [10, 11, 12],
    semester: 'fall', honors: false, ap: false, socialImpact: false,
    prereqs: ['sci-chemistry'],
    prereqNotes: 'In or have taken Chemistry',
    unlocks: [],
    tags: [],
    notes: 'Ceramic glazes, metallic patinas, pigment extraction. Interdisciplinary.', deadlineNote: null },

  { id: 'sci-blc-pnw', name: 'Better Living Through Chemistry: PNW Foods', department: 'Science', grades: [10, 11, 12],
    semester: 'spring', honors: false, ap: false, socialImpact: false,
    prereqs: ['sci-chemistry'],
    prereqNotes: 'In or have taken Chemistry',
    unlocks: [],
    tags: ['unique'],
    notes: 'Coffee roasting, maple sap, PNW berries, ice cream. Hands-on food chemistry.', deadlineNote: null },

  // ── HEALTH & PE ──────────────────────────────────────────────────────────

  { id: 'health', name: 'Health and Wellness', department: 'Health', grades: [9],
    semester: 'yearlong', honors: false, ap: false, socialImpact: false,
    prereqs: [], unlocks: [],
    tags: ['required'],
    notes: 'Required in 9th grade only. Covers sexuality ed, relationships, drugs, mental health. Includes ropes course.',
    deadlineNote: null },

  { id: 'weightlifting', name: 'Weightlifting', department: 'Health', grades: [10, 11, 12],
    semester: 'fall-spring', honors: false, ap: false, socialImpact: false,
    prereqs: [], unlocks: [],
    tags: [],
    notes: null, deadlineNote: null },

  // ── RELIGION & PHILOSOPHY ─────────────────────────────────────────────────

  { id: 'rp-worldrel', name: 'World Religions', department: 'Religion & Philosophy', grades: [10, 11, 12],
    semester: 'fall-spring', honors: false, ap: false, socialImpact: false,
    prereqs: [],
    unlocks: ['rp-buddhism', 'rp-love', 'rp-encounters', 'rp-ethics', 'rp-hebrew'],
    tags: ['required'],
    notes: 'MUST complete before any other R&P course. Cannot take concurrently. Must complete by fall of senior year at latest.',
    deadlineNote: 'Must complete World Religions by fall of senior year to have time for the required second R&P course.' },

  { id: 'rp-buddhism', name: 'Buddhism (H)', department: 'Religion & Philosophy', grades: [11, 12],
    semester: 'fall', honors: true, ap: false, socialImpact: false,
    prereqs: ['rp-worldrel'], unlocks: [],
    tags: [], notes: 'Four Noble Truths, emptiness, karma, meditation practice.', deadlineNote: null },

  { id: 'rp-love', name: 'The Philosophy of Love', department: 'Religion & Philosophy', grades: [11, 12],
    semester: 'fall', honors: false, ap: false, socialImpact: false,
    prereqs: ['rp-worldrel'], unlocks: [],
    tags: [], notes: 'Plato to bell hooks.', deadlineNote: null },

  { id: 'rp-encounters', name: 'Encounters: Literature of Transformation (H)', department: 'Religion & Philosophy', grades: [11, 12],
    semester: 'spring', honors: true, ap: false, socialImpact: false,
    prereqs: ['rp-worldrel'], unlocks: [],
    tags: [],
    notes: 'Philosophy + literature + theology. Milton, Hesse, O\'Connor. Also counts as Interdisciplinary elective.',
    deadlineNote: null },

  { id: 'rp-ethics', name: 'Ethical Intelligence', department: 'Religion & Philosophy', grades: [11, 12],
    semester: 'spring', honors: false, ap: false, socialImpact: false,
    prereqs: ['rp-worldrel'], unlocks: [],
    tags: [], notes: null, deadlineNote: null },

  { id: 'rp-hebrew', name: 'Women and the Hebrew Bible', department: 'Religion & Philosophy', grades: [11, 12],
    semester: 'spring', honors: false, ap: false, socialImpact: false,
    prereqs: ['rp-worldrel'], unlocks: [],
    tags: [], notes: null, deadlineNote: null },

  // ── WORLD LANGUAGES ──────────────────────────────────────────────────────

  { id: 'lang-spanish1', name: 'Spanish I', department: 'World Languages', grades: [9],
    semester: 'yearlong', honors: false, ap: false, socialImpact: false,
    prereqs: [], unlocks: ['lang-spanish2'],
    tags: ['required', 'language'],
    notes: 'Entry point for students new to Spanish. No placement test required. Year 1 of graduation requirement.',
    deadlineNote: null },

  { id: 'lang-spanish2', name: 'Spanish II', department: 'World Languages', grades: [9, 10],
    semester: 'yearlong', honors: false, ap: false, socialImpact: false,
    prereqs: ['lang-spanish1'], unlocks: ['lang-spanish3'],
    tags: ['required', 'language'],
    notes: 'Year 1 of graduation requirement if starting here. Most OES students enter at Level 2.', deadlineNote: null },

  { id: 'lang-spanish3', name: 'Spanish III', department: 'World Languages', grades: [10, 11],
    semester: 'yearlong', honors: false, ap: false, socialImpact: false,
    prereqs: ['lang-spanish2'], unlocks: ['lang-spanish4'],
    tags: ['language'],
    notes: 'Bridge to advanced Spanish. Authentic materials.', deadlineNote: null },

  { id: 'lang-spanish4', name: 'Spanish IV', department: 'World Languages', grades: [11, 12],
    semester: 'yearlong', honors: false, ap: false, socialImpact: false,
    prereqs: ['lang-spanish3'], unlocks: ['lang-ap-spanish', 'lang-hlc'],
    tags: ['language', 'decision'],
    notes: 'Pre-AP. Opens AP Spanish and HLC/HCC.',
    deadlineNote: 'Must reach Level 4 by 11th grade to access AP or HLC in 12th.' },

  { id: 'lang-ap-spanish', name: 'AP Spanish Language', department: 'World Languages', grades: [12],
    semester: 'yearlong', honors: true, ap: true, socialImpact: true,
    prereqs: ['lang-spanish4'], unlocks: [],
    tags: ['language', 'unique'],
    notes: 'Honors + Social Impact course. May qualify for college credit.', deadlineNote: null },

  { id: 'lang-hlc', name: 'HLC/HCC Spanish (H)', department: 'World Languages', grades: [11, 12],
    semester: 'fall', honors: true, ap: false, socialImpact: true,
    prereqs: ['lang-spanish4'], unlocks: [],
    tags: ['language', 'unique'],
    notes: 'Weekly 1-on-1 tutoring at Vose Elementary. Counts as Honors + Social Impact + CE project simultaneously. Alternates content yearly — can repeat.',
    deadlineNote: null },

  { id: 'lang-french2', name: 'French II', department: 'World Languages', grades: [9, 10],
    semester: 'yearlong', honors: false, ap: false, socialImpact: false,
    prereqs: [], unlocks: ['lang-french3'],
    tags: ['required', 'language'], notes: null, deadlineNote: null },

  { id: 'lang-french3', name: 'French III', department: 'World Languages', grades: [10, 11],
    semester: 'yearlong', honors: false, ap: false, socialImpact: false,
    prereqs: ['lang-french2'], unlocks: ['lang-french4'],
    tags: ['language'], notes: null, deadlineNote: null },

  { id: 'lang-french4', name: 'French IV', department: 'World Languages', grades: [11, 12],
    semester: 'yearlong', honors: false, ap: false, socialImpact: false,
    prereqs: ['lang-french3'], unlocks: ['lang-ap-french'],
    tags: ['language', 'decision'],
    notes: 'Pre-AP.',
    deadlineNote: 'Must reach Level 4 by 11th grade to access AP French in 12th.' },

  { id: 'lang-ap-french', name: 'AP French Language', department: 'World Languages', grades: [12],
    semester: 'yearlong', honors: true, ap: true, socialImpact: false,
    prereqs: ['lang-french4'], unlocks: [],
    tags: ['language', 'unique'], notes: 'Honors course. AP exam available.', deadlineNote: null },

  { id: 'lang-chinese2', name: 'Chinese II', department: 'World Languages', grades: [9, 10],
    semester: 'yearlong', honors: false, ap: false, socialImpact: false,
    prereqs: [], unlocks: ['lang-chinese3'],
    tags: ['required', 'language'], notes: null, deadlineNote: null },

  { id: 'lang-chinese3', name: 'Chinese III', department: 'World Languages', grades: [10, 11],
    semester: 'yearlong', honors: false, ap: false, socialImpact: false,
    prereqs: ['lang-chinese2'], unlocks: ['lang-chinese4'],
    tags: ['language'], notes: null, deadlineNote: null },

  { id: 'lang-chinese4', name: 'Chinese IV', department: 'World Languages', grades: [11, 12],
    semester: 'yearlong', honors: false, ap: false, socialImpact: false,
    prereqs: ['lang-chinese3'], unlocks: ['lang-chinese5'],
    tags: ['language', 'decision'], notes: null, deadlineNote: null },

  { id: 'lang-chinese5', name: 'Chinese V (H)', department: 'World Languages', grades: [12],
    semester: 'yearlong', honors: true, ap: false, socialImpact: false,
    prereqs: ['lang-chinese4'], unlocks: [],
    tags: ['language'], notes: 'Unrehearsed discussions on complex topics; long-form composition.', deadlineNote: null },

  // ── ARTS ─────────────────────────────────────────────────────────────────
  // Three representative courses covering the 1.5-credit (3-course) arts requirement.
  // Many more options exist; these are the most useful for four-year planning.

  { id: 'arts-studio-found', name: 'Studio Art Foundations', department: 'Arts', grades: [9, 10, 11, 12],
    semester: 'fall-spring', honors: false, ap: false, socialImpact: false,
    prereqs: [], unlocks: ['arts-inquiry'],
    tags: ['arts'],
    notes: 'Intro to elements of art and design in 2D and 3D. Good first arts course. Can only be taken once.',
    deadlineNote: null },

  { id: 'arts-photo', name: 'Fine Art Photography', department: 'Arts', grades: [9, 10, 11, 12],
    semester: 'fall-spring', honors: false, ap: false, socialImpact: false,
    prereqs: [], unlocks: ['arts-inquiry'],
    tags: ['arts'],
    notes: 'Darkroom to digital: pinhole cameras through Adobe Lightroom. Can be taken twice (advanced track second time).',
    deadlineNote: null },

  { id: 'arts-inquiry', name: 'Inquiry in Arts', department: 'Arts', grades: [11, 12],
    semester: 'fall-spring', honors: false, ap: false, socialImpact: false,
    prereqs: ['arts-studio-found'],
    prereqNotes: 'Must have completed 3 arts courses (1.5 credits). Signed proposal and approval required.',
    unlocks: [],
    tags: ['arts', 'unique', 'deadline'],
    notes: 'Individualized advanced project: college portfolio, specialized medium, or interdisciplinary inquiry. Space limited by mentor availability.',
    deadlineNote: 'PROPOSAL DEADLINE: End of junior year for the following fall or spring. First-come, first-served.' },

  // ── INTERDISCIPLINARY ────────────────────────────────────────────────────

  { id: 'inter-social-innovation', name: 'Social Innovation & Entrepreneurship', department: 'Interdisciplinary', grades: [12],
    semester: 'spring', honors: false, ap: false, socialImpact: true,
    prereqs: [], unlocks: [],
    tags: ['unique'],
    notes: 'Design + launch a real social venture using UN SDG framework. "Field-work" phase. Community Engagement project.',
    deadlineNote: null },

  { id: 'inter-encounters', name: 'Encounters: Literature of Transformation (H)', department: 'Interdisciplinary', grades: [11, 12],
    semester: 'spring', honors: true, ap: false, socialImpact: false,
    prereqs: [], unlocks: [],
    tags: ['unique'],
    notes: 'Philosophy + literature + theology. Also satisfies R&P requirement if World Religions completed.',
    deadlineNote: null },

  // ── SPECIAL PROGRAMS ─────────────────────────────────────────────────────

  { id: 'ta-program', name: 'Teaching Assistant Program', department: 'Special', grades: [11, 12],
    semester: 'fall-spring', honors: false, ap: false, socialImpact: false,
    prereqs: [],
    prereqNotes: 'Strong record in subject; application required by May 1 of junior year',
    unlocks: [],
    tags: ['unique', 'deadline'],
    notes: 'Peer tutoring, leading discussions, grading. Can count as 7th class. Transcript entry. Strong college signal.',
    deadlineNote: 'APPLICATION DEADLINE: May 1 of junior year (11th grade). Must apply to have this option in 12th grade.' },

  { id: 'winterim', name: 'Winterim', department: 'Special', grades: [9, 10, 11, 12],
    semester: 'yearlong', honors: false, ap: false, socialImpact: false,
    prereqs: [], unlocks: [],
    tags: ['required'],
    notes: 'Six days before spring break. Immersive experiential learning. Required every year. Domestic and international options.',
    deadlineNote: null },

];

// ── CRITICAL PATHS ────────────────────────────────────────────────────────
// Pre-computed chains for the dependency view

const CRITICAL_PATHS = [
  {
    id: 'path-calc-bc',
    name: 'AP Calculus BC path',
    description: 'The highest math trajectory. Unlocks Linear Algebra and Multivariable Calculus senior year.',
    steps: [
      { grade: 9, courseId: 'math-geometry', note: 'Must be in Geometry now' },
      { grade: 10, courseId: 'math-advalg-proofs', note: 'Requires A in Geometry + teacher rec' },
      { grade: 11, courseId: 'math-precalc-proofs', note: 'Requires B+ in Adv Alg with Proofs' },
      { grade: 12, courseId: 'math-calc-bc', note: 'Goal — college-level calculus' },
      { grade: 12, courseId: 'math-linear-alg', note: 'Bonus: Linear Algebra (H), fall semester' },
      { grade: 12, courseId: 'math-multivariable', note: 'Bonus: Multivariable Calc (H), spring semester' },
    ]
  },
  {
    id: 'path-calc-ab',
    name: 'AP Calculus AB path',
    description: 'Strong standard path. Still rigorous and college-prep.',
    steps: [
      { grade: 9, courseId: 'math-geometry', note: 'In Geometry now' },
      { grade: 10, courseId: 'math-advalg', note: 'Standard Advanced Algebra' },
      { grade: 11, courseId: 'math-precalc', note: 'Precalculus' },
      { grade: 12, courseId: 'math-calc-ab', note: 'AP Calculus AB' },
    ]
  },
  {
    id: 'path-ml',
    name: 'Machine Learning path',
    description: 'Full CS sequence. Requires starting Python I by 10th grade AND being on honors math path.',
    steps: [
      { grade: 10, courseId: 'cs-python1', note: 'Must start by 10th grade' },
      { grade: 11, courseId: 'cs-python2', note: 'Fall semester only' },
      { grade: 11, courseId: 'cs-python3', note: 'Spring semester only' },
      { grade: 12, courseId: 'cs-ml', note: 'Also requires AP Calc AB' },
    ]
  },
  {
    id: 'path-ap-language',
    name: 'AP Language path',
    description: 'Three-to-four year language track. Strongly recommended for selective college applicants.',
    steps: [
      { grade: 9, courseId: null, note: 'Current language placement (Level 2 assumed)' },
      { grade: 10, courseId: null, note: 'Level 3' },
      { grade: 11, courseId: null, note: 'Level 4' },
      { grade: 12, courseId: null, note: 'AP Language OR HLC/HCC (Spanish)' },
    ]
  },
  {
    id: 'path-ta',
    name: 'Teaching Assistant',
    description: 'Leadership role in 12th grade. Application in spring of 11th grade.',
    steps: [
      { grade: 9, courseId: null, note: 'Build strong record in target subject' },
      { grade: 10, courseId: null, note: 'Continue building record' },
      { grade: 11, courseId: 'ta-program', note: 'Apply by May 1 — THIS IS THE DEADLINE' },
      { grade: 12, courseId: 'ta-program', note: 'Serve as TA; can be 7th class' },
    ]
  }
];

// ── KEY DEADLINES ─────────────────────────────────────────────────────────

const DEADLINES = [
  {
    when: 'Spring of Grade 9 (now — course registration)',
    urgency: 'critical',
    action: 'Confirm math placement for 10th grade',
    detail: 'Advanced Algebra with Proofs (H) requires A average in Geometry + teacher recommendation. This is the fork that determines whether he can reach Calc BC, Linear Algebra, and Multivariable Calculus.',
    affects: ['math-advalg-proofs', 'math-precalc-proofs', 'math-calc-bc', 'math-linear-alg', 'math-multivariable']
  },
  {
    when: 'Spring of Grade 9 (now — course registration)',
    urgency: 'high',
    action: 'Decide whether to start CS in 10th grade',
    detail: 'Python I in 10th grade is the only way to reach Machine Learning (H) by senior year. Waiting until 11th grade makes it impossible.',
    affects: ['cs-python1', 'cs-python2', 'cs-python3', 'cs-ml']
  },
  {
    when: 'Spring of Grade 9 (now)',
    urgency: 'medium',
    action: 'Plan World Religions timing',
    detail: 'Must complete World Religions before any other Religion & Philosophy course, and no later than fall of senior year. Taking it in 10th grade (spring only) opens up elective options in 11th and 12th.',
    affects: ['rp-worldrel', 'rp-buddhism', 'rp-encounters', 'rp-ethics']
  },
  {
    when: 'Spring of Grade 9 (now)',
    urgency: 'medium',
    action: 'Decide on language continuation depth',
    detail: 'Two years fulfills the requirement. But 3–4 years is strongly recommended for selective colleges. AP or HLC/HCC requires Level 4, which means committing to the language through 11th grade.',
    affects: ['lang-spanish4', 'lang-ap-spanish', 'lang-hlc', 'lang-french4', 'lang-ap-french']
  },
  {
    when: 'May 1 of Grade 11 (junior year)',
    urgency: 'critical',
    action: 'Submit Teaching Assistant application',
    detail: 'TA program for 12th grade. Hard deadline. Requires demonstrated record in a subject over previous years. Can count as 7th class senior year.',
    affects: ['ta-program']
  },
  {
    when: 'End of Grade 11 (junior year)',
    urgency: 'medium',
    action: 'Submit Inquiry in Arts proposal (if interested)',
    detail: 'Fall and spring proposals due end of junior year. Space limited by mentor availability.',
    affects: []
  },
  {
    when: 'Grade 10 registration',
    urgency: 'high',
    action: 'Confirm science track',
    detail: 'Accelerated Chemistry (H) is placement-only (not self-selected). Faculty will assess. If placed, it signals readiness for advanced science electives. Standard Chemistry also feeds all advanced science options.',
    affects: ['sci-chem-h', 'sci-advbio-mol', 'sci-advchem']
  }
];

// ── GRADUATION REQUIREMENTS ───────────────────────────────────────────────

const GRADUATION_REQUIREMENTS = {
  english: { credits: 4, description: 'English 9, 10, 11, and two senior courses' },
  history: { credits: 2.5, description: 'Global Perspectives, US History, Civics/Gov/Economy' },
  math: { credits: 3, description: 'Must complete through Advanced Algebra' },
  health: { credits: 1, description: 'Health and Wellness in grade 9' },
  religion: { credits: 1, description: 'World Religions + one elective' },
  science: { credits: 3, description: 'Physics, Chemistry, Biology' },
  arts: { credits: 1.5, description: 'Three semesters in Performing Arts, Visual Art, or Music' },
  languages: { credits: 2, description: 'Two consecutive years of the same language' },
  additional: { credits: 3, description: 'Six additional semester courses in any subject' },
  communityEngagement: {
    oncampus: 60, offcampus: 20,
    alternative: { oncampus: 40, offcampus: 40 },
    projects: 2,
    description: '60 hrs on campus + 20 off (or 40+40). Two projects. Unpaid. Nonprofit only.'
  },
  winterim: 'Required every year',
  extracurricular: {
    grades9to10: 2,
    grades11to12: 1,
    description: 'Two per year in grades 9-10; one per year in grades 11-12'
  }
};

if (typeof module !== 'undefined') {
  module.exports = { COURSES, CRITICAL_PATHS, DEADLINES, GRADUATION_REQUIREMENTS };
}
