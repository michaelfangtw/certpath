const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const APP = '/TOEIC%20Golden%20Certs.html';
const VENDOR_DIR = path.join(__dirname, '..', 'project', 'vendor');

async function goToQuiz(page) {
  // Serve React/Babel from local vendor files so no CDN access is needed
  await page.route('https://unpkg.com/react@18.3.1/umd/react.development.js', route =>
    route.fulfill({ body: fs.readFileSync(path.join(VENDOR_DIR, 'react.development.js')), contentType: 'application/javascript' })
  );
  await page.route('https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js', route =>
    route.fulfill({ body: fs.readFileSync(path.join(VENDOR_DIR, 'react-dom.development.js')), contentType: 'application/javascript' })
  );
  await page.route('https://unpkg.com/@babel/standalone@7.29.0/babel.min.js', route =>
    route.fulfill({ body: fs.readFileSync(path.join(VENDOR_DIR, 'babel.min.js')), contentType: 'application/javascript' })
  );

  // Suppress session-triggered modals so they don't block navigation
  await page.addInitScript(() => {
    sessionStorage.setItem('toeic_signed', '1');
    sessionStorage.setItem('daily_gate_shown', '1');
    sessionStorage.setItem('toeic_alert_seen', '1');
  });

  await page.goto(APP);

  // Landing → Login (Babel needs time to transform JSX on first load)
  await page.getByRole('button', { name: /Google 快速登入/ }).first().waitFor({ timeout: 30000 });
  await page.getByRole('button', { name: /Google 快速登入/ }).first().click();

  // Login → Dashboard (2.4 s animation inside the login screen)
  await page.getByRole('button', { name: /使用 Google 帳號繼續/ }).click();

  // Wait for the dashboard navbar's "練習中心" link to appear
  await page.locator('a', { hasText: '練習中心' }).waitFor({ timeout: 15000 });
  await page.locator('a', { hasText: '練習中心' }).click();

  // Click the "照片描述" (Part 1) row to start the quiz
  await page.locator('button', { hasText: '照片描述' }).first().waitFor({ timeout: 5000 });
  await page.locator('button', { hasText: '照片描述' }).first().click();

  // Confirm quiz screen is ready
  await page.getByRole('button', { name: '送出答案' }).waitFor({ timeout: 5000 });
}

// ── Bug 1: explanation panel appears after submit ────────────────────────────

test('shows explanation after submitting answer', async ({ page }) => {
  await goToQuiz(page);

  // Pick option A
  await page.locator('button', { hasText: '(A)' }).first().click();

  // Submit
  await page.getByRole('button', { name: '送出答案' }).click();

  // Explanation section heading must be visible
  await expect(page.getByText('📚 解析')).toBeVisible();
});

test('explanation contains correct rationale text after submit', async ({ page }) => {
  await goToQuiz(page);

  await page.locator('button', { hasText: '(A)' }).first().click();
  await page.getByRole('button', { name: '送出答案' }).click();

  // Q0a explain starts with this phrase
  await expect(page.locator('p', { hasText: '照片中多人圍坐圓桌' })).toBeVisible();
});

test('next-question button replaces submit button after reveal', async ({ page }) => {
  await goToQuiz(page);

  await page.locator('button', { hasText: '(A)' }).first().click();
  await page.getByRole('button', { name: '送出答案' }).click();

  await expect(page.getByRole('button', { name: /下一題/ })).toBeVisible();
  await expect(page.getByRole('button', { name: '送出答案' })).not.toBeVisible();
});

// ── Bug 2: Part 1 photos are distinct per question ───────────────────────────

test('first Part 1 question shows meeting-room SVG scene', async ({ page }) => {
  await goToQuiz(page);

  // Q0a has photo.kind = 'meeting-room'; its SVG caption is "Conference room"
  await expect(page.getByText('Conference room')).toBeVisible();
});

test('second Part 1 question shows reception SVG scene', async ({ page }) => {
  await goToQuiz(page);

  // Advance past Q0a
  await page.locator('button', { hasText: '(A)' }).first().click();
  await page.getByRole('button', { name: '送出答案' }).click();
  await page.getByRole('button', { name: /下一題/ }).click();

  // Q0b has photo.kind = 'reception'; its SVG caption is "Reception area"
  await expect(page.getByText('Reception area')).toBeVisible();
});

test('Part 1 photos are not identical across questions', async ({ page }) => {
  await goToQuiz(page);

  // Target the Part1Photo SVG specifically by its viewBox dimensions
  const partSvg = page.locator('svg[viewBox="0 0 400 225"]');
  const svgQ0a = await partSvg.innerHTML();

  // Advance to Q0b
  await page.locator('button', { hasText: '(A)' }).first().click();
  await page.getByRole('button', { name: '送出答案' }).click();
  await page.getByRole('button', { name: /下一題/ }).click();

  const svgQ0b = await partSvg.innerHTML();

  expect(svgQ0a).not.toBe(svgQ0b);
});
