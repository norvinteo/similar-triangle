const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(colors[color] + message + colors.reset);
}

async function testFunction(name, testFn) {
    try {
        await testFn();
        log(`✅ ${name} - PASSED`, 'green');
        return true;
    } catch (error) {
        log(`❌ ${name} - FAILED: ${error.message}`, 'red');
        return false;
    }
}

(async () => {
    log('\n🧪 COMPREHENSIVE FUNCTION TESTING FOR MODERN UI\n', 'cyan');
    
    const screenshotsDir = path.join(__dirname, 'test-results');
    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir);
    }
    
    const browser = await chromium.launch({ 
        headless: true, // Run in headless mode for speed
        slowMo: 0 // No slow motion
    });
    
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        locale: 'th-TH'
    });
    
    const page = await context.newPage();
    
    let totalTests = 0;
    let passedTests = 0;
    
    try {
        // Load the application
        const filePath = `file://${path.join(__dirname, 'index-modern.html')}`;
        log(`Loading: ${filePath}`, 'blue');
        await page.goto(filePath, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
        
        log('\n📋 STARTING ALL FUNCTION TESTS\n', 'magenta');
        
        // Test 1: Navigation System
        log('\n1️⃣ NAVIGATION SYSTEM', 'yellow');
        totalTests++;
        if (await testFunction('Navigation buttons exist', async () => {
            const navButtons = await page.$$('.nav-button');
            if (navButtons.length !== 6) throw new Error(`Expected 6 nav buttons, found ${navButtons.length}`);
        })) passedTests++;
        
        totalTests++;
        if (await testFunction('Navigate to all sections', async () => {
            const sections = ['เริ่มต้น', 'สามเหลี่ยม', '3D Lab', 'คำนวณ', 'ท้าทาย', 'โลกจริง'];
            for (let i = 0; i < sections.length; i++) {
                const button = await page.$(`.nav-button:nth-child(${i + 1})`);
                await button.click();
                await page.waitForTimeout(500);
                const isActive = await page.$eval(`.nav-button:nth-child(${i + 1})`, el => el.classList.contains('active'));
                if (!isActive) throw new Error(`Section ${sections[i]} not active`);
            }
        })) passedTests++;
        
        // Test 2: Dark Mode
        log('\n2️⃣ DARK MODE TOGGLE', 'yellow');
        totalTests++;
        if (await testFunction('Dark mode toggle', async () => {
            // Find moon/sun icon button
            const darkModeBtn = await page.$('button.icon-btn:has(i.fa-moon), button.icon-btn:has(i.fa-sun)');
            if (!darkModeBtn) throw new Error('Dark mode button not found');
            
            // Toggle dark mode
            await darkModeBtn.click();
            await page.waitForTimeout(500);
            
            // Check if dark mode class is applied
            const hasDarkMode = await page.$('.app-container.dark-mode');
            if (!hasDarkMode) throw new Error('Dark mode not applied');
            
            // Toggle back
            await darkModeBtn.click();
            await page.waitForTimeout(500);
        })) passedTests++;
        
        // Test 3: Sound Toggle
        log('\n3️⃣ SOUND SYSTEM', 'yellow');
        totalTests++;
        if (await testFunction('Sound toggle', async () => {
            const soundBtn = await page.$('button.icon-btn:has(i.fa-volume-up), button.icon-btn:has(i.fa-volume-mute)');
            if (!soundBtn) throw new Error('Sound button not found');
            
            await soundBtn.click();
            await page.waitForTimeout(300);
            
            // Check icon changed
            const isMuted = await page.$('i.fa-volume-mute');
            if (!isMuted) throw new Error('Sound not muted');
            
            await soundBtn.click();
            await page.waitForTimeout(300);
        })) passedTests++;
        
        // Test 4: Gamification Features
        log('\n4️⃣ GAMIFICATION SYSTEM', 'yellow');
        
        totalTests++;
        if (await testFunction('XP and Level display', async () => {
            const level = await page.$('.stat-item.level');
            if (!level) throw new Error('Level display not found');
            
            const xpBar = await page.$('.xp-bar');
            if (!xpBar) throw new Error('XP bar not found');
            
            const xpText = await page.$('.xp-text');
            if (!xpText) throw new Error('XP text not found');
        })) passedTests++;
        
        totalTests++;
        if (await testFunction('Achievements bar', async () => {
            const achievementsBar = await page.$('.achievements-bar');
            if (!achievementsBar) throw new Error('Achievements bar not found');
            
            const noAchievements = await page.$('.no-achievements');
            if (!noAchievements) throw new Error('No achievements message not found');
        })) passedTests++;
        
        totalTests++;
        if (await testFunction('Daily streak display', async () => {
            const streak = await page.$('.stat-item.streak');
            if (!streak) throw new Error('Streak display not found');
        })) passedTests++;
        
        // Test 5: Mascot
        log('\n5️⃣ MASCOT CHARACTER', 'yellow');
        totalTests++;
        if (await testFunction('Mascot presence and animation', async () => {
            const mascot = await page.$('.mascot');
            if (!mascot) throw new Error('Mascot not found');
            
            const mascotSpeech = await page.$('.mascot-speech');
            if (!mascotSpeech) throw new Error('Mascot speech bubble not found');
        })) passedTests++;
        
        // Test 6: Calculator Section
        log('\n6️⃣ CALCULATOR FUNCTIONALITY', 'yellow');
        
        // Navigate to calculator
        await page.click('.nav-button:nth-child(4)');
        await page.waitForTimeout(1000);
        
        totalTests++;
        if (await testFunction('Calculator inputs', async () => {
            const inputs = await page.$$('.neon-input');
            if (inputs.length < 6) throw new Error(`Expected at least 6 inputs, found ${inputs.length}`);
            
            // Clear and fill inputs
            for (let i = 0; i < 3; i++) {
                await inputs[i].fill('');
                await inputs[i].type('3');
            }
            for (let i = 3; i < 6; i++) {
                await inputs[i].fill('');
                await inputs[i].type('6');
            }
        })) passedTests++;
        
        totalTests++;
        if (await testFunction('Calculate ratio', async () => {
            const calculateBtn = await page.$('.calculate-btn');
            if (!calculateBtn) throw new Error('Calculate button not found');
            
            await calculateBtn.click();
            await page.waitForTimeout(1500);
            
            const result = await page.$('.result-panel');
            if (!result) throw new Error('Result panel not displayed');
            
            const successResult = await page.$('.result-panel.success');
            if (!successResult) throw new Error('Should show similar triangles');
        })) passedTests++;
        
        // Test 7: Quiz/Exercises
        log('\n7️⃣ QUIZ & EXERCISES', 'yellow');
        
        // Navigate to exercises
        await page.click('.nav-button:nth-child(5)');
        await page.waitForTimeout(1000);
        
        totalTests++;
        if (await testFunction('Quiz interface', async () => {
            const quizContainer = await page.$('.quiz-container');
            if (!quizContainer) throw new Error('Quiz container not found');
            
            const questionText = await page.$('.question-text');
            if (!questionText) throw new Error('Question text not found');
            
            const options = await page.$$('.option-btn');
            if (options.length !== 4) throw new Error(`Expected 4 options, found ${options.length}`);
        })) passedTests++;
        
        totalTests++;
        if (await testFunction('Game stats display', async () => {
            const gameStats = await page.$('.game-stats');
            if (!gameStats) throw new Error('Game stats not found');
            
            const timer = await page.$('.stat-box.timer');
            if (!timer) throw new Error('Timer not found');
        })) passedTests++;
        
        totalTests++;
        if (await testFunction('Answer question', async () => {
            const firstOption = await page.$('.option-btn');
            await firstOption.click();
            await page.waitForTimeout(1000);
            
            const explanation = await page.$('.explanation-box');
            if (!explanation) throw new Error('Explanation not shown after answer');
            
            const nextBtn = await page.$('.next-btn');
            if (!nextBtn) throw new Error('Next button not shown');
        })) passedTests++;
        
        // Test 8: 3D Visualization
        log('\n8️⃣ 3D VISUALIZATION', 'yellow');
        
        // Navigate to visualization
        await page.click('.nav-button:nth-child(3)');
        await page.waitForTimeout(1000);
        
        totalTests++;
        if (await testFunction('Mode selector (2D/3D)', async () => {
            const modeSelector = await page.$('.mode-selector');
            if (!modeSelector) throw new Error('Mode selector not found');
            
            const mode2D = await page.$('.mode-btn:has-text("2D Mode")');
            const mode3D = await page.$('.mode-btn:has-text("3D Mode")');
            if (!mode2D || !mode3D) throw new Error('Mode buttons not found');
        })) passedTests++;
        
        totalTests++;
        if (await testFunction('Scale slider', async () => {
            const slider = await page.$('.neon-slider');
            if (!slider) throw new Error('Scale slider not found');
            
            // Test slider interaction
            await slider.fill('2');
            await page.waitForTimeout(500);
            
            const statsDisplay = await page.$('.stats-display');
            if (!statsDisplay) throw new Error('Stats display not found');
        })) passedTests++;
        
        totalTests++;
        if (await testFunction('Switch to 3D mode', async () => {
            const mode3D = await page.$('.mode-btn:has-text("3D Mode")');
            await mode3D.click();
            await page.waitForTimeout(2000);
            
            // Check if 3D container exists
            const threeContainer = await page.$('.three-container');
            if (!threeContainer) throw new Error('3D container not created');
        })) passedTests++;
        
        // Test 9: Real World Examples
        log('\n9️⃣ REAL WORLD SECTION', 'yellow');
        
        // Navigate to real world
        await page.click('.nav-button:nth-child(6)');
        await page.waitForTimeout(1000);
        
        totalTests++;
        if (await testFunction('Example cards', async () => {
            const exampleCards = await page.$$('.example-card');
            if (exampleCards.length !== 3) throw new Error(`Expected 3 example cards, found ${exampleCards.length}`);
            
            // Click first card
            await exampleCards[0].click();
            await page.waitForTimeout(500);
            
            const cardDetail = await page.$('.card-detail');
            if (!cardDetail) throw new Error('Card detail not shown');
        })) passedTests++;
        
        totalTests++;
        if (await testFunction('Practice problem', async () => {
            const practiceProblem = await page.$('.practice-problem');
            if (!practiceProblem) throw new Error('Practice problem not found');
            
            const solution = await page.$('details.solution');
            if (!solution) throw new Error('Solution details not found');
        })) passedTests++;
        
        // Test 10: Intro Section Features
        log('\n🔟 INTRO SECTION', 'yellow');
        
        // Navigate to intro
        await page.click('.nav-button:nth-child(1)');
        await page.waitForTimeout(1000);
        
        totalTests++;
        if (await testFunction('Example selector', async () => {
            const exampleBtns = await page.$$('.example-btn');
            if (exampleBtns.length !== 3) throw new Error(`Expected 3 example buttons, found ${exampleBtns.length}`);
            
            // Click each example
            for (let btn of exampleBtns) {
                await btn.click();
                await page.waitForTimeout(500);
            }
        })) passedTests++;
        
        totalTests++;
        if (await testFunction('Interactive quiz shapes', async () => {
            const shapeBtns = await page.$$('.shape-btn');
            if (shapeBtns.length !== 4) throw new Error(`Expected 4 shape buttons, found ${shapeBtns.length}`);
            
            // Click a shape
            await shapeBtns[0].click();
            await page.waitForTimeout(500);
        })) passedTests++;
        
        // Test 11: Responsive Design
        log('\n1️⃣1️⃣ RESPONSIVE DESIGN', 'yellow');
        
        totalTests++;
        if (await testFunction('Mobile view (375px)', async () => {
            await page.setViewportSize({ width: 375, height: 812 });
            await page.waitForTimeout(1000);
            
            // Check if navigation is still accessible
            const nav = await page.$('.navigation');
            if (!nav) throw new Error('Navigation not found in mobile view');
            
            await page.screenshot({ 
                path: path.join(screenshotsDir, 'mobile-test.png')
            });
        })) passedTests++;
        
        totalTests++;
        if (await testFunction('Tablet view (768px)', async () => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.waitForTimeout(1000);
            
            await page.screenshot({ 
                path: path.join(screenshotsDir, 'tablet-test.png')
            });
        })) passedTests++;
        
        totalTests++;
        if (await testFunction('Desktop view (1920px)', async () => {
            await page.setViewportSize({ width: 1920, height: 1080 });
            await page.waitForTimeout(1000);
            
            await page.screenshot({ 
                path: path.join(screenshotsDir, 'desktop-test.png')
            });
        })) passedTests++;
        
        // Test 12: Footer Stats
        log('\n1️⃣2️⃣ FOOTER STATISTICS', 'yellow');
        
        totalTests++;
        if (await testFunction('Footer stats display', async () => {
            const footer = await page.$('.app-footer');
            if (!footer) throw new Error('Footer not found');
            
            const footerStats = await page.$('.footer-stats');
            if (!footerStats) throw new Error('Footer stats not found');
            
            const stats = await page.$$('.footer-stats .stat');
            if (stats.length !== 3) throw new Error(`Expected 3 stats, found ${stats.length}`);
        })) passedTests++;
        
        // RESULTS SUMMARY
        log('\n' + '='.repeat(60), 'cyan');
        log('📊 TEST RESULTS SUMMARY', 'cyan');
        log('='.repeat(60), 'cyan');
        
        const percentage = ((passedTests / totalTests) * 100).toFixed(1);
        const resultColor = passedTests === totalTests ? 'green' : passedTests > totalTests * 0.7 ? 'yellow' : 'red';
        
        log(`\nTotal Tests: ${totalTests}`, 'blue');
        log(`Passed: ${passedTests}`, 'green');
        log(`Failed: ${totalTests - passedTests}`, 'red');
        log(`Success Rate: ${percentage}%`, resultColor);
        
        if (passedTests === totalTests) {
            log('\n🎉 ALL TESTS PASSED! The application is fully functional!', 'green');
        } else {
            log(`\n⚠️ ${totalTests - passedTests} tests failed. Please review the errors above.`, 'yellow');
        }
        
        // Take final screenshot
        await page.screenshot({ 
            path: path.join(screenshotsDir, 'final-state.png'),
            fullPage: true 
        });
        
        log(`\n📁 Test results saved in: ${screenshotsDir}`, 'magenta');
        
    } catch (error) {
        log(`\n💥 CRITICAL ERROR: ${error.message}`, 'red');
        await page.screenshot({ 
            path: path.join(screenshotsDir, 'error-state.png'),
            fullPage: true 
        });
    } finally {
        await browser.close();
        log('\n🏁 Testing completed!\n', 'cyan');
    }
})();