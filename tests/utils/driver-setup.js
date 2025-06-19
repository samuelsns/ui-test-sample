/**
 * Utility for setting up Selenium WebDriver
 */

const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const config = require('../config/test-config');

/**
 * Creates and configures a WebDriver instance based on the test configuration
 * @returns {Promise<WebDriver>} Configured WebDriver instance
 */
async function setupDriver() {
  const browserName = config.browser.name.toLowerCase();
  let builder = new Builder();
  
  // Configure browser options based on the selected browser
  if (browserName === 'chrome') {
    let options = new chrome.Options();
    
    if (config.browser.headless) {
      options.addArguments('--headless=new');
    }
    
    options.addArguments(`--window-size=${config.browser.windowSize.width},${config.browser.windowSize.height}`);
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    
    // Use the ChromeDriver installed by run-tests.js
    builder.forBrowser('chrome').setChromeOptions(options);
  } else if (browserName === 'firefox') {
    let options = new firefox.Options();
    
    if (config.browser.headless) {
      options.addArguments('-headless');
    }
    
    options.addArguments(`--width=${config.browser.windowSize.width}`);
    options.addArguments(`--height=${config.browser.windowSize.height}`);
    
    builder.forBrowser('firefox').setFirefoxOptions(options);
  } else {
    throw new Error(`Unsupported browser: ${browserName}`);
  }
  
  // Create the driver
  const driver = await builder.build();
  
  // Set timeouts
  await driver.manage().setTimeouts({
    implicit: config.timeouts.implicit,
    pageLoad: config.timeouts.pageLoad,
    script: config.timeouts.script
  });
  
  return driver;
}

/**
 * Quits the WebDriver instance
 * @param {WebDriver} driver - The WebDriver instance to quit
 * @returns {Promise<void>}
 */
async function quitDriver(driver) {
  if (driver) {
    await driver.quit();
  }
}

module.exports = {
  setupDriver,
  quitDriver
};
