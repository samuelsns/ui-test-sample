/**
 * Page Object Model for the Gugut Landing Page
 */

const { By, until } = require('selenium-webdriver');
const config = require('../config/test-config');

/**
 * Sleep utility function to add delay between actions
 * @param {number} ms - Milliseconds to sleep (defaults to config value)
 * @returns {Promise<void>}
 */
const sleep = (ms = config.timeouts.actionDelay) => new Promise(resolve => setTimeout(resolve, ms));

class LandingPage {
  /**
   * Constructor for the LandingPage class
   * @param {WebDriver} driver - The Selenium WebDriver instance
   */
  constructor(driver) {
    this.driver = driver;
    
    // Define element selectors
    this.selectors = {
      // Navigation
      logo: By.css('.logo h1'),
      menuToggle: By.css('.menu-toggle'),
      navLinks: By.css('.nav-links'),
      navItems: By.css('.nav-links li a'),
      
      // Hero section
      heroSection: By.id('home'),
      heroTitle: By.css('.hero-content h2'),
      heroDescription: By.css('.hero-content p'),
      heroButton: By.css('.hero-content .btn'),
      
      // CTA section
      ctaSection: By.id('cta'),
      ctaTitle: By.css('.cta h2'),
      ctaButton: By.css('.cta .btn'),
      
      // Programs section
      programsSection: By.id('programs'),
      programsTitle: By.css('.programs .section-title'),
      programCards: By.css('.program-cards .card'),
      
      // Contact section
      contactSection: By.id('contact'),
      contactTitle: By.css('.contact .section-title'),
      contactForm: By.css('.contact-form form'),
      nameInput: By.id('name'),
      emailInput: By.id('email'),
      phoneInput: By.id('phone'),
      messageInput: By.id('message'),
      submitButton: By.css('.contact-form .btn'),
      
      // Footer
      footer: By.css('footer'),
      footerLogo: By.css('.footer-logo h2'),
      footerLinks: By.css('.footer-links ul li a'),
      footerSocial: By.css('.footer-social .social-icons a')
    };
  }
  
  /**
   * Navigate to the landing page
   * @returns {Promise<void>}
   */
  async navigate() {
    await this.driver.get(config.baseUrl);
    await sleep();
  }
  
  /**
   * Get the page title
   * @returns {Promise<string>} The page title
   */
  async getTitle() {
    return await this.driver.getTitle();
  }
  
  /**
   * Toggle the mobile menu
   * @returns {Promise<void>}
   */
  async toggleMobileMenu() {
    const menuToggle = await this.driver.findElement(this.selectors.menuToggle);
    await sleep();
    await menuToggle.click();
    
    // Wait for the menu to toggle
    await sleep(500);
  }
  
  /**
   * Check if the mobile menu is visible
   * @returns {Promise<boolean>} True if the mobile menu is visible
   */
  async isMobileMenuVisible() {
    const navLinks = await this.driver.findElement(this.selectors.navLinks);
    const classes = await navLinks.getAttribute('class');
    return classes.includes('active');
  }
  
  /**
   * Click a navigation link by text
   * @param {string} linkText - The text of the link to click
   * @returns {Promise<void>}
   */
  async clickNavLink(linkText) {
    const navItems = await this.driver.findElements(this.selectors.navItems);
    await sleep();
    
    for (const item of navItems) {
      const text = await item.getText();
      if (text.trim() === linkText) {
        await sleep();
        await item.click();
        await sleep();
        return;
      }
    }
    
    throw new Error(`Navigation link with text "${linkText}" not found`);
  }
  
  /**
   * Fill out the contact form
   * @param {Object} formData - The data to fill in the form
   * @param {string} formData.name - The name to enter
   * @param {string} formData.email - The email to enter
   * @param {string} formData.phone - The phone number to enter
   * @param {string} formData.message - The message to enter
   * @returns {Promise<void>}
   */
  async fillContactForm(formData) {
    await sleep();
    await this.driver.findElement(this.selectors.nameInput).sendKeys(formData.name);
    await sleep();
    await this.driver.findElement(this.selectors.emailInput).sendKeys(formData.email);
    await sleep();
    await this.driver.findElement(this.selectors.phoneInput).sendKeys(formData.phone);
    await sleep();
    await this.driver.findElement(this.selectors.messageInput).sendKeys(formData.message);
    await sleep();
  }
  
  /**
   * Submit the contact form
   * @returns {Promise<void>}
   */
  async submitContactForm() {
    await sleep();
    await this.driver.findElement(this.selectors.submitButton).click();
    await sleep();
  }
  
  /**
   * Get the number of program cards displayed
   * @returns {Promise<number>} The number of program cards
   */
  async getProgramCardCount() {
    const cards = await this.driver.findElements(this.selectors.programCards);
    return cards.length;
  }
  
  /**
   * Check if an element is in the viewport
   * @param {WebElement} element - The element to check
   * @returns {Promise<boolean>} True if the element is in the viewport
   */
  async isElementInViewport(element) {
    return await this.driver.executeScript(`
      const rect = arguments[0].getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    `, element);
  }
  
  /**
   * Scroll to a section by its ID
   * @param {string} sectionId - The ID of the section to scroll to
   * @returns {Promise<void>}
   */
  async scrollToSection(sectionId) {
    await sleep();
    await this.driver.executeScript(`
      document.getElementById('${sectionId}').scrollIntoView({ behavior: 'smooth', block: 'start' });
    `);
    
    // Wait for the scroll to complete
    await sleep(1000);
  }
}

module.exports = LandingPage;
