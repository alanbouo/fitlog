/**
 * Browser Automation Tests
 * Full end-to-end flow test using Playwright
 * Tests: Signup → Login → Log Workout → AI Suggestion → Complete → Delete
 * 
 * Run with: npx playwright test browser_test.js
 */

// Install Playwright: npm install -D @playwright/test
// Then: npx playwright install

import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'
const API_URL = 'http://localhost:5000'

// Generate unique username for each test run
const timestamp = Date.now()
const testUsername = `testuser_${timestamp}`
const testEmail = `test${timestamp}@fitlog.com`
const testPassword = 'testpass123'

test.describe('FitLog Full Flow Test', () => {
  test('Complete user journey: Signup → Login → Log Workout → AI Suggestion → Complete → Delete', async ({ page }) => {
    // Step 1: Navigate to app
    console.log('📱 Step 1: Navigating to FitLog app...')
    await page.goto(BASE_URL)
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*\/login/)
    
    // Step 2: Signup
    console.log('✍️ Step 2: Creating new account...')
    await page.click('text=Sign up')
    await expect(page).toHaveURL(/.*\/signup/)
    
    // Fill signup form
    await page.fill('input[name="username"]', testUsername)
    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="password"]', testPassword)
    await page.fill('input[name="confirmPassword"]', testPassword)
    
    // Submit signup
    await page.click('button:has-text("Sign up")')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/)
    await expect(page.locator('text=Welcome')).toBeVisible()
    
    console.log('✅ Account created and logged in successfully!')
    
    // Step 3: Log a workout
    console.log('🏋️ Step 3: Logging a workout...')
    
    // Fill workout form
    await page.fill('input[name="exercise"]', 'Squats')
    await page.fill('input[name="sets"]', '3')
    await page.fill('input[name="reps"]', '15')
    await page.fill('input[name="duration"]', '0')
    
    // Submit workout
    await page.click('button:has-text("Log Workout")')
    
    // Wait for success message
    await expect(page.locator('text=Workout logged successfully')).toBeVisible({ timeout: 5000 })
    
    console.log('✅ Workout logged successfully!')
    
    // Step 4: Check AI suggestion
    console.log('🤖 Step 4: Checking AI suggestion...')
    
    // Wait for AI suggestion to appear
    await expect(page.locator('text=AI Suggestion')).toBeVisible({ timeout: 5000 })
    
    // Verify suggestion contains expected content (after squats, should suggest push-ups)
    const suggestionText = await page.locator('text=AI Suggestion').locator('..').textContent()
    expect(suggestionText).toContain('Push-ups')
    
    console.log('✅ AI suggestion displayed correctly!')
    
    // Step 5: Verify workout in list
    console.log('📋 Step 5: Verifying workout in list...')
    
    await expect(page.locator('text=Squats')).toBeVisible()
    await expect(page.locator('text=3')).toBeVisible() // Sets
    await expect(page.locator('text=15')).toBeVisible() // Reps
    
    console.log('✅ Workout appears in list!')
    
    // Step 6: Mark workout as complete
    console.log('✓ Step 6: Marking workout as complete...')
    
    // Find the workout card and click Complete button
    const workoutCard = page.locator(`text=Squats`).locator('..').locator('..')
    await workoutCard.locator('button:has-text("Complete")').click()
    
    // Verify completion status
    await expect(page.locator('text=Completed')).toBeVisible({ timeout: 3000 })
    
    console.log('✅ Workout marked as complete!')
    
    // Step 7: Delete workout
    console.log('🗑️ Step 7: Deleting workout...')
    
    // Click delete button on the completed workout
    await workoutCard.locator('button:has-text("Delete")').click()
    
    // Confirm deletion (if dialog appears)
    if (await page.locator('text=Are you sure').isVisible({ timeout: 1000 })) {
      await page.click('button:has-text("OK"), button:has-text("Confirm")')
    }
    
    // Wait for workout to disappear
    await expect(page.locator('text=Squats')).not.toBeVisible({ timeout: 3000 })
    
    console.log('✅ Workout deleted successfully!')
    
    // Step 8: Logout
    console.log('🚪 Step 8: Logging out...')
    
    await page.click('button:has-text("Logout")')
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*\/login/, { timeout: 5000 })
    
    console.log('✅ Logged out successfully!')
    
    // Step 9: Login again
    console.log('🔐 Step 9: Logging back in...')
    
    await page.fill('input[name="username"]', testUsername)
    await page.fill('input[name="password"]', testPassword)
    await page.click('button:has-text("Sign in")')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 5000 })
    
    console.log('✅ Login successful!')
    console.log('🎉 All tests passed! Complete flow verified.')
  })
  
  test('API Health Check', async ({ request }) => {
    console.log('🏥 Testing API health endpoint...')
    const response = await request.get(`${API_URL}/api/health`)
    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    expect(data.status).toBe('healthy')
    console.log('✅ API is healthy!')
  })
})

