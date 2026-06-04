/**
 * Sprint 13 Epic X: Unified LLM Context Service E2E Tests
 *
 * Test Coverage:
 * - X1-X4: Context Service (code structure validation)
 * - X5-X7: LLM History & Learning (model/API validation)
 * - X8-X10: AI-Powered Planning Features (UI element validation)
 *
 * These tests verify the Epic X implementation exists and is properly structured.
 * For full E2E testing with authenticated users, run with seeded test data.
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Test configuration
// Use development environment by default for E2E tests
const BASE_URL = process.env.BASE_URL || 'https://karvia-business-1.onrender.com';
const PROJECT_ROOT = path.resolve(__dirname, '../../../../../../../');

// ============================================
// TEST SUITE: CODE STRUCTURE VALIDATION
// ============================================

test.describe('Sprint 13 Epic X: Code Structure Validation', () => {

  // ========================================
  // X1-X4: CONTEXT SERVICE FILES
  // ========================================

  test.describe('X1-X4: AIContextService Implementation', () => {

    test('X1: AIContextService file exists', async () => {
      const servicePath = path.join(PROJECT_ROOT, 'server/services/AIContextService.js');
      expect(fs.existsSync(servicePath)).toBeTruthy();
    });

    test('X2: AIContextService has buildContext method', async () => {
      const servicePath = path.join(PROJECT_ROOT, 'server/services/AIContextService.js');
      const content = fs.readFileSync(servicePath, 'utf-8');
      expect(content).toContain('buildContext');
      expect(content).toContain('async buildContext');
    });

    test('X3: AIContextService has getContextDelta method', async () => {
      const servicePath = path.join(PROJECT_ROOT, 'server/services/AIContextService.js');
      const content = fs.readFileSync(servicePath, 'utf-8');
      expect(content).toContain('getContextDelta');
    });

    test('X4: AIContextService has token budget management', async () => {
      const servicePath = path.join(PROJECT_ROOT, 'server/services/AIContextService.js');
      const content = fs.readFileSync(servicePath, 'utf-8');
      // Check for token budget related code
      expect(content).toMatch(/token|budget|MAX_TOKENS|8000/i);
    });

    test('X1-X4: AIContextService has all required methods', async () => {
      const servicePath = path.join(PROJECT_ROOT, 'server/services/AIContextService.js');
      const content = fs.readFileSync(servicePath, 'utf-8');

      // Core methods required for Epic X
      const requiredMethods = [
        'getFullSSIScores',
        'buildContext',
        'getContextDelta',
        'getTaskHistory',
        'logInteraction',
        'getRejectionHistory',
        'getAIPerformanceStats',
        'getActiveObjectives',
        'getTeamStructure'
      ];

      for (const method of requiredMethods) {
        expect(content).toContain(method);
      }
    });
  });

  // ========================================
  // X5-X7: LLM HISTORY MODEL
  // ========================================

  test.describe('X5-X7: AIInteractionLog Model', () => {

    test('X5: AIInteractionLog model file exists', async () => {
      const modelPath = path.join(PROJECT_ROOT, 'server/models/AIInteractionLog.js');
      expect(fs.existsSync(modelPath)).toBeTruthy();
    });

    test('X6: AIInteractionLog has rejection tracking fields', async () => {
      const modelPath = path.join(PROJECT_ROOT, 'server/models/AIInteractionLog.js');
      const content = fs.readFileSync(modelPath, 'utf-8');
      // Uses outcome.rejection_reasons array
      expect(content).toContain('rejection_reasons');
      expect(content).toContain('outcome');
    });

    test('X7: AIInteractionLog has context snapshot field', async () => {
      const modelPath = path.join(PROJECT_ROOT, 'server/models/AIInteractionLog.js');
      const content = fs.readFileSync(modelPath, 'utf-8');
      expect(content).toContain('context_snapshot');
    });

    test('X5-X7: AIInteractionLog has all required fields', async () => {
      const modelPath = path.join(PROJECT_ROOT, 'server/models/AIInteractionLog.js');
      const content = fs.readFileSync(modelPath, 'utf-8');

      const requiredFields = [
        'company_id',
        'user_id',
        'interaction_type',
        'prompt',
        'response',
        'outcome',           // Contains rejection_reasons, items_approved, etc.
        'context_snapshot',
        'tokens_used'
      ];

      for (const field of requiredFields) {
        expect(content).toContain(field);
      }
    });
  });

  // ========================================
  // X8: TASK GENERATION API
  // ========================================

  test.describe('X8: Task Generation Endpoint', () => {

    test('X8: Planning routes file exists', async () => {
      const routePath = path.join(PROJECT_ROOT, 'server/routes/planning.js');
      expect(fs.existsSync(routePath)).toBeTruthy();
    });

    test('X8: Planning routes has generate-tasks endpoint', async () => {
      const routePath = path.join(PROJECT_ROOT, 'server/routes/planning.js');
      const content = fs.readFileSync(routePath, 'utf-8');
      expect(content).toContain('generate-tasks');
    });

    test('X8: AIContextService is imported in planning routes', async () => {
      const routePath = path.join(PROJECT_ROOT, 'server/routes/planning.js');
      const content = fs.readFileSync(routePath, 'utf-8');
      expect(content).toContain('AIContextService');
    });
  });

  // ========================================
  // X9: FRONTEND AI INTEGRATION
  // ========================================

  test.describe('X9: Frontend AI Integration', () => {

    test('X9: planning-v2.js file exists', async () => {
      const scriptPath = path.join(PROJECT_ROOT, 'client/pages/scripts/planning-v2.js');
      expect(fs.existsSync(scriptPath)).toBeTruthy();
    });

    test('X9: planning-v2.js has generate tasks functionality', async () => {
      const scriptPath = path.join(PROJECT_ROOT, 'client/pages/scripts/planning-v2.js');
      const content = fs.readFileSync(scriptPath, 'utf-8');
      expect(content).toMatch(/generate.*task|task.*generat/i);
    });

    test('X9: planning-v2.js handles loading states', async () => {
      const scriptPath = path.join(PROJECT_ROOT, 'client/pages/scripts/planning-v2.js');
      const content = fs.readFileSync(scriptPath, 'utf-8');
      expect(content).toMatch(/loading|isGenerating|disabled/i);
    });
  });

  // ========================================
  // X10: WEEKLY GOAL ASSIGNMENT
  // ========================================

  test.describe('X10: Weekly Goal Assignment', () => {

    test('X10: planning-v2.js has assignment dropdown functionality', async () => {
      const scriptPath = path.join(PROJECT_ROOT, 'client/pages/scripts/planning-v2.js');
      const content = fs.readFileSync(scriptPath, 'utf-8');
      expect(content).toContain('assignWeeklyGoal');
      expect(content).toContain('showAssignmentDropdown');
      expect(content).toContain('fetchTeamMembers');
    });

    test('X10: planning-v2.html has assignment dropdown CSS', async () => {
      const htmlPath = path.join(PROJECT_ROOT, 'client/pages/planning-v2.html');
      const content = fs.readFileSync(htmlPath, 'utf-8');
      expect(content).toContain('assignment-dropdown');
      expect(content).toContain('week-owner');
    });

    test('X10: goals.js has owner_id update support', async () => {
      const routePath = path.join(PROJECT_ROOT, 'server/routes/goals.js');
      const content = fs.readFileSync(routePath, 'utf-8');
      expect(content).toContain('owner_id');
    });

    test('X10: goals.js has RBAC for reassignment', async () => {
      const routePath = path.join(PROJECT_ROOT, 'server/routes/goals.js');
      const content = fs.readFileSync(routePath, 'utf-8');
      // Check for role-based access control on reassignment
      expect(content).toMatch(/MANAGER|CONSULTANT|BUSINESS_OWNER|EXECUTIVE/);
      expect(content).toMatch(/reassign|canReassign/i);
    });
  });
});

// ============================================
// TEST SUITE: API ENDPOINT VALIDATION
// ============================================

test.describe('Epic X: API Endpoint Availability', () => {

  test('Health endpoint is available', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/health`);
    expect(response.status()).toBeLessThan(500);
  });

  test('API endpoints return proper error for unauthorized access', async ({ request }) => {
    // Test that protected endpoints require authentication
    const endpoints = [
      '/api/planning/generate-tasks',
      '/api/users',
      '/api/goals/weekly'
    ];

    for (const endpoint of endpoints) {
      const response = await request.get(`${BASE_URL}${endpoint}`);
      // Should return 401/403 for unauthorized, not 500
      expect([401, 403, 404, 405]).toContain(response.status());
    }
  });
});

// ============================================
// TEST SUITE: UI ELEMENT VALIDATION
// ============================================

test.describe('Epic X: UI Element Validation', () => {

  test('Login page loads correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/pages/login.html`);

    // Verify login form elements exist
    await expect(page.locator('input[name="email"], #email, input[type="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"], #password, input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Planning page HTML structure is correct', async () => {
    const htmlPath = path.join(PROJECT_ROOT, 'client/pages/planning-v2.html');
    const content = fs.readFileSync(htmlPath, 'utf-8');

    // Verify key UI elements are in the HTML
    expect(content).toContain('planning-v2.js'); // Script loaded
    expect(content).toContain('week-card'); // Week cards
    expect(content).toContain('assignment-dropdown'); // Assignment dropdown CSS
  });
});

// ============================================
// TEST SUITE: INTEGRATION VALIDATION
// ============================================

test.describe('Epic X: Integration Points', () => {

  test('Server index.js loads planning routes', async () => {
    const indexPath = path.join(PROJECT_ROOT, 'server/index.js');
    const content = fs.readFileSync(indexPath, 'utf-8');
    expect(content).toContain('planning');
    expect(content).toContain("require('./routes/planning')");
  });

  test('AIContextService is exported correctly', async () => {
    const servicePath = path.join(PROJECT_ROOT, 'server/services/AIContextService.js');
    const content = fs.readFileSync(servicePath, 'utf-8');
    expect(content).toContain('module.exports');
  });

  test('AIInteractionLog is exported correctly', async () => {
    const modelPath = path.join(PROJECT_ROOT, 'server/models/AIInteractionLog.js');
    const content = fs.readFileSync(modelPath, 'utf-8');
    expect(content).toContain('module.exports');
  });
});
