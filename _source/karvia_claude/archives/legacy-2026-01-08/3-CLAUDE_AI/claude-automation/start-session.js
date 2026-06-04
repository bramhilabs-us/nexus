#!/usr/bin/env node

/**
 * Claude Session Start Script
 * Automatically gathers context and prepares environment for new session
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

// Configuration
const PROJECT_ROOT = path.join(__dirname, '../..');  // Updated: Now inside .claude/claude-automation
const SESSION_MGMT_PATH = path.join(PROJECT_ROOT, 'KARVIA_STRATEGY/3-DELIVERY/handoffs/SESSION_MANAGEMENT');
const ACTIVE_SESSION_PATH = path.join(SESSION_MGMT_PATH, 'ACTIVE_SESSION.md');
const CLAUDE_PATH = path.join(__dirname, '..');  // Updated: Parent directory is .claude

// Session data
const sessionData = {
  sessionId: `SESSION-${new Date().toISOString().replace(/[:.]/g, '-')}`,
  startTime: new Date().toISOString(),
  environment: {},
  context: {
    immediate: [],
    sprint: [],
    project: []
  },
  metrics: {
    previousSession: null,
    targets: {}
  },
  checks: {
    environment: false,
    server: false,
    git: false,
    activeSession: false
  }
};

// Utility functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'bright');
  console.log('='.repeat(60));
}

function executeCommand(command, silent = false) {
  try {
    const result = execSync(command, { encoding: 'utf8', stdio: silent ? 'pipe' : 'inherit' });
    return result;
  } catch (error) {
    return null;
  }
}

// Check functions
function checkActiveSession() {
  logSection('📋 CHECKING ACTIVE SESSION');

  if (fs.existsSync(ACTIVE_SESSION_PATH)) {
    const content = fs.readFileSync(ACTIVE_SESSION_PATH, 'utf8');

    // Extract key information
    const sessionIdMatch = content.match(/Session ID: (SESSION-[\d-T]+)/);
    const progressMatch = content.match(/Overall Progress: (\d+%)/);
    const currentTaskMatch = content.match(/TASK: (.+)\nSTATUS: (.+)/);

    log('✅ Active session found', 'green');

    if (sessionIdMatch) {
      log(`   Previous Session: ${sessionIdMatch[1]}`, 'cyan');
      sessionData.metrics.previousSession = sessionIdMatch[1];
    }

    if (progressMatch) {
      log(`   Overall Progress: ${progressMatch[1]}`, 'cyan');
    }

    if (currentTaskMatch) {
      log(`   Current Task: ${currentTaskMatch[1]}`, 'yellow');
      log(`   Status: ${currentTaskMatch[2]}`, 'yellow');
    }

    sessionData.checks.activeSession = true;
    sessionData.context.immediate.push(ACTIVE_SESSION_PATH);

    // Display immediate next actions
    const nextActionsMatch = content.match(/### Immediate \(Next 30 minutes\)\n([\s\S]*?)### Session Goals/);
    if (nextActionsMatch) {
      log('\n📍 IMMEDIATE NEXT ACTIONS:', 'bright');
      console.log(nextActionsMatch[1].trim());
    }

    return true;
  } else {
    log('⚠️  No active session found - starting fresh', 'yellow');
    return false;
  }
}

function checkEnvironment() {
  logSection('🔧 CHECKING ENVIRONMENT');

  // Check Node.js version
  const nodeVersion = process.version;
  log(`Node.js: ${nodeVersion}`, 'cyan');

  // Check if .env exists
  const envPath = path.join(PROJECT_ROOT, '.env');
  if (fs.existsSync(envPath)) {
    log('✅ .env file found', 'green');
    sessionData.environment.envFile = true;
  } else {
    log('⚠️  .env file not found', 'yellow');
    sessionData.environment.envFile = false;
  }

  // Run Claude verification if available
  const verifyScriptPath = path.join(CLAUDE_PATH, 'verify-environment.js');
  if (fs.existsSync(verifyScriptPath)) {
    log('\nRunning environment verification...', 'cyan');
    const result = executeCommand(`node ${verifyScriptPath}`, true);
    if (result && result.includes('Success')) {
      log('✅ Environment verification passed', 'green');
      sessionData.checks.environment = true;
    } else {
      log('⚠️  Environment verification failed', 'yellow');
    }
  }

  return sessionData.checks.environment;
}

function checkServerStatus() {
  logSection('🚀 CHECKING SERVER STATUS');

  try {
    const healthCheck = executeCommand('curl -s http://localhost:8080/api/health', true);
    if (healthCheck) {
      log('✅ Server is running on port 8080', 'green');
      sessionData.checks.server = true;
    } else {
      log('⚠️  Server not responding', 'yellow');
      log('   Run: npm start', 'cyan');
    }
  } catch (error) {
    log('❌ Server is not running', 'red');
    log('   Run: npm start', 'cyan');
  }

  return sessionData.checks.server;
}

function checkGitStatus() {
  logSection('📦 CHECKING GIT STATUS');

  try {
    const branch = executeCommand('git branch --show-current', true).trim();
    const status = executeCommand('git status --short', true);

    log(`Current Branch: ${branch}`, 'cyan');
    sessionData.environment.gitBranch = branch;

    if (status) {
      const lines = status.split('\n').filter(l => l.trim());
      log(`Uncommitted Changes: ${lines.length} files`, 'yellow');

      if (lines.length > 0) {
        log('\nChanged files:', 'yellow');
        lines.slice(0, 5).forEach(line => console.log(`   ${line}`));
        if (lines.length > 5) {
          console.log(`   ... and ${lines.length - 5} more`);
        }
      }
    } else {
      log('✅ Working directory clean', 'green');
    }

    sessionData.checks.git = true;
  } catch (error) {
    log('⚠️  Not a git repository', 'yellow');
  }

  return sessionData.checks.git;
}

function gatherContext() {
  logSection('📚 GATHERING CONTEXT');

  // Immediate context (already loaded from active session)
  log('\n1. Immediate Context:', 'bright');
  sessionData.context.immediate.forEach(file => {
    log(`   ✓ ${path.basename(file)}`, 'green');
  });

  // Sprint context
  log('\n2. Sprint Context:', 'bright');
  const sprintDocs = [
    'KARVIA_STRATEGY/3-DELIVERY/MASTER_DEV_LIST.md',
    'KARVIA_STRATEGY/3-DELIVERY/MASTER_ISSUES_LIST.md',
    'KARVIA_STRATEGY/3-DELIVERY/MASTER_DEVELOPMENT_PLAN.md'
  ];

  sprintDocs.forEach(doc => {
    const fullPath = path.join(PROJECT_ROOT, doc);
    if (fs.existsSync(fullPath)) {
      sessionData.context.sprint.push(fullPath);
      log(`   ✓ ${path.basename(doc)}`, 'green');
    }
  });

  // Project context
  log('\n3. Project Context (Reference Only):', 'bright');
  const projectDocs = [
    'KARVIA_STRATEGY/1-PRODUCT/SYSTEM_OVERVIEW.md',
    'KARVIA_STRATEGY/1-PRODUCT/PRODUCT_ARCHITECTURE.md',
    'KARVIA_STRATEGY/1-PRODUCT/FEATURE_CATALOG.md'
  ];

  projectDocs.forEach(doc => {
    const fullPath = path.join(PROJECT_ROOT, doc);
    if (fs.existsSync(fullPath)) {
      sessionData.context.project.push(fullPath);
      log(`   ✓ ${path.basename(doc)}`, 'cyan');
    }
  });
}

function loadPerformanceTargets() {
  logSection('📊 LOADING PERFORMANCE TARGETS');

  const metricsPath = path.join(SESSION_MGMT_PATH, 'PERFORMANCE_METRICS.md');

  if (fs.existsSync(metricsPath)) {
    const content = fs.readFileSync(metricsPath, 'utf8');

    // Extract current metrics
    const cerMatch = content.match(/CER Score: (\d+)%/);
    const tcvMatch = content.match(/TCV Score: ([\d.]+)/);
    const tesMatch = content.match(/TES Score: ([\d.]+)/);
    const raiMatch = content.match(/RAI Score: (\d+)%/);

    log('Current Performance:', 'bright');
    if (cerMatch) log(`   CER: ${cerMatch[1]}% (Target: >85%)`, 'cyan');
    if (tcvMatch) log(`   TCV: ${tcvMatch[1]} (Target: 0.9-1.1)`, 'cyan');
    if (tesMatch) log(`   TES: ${tesMatch[1]} (Target: >0.60)`, 'cyan');
    if (raiMatch) log(`   RAI: ${raiMatch[1]}% (Target: >85%)`, 'cyan');

    sessionData.metrics.targets = {
      CER: 85,
      TCV: 0.90,
      TES: 0.60,
      RAI: 85
    };
  }
}

function generateSessionStartReport() {
  logSection('📝 GENERATING SESSION START REPORT');

  const reportPath = path.join(SESSION_MGMT_PATH, 'CURRENT_SESSION_START.md');

  const report = `# 🚀 Session Start Report

**Session ID**: ${sessionData.sessionId}
**Start Time**: ${sessionData.startTime}
**Previous Session**: ${sessionData.metrics.previousSession || 'None'}

## ✅ Environment Checks

- Active Session: ${sessionData.checks.activeSession ? '✅' : '❌'}
- Environment: ${sessionData.checks.environment ? '✅' : '⚠️'}
- Server: ${sessionData.checks.server ? '✅' : '❌'}
- Git: ${sessionData.checks.git ? '✅' : '⚠️'}

## 📚 Context Loaded

### Immediate (${sessionData.context.immediate.length} files)
${sessionData.context.immediate.map(f => `- ${path.basename(f)}`).join('\n')}

### Sprint (${sessionData.context.sprint.length} files)
${sessionData.context.sprint.map(f => `- ${path.basename(f)}`).join('\n')}

### Project (${sessionData.context.project.length} files - reference only)
${sessionData.context.project.map(f => `- ${path.basename(f)}`).join('\n')}

## 📊 Performance Targets

- CER: >85% (Context Efficiency)
- TCV: 0.9-1.1 (Task Velocity)
- TES: >0.60 (Token Efficiency)
- RAI: >85% (Resolution Accuracy)

## 🎯 Quick Commands

\`\`\`bash
# Continue work
cd ${PROJECT_ROOT}

# Check active session
cat KARVIA_STRATEGY/3-DELIVERY/handoffs/SESSION_MANAGEMENT/ACTIVE_SESSION.md

# Run tests
npm test

# Check server
curl http://localhost:8080/api/health
\`\`\`

## 📋 Remember

1. Check ACTIVE_SESSION.md for immediate tasks
2. Use existing code as templates
3. Commit frequently
4. Update metrics hourly
5. Run end-session.js when stopping

---

**Session Ready**: ${new Date().toLocaleTimeString()}
`;

  fs.writeFileSync(reportPath, report);
  log(`\n✅ Session start report saved to:`, 'green');
  log(`   ${reportPath}`, 'cyan');
}

function displayQuickStart() {
  logSection('🎯 QUICK START GUIDE');

  log('Your session is ready! Here\'s what to do:', 'bright');

  console.log(`
${colors.cyan}1. Check immediate tasks:${colors.reset}
   cat ${ACTIVE_SESSION_PATH}

${colors.cyan}2. Navigate to working directory:${colors.reset}
   cd ${PROJECT_ROOT}

${colors.cyan}3. Continue where you left off:${colors.reset}
   Check ACTIVE_SESSION.md for specific file and line numbers

${colors.cyan}4. When ending session:${colors.reset}
   node claude-automation/end-session.js

${colors.yellow}Performance Tips:${colors.reset}
- Load only needed context (saves 30% tokens)
- Use templates from existing code (saves 40% time)
- Batch similar operations (saves 15% tokens)
- Test incrementally (improves RAI score)
`);
}

// Main execution
async function main() {
  console.clear();
  log('🤖 CLAUDE SESSION INITIALIZATION', 'bright');
  log(`Starting session: ${sessionData.sessionId}`, 'cyan');

  // Run all checks
  checkActiveSession();
  checkEnvironment();
  checkServerStatus();
  checkGitStatus();
  gatherContext();
  loadPerformanceTargets();
  generateSessionStartReport();
  displayQuickStart();

  // Final status
  logSection('✅ SESSION READY');

  const allChecks = Object.values(sessionData.checks).every(check => check);
  if (allChecks) {
    log('All systems operational - you can begin work!', 'green');
  } else {
    log('Some checks failed - review warnings above', 'yellow');
  }

  log(`\nSession ID: ${sessionData.sessionId}`, 'bright');
  log('Happy coding! 🚀\n', 'cyan');
}

// Run the script
main().catch(error => {
  log(`\n❌ Error during session start: ${error.message}`, 'red');
  process.exit(1);
});