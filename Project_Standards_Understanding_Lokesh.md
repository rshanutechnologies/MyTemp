
# SSC-Website Portal - Project Standards Understanding

**Prepared by:** Lokesh Gandam  
**Project:** SSC-LMS (Learning Management System)  
**Grades:** 1-5 | **Exercise Types:** MCQ, FITB, True/False, Matching, One Word, One Example

---

## 1. Typography Standards


| Element | Font Family | Font Size | Weight |
|---------|------------|-----------|--------|
| Dashboard (index.html) | `Poppins` | Body: 14px, Headers: 28-36px | 500-800 |
| Lesson Exercises | `Livvic` | Title: 30-34px, Question: 30-44px | 400-700 |
| Option Labels | (inherits) | 18px | 600 |
| Popup Title | (inherits) | 28px | 600 |
| Popup Message | (inherits) | 18px | 500 |
| Prev/Next Buttons | (inherits) | 16px | 500 |
| Input Fields (FITB) | (inherits) | 22-26px | 400 |

**Issue Found:** Some exercise HTML files reference `Livvic` while dashboard uses `Poppins`. Need to standardize to ONE font family across all pages.

---

## 2. Image Guidelines - CRITICAL: Do NOT Reveal Answers

**Current Issues Observed in Code:**

1. **MCQ (`mcq.js`):** Option images are named after the answer value (e.g., `10.png`, `12.png`, `18.png`, `22.png`). A student can view the image filename in DevTools or by hovering to see the answer.

2. **FITB (`FITB.js`):** Correct answers are stored in plain text in `questions[]` array visible in browser DevTools Sources tab. The answer values are visible in JavaScript.

3. **True/False (`true_false.js`):** Boolean answer (`a:true`/`a:false`) is stored in the JS array, visible in sources.

**Standards to Follow:**
- Image filenames must NOT contain the answer or any hint about the correct option
- Answers should be obfuscated or server-side validated where possible
- If storing answers client-side, at minimum use encoding/hashing or split across multiple files
- Image alt text should NOT reveal the answer either

---

## 3. Layout & Alignment Standards

| Component | Standard |
|-----------|----------|
| Question text | Centered or start-aligned, width: 750-900px, min-height: 80px |
| Option grid | 4 columns (desktop), 2 columns (tablet/mobile), gap: 30px |
| Option cards | Border-radius: 22px, padding: 10px, border: 3px transparent |
| Navigation buttons | Circular (80x80px), gap between: 65-85% of container |
| Input containers | Width: 65%, border-radius: 30-40px, centered with margin: auto |
| Images in questions | Width: 200-300px, Height: 200-350px, object-fit: contain |
| Popup containers | Width: min(420px, 90%), border-radius: 25px, padding: 35-40px |
| Score display | Position: absolute, right: 0, top: 0 (dashboard header style) |
| Sidebar | Width: 260px, position: fixed on desktop, hidden off-canvas on mobile |

---

## 4. Responsive Breakpoints

| Breakpoint | Target Devices |
|------------|----------------|
| 320-350px | Small phones |
| 351-430px | Regular phones |
| 431-600px | Large phones |
| 601-768px | Tablets portrait |
| 769-1100px | Tablets landscape / small laptops |
| 1101-1440px | Desktops |
| 1441-1920px | Large screens |
| 1921px+ | 4K displays |

---

## 5. Folder & Naming Conventions

```
Grade_X/
├── GradeX_lessonY.html       (Lesson hub page - PascalCase)
├── exercises/
│   ├── MCQ.html              (Exercise HTML - uppercase for exercise type)
│   ├── FITB.html
│   ├── True_false.html
│   ├── matching.html
│   └── oneExample.html
└── assets/
    ├── css/
    │   ├── mcq.css            (lowercase CSS file naming)
    │   ├── FITB.css
    │   ├── true_false.css
    │   └── matching.css
    ├── js/
    │   ├── mcq.js             (lowercase JS file naming)
    │   ├── FITB.js
    │   └── true_false.js
    └── images/
        └── (image files)
```

**Issues:** Inconsistent casing in file names (e.g., `true_false.html` vs `True_false.html`, `oneExample.html` vs `one_word.html`). Exercise type naming should be consistent across grades.

---

## 6. Code Conventions

- **Indentation:** 2 spaces (observed consistently)
- **Quotes:** Double quotes for HTML attributes, single quotes for JS strings (mixed usage)
- **Naming:** camelCase for JS variables/functions, kebab-case for CSS classes (mixed usage)
- **Comments:** Block comments `/* ... */` used for section headers
- **Ending semicolons:** Yes (consistent in JS)
- **CSS organization:** RESET -> BODY -> specific components -> responsive @media queries

---

## 7. Exercise Logic Patterns (Common Template)

All exercises follow this flow:
1. Load data array (questions/answers/images)
2. Load question `loadQuestion() / loadQuestion(index)`
3. User interacts (click option / type input / drag match)
4. Check answer -> show popup (correct/wrong)
5. Update score -> enable Next button
6. On last question -> show final popup with score + stars

---

## 8. Consistency Gaps Identified

1. **Font:** Dashboard uses `Poppins`, exercises use `Livvic` - should be unified
2. **Exercise URLs:** Some use `.html`, some load via iframe
3. **Score display:** Some exercises have scoreBox, some don't
4. **Image answer leak:** MCQ option images named with numbers that reveal answer
5. **File naming:** Mixed casing across grades (e.g., `True_false/true_false`)
6. **CSS duplication:** Same styles repeated across multiple CSS files (popup, final-box patterns)
7. **Responsive approach:** Inconsistent - some files have comprehensive media queries, others minimal
8. **Audio files:** Some exercises link to external audio URLs, some don't have audio at all
9. **Confetti library:** canvas-confetti CDN - should be consistent across all exercises

---

## 9. Recommended Action Items

1. Unify font family across all pages (recommend Poppins as base, or document the choice)
2. Rename all image files to NOT reveal answer values (e.g., `opt_a.png`, `opt_b.png` instead of `10.png`)
3. Standardize file naming convention (decide on PascalCase vs camelCase for HTML files)
4. Create a shared `common.css` for popup, button, and score styles to avoid duplication
5. Ensure every exercise type exists in every grade (currently some grades missing exercise types)
6. Fix inconsistent media query breakpoints across files
7. Standardize gap values for navigation buttons (currently varies from 40%-85%)
8. Document the quiz data structure template so all devs follow the same pattern
