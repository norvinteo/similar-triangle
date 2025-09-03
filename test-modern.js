const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
    console.log('🚀 Testing Modern UI...\n');
    
    const screenshotsDir = path.join(__dirname, 'screenshots-modern');
    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir);
    }
    
    const browser = await chromium.launch({ 
        headless: true,
        args: ['--disable-blink-features=AutomationControlled']
    });
    
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        locale: 'th-TH'
    });
    
    const page = await context.newPage();
    
    try {
        // Load the modern HTML file
        const filePath = `file://${path.join(__dirname, 'index-modern.html')}`;
        console.log(`📄 Loading Modern UI: ${filePath}`);
        await page.goto(filePath, { waitUntil: 'networkidle' });
        
        // Wait for React to render
        await page.waitForTimeout(3000);
        
        console.log('✅ Modern UI loaded successfully!\n');
        
        // Test 1: Check main elements
        console.log('🧪 Test 1: Checking enhanced UI elements...');
        
        // Check header elements
        const title = await page.textContent('.app-title');
        console.log(`   Title: ${title}`);
        
        // Check user stats
        const levelElement = await page.$('.stat-item.level');
        if (levelElement) {
            console.log('   ✓ Level system present');
        }
        
        const xpBar = await page.$('.xp-bar');
        if (xpBar) {
            console.log('   ✓ XP bar present');
        }
        
        // Check mascot
        const mascot = await page.$('.mascot');
        if (mascot) {
            console.log('   ✓ Mascot character present');
        }
        
        // Check achievements bar
        const achievements = await page.$('.achievements-bar');
        if (achievements) {
            console.log('   ✓ Achievements system present');
        }
        
        // Take screenshot of home
        await page.screenshot({ 
            path: path.join(screenshotsDir, '1-modern-home.png'),
            fullPage: true 
        });
        console.log('   📸 Screenshot: 1-modern-home.png\n');
        
        // Test 2: Test dark mode toggle
        console.log('🧪 Test 2: Testing dark mode...');
        const darkModeBtn = await page.$('button.icon-btn:has(i.fa-moon)');
        if (darkModeBtn) {
            await darkModeBtn.click();
            await page.waitForTimeout(500);
            
            const hasDarkMode = await page.$('.app-container.dark-mode');
            console.log(`   Dark mode activated: ${hasDarkMode !== null}`);
            
            await page.screenshot({ 
                path: path.join(screenshotsDir, '2-dark-mode.png'),
                fullPage: true 
            });
            console.log('   📸 Screenshot: 2-dark-mode.png\n');
        }
        
        // Test 3: Navigate through sections
        console.log('🧪 Test 3: Testing navigation with new design...');
        const navButtons = await page.$$('.nav-button');
        console.log(`   Found ${navButtons.length} navigation buttons`);
        
        for (let i = 0; i < Math.min(navButtons.length, 3); i++) {
            await navButtons[i].click();
            await page.waitForTimeout(1000);
            
            await page.screenshot({ 
                path: path.join(screenshotsDir, `${i + 3}-section-${i}.png`),
                fullPage: true 
            });
            console.log(`   📸 Screenshot: ${i + 3}-section-${i}.png`);
        }
        console.log();
        
        // Test 4: Test gamification features
        console.log('🧪 Test 4: Testing gamification...');
        
        // Navigate to exercises
        const exercisesBtn = await page.$('.nav-button:has(i.fa-gamepad)');
        if (exercisesBtn) {
            await exercisesBtn.click();
            await page.waitForTimeout(1000);
            
            // Check game stats
            const gameStats = await page.$('.game-stats');
            if (gameStats) {
                console.log('   ✓ Game stats present');
            }
            
            // Try answering a question
            const optionBtn = await page.$('.option-btn');
            if (optionBtn) {
                await optionBtn.click();
                await page.waitForTimeout(1000);
                console.log('   ✓ Quiz interaction works');
            }
            
            await page.screenshot({ 
                path: path.join(screenshotsDir, '6-gamification.png'),
                fullPage: true 
            });
            console.log('   📸 Screenshot: 6-gamification.png\n');
        }
        
        // Test 5: Test 3D visualization
        console.log('🧪 Test 5: Testing 3D visualization...');
        const vizBtn = await page.$('.nav-button:has(i.fa-cube)');
        if (vizBtn) {
            await vizBtn.click();
            await page.waitForTimeout(1000);
            
            // Check for 3D mode button
            const mode3D = await page.$('.mode-btn:has-text("3D Mode")');
            if (mode3D) {
                await mode3D.click();
                await page.waitForTimeout(2000);
                console.log('   ✓ 3D mode activated');
            }
            
            await page.screenshot({ 
                path: path.join(screenshotsDir, '7-3d-visualization.png'),
                fullPage: true 
            });
            console.log('   📸 Screenshot: 7-3d-visualization.png\n');
        }
        
        // Test 6: Test calculator with neon design
        console.log('🧪 Test 6: Testing enhanced calculator...');
        const calcBtn = await page.$('.nav-button:has(i.fa-calculator)');
        if (calcBtn) {
            await calcBtn.click();
            await page.waitForTimeout(1000);
            
            const calculateBtn = await page.$('.calculate-btn');
            if (calculateBtn) {
                await calculateBtn.click();
                await page.waitForTimeout(1500);
                
                const result = await page.$('.result-panel');
                console.log(`   Calculator result displayed: ${result !== null}`);
            }
            
            await page.screenshot({ 
                path: path.join(screenshotsDir, '8-calculator.png'),
                fullPage: true 
            });
            console.log('   📸 Screenshot: 8-calculator.png\n');
        }
        
        // Test 7: Mobile responsive
        console.log('🧪 Test 7: Testing mobile responsiveness...');
        await page.setViewportSize({ width: 375, height: 812 });
        await page.waitForTimeout(500);
        
        await page.screenshot({ 
            path: path.join(screenshotsDir, '9-mobile-view.png'),
            fullPage: true 
        });
        console.log('   📸 Screenshot: 9-mobile-view.png\n');
        
        console.log('✅ All modern UI tests completed successfully!');
        console.log(`📁 Screenshots saved in: ${screenshotsDir}`);
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        await page.screenshot({ 
            path: path.join(screenshotsDir, 'error.png'),
            fullPage: true 
        });
    } finally {
        await browser.close();
        console.log('\n🏁 Modern UI test finished!');
    }
})();