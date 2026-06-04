#!/usr/bin/env node

/**
 * Simple Atlas browser automation harness using Playwright.
 * Runs a curated list of scenarios (login, cluster check, data explorer, collection view).
 */

const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');
const dotenvPath = path.join(__dirname, '.env');
if (fs.existsSync(dotenvPath)) {
  require('dotenv').config({ path: dotenvPath });
} else {
  require('dotenv').config();
}

const CONFIG = {
  email: process.env.ATLAS_EMAIL,
  password: process.env.ATLAS_PASSWORD,
  projectName: process.env.ATLAS_PROJECT_NAME || '',
  clusterName: process.env.ATLAS_CLUSTER_NAME || '',
  databaseName: process.env.ATLAS_DATABASE_NAME || '',
  collectionName: process.env.ATLAS_COLLECTION_NAME || '',
  baseUrl: process.env.ATLAS_BASE_URL || 'https://account.mongodb.com',
  timeout: Number(process.env.ATLAS_TIMEOUT_MS || 45000),
  headless: process.env.ATLAS_HEADLESS !== 'false',
};

if (!CONFIG.email || !CONFIG.password) {
  console.error('❌ Missing ATLAS_EMAIL or ATLAS_PASSWORD environment variables.');
  process.exit(1);
}

const REPORT_DIR = path.join(__dirname, 'reports');
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

const scenarios = [
  {
    id: 'project-dashboard',
    name: 'Project dashboard loads',
    run: async (page) => {
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('text=Clusters', { timeout: CONFIG.timeout });
      if (CONFIG.projectName) {
        await page.waitForSelector(`text=${CONFIG.projectName}`, { timeout: CONFIG.timeout });
      }
    },
  },
  {
    id: 'cluster-health',
    name: 'Cluster health panel',
    run: async (page) => {
      if (!CONFIG.clusterName) {
        console.warn('⚠️  ATLAS_CLUSTER_NAME not set, skipping cluster-health scenario.');
        return;
      }
      await page.click(`text=${CONFIG.clusterName}`);
      await page.waitForSelector('text=Metrics', { timeout: CONFIG.timeout });
      await page.waitForTimeout(3_000);
    },
  },
  {
    id: 'data-explorer',
    name: 'Open Data Explorer',
    run: async (page) => {
      if (!CONFIG.clusterName) {
        console.warn('⚠️  ATLAS_CLUSTER_NAME not set, skipping data-explorer scenario.');
        return;
      }
      await page.click('text=Data Explorer', { timeout: CONFIG.timeout });
      await page.waitForSelector('text=Browse Collections', { timeout: CONFIG.timeout });
    },
  },
  {
    id: 'collection-view',
    name: 'Open target collection',
    run: async (page) => {
      if (!CONFIG.databaseName || !CONFIG.collectionName) {
        console.warn('⚠️  ATLAS_DATABASE_NAME or ATLAS_COLLECTION_NAME not set, skipping collection-view scenario.');
        return;
      }
      await page.click(`text=${CONFIG.databaseName}`);
      await page.click(`text=${CONFIG.collectionName}`);
      await page.waitForSelector('text=Documents', { timeout: CONFIG.timeout });
      await page.waitForTimeout(1_000);
    },
  },
];

const filterArg = process.argv.find((arg) => arg.startsWith('--scenario='));
const allowedScenarioIds = filterArg ? filterArg.split('=')[1].split(',').map((id) => id.trim()) : null;
const selectedScenarios = allowedScenarioIds
  ? scenarios.filter((scenario) => allowedScenarioIds.includes(scenario.id))
  : scenarios;

async function login(page) {
  const loginUrl = `${CONFIG.baseUrl}/account/login`;
  console.log(`🔐 Navigating to ${loginUrl}`);
  await page.goto(loginUrl, { waitUntil: 'load', timeout: CONFIG.timeout });
  await page.waitForSelector('input[name="email"]', { timeout: CONFIG.timeout });
  await page.fill('input[name="email"]', CONFIG.email);
  await page.click('button[type="submit"]');
  await page.waitForSelector('input[name="password"]', { timeout: CONFIG.timeout });
  await page.fill('input[name="password"]', CONFIG.password);
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('text=Projects', { timeout: CONFIG.timeout }).catch(() => undefined);
  console.log('✅ Logged into MongoDB Atlas');
}

async function runScenario(page, scenario) {
  const start = Date.now();
  try {
    console.log(`▶️  ${scenario.name}`);
    await scenario.run(page);
    const duration = Date.now() - start;
    console.log(`✅ ${scenario.id} completed in ${duration}ms`);
    return { id: scenario.id, status: 'passed', duration };
  } catch (error) {
    const duration = Date.now() - start;
    const screenshotPath = path.join(REPORT_DIR, `${scenario.id}-${Date.now()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => undefined);
    console.error(`❌ ${scenario.id} failed after ${duration}ms`);
    console.error(error.message);
    return { id: scenario.id, status: 'failed', duration, error, screenshotPath };
  }
}

(async () => {
  const browser = await chromium.launch({ headless: CONFIG.headless });
  const context = await browser.newContext();
  const page = await context.newPage();
  const results = [];
  try {
    await login(page);
    for (const scenario of selectedScenarios) {
      const result = await runScenario(page, scenario);
      results.push(result);
      if (result.status === 'failed') {
        console.error(`Stopping suite because scenario ${scenario.id} failed.`);
        break;
      }
    }
  } catch (error) {
    console.error('Suite crashed:');
    console.error(error);
    process.exitCode = 1;
  } finally {
    await browser.close();
    const summaryPath = path.join(REPORT_DIR, `atlas-suite-${Date.now()}.json`);
    fs.writeFileSync(summaryPath, JSON.stringify({ timestamp: new Date().toISOString(), results }, null, 2));
    const hasFailures = results.some((result) => result.status === 'failed');
    if (hasFailures) {
      console.error(`❌ Atlas suite finished with failures. See ${summaryPath}`);
      process.exitCode = 1;
    } else {
      console.log(`🎉 Atlas suite finished successfully. Report saved to ${summaryPath}`);
    }
  }
})();
