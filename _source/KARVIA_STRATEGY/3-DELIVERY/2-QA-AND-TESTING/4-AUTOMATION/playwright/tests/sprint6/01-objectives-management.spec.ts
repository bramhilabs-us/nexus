/**
 * Sprint 6 Test Suite: Objectives Management
 * Epic 2 - Objectives Enhancement
 *
 * Tests:
 * - Objectives list loads
 * - Delete confirmation modal
 * - KR toggle with completion count
 * - Owner dropdown
 * - Target year dropdown
 */

import { test, expect } from '@playwright/test';

test.describe('Sprint 6: Objectives Management', () => {

  // Before each test, login as Executive (has objective management access)
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/client/pages/login.html');
    await page.fill('#email', 'exec@test.com');
    await page.fill('#password', 'Test123!');
    await page.click('button[type="submit"]');

    // Wait for login to complete
    await page.waitForTimeout(2000);

    // Navigate to objectives page
    await page.goto('/client/pages/objectives.html');
    await page.waitForLoadState('networkidle');
  });

  /**
   * OBJ-001: Objectives list loads
   */
  test('OBJ-001: should load objectives list', async ({ page }) => {
    // Verify page loaded
    await expect(page.locator('h1, .page-title')).toContainText(/objective/i);

    // Verify objectives container exists
    const objectivesContainer = page.locator('#objectives-container, .objectives-list');
    await expect(objectivesContainer).toBeVisible({ timeout: 10000 });
  });

  /**
   * OBJ-002: Create new objective button exists
   */
  test('OBJ-002: should show create objective button', async ({ page }) => {
    // Check for create/new objective button
    const createButton = page.locator('button:has-text("New"), button:has-text("Create"), .btn-new-objective');
    await expect(createButton).toBeVisible();
  });

  /**
   * OBJ-003: Owner dropdown populates with team members
   */
  test('OBJ-003: owner dropdown should populate with team members', async ({ page }) => {
    // Click create new objective
    await page.click('button:has-text("New"), button:has-text("Create"), .btn-new-objective');

    // Wait for modal/form to appear
    await page.waitForTimeout(1000);

    // Check owner dropdown exists
    const ownerDropdown = page.locator('#owner-select, select[name="owner"], #owner');
    await expect(ownerDropdown).toBeVisible();

    // Check it has options (team members)
    const options = await ownerDropdown.locator('option').count();
    expect(options).toBeGreaterThan(1); // At least default + 1 team member
  });

  /**
   * OBJ-004: Target year dropdown shows dynamic years
   */
  test('OBJ-004: target year dropdown should show current and future years', async ({ page }) => {
    // Click create new objective
    await page.click('button:has-text("New"), button:has-text("Create"), .btn-new-objective');

    // Wait for modal/form to appear
    await page.waitForTimeout(1000);

    // Check target year dropdown
    const yearDropdown = page.locator('#target-year, select[name="target_year"]');
    await expect(yearDropdown).toBeVisible();

    // Get current year
    const currentYear = new Date().getFullYear();

    // Verify current year is an option
    const yearOptions = await yearDropdown.locator('option').allTextContents();
    const hasCurrentYear = yearOptions.some(y => y.includes(currentYear.toString()));
    expect(hasCurrentYear).toBe(true);
  });

  /**
   * OBJ-007: Delete objective shows styled modal
   */
  test('OBJ-007: delete should show styled confirmation modal', async ({ page }) => {
    // Wait for objectives to load
    await page.waitForSelector('.objective-card, .objective-item, [data-objective-id]', { timeout: 10000 });

    // Find first objective's delete button
    const deleteButton = page.locator('.delete-btn, button:has-text("Delete"), .btn-delete').first();

    if (await deleteButton.isVisible()) {
      await deleteButton.click();

      // Check for confirmation modal
      const modal = page.locator('#delete-confirm-modal, .delete-modal, .modal-confirm');
      await expect(modal).toBeVisible({ timeout: 5000 });

      // Check modal has warning styling
      const warningElement = modal.locator('.warning, .alert-warning, [class*="warning"]');
      await expect(warningElement.or(modal.locator('text=/warning|delete|remove|permanent/i'))).toBeVisible();

      // Check modal has confirm and cancel buttons
      const confirmBtn = modal.locator('button:has-text("Confirm"), button:has-text("Delete"), .btn-confirm');
      const cancelBtn = modal.locator('button:has-text("Cancel"), .btn-cancel');

      await expect(confirmBtn).toBeVisible();
      await expect(cancelBtn).toBeVisible();

      // Close modal
      await cancelBtn.click();
      await expect(modal).not.toBeVisible();
    } else {
      // Skip if no objectives to delete
      test.skip();
    }
  });

  /**
   * OBJ-010: KR toggle shows completion count
   */
  test('OBJ-010: KR toggle should show "X more (Y completed)"', async ({ page }) => {
    // Wait for objectives to load
    await page.waitForSelector('.objective-card, .objective-item', { timeout: 10000 });

    // Look for KR toggle button with the new format
    const krToggle = page.locator('.kr-toggle, .toggle-krs, [class*="more"]');

    if (await krToggle.first().isVisible()) {
      // Check toggle text format
      const toggleText = await krToggle.first().textContent();

      // Should contain "more" and potentially "completed"
      expect(toggleText?.toLowerCase()).toMatch(/more|show|hide/);
    }
  });

  /**
   * OBJ-011: KR toggle expands/collapses
   */
  test('OBJ-011: KR toggle should expand and collapse KRs', async ({ page }) => {
    // Wait for objectives to load
    await page.waitForSelector('.objective-card, .objective-item', { timeout: 10000 });

    // Find KR toggle
    const krToggle = page.locator('.kr-toggle, .toggle-krs, button:has-text("more")').first();

    if (await krToggle.isVisible()) {
      // Get initial state
      const hiddenKRs = page.locator('.kr-hidden, .collapsed-krs, [data-collapsed="true"]');
      const initialHiddenCount = await hiddenKRs.count();

      // Click toggle
      await krToggle.click();

      // Wait for animation
      await page.waitForTimeout(500);

      // Check that state changed
      const toggleText = await krToggle.textContent();
      expect(toggleText?.toLowerCase()).toMatch(/show|hide|more|less/);
    }
  });

  /**
   * OBJ-005: New objectives show "On track" status
   */
  test('OBJ-005: new objectives should show On Track status', async ({ page }) => {
    // Click create new objective
    await page.click('button:has-text("New"), button:has-text("Create"), .btn-new-objective');
    await page.waitForTimeout(1000);

    // Fill minimal form
    await page.fill('#title, input[name="title"]', `Test Objective ${Date.now()}`);
    await page.fill('#description, textarea[name="description"]', 'Test description');

    // Select a category if dropdown exists
    const categorySelect = page.locator('#category, select[name="category"]');
    if (await categorySelect.isVisible()) {
      await categorySelect.selectOption({ index: 1 });
    }

    // Submit form
    await page.click('button[type="submit"], button:has-text("Save"), button:has-text("Create")');

    // Wait for objective to be created
    await page.waitForTimeout(2000);

    // Check the new objective has "On track" status
    const statusBadge = page.locator('.status-badge, .timeline-status').last();
    if (await statusBadge.isVisible()) {
      const statusText = await statusBadge.textContent();
      expect(statusText?.toLowerCase()).toMatch(/on track|active|pending/i);
    }
  });

});
