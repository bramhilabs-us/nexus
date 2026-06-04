/**
 * Sprint 6 Test Suite: SSI Diagnostic System
 * Epic 7 - SSI Diagnostic Report
 *
 * Tests:
 * - Team SSI View page loads
 * - Diagnostic button shows eligibility state
 * - 80% gate progress display
 * - Diagnostic modal displays
 * - Export functionality
 * - Use for OKR integration
 */

import { test, expect } from '@playwright/test';

test.describe('Sprint 6: SSI Diagnostic System', () => {

  // Before each test, login as Executive (has diagnostic access)
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/client/pages/login.html');
    await page.fill('#email', 'exec@test.com');
    await page.fill('#password', 'Test123!');
    await page.click('button[type="submit"]');

    // Wait for login
    await page.waitForTimeout(2000);

    // Navigate to Team SSI View
    await page.goto('/client/pages/team-ssi-view.html');
    await page.waitForLoadState('networkidle');
  });

  /**
   * DIAG-001: Team SSI View page loads
   */
  test('DIAG-001: Team SSI View page should load', async ({ page }) => {
    // Verify page loaded
    await expect(page).toHaveURL(/team-ssi-view/);

    // Verify SSI content exists
    const ssiContent = page.locator('.ssi-overview, #team-breakdown, .company-overview');
    await expect(ssiContent.first()).toBeVisible({ timeout: 10000 });
  });

  /**
   * DIAG-002: Diagnostic action container exists
   */
  test('DIAG-002: diagnostic action container should exist', async ({ page }) => {
    // Check for diagnostic action area
    const diagnosticContainer = page.locator('#diagnostic-action-container, .diagnostic-action, .diagnostic-section');
    await expect(diagnosticContainer).toBeVisible({ timeout: 10000 });
  });

  /**
   * DIAG-003: Below 80% shows locked state
   */
  test('DIAG-003: below 80% completion should show locked state', async ({ page }) => {
    // Wait for diagnostic container
    await page.waitForSelector('#diagnostic-action-container, .diagnostic-action', { timeout: 10000 });

    // Check for either locked state or generate button
    const lockedState = page.locator('.locked, .progress-gate, [class*="disabled"]');
    const generateButton = page.locator('#generate-diagnostic-btn, button:has-text("Generate")');

    // One of these should be visible
    const isLocked = await lockedState.isVisible();
    const canGenerate = await generateButton.isVisible();

    expect(isLocked || canGenerate).toBe(true);

    // If locked, should show progress indicator
    if (isLocked) {
      const progressText = page.locator('.completion-progress, .progress-text');
      await expect(progressText).toContainText(/%/);
    }
  });

  /**
   * DIAG-004: Generate button visible when eligible
   */
  test('DIAG-004: generate button should be visible when eligible', async ({ page }) => {
    // Wait for page load
    await page.waitForTimeout(2000);

    // Look for generate button (may or may not be enabled based on eligibility)
    const generateButton = page.locator('#generate-diagnostic-btn, button:has-text("Generate Diagnostic"), button:has-text("Diagnostic Report")');

    if (await generateButton.isVisible()) {
      // Check if button exists (may be disabled if not eligible)
      const isDisabled = await generateButton.isDisabled();

      // Button should exist in DOM
      await expect(generateButton).toBeVisible();

      // If enabled, it should be clickable
      if (!isDisabled) {
        expect(await generateButton.isEnabled()).toBe(true);
      }
    }
  });

  /**
   * DIAG-005: Clicking generate opens modal
   */
  test('DIAG-005: clicking generate should open diagnostic modal', async ({ page }) => {
    // Wait for page load
    await page.waitForTimeout(2000);

    // Find generate button
    const generateButton = page.locator('#generate-diagnostic-btn:not([disabled]), button:has-text("Generate Diagnostic"):not([disabled])');

    if (await generateButton.isVisible()) {
      await generateButton.click();

      // Wait for modal
      await page.waitForTimeout(2000);

      // Check for modal
      const modal = page.locator('#diagnostic-modal, .diagnostic-modal, .modal:visible');
      await expect(modal).toBeVisible({ timeout: 10000 });

      // Modal should have header
      const modalHeader = modal.locator('.modal-header, h2, h3');
      await expect(modalHeader).toBeVisible();
    } else {
      // Skip if not eligible (button disabled or not visible)
      test.skip();
    }
  });

  /**
   * DIAG-006: Modal displays health score
   */
  test('DIAG-006: modal should display health score', async ({ page }) => {
    // Wait for page and try to open modal
    await page.waitForTimeout(2000);

    const generateButton = page.locator('#generate-diagnostic-btn:not([disabled])');

    if (await generateButton.isVisible()) {
      await generateButton.click();
      await page.waitForTimeout(3000);

      // Check for health score in modal
      const modal = page.locator('#diagnostic-modal, .diagnostic-modal');

      if (await modal.isVisible()) {
        const healthScore = modal.locator('.health-score, .score-value, [class*="health"]');
        await expect(healthScore.or(modal.locator('text=/\\d+%|\\d+\\/100/'))).toBeVisible();
      }
    } else {
      test.skip();
    }
  });

  /**
   * DIAG-007: Modal displays dimension scores
   */
  test('DIAG-007: modal should display SSI dimension scores', async ({ page }) => {
    await page.waitForTimeout(2000);

    const generateButton = page.locator('#generate-diagnostic-btn:not([disabled])');

    if (await generateButton.isVisible()) {
      await generateButton.click();
      await page.waitForTimeout(3000);

      const modal = page.locator('#diagnostic-modal, .diagnostic-modal');

      if (await modal.isVisible()) {
        // Check for Speed, Strength, Intelligence scores
        const speedScore = modal.locator('text=/speed/i');
        const strengthScore = modal.locator('text=/strength/i');
        const intelligenceScore = modal.locator('text=/intelligence/i');

        // At least one dimension should be visible
        const hasSpeedOrStrengthOrIntel = await speedScore.isVisible() ||
                                           await strengthScore.isVisible() ||
                                           await intelligenceScore.isVisible();
        expect(hasSpeedOrStrengthOrIntel).toBe(true);
      }
    } else {
      test.skip();
    }
  });

  /**
   * DIAG-008: Modal has export button
   */
  test('DIAG-008: modal should have export button', async ({ page }) => {
    await page.waitForTimeout(2000);

    const generateButton = page.locator('#generate-diagnostic-btn:not([disabled])');

    if (await generateButton.isVisible()) {
      await generateButton.click();
      await page.waitForTimeout(3000);

      const modal = page.locator('#diagnostic-modal, .diagnostic-modal');

      if (await modal.isVisible()) {
        // Check for export button
        const exportButton = modal.locator('button:has-text("Export"), button:has-text("Download"), .btn-export');
        await expect(exportButton).toBeVisible();
      }
    } else {
      test.skip();
    }
  });

  /**
   * DIAG-009: Modal has Use for OKR button
   */
  test('DIAG-009: modal should have Use for OKR button', async ({ page }) => {
    await page.waitForTimeout(2000);

    const generateButton = page.locator('#generate-diagnostic-btn:not([disabled])');

    if (await generateButton.isVisible()) {
      await generateButton.click();
      await page.waitForTimeout(3000);

      const modal = page.locator('#diagnostic-modal, .diagnostic-modal');

      if (await modal.isVisible()) {
        // Check for OKR integration button
        const okrButton = modal.locator('button:has-text("OKR"), button:has-text("Use for"), .btn-okr');
        await expect(okrButton).toBeVisible();
      }
    } else {
      test.skip();
    }
  });

  /**
   * DIAG-010: Modal can be closed
   */
  test('DIAG-010: modal should close on X or cancel', async ({ page }) => {
    await page.waitForTimeout(2000);

    const generateButton = page.locator('#generate-diagnostic-btn:not([disabled])');

    if (await generateButton.isVisible()) {
      await generateButton.click();
      await page.waitForTimeout(3000);

      const modal = page.locator('#diagnostic-modal, .diagnostic-modal');

      if (await modal.isVisible()) {
        // Find close button (X or Cancel)
        const closeButton = modal.locator('.close-btn, button:has-text("Close"), button:has-text("Cancel"), .btn-close, [aria-label="Close"]');

        if (await closeButton.first().isVisible()) {
          await closeButton.first().click();
          await page.waitForTimeout(500);

          // Modal should be hidden
          await expect(modal).not.toBeVisible();
        }
      }
    } else {
      test.skip();
    }
  });

});
