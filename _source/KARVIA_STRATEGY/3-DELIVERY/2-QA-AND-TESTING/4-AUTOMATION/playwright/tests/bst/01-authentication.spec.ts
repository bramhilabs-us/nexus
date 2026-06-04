/**
 * BST Test Suite 1: Authentication (10 tests)
 * Priority: P0 (Critical - Blocking)
 *
 * Tests:
 * - Valid login (all roles)
 * - Invalid login (wrong password, non-existent user)
 * - Session persistence
 * - Token refresh
 * - Logout
 * - Signup flow
 * - Password validation
 * - Email validation
 */

import { test, expect } from '@playwright/test';

test.describe('BST Suite 1: Authentication', () => {

  /**
   * TC-AUTH-001: Valid Login - Business Owner
   */
  test('TC-AUTH-001: should login successfully as business owner', async ({ page }) => {
    // Navigate to login page
    await page.goto('/client/pages/login.html');

    // Fill login form
    await page.fill('#email', 'owner@test.com');
    await page.fill('#password', 'Test123!');

    // Click login button
    await page.click('button[type="submit"]');

    // Verify redirect to dashboard
    await expect(page).toHaveURL('/client/pages/dashboard.html');

    // Verify JWT token stored
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();

    // Verify user name displayed
    const userName = await page.textContent('.user-name');
    expect(userName).toContain('Test Owner');

    // Verify role badge
    const roleBadge = await page.textContent('.role-badge');
    expect(roleBadge).toContain('Business Owner');
  });

  /**
   * TC-AUTH-002: Valid Login - All Roles
   */
  test('TC-AUTH-002: should login successfully for all roles', async ({ page }) => {
    const testUsers = [
      {
        email: 'consultant@test.com',
        password: 'Test123!',
        role: 'Consultant',
        expectedDashboard: '/client/pages/dashboard.html'
      },
      {
        email: 'executive@test.com',
        password: 'Test123!',
        role: 'Executive',
        expectedDashboard: '/client/pages/executive-dashboard.html'
      },
      {
        email: 'manager@test.com',
        password: 'Test123!',
        role: 'Manager',
        expectedDashboard: '/client/pages/manager-dashboard.html'
      },
      {
        email: 'employee@test.com',
        password: 'Test123!',
        role: 'Employee',
        expectedDashboard: '/client/pages/dashboard.html'
      }
    ];

    for (const user of testUsers) {
      // Navigate to login
      await page.goto('/client/pages/login.html');

      // Login
      await page.fill('#email', user.email);
      await page.fill('#password', user.password);
      await page.click('button[type="submit"]');

      // Verify correct dashboard
      await expect(page).toHaveURL(user.expectedDashboard, { timeout: 10000 });

      // Verify role displayed
      const roleText = await page.textContent('.role-badge');
      expect(roleText).toContain(user.role);

      // Logout for next test
      await page.click('.logout-button');
      await expect(page).toHaveURL('/client/pages/login.html');
    }
  });

  /**
   * TC-AUTH-003: Invalid Login - Wrong Password
   */
  test('TC-AUTH-003: should show error for wrong password', async ({ page }) => {
    await page.goto('/client/pages/login.html');

    // Enter valid email, wrong password
    await page.fill('#email', 'owner@test.com');
    await page.fill('#password', 'WrongPassword123!');
    await page.click('button[type="submit"]');

    // Verify error message
    const errorMessage = await page.textContent('.error-message');
    expect(errorMessage).toContain('Invalid email or password');

    // Verify no redirect
    await expect(page).toHaveURL('/client/pages/login.html');

    // Verify no token stored
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeNull();

    // Verify email field retains value
    const emailValue = await page.inputValue('#email');
    expect(emailValue).toBe('owner@test.com');

    // Verify password field cleared
    const passwordValue = await page.inputValue('#password');
    expect(passwordValue).toBe('');
  });

  /**
   * TC-AUTH-004: Invalid Login - Non-existent User
   */
  test('TC-AUTH-004: should show error for non-existent user', async ({ page }) => {
    await page.goto('/client/pages/login.html');

    // Enter non-existent email
    await page.fill('#email', 'nonexistent@test.com');
    await page.fill('#password', 'Test123!');
    await page.click('button[type="submit"]');

    // Verify error message (same as wrong password - don't reveal user existence)
    const errorMessage = await page.textContent('.error-message');
    expect(errorMessage).toContain('Invalid email or password');

    // Verify no redirect
    await expect(page).toHaveURL('/client/pages/login.html');
  });

  /**
   * TC-AUTH-005: Session Persistence
   */
  test('TC-AUTH-005: should persist session after browser close', async ({ browser }) => {
    // Create new context to simulate browser close/reopen
    const context = await browser.newContext();
    const page = await context.newPage();

    // Login
    await page.goto('/client/pages/login.html');
    await page.fill('#email', 'owner@test.com');
    await page.fill('#password', 'Test123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/client/pages/dashboard.html');

    // Get token
    const token = await page.evaluate(() => localStorage.getItem('token'));

    // Close context (simulate browser close)
    await context.close();

    // Create new context with same storage (simulate browser reopen)
    const newContext = await browser.newContext({
      storageState: {
        cookies: [],
        origins: [{
          origin: page.url(),
          localStorage: [{ name: 'token', value: token }]
        }]
      }
    });
    const newPage = await newContext.newPage();

    // Navigate to dashboard directly
    await newPage.goto('/client/pages/dashboard.html');

    // Verify user remains logged in (no redirect to login)
    await expect(newPage).toHaveURL('/client/pages/dashboard.html');

    await newContext.close();
  });

  /**
   * TC-AUTH-007: Logout
   */
  test('TC-AUTH-007: should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/client/pages/login.html');
    await page.fill('#email', 'owner@test.com');
    await page.fill('#password', 'Test123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/client/pages/dashboard.html');

    // Logout
    await page.click('.logout-button');

    // Verify redirected to login
    await expect(page).toHaveURL('/client/pages/login.html');

    // Verify token removed
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeNull();

    // Attempt to access dashboard
    await page.goto('/client/pages/dashboard.html');

    // Verify redirected back to login
    await expect(page).toHaveURL('/client/pages/login.html');
  });

  /**
   * TC-AUTH-008: Signup - Business Owner
   */
  test('TC-AUTH-008: should signup successfully as business owner', async ({ page }) => {
    await page.goto('/client/pages/signup.html');

    // Generate unique email
    const uniqueEmail = `newowner${Date.now()}@test.com`;

    // Fill signup form
    await page.fill('#email', uniqueEmail);
    await page.fill('#password', 'Test123!');
    await page.fill('#first_name', 'John');
    await page.fill('#last_name', 'Doe');
    await page.fill('#company_name', 'New Test Company');
    await page.select('#industry', 'SaaS');
    await page.fill('#employee_count', '50');

    // Submit
    await page.click('button[type="submit"]');

    // Verify redirect to dashboard (logged in automatically)
    await expect(page).toHaveURL('/client/pages/dashboard.html', { timeout: 10000 });

    // Verify user created and logged in
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
  });

  /**
   * TC-AUTH-009: Password Validation
   */
  test('TC-AUTH-009: should validate password requirements', async ({ page }) => {
    await page.goto('/client/pages/signup.html');

    const passwordTests = [
      { password: 'test', expectedError: 'Password must be at least 8 characters' },
      { password: 'test1234', expectedError: 'Password must contain special character' },
      { password: 'Test1234', expectedError: 'Password must contain special character' },
      { password: 'Test123!', expectedError: null }  // Valid password
    ];

    for (const testCase of passwordTests) {
      // Fill minimal form
      await page.fill('#email', 'test@test.com');
      await page.fill('#password', testCase.password);
      await page.fill('#first_name', 'Test');
      await page.fill('#last_name', 'User');

      // Trigger validation (blur or submit)
      await page.fill('#first_name', 'Test');  // Blur password field

      if (testCase.expectedError) {
        // Verify error message
        const error = await page.textContent('.password-error');
        expect(error).toContain(testCase.expectedError);
      } else {
        // Verify no error
        const error = await page.locator('.password-error');
        await expect(error).not.toBeVisible();
      }

      // Reset form
      await page.reload();
    }
  });

  /**
   * TC-AUTH-010: Email Validation
   */
  test('TC-AUTH-010: should validate email format', async ({ page }) => {
    await page.goto('/client/pages/signup.html');

    const emailTests = [
      { email: 'test', expectedError: 'Invalid email format' },
      { email: 'test@', expectedError: 'Invalid email format' },
      { email: 'test@test', expectedError: 'Invalid email format' },
      { email: 'test@test.com', expectedError: null },  // Valid
      { email: 'owner@test.com', expectedError: 'Email already registered' }  // Duplicate
    ];

    for (const testCase of emailTests) {
      await page.fill('#email', testCase.email);
      await page.fill('#password', 'Test123!');

      // Blur to trigger validation
      await page.fill('#first_name', 'Test');

      if (testCase.expectedError) {
        const error = await page.textContent('.email-error');
        expect(error).toContain(testCase.expectedError);
      } else {
        const error = await page.locator('.email-error');
        await expect(error).not.toBeVisible();
      }

      await page.reload();
    }
  });
});
