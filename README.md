# Playwright Test Framework

This repository contains automated tests for the Sauce Demo application using Playwright.

## Prerequisites

- Node.js 20 or higher
- npm (Node Package Manager)

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd playwright-test-framework

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Running Tests

Available scripts:

- `npm test` - Run all tests in headless mode
- `npm run test:chrome` - Run tests only in Chrome (headless)
- `npm run test:headed` - Run all tests in headed mode
- `npm run test:chrome:headed` - Run tests only in Chrome with browser visible
- `npm run test:debug` - Run tests in debug mode
- `npm run test:ui` - Open Playwright's UI mode for testing
- `npm run report` - Show the HTML report of the last test run
- `npm run test:purchase-flow` - Run purchase flow tests in Chrome
- `npm run test:ci` - Run tests in CI mode with multiple reporters

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration. The pipeline:

1. Triggers on push to main/master branch and pull requests
2. Sets up Node.js environment
3. Installs dependencies and Playwright browsers
4. Runs tests in headless mode
5. Uploads test reports as artifacts

### Test Reports

After each CI run, test reports are available as artifacts in the GitHub Actions interface:
- HTML Report
- JUnit Report
- Test Results

## Project Structure

```
├── tests/                    # Test files
├── pages/                    # Page Object Models
├── fixtures/                 # Test fixtures
├── locators/                # Element locators
├── test-data/               # Test data configuration
├── .github/
│   └── workflows/           # GitHub Actions workflows
└── playwright.config.ts     # Playwright configuration
```

## Best Practices

- Tests are organized using the Page Object Model pattern
- Custom fixtures for better test organization
- Comprehensive test data management
- CI/CD integration with multiple reporting formats
- Parallel test execution for faster feedback 