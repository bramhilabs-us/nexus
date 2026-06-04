/**
 * Authentication Setup for Playwright Tests
 * Creates authenticated state for different user roles
 *
 * Sprint 13 - Unified LLM Context Service
 */

import { test as setup, expect } from '@playwright/test';
import path from 'path';

// Storage state files for different roles
const STORAGE_DIR = path.join(__dirname, '../.auth');

// Test credentials - these should match seed data
const TEST_USERS = {
  manager: {
    email: process.env.TEST_MANAGER_EMAIL || 'manager@karvia-test.com',
    password: process.env.TEST_MANAGER_PASSWORD || 'Test123!',
    storageFile: path.join(STORAGE_DIR, 'manager.json'),
  },
  businessOwner: {
    email: process.env.TEST_OWNER_EMAIL || 'owner@karvia-test.com',
    password: process.env.TEST_OWNER_PASSWORD || 'Test123!',
    storageFile: path.join(STORAGE_DIR, 'owner.json'),
  },
  employee: {
    email: process.env.TEST_EMPLOYEE_EMAIL || 'employee@karvia-test.com',
    password: process.env.TEST_EMPLOYEE_PASSWORD || 'Test123!',
    storageFile: path.join(STORAGE_DIR, 'employee.json'),
  },
};

/**
 * Setup: Authenticate as Manager
 * Required for: X10 Assignment UI tests (MANAGER+ roles)
 */
setup('authenticate as manager', async ({ page }) => {
  await page.goto('/client/pages/login.html');

  // Fill login form
  await page.fill('input[name="email"], #email', TEST_USERS.manager.email);
  await page.fill('input[name="password"], #password', TEST_USERS.manager.password);

  // Submit
  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard
  await page.waitForURL(/dashboard/, { timeout: 15000 });

  // Verify token exists
  const token = await page.evaluate(() => localStorage.getItem('karvia_token'));
  expect(token).toBeTruthy();

  // Save storage state
  await page.context().storageState({ path: TEST_USERS.manager.storageFile });
});

/**
 * Setup: Authenticate as Business Owner
 * Required for: Full system access tests
 */
setup('authenticate as business owner', async ({ page }) => {
  await page.goto('/client/pages/login.html');

  await page.fill('input[name="email"], #email', TEST_USERS.businessOwner.email);
  await page.fill('input[name="password"], #password', TEST_USERS.businessOwner.password);
  await page.click('button[type="submit"]');

  await page.waitForURL(/dashboard/, { timeout: 15000 });

  const token = await page.evaluate(() => localStorage.getItem('karvia_token'));
  expect(token).toBeTruthy();

  await page.context().storageState({ path: TEST_USERS.businessOwner.storageFile });
});

/**
 * Setup: Authenticate as Employee
 * Required for: RBAC negative tests (employee cannot reassign)
 */
setup('authenticate as employee', async ({ page }) => {
  await page.goto('/client/pages/login.html');

  await page.fill('input[name="email"], #email', TEST_USERS.employee.email);
  await page.fill('input[name="password"], #password', TEST_USERS.employee.password);
  await page.click('button[type="submit"]');

  await page.waitForURL(/dashboard/, { timeout: 15000 });

  const token = await page.evaluate(() => localStorage.getItem('karvia_token'));
  expect(token).toBeTruthy();

  await page.context().storageState({ path: TEST_USERS.employee.storageFile });
});

export { TEST_USERS, STORAGE_DIR };
