import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 30000,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 4 : 3,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000
  },
  projects: [
    {
      name: 'Chrome',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
        launchOptions: {
          args: ['--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox']
        }
      },
    },
    // {
    //   name: 'Firefox',
    //   use: {
    //     browserName: 'firefox',
    //     viewport: { width: 1280, height: 720 }
    //   },
    // },
    // {
    //   name: 'Mobile Chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: {
    //     ...devices['iPhone 12'],
    //   },
    // }
  ],
  globalSetup: require.resolve('./global-setup.ts'),
  globalTeardown: require.resolve('./global-teardown.ts'),
  outputDir: 'test-results',
  preserveOutput: 'failures-only',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  maxFailures: process.env.CI ? 10 : undefined,
};

export default config; 