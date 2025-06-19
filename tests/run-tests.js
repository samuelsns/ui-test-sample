/**
 * Script to run Selenium tests with automatic ChromeDriver management
 */

const { execSync } = require('child_process');

// Function to install the correct ChromeDriver version
function setupChromeDriver() {
  try {
    console.log('Setting up ChromeDriver...');
    
    // Get Chrome version
    let chromeVersion;
    try {
      if (process.platform === 'darwin') { // macOS
        const output = execSync('/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --version').toString();
        chromeVersion = output.match(/Chrome\s+(\d+\.\d+\.\d+\.\d+)/)[1];
      } else if (process.platform === 'win32') { // Windows
        const output = execSync('reg query "HKEY_CURRENT_USER\\Software\\Google\\Chrome\\BLBeacon" /v version').toString();
        chromeVersion = output.match(/version\s+REG_SZ\s+(\d+\.\d+\.\d+\.\d+)/)[1];
      } else { // Linux
        const output = execSync('google-chrome --version').toString();
        chromeVersion = output.match(/Chrome\s+(\d+\.\d+\.\d+\.\d+)/)[1];
      }
      
      const majorVersion = chromeVersion.split('.')[0];
      console.log(`Detected Chrome version: ${chromeVersion} (Major version: ${majorVersion})`);
      
      // Install matching ChromeDriver
      console.log(`Installing ChromeDriver for Chrome ${majorVersion}...`);
      execSync(`npm install chromedriver@${majorVersion} --no-save`, { stdio: 'inherit' });
      
      console.log('ChromeDriver setup complete!');
    } catch (error) {
      console.error('Error detecting Chrome version:', error);
      console.log('Falling back to latest ChromeDriver...');
      execSync('npm install chromedriver@latest --no-save', { stdio: 'inherit' });
    }
  } catch (error) {
    console.error('Error setting up ChromeDriver:', error);
    process.exit(1);
  }
}

// Setup ChromeDriver
setupChromeDriver();

// Run the tests
console.log('Running tests...');
try {
  execSync('npx mocha tests/**/*.test.js --timeout 30000', { stdio: 'inherit' });
} catch (error) {
  console.error('Tests failed:', error);
  process.exit(1);
}
