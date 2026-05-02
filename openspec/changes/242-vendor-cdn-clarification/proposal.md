# Proposal: Clarify vendor/ is for Playwright mocking only (issue #242)

## Problem

SA.md labels `vendor/` as "vendored front-end dependencies (React 18 + Babel)",
implying the app uses these files at runtime. In fact, `project/TOEIC Golden
Certs.html` loads all three libraries from CDN (unpkg.com):

- `https://unpkg.com/react@18.3.1/umd/react.development.js`
- `https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js`
- `https://unpkg.com/@babel/standalone@7.29.0/babel.min.js`

The `vendor/` files are only used by `tests/quiz.spec.js`, which routes
(mocks) those CDN URLs to the local copies so Playwright tests can run
offline.

## Fix

Update the `vendor/` comment in the SA.md directory structure from
"vendored front-end dependencies (React 18 + Babel)" to
"local copies of CDN deps — used by Playwright for offline test mocking only".
