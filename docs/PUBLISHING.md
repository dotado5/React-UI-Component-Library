# Publishing cobalt-ui

This project publishes to npm through a **tag-driven GitHub Actions workflow**
([`.github/workflows/release.yml`](../.github/workflows/release.yml)). You never
run `npm publish` by hand — you bump the version, push a tag, and CI does the
rest.

```
npm version <bump>   ─►   git push --follow-tags   ─►   Release workflow   ─►   npm
   (bumps + tags)            (pushes the tag)          (gates + publish)
```

---

## Why this design

- **Reproducible** — every release is built on a clean CI runner from a tagged
  commit, not from whatever happens to be on someone's laptop.
- **Gated** — the tag only publishes if typecheck, lint, tests (100% coverage)
  and build all pass again.
- **Traceable** — the published version is tied to a git tag and a signed
  provenance statement, so anyone can see exactly which commit produced it.
- **Hard to get wrong** — the workflow refuses to publish if the tag and
  `package.json` version disagree.

---

## One-time setup

You only do this once per repository.

### 1. Have an npm account

Create one at <https://www.npmjs.com/signup> if you don't have it, and (strongly
recommended) enable 2FA on your account.

### 2. Check the package name is available

The name in `package.json` is `cobalt-ui`. Confirm nobody else owns it:

```bash
npm view cobalt-ui
```

- **`404 Not Found`** → the name is free. 
- **Anything else** → the name is taken; change `"name"` in `package.json`
  (e.g. scope it as `@your-username/cobalt-ui`) before publishing. A scoped
  name also needs `--access public`, which the workflow already passes.

### 3. Create an npm access token

1. Log in to npmjs.com → click your avatar → **Access Tokens**.
2. **Generate New Token → Granular Access Token** (preferred) or **Classic →
   Automation**.
   - A **Granular** token: give it **Read and write** on packages, and scope it
     to just this package (or your whole account for the first publish, since the
     package doesn't exist yet — you can tighten it afterwards).
   - An **Automation** token (classic) works too and bypasses 2FA in CI, which is
     what you want for an unattended workflow.
3. Copy the token now — npm shows it only once.

> A CI token is a credential. Never paste it into code, commits, or chat. It goes
> only into the GitHub secret below, where it's encrypted.

### 4. Add the token as a GitHub secret

In the GitHub repo: **Settings → Secrets and variables → Actions → New
repository secret**.

- **Name:** `NPM_TOKEN` (must match exactly — the workflow reads
  `secrets.NPM_TOKEN`).
- **Value:** the token you copied.

That's the whole setup. From here on, releasing is three commands.

---

## Cutting a release

### 1. Make sure `main` is green and clean

```bash
git checkout main
git pull
git status        # should be clean
```

### 2. Bump the version and create the tag

`npm version` edits `package.json`, makes a commit, and creates a matching git
tag — all in one step, so the version and tag can never drift apart.

```bash
npm version patch   # 0.1.0 -> 0.1.1  (bug fixes)
# or
npm version minor   # 0.1.0 -> 0.2.0  (new features, backwards-compatible)
# or
npm version major   # 0.1.0 -> 1.0.0  (breaking changes)
```

Pick the bump using [semver](https://semver.org): patch = fixes, minor = new
components/props that don't break existing usage, major = anything that could
break a consumer.

### 3. Push the commit **and** the tag

```bash
git push --follow-tags
```

`--follow-tags` pushes both the version-bump commit and the new tag. The tag push
is what triggers the Release workflow.

### 4. Watch it publish

Open the repo's **Actions** tab → the **Release** run. When it goes green, the
package is live. Verify:

```bash
npm view cobalt-ui version
```

---

## What the workflow actually does

Each step in [`release.yml`](../.github/workflows/release.yml), in order:

| Step | Purpose |
|---|---|
| **Checkout** | Pulls the tagged commit. |
| **Set up Node** (`registry-url`) | Installs Node 22 and writes an npm config pointing at the npm registry — this is what lets the publish step authenticate. |
| **Install dependencies** (`npm ci`) | Clean, lockfile-exact install. |
| **Verify tag matches version** | Fails the run if the git tag (`v0.2.0`) and `package.json` (`0.2.0`) disagree — a guard against mis-tagged releases. |
| **Typecheck / Lint / Test / Build** | Re-runs every quality gate on the clean runner. A red gate blocks the publish. |
| **Publish** (`npm publish --provenance --access public`) | Builds the tarball (via `prepublishOnly`) and pushes it to npm, attaching a signed provenance statement. Authenticated by `NODE_AUTH_TOKEN` = your `NPM_TOKEN` secret. |

### About `--provenance`

Provenance attaches a cryptographically signed record to the npm release stating
*"this exact tarball was built by this GitHub workflow from this commit."* npm
shows a **"Built and signed on GitHub Actions"** badge on the package page. It
requires the `id-token: write` permission (already set) and a **public repo**
(this repo is public). If you ever make the repo private, remove `--provenance`
from the workflow or the publish will fail.

### The `prepublishOnly` safety net

`package.json` defines `"prepublishOnly": "npm run build"`. npm runs this
automatically before any publish — so even a manual `npm publish` can't ship a
stale `dist/`.

---

## Prereleases (optional)

To ship a beta without it becoming the default `latest` version:

```bash
npm version prerelease --preid=beta   # 0.2.0 -> 0.2.1-beta.0
git push --follow-tags
```

Then publish it under a separate dist-tag so `npm install cobalt-ui` still
gets the stable release. Change the workflow's publish line to:

```bash
npm publish --provenance --access public --tag beta
```

Consumers opt in with `npm install cobalt-ui@beta`. (For a permanent setup
you'd branch this logic on whether the tag contains a prerelease suffix — ask if
you want that wired in.)

---

## Manual publish (fallback)

If you ever need to publish without CI (not recommended — it skips the gates):

```bash
npm login                       # interactive; may prompt for 2FA
npm run build
npm publish --access public
```

`prepublishOnly` still rebuilds first. Prefer the workflow whenever possible.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Workflow didn't start | Pushed a branch, not a tag | `git push --follow-tags`; tag must match `v*.*.*` |
| `Tag vX does not match package.json version` | Hand-made tag drifted from `package.json` | Use `npm version` so both are set together; delete/retag if needed |
| `403 Forbidden` on publish | Bad/expired token, or name owned by someone else | Regenerate `NPM_TOKEN`; confirm name with `npm view` |
| `402 Payment Required` | Publishing a **scoped** package without public access | Ensure `--access public` (already in the workflow) |
| `You cannot publish over the previously published versions` | That version already exists on npm | Bump again — npm versions are immutable |
| Provenance error | Repo is private | Make the repo public or drop `--provenance` |

---

## Quick reference

```bash
# one-time: add NPM_TOKEN secret in GitHub repo settings

# every release:
git checkout main && git pull
npm version minor          # bumps package.json + creates git tag
git push --follow-tags     # triggers the Release workflow
# watch the Actions tab; then:
npm view cobalt-ui version
```
