const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 90000,
  expect: { timeout: 15000 },
  workers: 1,
  webServer: {
    command: 'python3 -m http.server 8765 --directory project',
    url: 'http://localhost:8765',
    reuseExistingServer: false,
    timeout: 30000,
  },
  use: {
    baseURL: 'http://localhost:8765',
    headless: true,
  },
});
