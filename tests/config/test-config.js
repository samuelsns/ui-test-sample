/**
 * Test configuration for Selenium WebDriver tests
 */

module.exports = {
  // Base URL for the application
  baseUrl: 'http://localhost:8000',
  
  // Browser settings
  browser: {
    name: process.env.BROWSER || 'chrome', // chrome, firefox, edge
    headless: process.env.HEADLESS === 'true', // run in headed mode by default
    windowSize: {
      width: 1920,
      height: 1080
    }
  },
  
  // Timeouts
  timeouts: {
    implicit: 10000, // implicit wait timeout in milliseconds
    pageLoad: 30000, // page load timeout in milliseconds
    script: 30000, // script timeout in milliseconds
    actionDelay: 1000 // delay between actions in milliseconds (for demo/viewing purposes)
  },
  
  // Device viewport configurations for responsive testing
  viewports: {
    mobile: {
      width: 375,
      height: 667,
      deviceName: 'iPhone 8'
    },
    mobileSmall: {
      width: 320,
      height: 568,
      deviceName: 'iPhone 5/SE'
    },
    mobileLarge: {
      width: 414,
      height: 896,
      deviceName: 'iPhone 11'
    },
    tablet: {
      width: 768,
      height: 1024,
      deviceName: 'iPad'
    },
    desktop: {
      width: 1920,
      height: 1080,
      deviceName: 'Desktop'
    }
  },
  
  // Test data
  testData: {
    contactForm: {
      name: 'Test User',
      email: 'test@example.com',
      phone: '123-456-7890',
      message: 'This is a test message from the automated UI tests.'
    }
  }
};
