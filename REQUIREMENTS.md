# reactgentester — Project Requirements

A reusable, production-quality React UI component library, published to npm as
**`reactgentester`**. Built with an emphasis on reusability, accessibility, type
safety, maintainability, and rigorous automated testing.

> This document is the fine-tuned source of truth for the project. It supersedes
> the original brief. Forward-looking scope lives in [ROADMAP.md](./ROADMAP.md).

---

## 1. Locked decisions

| Area | Decision | Notes |
|---|---|---|
| **Framework** | React + TypeScript | Functional components only; strict TS; no `any`. |
| **Build tool** | Vite (library mode) | ESM + CJS output, `.d.ts` generation. |
| **Styling** | Tailwind CSS (v4) | Authored with utilities; **shipped as precompiled CSS**. |
| **Theming** | CSS variables | Tailwind `@theme` tokens compile to CSS custom properties. |
| **Distribution** | Publishable npm package | `reactgentester`; React as a `peerDependency`. |
| **Testing** | Vitest + React Testing Library | + `@testing-library/user-event`, `jest-dom`, `vitest-axe`. |
| **Coverage** | ~95%+ pragmatic gate | Explicit, annotated ignores allowed. |
| **v1 scope** | Core 3: Button, Input, Modal | Phase 2 and beyond in [ROADMAP.md](./ROADMAP.md). |

---

## 2. Styling & theming model (important)

Because the library is **published** and must work for consumers who do **not**
use Tailwind:

1. Components are **authored** with Tailwind utility classes for developer
   experience.
2. The build **precompiles** all utilities into a single stylesheet shipped at
   `reactgentester/styles.css`. Consumers get styles with one import — no
   Tailwind required on their end.
3. All design tokens (colors, spacing, radii, etc.) are defined via Tailwind v4
   `@theme`, which emits **CSS custom properties**. Consumers **re-theme by
   overriding CSS variables** — no build step needed.
4. Design tokens are **namespaced** with `rgt-` (e.g. `bg-rgt-primary`,
   `rounded-rgt-md`), so the library's themeable utilities never collide with a
   consumer's own theme. (A full global class prefix can be enabled later if
   needed.)

**Consumer usage:**

```tsx
import { Button } from 'reactgentester';
import 'reactgentester/styles.css';

<Button variant="primary">Save</Button>
```

**Consumer theming (no Tailwind needed):**

```css
:root {
  --rgt-color-primary: #4f46e5;
  --rgt-radius-md: 0.5rem;
}
```

---

## 3. Success criteria (Definition of Done for v1)

A component is **done** only when all of the following hold:

- [ ] Fully implemented as a functional component, strictly typed.
- [ ] Forwards refs where appropriate; spreads native HTML props.
- [ ] Accessible: semantic HTML, ARIA, keyboard support, visible focus,
      screen-reader friendly.
- [ ] **Unit** tests passing (rendering, props, interaction, state, styling, a11y, edge cases).
- [ ] **Integration** tests passing (composition with sibling components).
- [ ] **Functional** tests passing (complete user workflows).
- [ ] **Regression** tests added for any fixed bug.
- [ ] Automated a11y assertions (`vitest-axe`) report **zero** violations.
- [ ] Coverage ≥ **95%** for statements, branches, functions, and lines; every
      ignore annotated with a reason.
- [ ] `tsc --noEmit` clean; lint clean.
- [ ] Documented: component README with prop table + usage examples.
- [ ] Exported from the package barrel and renders in the local demo app.

The **library** is release-ready when: it builds to ESM + CJS + types, the demo
app renders every component and variant, and CI-equivalent checks
(typecheck, lint, test, coverage, build) all pass.

---

## 4. Components — v1 (Phase 1: Core)

### Button
Variants: `primary`, `secondary`, `danger`, `outline`, `ghost`.
Sizes: `sm`, `md`, `lg`. States: loading, disabled.
Left/right icon, full-width, custom `className`, native button props, ref forwarding.

### Input
Label, placeholder, helper text, error message, required, disabled.
Controlled mode, prefix/suffix icon, password visibility toggle, ref forwarding.

### Modal
Open/close, overlay, close button, Escape support, overlay-click support,
portal rendering, body scroll locking, focus management (trap + restore),
full keyboard accessibility.

> Phase 2 (Checkbox, Radio Group, Switch, Badge, Spinner, Alert, Card) and
> future components are specified in [ROADMAP.md](./ROADMAP.md).

---

## 5. Accessibility requirements

Every interactive component must:

- Use semantic HTML.
- Be fully keyboard accessible.
- Include appropriate ARIA attributes.
- Maintain a visible focus indicator.
- Meet WCAG 2.1 AA recommendations.
- Support screen readers.
- Pass automated `vitest-axe` checks with zero violations.

---

## 6. Testing strategy

A layered approach; behavior over implementation detail.

| Layer | Purpose |
|---|---|
| **Unit** | Each component in isolation: rendering, props, interaction, state, styling, a11y, edge cases. |
| **Integration** | Multiple components composed (e.g. Login Form = Card + Input + Button). |
| **Functional** | Complete user workflows (e.g. open modal → focus trap → Escape → focus restored). |
| **Regression** | A permanent test for every fixed bug. |

**Testing philosophy**
- Test behavior, not implementation details.
- Prefer semantic queries (`getByRole`, `getByLabelText`).
- Avoid class-name / implementation-specific selectors.
- Mock only external dependencies when necessary.
- Keep tests isolated, deterministic, and descriptively named.

**v1 example scenarios**
- *Login Form* (Card + Input + Button): credentials update; submit receives expected data.
- *Delete Confirmation* (Button + Modal): button opens modal; cancel closes; confirm fires callback.
- *Modal Flow* (functional): open → focus moves inside → keyboard nav → Escape closes → focus returns to trigger.

---

## 7. Coverage requirements

- Targets: **≥95%** statements, branches, functions, lines.
- Enforced via Vitest coverage thresholds (CI-ready).
- Ignores permitted only with an inline reason, e.g.
  `/* c8 ignore next -- unreachable: defensive default */`.
- Coverage maintained across unit, integration, functional, and regression tests.

---

## 8. Quality gates

A component advances only after clearing each gate in order:

1. ✅ Implemented
2. ✅ Unit tests
3. ✅ Integration tests
4. ✅ Functional tests
5. ✅ Accessibility verified (incl. `vitest-axe`)
6. ✅ ≥95% coverage
7. ✅ Documentation

---

## 9. Repository structure

Designed so adding a component is drop-in and repeatable.

```
reactgentester/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx        # unit
│   │   │   ├── Button.a11y.test.tsx   # axe (or folded into unit)
│   │   │   └── index.ts
│   │   ├── Input/
│   │   └── Modal/
│   ├── hooks/                 # shared hooks (e.g. useFocusTrap, useScrollLock)
│   ├── utils/                 # shared helpers (e.g. cn/classnames)
│   ├── styles/                # Tailwind entry + @theme tokens
│   ├── test/
│   │   ├── setup.ts           # jest-dom, vitest-axe registration
│   │   └── integration/       # cross-component scenarios
│   └── index.ts               # public barrel export
├── demo/                      # local showcase app (Vite)
├── REQUIREMENTS.md
├── ROADMAP.md
├── package.json               # exports map: ".", "./styles.css"
├── vite.config.ts             # library build
├── vitest.config.ts           # test + coverage thresholds
└── tsconfig.json
```

Per-component contract: one folder, one `index.ts`, colocated tests, exported
from the root barrel.

---

## 10. Coding standards

- Functional components only; strict TypeScript; **no `any`**.
- Forward refs where appropriate; spread native props.
- Prefer composition over inheritance.
- Keep components focused, reusable, and framework-agnostic where practical.
- Minimize external runtime dependencies.
- Semantic HTML wherever possible.

---

## 11. Tooling

**v1:** Vite (lib mode), Vitest, RTL, user-event, jest-dom, vitest-axe,
TypeScript, ESLint, Prettier.

**Later (see ROADMAP):** Storybook, GitHub Actions CI, Husky + lint-staged,
automated release + npm publish workflow.
