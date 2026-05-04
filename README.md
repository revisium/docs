# Revisium Docs

## Local Development

This repository contains the Docusaurus site published at
[docs.revisium.io](https://docs.revisium.io). Use the local site for both
developer changes and editor/content-only updates.

### Prerequisites

- Node.js `22.16.0` from `.nvmrc`. The package accepts Node.js `>=18`, but the
  pinned version keeps local work close to CI and release tooling.
- npm. Use `package-lock.json` as the dependency lockfile.
- No Revisium backend is required to run or build the docs site locally.

### First Run

```bash
cd <path-to-revisium-docs>
nvm use
npm ci
npm start
```

Open [http://localhost:3000](http://localhost:3000). Docusaurus reloads the
site as Markdown, MDX, TypeScript, CSS, and sidebar files change.

If port `3000` is busy, pass another port:

```bash
npm start -- --port 3001
```

### Editing Guide

- Main documentation pages live in `docs/`.
- Sidebar navigation is controlled by `sidebars.ts`.
- Static images live under `static/img/`.
- Screenshot pages usually use `src/components/Screenshot`; when adding a new
  screenshot through that component, add its dimensions in
  `src/components/Screenshot/imageDimensions.ts`.
- Prompt-backed diagrams or generated visual assets should live under
  `static/img/diagrams/<asset-name>/` with:
  - `prompt.md` for the current approved generation prompt, constraints, usage,
    and regeneration checklist.
  - `README.md` for asset ownership, source-of-truth notes, stable path,
    dimensions, and update workflow.
  - `diagram.png` or another stable published filename referenced by docs.
  - `versions/` for approved historical exports.
- The site uses MDX, so Markdown pages can import React components when needed.

### Local Checks

Run these before opening a pull request or handing a docs change to review:

```bash
git diff --check
npm run typecheck
npm run build
```

`npm run build` catches broken links and Docusaurus build errors. After a
successful build, preview the production bundle with:

```bash
npm run serve
```

## Release Train

Use the `Release Train` workflow to plan or publish release-train transitions.
Dry run mode is enabled by default and does not push branches, commits, tags, or
releases.

Manual dispatch:

1. Open **Actions** -> **Release Train**.
2. Select the release transition, for example `start-minor-alpha`.
3. Keep `dry_run` enabled to inspect the plan, or disable it to publish the
   release branch and tag.
4. Run the workflow from `master` for `start-*` transitions, or from the
   matching `release/X.Y.x` branch for branch-scoped transitions.

Bot dispatch can call the same `workflow_dispatch` endpoint with the `action`
and `dry_run` inputs. The release-train, CI, and Docker build workflows are
pinned to `revisium-actions` `v0.3.2` by commit hash `763f2746`.

Write mode requires these repository settings:

- `RELEASE_BOT_CLIENT_ID` as an Actions variable.
- `RELEASE_BOT_PRIVATE_KEY` as an Actions secret.
