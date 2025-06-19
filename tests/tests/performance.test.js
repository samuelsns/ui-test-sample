/**
 * Performance Tests for Gugut Landing Page
 */

const { expect } = require('chai');
const { Builder, By, until } = require('selenium-webdriver');
const config = require('../config/test-config');
const LandingPage = require('../page-objects/landing-page');
const { setupDriver, quitDriver } = require('../utils/driver-setup');

describe('Gugut Landing Page - Performance Tests', function() {
  let driver;
  let landingPage;
  
  // Increase timeout for performance tests
  this.timeout(60000);
  
  beforeEach(async function() {
    driver = await setupDriver();
    landingPage = new LandingPage(driver);
  });
  
  afterEach(async function() {
    await quitDriver(driver);
  });
  
  describe('Page Load Time', function() {
    it('should load the page within an acceptable timeframe', async function() {
      // Record start time
      const startTime = Date.now();
      
      // Navigate to the page
      await landingPage.navigate();
      
      // Wait for a key element to be present, indicating the page has loaded
      // Here we're waiting for the hero section title which is a good indicator the page is ready
      await driver.wait(until.elementLocated(landingPage.selectors.heroTitle), 10000);
      
      // Record end time
      const endTime = Date.now();
      
      // Calculate load time in milliseconds
      const loadTime = endTime - startTime;
      console.log(`Page load time: ${loadTime}ms`);
      
      // Define acceptable load time threshold (3 seconds = 3000ms)
      // This can be adjusted based on your performance requirements
      const acceptableLoadTime = 3000;
      
      // Assert that the page loaded within the acceptable timeframe
      expect(loadTime).to.be.at.most(acceptableLoadTime, 
        `Page load time (${loadTime}ms) exceeded acceptable threshold (${acceptableLoadTime}ms)`);
    });
    
    it('should load critical elements quickly on mobile devices', async function() {
      // Set mobile viewport size
      await driver.manage().window().setRect(config.viewports.mobile);
      
      // Record start time
      const startTime = Date.now();
      
      // Navigate to the page
      await landingPage.navigate();
      
      // Wait for critical elements to be present
      await driver.wait(until.elementLocated(landingPage.selectors.heroTitle), 10000);
      await driver.wait(until.elementLocated(landingPage.selectors.menuToggle), 10000);
      
      // Record end time
      const endTime = Date.now();
      
      // Calculate load time in milliseconds
      const loadTime = endTime - startTime;
      console.log(`Mobile page load time: ${loadTime}ms`);
      
      // Mobile devices might be slightly slower, so we allow a bit more time
      const acceptableLoadTime = 4000;
      
      // Assert that the page loaded within the acceptable timeframe
      expect(loadTime).to.be.at.most(acceptableLoadTime, 
        `Mobile page load time (${loadTime}ms) exceeded acceptable threshold (${acceptableLoadTime}ms)`);
    });
    
    it('should measure time to interactive', async function() {
      // Record start time
      const startTime = Date.now();
      
      // Navigate to the page
      await landingPage.navigate();
      
      // Wait for the page to be interactive by checking if we can click a button
      await driver.wait(until.elementLocated(landingPage.selectors.heroButton), 10000);
      const heroButton = await driver.findElement(landingPage.selectors.heroButton);
      await driver.wait(until.elementIsEnabled(heroButton), 10000);
      
      // Record time to interactive
      const timeToInteractive = Date.now() - startTime;
      console.log(`Time to interactive: ${timeToInteractive}ms`);
      
      // Define acceptable time to interactive threshold (3.5 seconds = 3500ms)
      const acceptableTimeToInteractive = 3500;
      
      // Assert that the page became interactive within the acceptable timeframe
      expect(timeToInteractive).to.be.at.most(acceptableTimeToInteractive, 
        `Time to interactive (${timeToInteractive}ms) exceeded acceptable threshold (${acceptableTimeToInteractive}ms)`);
    });
  });
  
  describe('Resource Loading', function() {
    it('should load CSS resources quickly', async function() {
      // Navigate to the page first
      await landingPage.navigate();
      
      // Use the browser's Navigation Timing API which is more reliable
      const cssLoadTime = await driver.executeScript(`
        // Get the performance entries
        const resources = performance.getEntriesByType('resource');
        const cssResources = resources.filter(resource => resource.name.endsWith('.css'));
        
        if (cssResources.length === 0) {
          return 0;
        } else {
          // Calculate average load time for CSS resources
          const totalLoadTime = cssResources.reduce((sum, resource) => {
            return sum + (resource.responseEnd - resource.startTime);
          }, 0);
          
          return totalLoadTime / cssResources.length;
        }
      `);
      
      console.log(`Average CSS load time: ${cssLoadTime}ms`);
      
      // Define acceptable CSS load time (1.5 seconds = 1500ms)
      // Increased from 1000ms to account for local development environment
      const acceptableCssLoadTime = 1500;
      
      // Assert that CSS resources loaded within the acceptable timeframe
      expect(cssLoadTime).to.be.at.most(acceptableCssLoadTime, 
        `CSS load time (${cssLoadTime}ms) exceeded acceptable threshold (${acceptableCssLoadTime}ms)`);
    });
    
    it('should load JavaScript resources within acceptable time', async function() {
      // Navigate to the page first
      await landingPage.navigate();
      
      // Measure JS resource loading time
      const jsLoadTime = await driver.executeScript(`
        // Get the performance entries
        const resources = performance.getEntriesByType('resource');
        const jsResources = resources.filter(resource => resource.name.endsWith('.js'));
        
        if (jsResources.length === 0) {
          return 0;
        } else {
          // Calculate average load time for JS resources
          const totalLoadTime = jsResources.reduce((sum, resource) => {
            return sum + (resource.responseEnd - resource.startTime);
          }, 0);
          
          return totalLoadTime / jsResources.length;
        }
      `);
      
      console.log(`Average JavaScript load time: ${jsLoadTime}ms`);
      
      // Define acceptable JS load time (1.5 seconds = 1500ms)
      const acceptableJsLoadTime = 1500;
      
      // Assert that JS resources loaded within the acceptable timeframe
      expect(jsLoadTime).to.be.at.most(acceptableJsLoadTime, 
        `JavaScript load time (${jsLoadTime}ms) exceeded acceptable threshold (${acceptableJsLoadTime}ms)`);
    });
  });
});
