/**
 * Tests for the Gugut landing page
 */

const { describe, it, before, after, beforeEach } = require('mocha');
const { expect } = require('chai');
const { setupDriver, quitDriver } = require('../utils/driver-setup');
const LandingPage = require('../page-objects/landing-page');
const config = require('../config/test-config');

describe('Gugut Landing Page', function() {
  let driver;
  let landingPage;
  
  before(async function() {
    // Set up the WebDriver before all tests
    driver = await setupDriver();
    landingPage = new LandingPage(driver);
  });
  
  after(async function() {
    // Quit the WebDriver after all tests
    await quitDriver(driver);
  });
  
  beforeEach(async function() {
    // Navigate to the landing page before each test
    await landingPage.navigate();
  });
  
  describe('Page Title and Content', function() {
    it('should have the correct page title', async function() {
      const title = await landingPage.getTitle();
      expect(title).to.equal('Gugut - After School Program');
    });
    
    it('should display the logo', async function() {
      const logo = await driver.findElement(landingPage.selectors.logo);
      const isDisplayed = await logo.isDisplayed();
      expect(isDisplayed).to.be.true;
      
      const logoText = await logo.getText();
      expect(logoText).to.equal('Gugut');
    });
    
    it('should have a hero section with title and CTA button', async function() {
      const heroTitle = await driver.findElement(landingPage.selectors.heroTitle);
      const heroButton = await driver.findElement(landingPage.selectors.heroButton);
      
      expect(await heroTitle.isDisplayed()).to.be.true;
      expect(await heroButton.isDisplayed()).to.be.true;
      
      const buttonText = await heroButton.getText();
      expect(buttonText).to.equal('Enroll Now');
    });
  });
  
  describe('Navigation', function() {
    it('should toggle mobile menu when menu button is clicked', async function() {
      // First, resize the window to mobile size to ensure the menu toggle is visible
      await driver.manage().window().setRect({ width: 375, height: 667 });
      
      // Check that the menu is initially hidden
      expect(await landingPage.isMobileMenuVisible()).to.be.false;
      
      // Toggle the menu
      await landingPage.toggleMobileMenu();
      
      // Check that the menu is now visible
      expect(await landingPage.isMobileMenuVisible()).to.be.true;
      
      // Toggle the menu again
      await landingPage.toggleMobileMenu();
      
      // Check that the menu is hidden again
      expect(await landingPage.isMobileMenuVisible()).to.be.false;
      
      // Reset window size
      await driver.manage().window().setRect(config.browser.windowSize);
    });
    
    it('should navigate to the programs section when Programs link is clicked', async function() {
      // On desktop, the navigation links are visible
      await driver.manage().window().setRect(config.browser.windowSize);
      
      // Click the Programs link
      await landingPage.clickNavLink('Programs');
      
      // Wait for the scroll to complete
      await driver.sleep(1000);
      
      // Check that the programs section is now in view
      const programsSection = await driver.findElement(landingPage.selectors.programsSection);
      const isInViewport = await landingPage.isElementInViewport(programsSection);
      
      expect(isInViewport).to.be.true;
    });
  });
  
  describe('Programs Section', function() {
    it('should display the correct number of program cards', async function() {
      // Scroll to the programs section
      await landingPage.scrollToSection('programs');
      
      // Check the number of program cards
      const cardCount = await landingPage.getProgramCardCount();
      expect(cardCount).to.equal(3);
    });
  });
  
  describe('Contact Form', function() {
    it('should allow filling out the contact form', async function() {
      // Scroll to the contact section
      await landingPage.scrollToSection('contact');
      
      // Fill out the form
      await landingPage.fillContactForm(config.testData.contactForm);
      
      // Check that the form fields have the correct values
      const nameValue = await driver.findElement(landingPage.selectors.nameInput).getAttribute('value');
      const emailValue = await driver.findElement(landingPage.selectors.emailInput).getAttribute('value');
      const phoneValue = await driver.findElement(landingPage.selectors.phoneInput).getAttribute('value');
      const messageValue = await driver.findElement(landingPage.selectors.messageInput).getAttribute('value');
      
      expect(nameValue).to.equal(config.testData.contactForm.name);
      expect(emailValue).to.equal(config.testData.contactForm.email);
      expect(phoneValue).to.equal(config.testData.contactForm.phone);
      expect(messageValue).to.equal(config.testData.contactForm.message);
    });
    
    // Note: We're not testing form submission here as it would trigger an alert in the current implementation
    // In a real application, you would test the form submission and verify the response
  });
  
  describe('Responsive Design', function() {
    it('should adapt layout for mobile devices', async function() {
      // Set mobile viewport size
      await driver.manage().window().setRect({ width: 375, height: 667 });
      
      // Check that the menu toggle is visible
      const menuToggle = await driver.findElement(landingPage.selectors.menuToggle);
      expect(await menuToggle.isDisplayed()).to.be.true;
      
      // Reset window size
      await driver.manage().window().setRect(config.browser.windowSize);
    });
    
    it('should adapt layout for tablets', async function() {
      // Set tablet viewport size
      await driver.manage().window().setRect({ width: 768, height: 1024 });
      
      // In tablet view, the navigation should be visible without toggling
      const navLinks = await driver.findElement(landingPage.selectors.navLinks);
      expect(await navLinks.isDisplayed()).to.be.true;
      
      // Reset window size
      await driver.manage().window().setRect(config.browser.windowSize);
    });
  });
});
