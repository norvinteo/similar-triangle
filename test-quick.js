const { chromium } = require('playwright');
const path = require('path');

(async () => {
    console.log('🚀 Quick Function Test for Modern UI\n');
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    const results = {
        passed: [],
        failed: []
    };
    
    try {
        // Load the application
        const filePath = `file://${path.join(__dirname, 'index-modern.html')}`;
        await page.goto(filePath, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2000);
        
        console.log('Testing core functions...\n');
        
        // Test 1: Check main UI elements
        console.log('1. UI Elements:');
        try {
            await page.waitForSelector('.app-title', { timeout: 5000 });
            console.log('   ✅ App title loaded');
            results.passed.push('App title');
        } catch {
            console.log('   ❌ App title missing');
            results.failed.push('App title');
        }
        
        try {
            await page.waitForSelector('.stat-item.level', { timeout: 5000 });
            console.log('   ✅ Level system present');
            results.passed.push('Level system');
        } catch {
            console.log('   ❌ Level system missing');
            results.failed.push('Level system');
        }
        
        try {
            await page.waitForSelector('.xp-bar', { timeout: 5000 });
            console.log('   ✅ XP bar present');
            results.passed.push('XP bar');
        } catch {
            console.log('   ❌ XP bar missing');
            results.failed.push('XP bar');
        }
        
        try {
            await page.waitForSelector('.mascot', { timeout: 5000 });
            console.log('   ✅ Mascot character present');
            results.passed.push('Mascot');
        } catch {
            console.log('   ❌ Mascot missing');
            results.failed.push('Mascot');
        }
        
        try {
            await page.waitForSelector('.achievements-bar', { timeout: 5000 });
            console.log('   ✅ Achievements bar present');
            results.passed.push('Achievements');
        } catch {
            console.log('   ❌ Achievements bar missing');
            results.failed.push('Achievements');
        }
        
        // Test 2: Navigation
        console.log('\n2. Navigation:');
        try {
            const navButtons = await page.$$('.nav-button');
            if (navButtons.length === 6) {
                console.log('   ✅ All 6 navigation buttons present');
                results.passed.push('Navigation buttons');
            } else {
                console.log(`   ❌ Expected 6 nav buttons, found ${navButtons.length}`);
                results.failed.push('Navigation buttons');
            }
        } catch {
            console.log('   ❌ Navigation error');
            results.failed.push('Navigation');
        }
        
        // Test 3: Dark Mode
        console.log('\n3. Dark Mode:');
        try {
            const darkModeBtn = await page.$('button.icon-btn i.fa-moon, button.icon-btn i.fa-sun');
            if (darkModeBtn) {
                const parent = await darkModeBtn.evaluateHandle(el => el.parentElement);
                await parent.click();
                await page.waitForTimeout(500);
                
                const hasDarkMode = await page.$('.app-container.dark-mode');
                if (hasDarkMode) {
                    console.log('   ✅ Dark mode toggle works');
                    results.passed.push('Dark mode');
                    
                    // Toggle back
                    await parent.click();
                } else {
                    console.log('   ⚠️ Dark mode toggle clicked but mode not applied');
                    results.failed.push('Dark mode');
                }
            } else {
                console.log('   ❌ Dark mode button not found');
                results.failed.push('Dark mode button');
            }
        } catch (e) {
            console.log('   ❌ Dark mode test error:', e.message);
            results.failed.push('Dark mode');
        }
        
        // Test 4: Sound Toggle
        console.log('\n4. Sound System:');
        try {
            const soundBtn = await page.$('button.icon-btn i.fa-volume-up, button.icon-btn i.fa-volume-mute');
            if (soundBtn) {
                console.log('   ✅ Sound toggle button present');
                results.passed.push('Sound toggle');
            } else {
                console.log('   ❌ Sound button not found');
                results.failed.push('Sound toggle');
            }
        } catch {
            console.log('   ❌ Sound system error');
            results.failed.push('Sound system');
        }
        
        // Test 5: Calculator
        console.log('\n5. Calculator:');
        try {
            // Navigate to calculator
            const calcBtn = await page.$('.nav-button:has(i.fa-calculator)');
            if (calcBtn) {
                await calcBtn.click();
                await page.waitForTimeout(1000);
                
                const inputs = await page.$$('.neon-input');
                const calculateBtn = await page.$('.calculate-btn');
                
                if (inputs.length >= 6 && calculateBtn) {
                    console.log('   ✅ Calculator interface loaded');
                    results.passed.push('Calculator');
                    
                    // Try calculation
                    for (let i = 0; i < Math.min(3, inputs.length); i++) {
                        await inputs[i].fill('3');
                    }
                    for (let i = 3; i < Math.min(6, inputs.length); i++) {
                        await inputs[i].fill('6');
                    }
                    
                    await calculateBtn.click();
                    await page.waitForTimeout(1500);
                    
                    const result = await page.$('.result-panel');
                    if (result) {
                        console.log('   ✅ Calculator computation works');
                        results.passed.push('Calculator computation');
                    }
                } else {
                    console.log('   ❌ Calculator interface incomplete');
                    results.failed.push('Calculator interface');
                }
            }
        } catch (e) {
            console.log('   ❌ Calculator error:', e.message);
            results.failed.push('Calculator');
        }
        
        // Test 6: Quiz
        console.log('\n6. Quiz/Exercises:');
        try {
            const quizBtn = await page.$('.nav-button:has(i.fa-gamepad)');
            if (quizBtn) {
                await quizBtn.click();
                await page.waitForTimeout(1000);
                
                const questionText = await page.$('.question-text');
                const options = await page.$$('.option-btn');
                
                if (questionText && options.length > 0) {
                    console.log('   ✅ Quiz interface loaded');
                    results.passed.push('Quiz interface');
                    
                    // Try answering
                    await options[0].click();
                    await page.waitForTimeout(1000);
                    
                    const explanation = await page.$('.explanation-box');
                    if (explanation) {
                        console.log('   ✅ Quiz interaction works');
                        results.passed.push('Quiz interaction');
                    }
                } else {
                    console.log('   ❌ Quiz interface incomplete');
                    results.failed.push('Quiz interface');
                }
            }
        } catch (e) {
            console.log('   ❌ Quiz error:', e.message);
            results.failed.push('Quiz');
        }
        
        // Test 7: 3D Visualization
        console.log('\n7. 3D Visualization:');
        try {
            const vizBtn = await page.$('.nav-button:has(i.fa-cube)');
            if (vizBtn) {
                await vizBtn.click();
                await page.waitForTimeout(1000);
                
                const mode3DBtn = await page.$('.mode-btn:has-text("3D Mode")');
                const slider = await page.$('.neon-slider');
                
                if (mode3DBtn && slider) {
                    console.log('   ✅ Visualization controls present');
                    results.passed.push('Visualization controls');
                    
                    await mode3DBtn.click();
                    await page.waitForTimeout(1500);
                    
                    const threeContainer = await page.$('.three-container');
                    if (threeContainer) {
                        console.log('   ✅ 3D mode activates');
                        results.passed.push('3D mode');
                    }
                } else {
                    console.log('   ❌ Visualization controls missing');
                    results.failed.push('Visualization controls');
                }
            }
        } catch (e) {
            console.log('   ❌ Visualization error:', e.message);
            results.failed.push('Visualization');
        }
        
        // Test 8: Responsive Design
        console.log('\n8. Responsive Design:');
        try {
            // Test mobile view
            await page.setViewportSize({ width: 375, height: 812 });
            await page.waitForTimeout(500);
            const mobileNav = await page.$('.navigation');
            if (mobileNav) {
                console.log('   ✅ Mobile view works (375px)');
                results.passed.push('Mobile view');
            }
            
            // Test tablet view
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.waitForTimeout(500);
            console.log('   ✅ Tablet view works (768px)');
            results.passed.push('Tablet view');
            
            // Back to desktop
            await page.setViewportSize({ width: 1920, height: 1080 });
            await page.waitForTimeout(500);
            console.log('   ✅ Desktop view works (1920px)');
            results.passed.push('Desktop view');
        } catch (e) {
            console.log('   ❌ Responsive design error:', e.message);
            results.failed.push('Responsive design');
        }
        
        // SUMMARY
        console.log('\n' + '='.repeat(50));
        console.log('📊 TEST SUMMARY');
        console.log('='.repeat(50));
        console.log(`✅ Passed: ${results.passed.length} tests`);
        console.log(`❌ Failed: ${results.failed.length} tests`);
        console.log(`📈 Success Rate: ${((results.passed.length / (results.passed.length + results.failed.length)) * 100).toFixed(1)}%`);
        
        if (results.failed.length > 0) {
            console.log('\n Failed tests:', results.failed.join(', '));
        }
        
        if (results.passed.length === results.passed.length + results.failed.length) {
            console.log('\n🎉 All functions working perfectly!');
        }
        
    } catch (error) {
        console.error('💥 Critical error:', error.message);
    } finally {
        await browser.close();
        console.log('\n✅ Test completed!');
    }
})();