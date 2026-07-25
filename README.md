# cobalt-ui

[![CI](https://github.com/dotado5/React-UI-Component-Test-Suite/actions/workflows/ci.yml/badge.svg)](https://github.com/dotado5/React-UI-Component-Test-Suite/actions/workflows/ci.yml)

A reusable, accessible, production-quality React UI component library — built with
React, TypeScript, Vite, Tailwind CSS v4, Vitest and React Testing Library.

- **Accessible by default** — semantic HTML, ARIA, keyboard support, focus management, zero axe violations.
- **Fully typed** — strict TypeScript, no `any`, refs forwarded, native props spread.
- **Themeable without Tailwind** — ships a precompiled stylesheet driven by CSS variables.
- **Heavily tested** — unit, integration, functional and regression layers at 100% coverage.

---

## Installation

```bash
npm install cobalt-ui
```

`react` and `react-dom` (v18 or v19) are peer dependencies.

## Quick start

```tsx
import { Button, Input, Modal } from 'cobalt-ui';
import 'cobalt-ui/styles.css';

export function Example() {
  return (
    <form>
      <Input label="Email" type="email" placeholder="you@example.com" />
      <Button type="submit">Sign in</Button>
    </form>
  );
}
```

The stylesheet import is required once, anywhere in your app. **You do not need
Tailwind** — the CSS ships precompiled.

> Want to try it in another local project before it's published? See
> [docs/LOCAL_USAGE.md](./docs/LOCAL_USAGE.md).

---

## Components

| Component | Description | Docs |
|---|---|---|
| `Button` | Variants, sizes, loading & disabled states, icons | [docs](./src/components/Button/README.md) |
| `Input` | Label, helper/error text, icons, password toggle | [docs](./src/components/Input/README.md) |
| `Modal` | Portal dialog with focus trap and scroll lock | [docs](./src/components/Modal/README.md) |
| `Checkbox` | Native checkbox with label and indeterminate state | [docs](./src/components/Checkbox/README.md) |
| `RadioGroup` | Fieldset-grouped radios, controlled or uncontrolled | [docs](./src/components/RadioGroup/README.md) |
| `Switch` | On/off toggle with `role="switch"` | [docs](./src/components/Switch/README.md) |
| `Badge` | Status/label indicator with variants and dot | [docs](./src/components/Badge/README.md) |
| `Spinner` | Accessible indeterminate loading indicator | [docs](./src/components/Spinner/README.md) |
| `Alert` | Contextual feedback, optional icon and dismiss | [docs](./src/components/Alert/README.md) |
| `Card` | Surface with header/footer and clickable state | [docs](./src/components/Card/README.md) |

Reusable hooks (`useFocusTrap`, `useScrollLock`, `useControllableState`) are also
exported — see [hooks docs](./src/hooks/README.md).

Further components are planned — see [ROADMAP.md](./ROADMAP.md).

---

## Theming

All design tokens are CSS custom properties, so you can re-theme the library by
overriding them — no Tailwind or build step required:

```css
:root {
  --color-rgt-primary: #0ea5e9;
  --color-rgt-primary-hover: #0284c7;
  --radius-rgt-md: 0.75rem;
}
```

### Available tokens

| Token | Default | Used by |
|---|---|---|
| `--color-rgt-primary` | `#4f46e5` | Primary button background |
| `--color-rgt-primary-hover` | `#4338ca` | Primary button hover |
| `--color-rgt-secondary` | `#4b5563` | Secondary button, muted text, placeholders |
| `--color-rgt-secondary-hover` | `#374151` | Secondary button hover |
| `--color-rgt-danger` | `#dc2626` | Danger button, error text/borders |
| `--color-rgt-danger-hover` | `#b91c1c` | Danger button hover, error alert/badge text |
| `--color-rgt-success` | `#15803d` | Success alert/badge text, dot |
| `--color-rgt-success-subtle` | `#dcfce7` | Success alert/badge background |
| `--color-rgt-warning` | `#b45309` | Warning alert/badge text, dot |
| `--color-rgt-warning-subtle` | `#fef3c7` | Warning alert/badge background |
| `--color-rgt-info` | `#1d4ed8` | Info alert/badge text, dot |
| `--color-rgt-info-subtle` | `#dbeafe` | Info alert/badge background |
| `--color-rgt-danger-subtle` | `#fee2e2` | Error alert/badge background |
| `--color-rgt-primary-subtle` | `#e0e7ff` | Primary badge background |
| `--color-rgt-fg` | `#111827` | Foreground / body text |
| `--color-rgt-muted` | `#f3f4f6` | Subtle hover backgrounds |
| `--color-rgt-border` | `#d1d5db` | Input and outline borders |
| `--color-rgt-ring` | `#6366f1` | Focus rings |
| `--color-rgt-bg` | `#ffffff` | Surface backgrounds |
| `--radius-rgt-sm` | `0.25rem` | Small radii (icon buttons) |
| `--radius-rgt-md` | `0.375rem` | Buttons, inputs |
| `--radius-rgt-lg` | `0.5rem` | Modal panel |

Tokens are namespaced with `rgt-` so they never collide with your own theme.

---

## Accessibility

Every interactive component uses semantic HTML, is fully keyboard operable,
exposes appropriate ARIA attributes, maintains a visible focus indicator, and is
verified against `axe` in the test suite with zero violations.

---

## Development

```bash
npm install
```

| Script | What it does |
|---|---|
| `npm run dev` | Demo/showcase playground at `localhost:5173` |
| `npm test` | Run the test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run coverage` | Run tests with the coverage gate (≥95%) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run build` | Build the publishable library to `dist/` |

The build emits ESM (`index.js`), CJS (`index.cjs`), type declarations, and a
single precompiled `style.css`.

See [REQUIREMENTS.md](./REQUIREMENTS.md) for the full spec and quality gates, and
[ROADMAP.md](./ROADMAP.md) for what's next and how to add a component.

## License

MIT
