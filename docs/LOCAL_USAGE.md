# Using cobalt-ui locally in another project

This guide covers consuming `cobalt-ui` from another project on your machine
**without publishing it to npm** — useful for trying it in a real app, or
developing the two side by side.

There are three approaches. In short:

| Approach | Best for | Reflects real install? |
|---|---|---|
| [Local tarball](#1-local-tarball-most-reliable) | Verifying before publish | ✅ Yes — closest to npm |
| [`npm link`](#2-npm-link-live-editing) | Active side-by-side development | ⚠️ Mostly (symlink caveats) |
| [File path dependency](#3-file-path-dependency) | Quick, persistent local wiring | ✅ Yes |

Throughout, assume:

- **library** = this repo (`cobalt-ui`)
- **app** = the other project consuming it

> Always build first. Consumers load `dist/`, so a stale or missing build is the
> most common "it doesn't work" cause.
>
> ```bash
> # in the library
> npm run build
> ```

---

## 1. Local tarball (most reliable)

`npm pack` produces the exact `.tgz` that would be published, so this is the
truest test of a real install — it respects the `files`, `exports`, and
`peerDependencies` fields.

```bash
# in the library
npm run build
npm pack
```

This writes `cobalt-ui-0.1.0.tgz` in the library root. Install it into the app:

```bash
# in the app
npm install /absolute/path/to/cobalt-ui/cobalt-ui-0.1.0.tgz
```

Then use it normally:

```tsx
import { Button } from 'cobalt-ui';
import 'cobalt-ui/styles.css';
```

To pick up changes: re-run `npm run build && npm pack` in the library, then
`npm install` the tarball again in the app.

---

## 2. `npm link` (live editing)

`npm link` symlinks the library into the app, so rebuilds are picked up without
reinstalling — best while actively changing both.

```bash
# in the library
npm run build
npm link
```

```bash
# in the app
npm link cobalt-ui
```

Rebuild the library after edits (or run a watch build) and the app sees the
output:

```bash
# in the library
npm run build
```

### The React "invalid hook call" caveat

Because `react` is a peer dependency, a linked setup can end up with **two copies
of React** (the app's and the library's `node_modules`), which throws
*"Invalid hook call"* or *"cannot read useState of null"*. If that happens, point
the app at a single React by having the library resolve the app's copy:

```bash
# in the app, link its React back into the library
cd ../cobalt-ui
npm link ../app/node_modules/react ../app/node_modules/react-dom
```

Or, with a bundler, dedupe React (Vite example in the app's `vite.config`):

```ts
resolve: {
  dedupe: ['react', 'react-dom'],
}
```

### Unlinking

```bash
# in the app
npm unlink cobalt-ui
npm install

# in the library
npm unlink
```

---

## 3. File path dependency

For a persistent local wiring (e.g. a monorepo-ish layout) without a tarball
step, reference the library by path in the **app's** `package.json`:

```json
{
  "dependencies": {
    "cobalt-ui": "file:../cobalt-ui"
  }
}
```

```bash
# in the app
npm install
```

npm installs from the folder, honoring the `files`/`exports` fields like a real
package. You still need the library built (`dist/` present), and you must
re-run `npm install` in the app after rebuilding to refresh the copy.

---

## Verifying it works

A quick smoke test in the app:

```tsx
import { Button } from 'cobalt-ui';
import 'cobalt-ui/styles.css';

export function Smoke() {
  return <Button variant="primary">It works</Button>;
}
```

If the button renders **and is styled** (indigo background), the JS and the CSS
are both resolving. If it renders **unstyled**, you forgot the
`import 'cobalt-ui/styles.css'`.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `Cannot find module 'cobalt-ui'` | Not installed / not linked | Re-do the install/link step |
| Components render but are unstyled | Missing stylesheet import | Add `import 'cobalt-ui/styles.css'` |
| "Invalid hook call" | Two copies of React (linking) | Dedupe React — see the [link caveat](#the-react-invalid-hook-call-caveat) |
| Changes not showing up | Stale build | Re-run `npm run build` in the library (and reinstall for tarball/file modes) |
| Types not resolving | Old TS or missing build | Ensure `dist/index.d.ts` exists; TS ≥ 4.7 for the `exports` map |
