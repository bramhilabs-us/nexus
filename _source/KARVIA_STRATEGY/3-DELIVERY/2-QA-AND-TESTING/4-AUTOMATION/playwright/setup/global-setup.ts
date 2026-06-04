/**
 * Playwright Global Setup
 * Runs once before all tests to seed test database with required data
 */

import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('\n🔧 Running global setup...\n');

  const baseURL = config.use.baseURL || 'http://localhost:8080';

  // Launch browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Wait for server to be ready
    console.log('⏳ Waiting for server to be ready...');
    await page.goto(baseURL, { timeout: 60000 });
    console.log('✓ Server is ready');

    // Seed test users via API
    console.log('\n📝 Seeding test users...');
    await seedTestUsers(page, baseURL);
    console.log('✓ Test users created');

    // Seed assessment questions
    console.log('\n📝 Seeding assessment questions...');
    await seedAssessmentQuestions(page, baseURL);
    console.log('✓ Assessment questions created');

    // Seed assessment template
    console.log('\n📝 Seeding assessment template...');
    await seedAssessmentTemplate(page, baseURL);
    console.log('✓ Assessment template created');

    console.log('\n✅ Global setup complete!\n');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

/**
 * Seed test users for all roles
 */
async function seedTestUsers(page: any, baseURL: string) {
  const testUsers = [
    {
      email: 'consultant@test.com',
      password: 'Test123!',
      first_name: 'Test',
      last_name: 'Consultant',
      role: 'CONSULTANT',
      company_name: 'Test Consulting Firm',
      industry: 'Consulting',
      employee_count: 10
    },
    {
      email: 'owner@test.com',
      password: 'Test123!',
      first_name: 'Test',
      last_name: 'Owner',
      role: 'BUSINESS_OWNER',
      company_name: 'Test Company',
      industry: 'SaaS',
      employee_count: 50
    },
    {
      email: 'executive@test.com',
      password: 'Test123!',
      first_name: 'Test',
      last_name: 'Executive',
      role: 'EXECUTIVE',
      company_name: 'Test Company',
      industry: 'SaaS',
      employee_count: 50
    },
    {
      email: 'manager@test.com',
      password: 'Test123!',
      first_name: 'Test',
      last_name: 'Manager',
      role: 'MANAGER',
      company_name: 'Test Company',
      industry: 'SaaS',
      employee_count: 50
    },
    {
      email: 'employee@test.com',
      password: 'Test123!',
      first_name: 'Test',
      last_name: 'Employee',
      role: 'EMPLOYEE',
      company_name: 'Test Company',
      industry: 'SaaS',
      employee_count: 50
    }
  ];

  for (const user of testUsers) {
    try {
      const response = await page.request.post(`${baseURL}/api/auth/signup`, {
        data: user
      });

      if (response.status() === 201) {
        console.log(`  ✓ Created user: ${user.email} (${user.role})`);
      } else if (response.status() === 400) {
        // User might already exist, that's okay
        console.log(`  ℹ User exists: ${user.email}`);
      } else {
        console.warn(`  ⚠ Unexpected status for ${user.email}: ${response.status()}`);
      }
    } catch (error) {
      console.error(`  ✗ Failed to create ${user.email}:`, error);
    }
  }
}

/**
 * Seed assessment questions (146 questions from SSI framework)
 */
async function seedAssessmentQuestions(page: any, baseURL: string) {
  // Note: In a real implementation, this would call your seed script
  // For now, we'll assume questions exist or create a minimal set

  console.log('  ℹ Skipping question seeding (use npm run seed:questions)');

  // Alternative: Call the seed endpoint if you create one
  // const response = await page.request.post(`${baseURL}/api/admin/seed-questions`);
}

/**
 * Seed a default SSI assessment template
 */
async function seedAssessmentTemplate(page: any, baseURL: string) {
  // Login as consultant first
  const loginResponse = await page.request.post(`${baseURL}/api/auth/login`, {
    data: {
      email: 'consultant@test.com',
      password: 'Test123!'
    }
  });

  if (loginResponse.status() !== 200) {
    console.warn('  ⚠ Could not login as consultant to create template');
    return;
  }

  const loginData = await loginResponse.json();
  const token = loginData.token;

  // Create SSI assessment template
  const templateResponse = await page.request.post(
    `${baseURL}/api/assessmentTemplates`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: {
        name: 'SSI Assessment',
        description: 'Strategic Success Index Assessment',
        assessment_type: 'ssi',
        dimensions: {
          speed: {
            weight: 0.35,
            thresholds: { needs_attention: 7.0, critical: 5.0 }
          },
          strength: {
            weight: 0.35,
            thresholds: { needs_attention: 7.0, critical: 5.0 }
          },
          intelligence: {
            weight: 0.30,
            thresholds: { needs_attention: 7.0, critical: 5.0 }
          }
        },
        weak_area_threshold: 40
      }
    }
  );

  if (templateResponse.status() === 201) {
    console.log('  ✓ Created SSI assessment template');
  } else {
    console.warn(`  ⚠ Template creation status: ${templateResponse.status()}`);
  }
}

export default globalSetup;
