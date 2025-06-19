# Gugut UI Testing with Selenium and Node.js

This directory contains automated UI tests for the Gugut landing page using Selenium WebDriver with Node.js.

## Setup

1. Make sure you have Node.js installed (version 14 or higher recommended)

2. Install dependencies:
   ```
   npm install
   ```

3. Download the appropriate WebDriver for your browser:
   - [ChromeDriver](https://sites.google.com/chromium.org/driver/)
   - [GeckoDriver](https://github.com/mozilla/geckodriver/releases) (Firefox)
   - [EdgeDriver](https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/)

   Make sure the WebDriver is in your PATH or use a WebDriver manager like `webdriver-manager`.

## Running Tests

To run all tests:
```
npm test
```

To run a specific test file:
```
npm test -- --spec=landing-page.test.js
```

## Test Structure

- `config/`: Contains test configuration files
- `tests/`: Contains test files
  - `landing-page.test.js`: Tests for the main landing page functionality
- `page-objects/`: Page Object Models for different sections of the website
- `utils/`: Helper functions and utilities for testing

## Reports

Test reports will be generated in the `reports` directory after test execution.
