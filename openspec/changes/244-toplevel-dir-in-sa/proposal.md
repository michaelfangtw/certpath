# Proposal: Add top-level directory layout to SA.md (issue #244)

## Problem

SA.md's Directory Structure section only shows the `project/`, `docs/`, and
`openspec/` subtrees. The following top-level files and directories are absent:

- `tests/quiz.spec.js` — 7 E2E tests (Playwright) covering quiz flow, explanations, Part 1 photos
- `playwright.config.js` — Playwright configuration (testDir: ./tests, webServer: python http.server)
- `package.json` / `package-lock.json` — devDependencies include `@playwright/test ^1.59.1`
- `vercel.json` — Vercel deployment configuration
- `readme.md` — project readme

## Fix

Extend the Directory Structure section in SA.md with an introductory top-level
layout block before the existing `project/` subtree, listing `tests/`,
`playwright.config.js`, `package.json`, `vercel.json`, and `readme.md`,
with a brief note that E2E tests use Playwright with local vendor CDN mocking.
