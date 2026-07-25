# cobalt-ui — Roadmap

How the library grows beyond v1. The repo is structured so that **adding a
component is a repeatable checklist**, not a redesign. See
[REQUIREMENTS.md](./REQUIREMENTS.md) for the locked decisions and quality gates.

---

## Release phases

### v1 — Core (current)
Prove the full pipeline end-to-end on three components.

- [x] **Button**
- [x] **Input**
- [x] **Modal** (+ reusable `useFocusTrap` / `useScrollLock` hooks)
- [x] Library build (ESM + CJS + types) + precompiled `styles.css`
- [x] Demo/showcase app renders all v1 components
- [x] Coverage ≥95% gate wired into Vitest (currently 100%)
- [x] Integration + functional test suites (Login Form, Delete Confirmation, Login/Modal/Validation/Accessibility flows)
- [x] Per-component README docs (Definition of Done item)

**v1 is complete.** All Core 3 components ship implemented, typed, accessible,
documented, and covered by unit + integration + functional tests at 100%.

### v2 — Supporting components (Phase 2) — ✅ complete
Expand the set once the pipeline is proven.

| Component | Key features | Status |
|---|---|---|
| **Checkbox** | Controlled, disabled, label, indeterminate state | ✅ done |
| **Radio Group** | Multiple options, controlled, disabled | ✅ done |
| **Switch** | On/off, disabled, keyboard accessible, labels | ✅ done |
| **Badge** | Variants, sizes, rounded, dot indicator | ✅ done |
| **Spinner** | Sizes, variants, accessible loading label | ✅ done |
| **Alert** | Success/warning/error/info, optional dismiss, icon support | ✅ done |
| **Card** | Header/body/footer, shadow variants, clickable state | ✅ done |

All Phase 2 components ship implemented, typed, accessible, documented, and
covered. The spec's remaining integration scenarios — **Settings Panel**
(Card + Switch + Checkbox + Button) and **Alert Flow** (Button + Alert) — are
now implemented too, completing §6.2 of the requirements.

### v3+ — Future components
Textarea · Select · Combobox · Dropdown Menu · Accordion · Tabs · Tooltip ·
Popover · Avatar · Progress Bar · Skeleton Loader · Toast · Pagination ·
Breadcrumb · Table · Theme Provider · Form components · Date Picker

### Tooling roadmap
- [ ] Storybook documentation site
- [x] GitHub Actions CI (typecheck, lint, test, coverage, build, pack) on Node 20 + 22
- [ ] ESLint + Prettier config hardening
- [ ] Husky + lint-staged pre-commit hooks
- [x] Automated release workflow (tag-driven, see [docs/PUBLISHING.md](./docs/PUBLISHING.md))
- [x] npm publish pipeline for `cobalt-ui` (GitHub Actions, provenance-signed)

---

## Adding a new component — the recipe

Every component follows the same steps so scaling stays mechanical:

1. **Scaffold** `src/components/<Name>/` with:
   - `<Name>.tsx` — implementation (functional, typed, ref-forwarded).
   - `<Name>.test.tsx` — unit + a11y (`vitest-axe`) tests.
   - `index.ts` — re-export the component and its public types.
2. **Style** with prefixed Tailwind utilities; add any new tokens to
   `src/styles` as `@theme` CSS variables (never hard-code themeable values).
3. **Export** from `src/index.ts` (the public barrel).
4. **Test** across all applicable layers:
   - Unit (rendering, props, interaction, state, styling, a11y, edge cases).
   - Integration (if it composes with others) in `src/test/integration`.
   - Functional (if it drives a workflow).
   - Regression (whenever a bug is fixed).
5. **Verify accessibility**: semantic HTML, ARIA, keyboard, focus, zero axe
   violations.
6. **Meet coverage** ≥95%; annotate any ignore with a reason.
7. **Document**: component README with a prop table and usage examples.
8. **Showcase**: add it to the demo app.
9. **Pass all quality gates** (see REQUIREMENTS §8) before marking done.

---

## Design principles that keep scaling cheap

- **One component contract.** Same folder shape, same export pattern, same test
  layers every time.
- **Tokens over hard-coded values.** Theming is CSS-variable driven, so new
  components inherit theming for free.
- **Shared primitives.** Reusable hooks (`useFocusTrap`, `useScrollLock`,
  `useControllableState`) and utils (`cn`) live in `src/hooks` and `src/utils`
  so components stay thin.
- **Behavior-first tests.** Semantic queries mean tests survive refactors and
  new variants without rewrites.
