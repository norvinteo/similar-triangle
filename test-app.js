const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
    console.log('🚀 Starting Playwright test...\n');
    
    // Create screenshots directory if it doesn't exist
    const screenshotsDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir);
    }
    
    const browser = await chromium.launch({ 
        headless: true,
        args: ['--disable-blink-features=AutomationControlled']
    });
    
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        locale: 'th-TH'
    });
    
    const page = await context.newPage();
    
    try {
        // Load the HTML file
        const filePath = `file://${path.join(__dirname, 'index.html')}`;
        console.log(`📄 Loading: ${filePath}`);
        await page.goto(filePath, { waitUntil: 'networkidle' });
        
        // Wait for React to render
        await page.waitForTimeout(2000);
        
        console.log('✅ Page loaded successfully!\n');
        
        // Test 1: Check if main elements are present
        console.log('🧪 Test 1: Checking main elements...');
        const title = await page.textContent('h1');
        console.log(`   Title: ${title}`);
        
        const navButtons = await page.$$('.nav-button');
        console.log(`   Navigation buttons found: ${navButtons.length}`);
        
        // Take screenshot of home page
        await page.screenshot({ 
            path: path.join(screenshotsDir, '1-home.png'),
            fullPage: true 
        });
        console.log('   📸 Screenshot saved: 1-home.png\n');
        
        // Test 2: Navigate through all sections
        const sections = [
            { id: 'intro', name: 'ความคล้าย' },
            { id: 'triangles', name: 'รูปสามเหลี่ยมคล้าย' },
            { id: 'visualization', name: 'ภาพเคลื่อนไหว' },
            { id: 'calculator', name: 'เครื่องคำนวณ' },
            { id: 'exercises', name: 'แบบฝึกหัด' },
            { id: 'realworld', name: 'ตัวอย่างจริง' }
        ];
        
        console.log('🧪 Test 2: Testing navigation...');
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            console.log(`   Navigating to: ${section.name}`);
            
            // Click the navigation button
            await page.click(`.nav-button:nth-child(${i + 1})`);
            await page.waitForTimeout(500);
            
            // Check if section is visible
            const sectionVisible = await page.isVisible(`.${section.id}-section`);
            console.log(`   ✓ Section visible: ${sectionVisible}`);
            
            // Take screenshot
            await page.screenshot({ 
                path: path.join(screenshotsDir, `${i + 2}-${section.id}.png`),
                fullPage: true 
            });
            console.log(`   📸 Screenshot saved: ${i + 2}-${section.id}.png`);
        }
        console.log();
        
        // Test 3: Test calculator functionality
        console.log('🧪 Test 3: Testing calculator...');
        await page.click('.nav-button:nth-child(4)'); // Navigate to calculator
        await page.waitForTimeout(500);
        
        // Enter values in calculator
        const inputs = await page.$$('.triangle-input input[type="number"]');
        if (inputs.length >= 6) {
            await inputs[0].fill('5');
            await inputs[1].fill('6');
            await inputs[2].fill('7');
            
            await inputs[3].fill('10');
            await inputs[4].fill('12');
            await inputs[5].fill('14');
        }
        
        // Click calculate button
        await page.click('.calculate-btn');
        await page.waitForTimeout(500);
        
        // Check if result appears
        const resultVisible = await page.isVisible('.result-box');
        console.log(`   Calculator result displayed: ${resultVisible}`);
        
        if (resultVisible) {
            const resultText = await page.textContent('.result-box');
            console.log(`   Result shows triangles are similar: ${resultText.includes('คล้ายกัน')}`);
        }
        
        await page.screenshot({ 
            path: path.join(screenshotsDir, '8-calculator-result.png'),
            fullPage: true 
        });
        console.log('   📸 Screenshot saved: 8-calculator-result.png\n');
        
        // Test 4: Test exercises
        console.log('🧪 Test 4: Testing exercises...');
        await page.click('.nav-button:nth-child(5)'); // Navigate to exercises
        await page.waitForTimeout(500);
        
        // Answer first question
        const questionText = await page.textContent('.question-box h3');
        console.log(`   First question: ${questionText.substring(0, 50)}...`);
        
        // Click an answer
        await page.click('.option-btn:nth-child(2)');
        await page.waitForTimeout(500);
        
        // Check if feedback appears
        const feedbackVisible = await page.isVisible('.feedback');
        console.log(`   Feedback displayed: ${feedbackVisible}`);
        
        await page.screenshot({ 
            path: path.join(screenshotsDir, '9-exercise.png'),
            fullPage: true 
        });
        console.log('   📸 Screenshot saved: 9-exercise.png\n');
        
        // Test 5: Test visualization controls
        console.log('🧪 Test 5: Testing visualization...');
        await page.click('.nav-button:nth-child(3)'); // Navigate to visualization
        await page.waitForTimeout(500);
        
        // Test scale slider
        const slider = await page.$('input[type="range"]');
        if (slider) {
            await page.fill('input[type="range"]', '1.5');
            console.log('   Scale slider adjusted to 1.5');
        }
        
        // Test rotation button
        await page.click('.rotate-btn');
        console.log('   Rotation toggled');
        await page.waitForTimeout(1000);
        
        await page.screenshot({ 
            path: path.join(screenshotsDir, '10-visualization.png'),
            fullPage: true 
        });
        console.log('   📸 Screenshot saved: 10-visualization.png\n');
        
        // Test 6: Check responsive design
        console.log('🧪 Test 6: Testing responsive design...');
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.waitForTimeout(500);
        
        await page.screenshot({ 
            path: path.join(screenshotsDir, '11-mobile-view.png'),
            fullPage: true 
        });
        console.log('   📸 Mobile view screenshot saved: 11-mobile-view.png\n');
        
        console.log('✅ All tests completed successfully!');
        console.log(`📁 Screenshots saved in: ${screenshotsDir}`);
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        await page.screenshot({ 
            path: path.join(screenshotsDir, 'error.png'),
            fullPage: true 
        });
    } finally {
        await browser.close();
        console.log('\n🏁 Test finished!');
    }
})();