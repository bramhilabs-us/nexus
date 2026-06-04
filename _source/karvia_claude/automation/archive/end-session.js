#!/usr/bin/env node

/**
 * Claude Session End Script
 * Automatically updates handoffs, calculates metrics, and prepares for next session
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

// Configuration
const PROJECT_ROOT = path.join(__dirname, '../..');  // Updated: Now inside .claude/claude-automation
const SESSION_MGMT_PATH = path.join(PROJECT_ROOT, 'KARVIA_STRATEGY/3-DELIVERY/handoffs/SESSION_MANAGEMENT');
const ACTIVE_SESSION_PATH = path.join(SESSION_MGMT_PATH, 'ACTIVE_SESSION.md');
const CONFIG_PATH = path.join(PROJECT_ROOT, '.session-config.json');

// Parse command-line arguments
function parseArgs() {
  const args = {
    auto: false,
    duration: null,
    skipCommit: false,
    help: false
  };

  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg === '--auto' || arg === '-a') {
      args.auto = true;
    } else if (arg === '--duration' || arg === '-d') {
      args.duration = parseFloat(process.argv[++i]);
    } else if (arg === '--skip-commit') {
      args.skipCommit = true;
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    }
  }

  return args;
}

// Load config file if exists
function loadConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
      return config;
    } catch (error) {
      log('⚠️  Failed to parse .session-config.json', 'yellow');
      return {};
    }
  }
  return {};
}

const CLI_ARGS = parseArgs();
const CONFIG = loadConfig();
const AUTO_MODE = CLI_ARGS.auto || CONFIG.autoMode || process.env.SESSION_AUTO_MODE === 'true';

// Session metrics to collect
const sessionMetrics = {
  sessionId: null,
  startTime: null,
  endTime: new Date().toISOString(),
  duration: 0,
  tasks: {
    completed: [],
    inProgress: [],
    blocked: []
  },
  files: {
    created: [],
    modified: [],
    deleted: []
  },
  metrics: {
    CER: { value: 0, contextLoaded: 0, contextUsed: 0 },
    TCV: { value: 0, tasksPlanned: 0, tasksCompleted: 0 },
    TES: { value: 0, businessValue: 0, tokensUsed: 0 },
    RAI: { value: 0, firstAttempts: 0, totalAttempts: 0 }
  },
  nextSession: {
    priorities: [],
    blockers: [],
    context: []
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

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(`${colors.cyan}${question}${colors.reset} `, resolve);
  });
}

function askYesNo(question) {
  return new Promise(resolve => {
    rl.question(`${colors.cyan}${question} (y/n)${colors.reset} `, answer => {
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

// Auto-detection functions (git-based)
function getLastSessionTimestamp() {
  try {
    if (fs.existsSync(ACTIVE_SESSION_PATH)) {
      const content = fs.readFileSync(ACTIVE_SESSION_PATH, 'utf8');
      const match = content.match(/\*\*Last Update\*\*: (.+)/);
      if (match) {
        return new Date(match[1]).getTime();
      }
    }
  } catch (error) {
    // Fallback to git log
  }

  try {
    // Get timestamp of last session-related commit
    const lastCommit = execSync('git log -1 --format=%ct', { encoding: 'utf8', cwd: PROJECT_ROOT }).trim();
    return parseInt(lastCommit) * 1000;
  } catch (error) {
    // Fallback to 1 hour ago
    return Date.now() - (60 * 60 * 1000);
  }
}

function autoDetectDuration() {
  try {
    const lastSessionTime = getLastSessionTimestamp();
    const now = Date.now();
    const durationHours = (now - lastSessionTime) / (1000 * 60 * 60);

    // Cap at 8 hours for sanity
    return Math.min(durationHours, 8).toFixed(1);
  } catch (error) {
    return 1.0; // Default 1 hour
  }
}

function autoDetectTasks() {
  try {
    const lastSessionTime = getLastSessionTimestamp();
    const sinceTime = new Date(lastSessionTime).toISOString();

    // Get commit messages since last session
    const commits = execSync(
      `git log --since="${sinceTime}" --format=%s`,
      { encoding: 'utf8', cwd: PROJECT_ROOT }
    ).toString().trim();

    if (!commits) return [];

    const commitLines = commits.split('\n').filter(Boolean);

    // Extract tasks from commit messages
    const tasks = commitLines.map(line => {
      // Remove common prefixes like "Session XYZ:", "fix:", "feat:", etc.
      return line.replace(/^(Session [^:]+:|fix:|feat:|docs:|refactor:|test:|chore:)\s*/i, '').trim();
    }).filter(task => task.length > 0);

    return tasks;
  } catch (error) {
    return [];
  }
}

function autoDetectFileChanges() {
  const files = {
    created: [],
    modified: [],
    deleted: []
  };

  try {
    // Get git status
    const gitStatus = execSync('git status --short', { encoding: 'utf8', cwd: PROJECT_ROOT });
    const lines = gitStatus.split('\n').filter(l => l.trim());

    lines.forEach(line => {
      const status = line.substring(0, 2).trim();
      const file = line.substring(3);

      if (status === 'A' || status === '??') {
        files.created.push(file);
      } else if (status === 'M') {
        files.modified.push(file);
      } else if (status === 'D') {
        files.deleted.push(file);
      }
    });
  } catch (error) {
    // Silent fail - will return empty arrays
  }

  return files;
}

function generateAutoCommitMessage(tasks) {
  if (tasks.length === 0) {
    return 'Session updates';
  }

  if (tasks.length === 1) {
    return tasks[0];
  }

  // Combine tasks intelligently
  const mainTask = tasks[0];
  const additionalCount = tasks.length - 1;
  return `${mainTask} (+${additionalCount} more)`;
}

function showAutoDetectedSummary(autoData) {
  logSection('🤖 AUTO-DETECTED SESSION DATA');

  log('Session Information:', 'bright');
  log(`  Duration: ${autoData.duration} hours`, 'cyan');
  log(`  Tasks Completed: ${autoData.tasks.completed.length}`, 'cyan');

  if (autoData.tasks.completed.length > 0) {
    log('\n  Detected Tasks:', 'bright');
    autoData.tasks.completed.slice(0, 5).forEach(task => {
      log(`    ✓ ${task}`, 'green');
    });
    if (autoData.tasks.completed.length > 5) {
      log(`    ... and ${autoData.tasks.completed.length - 5} more`, 'green');
    }
  }

  log(`\n  Files Changed: ${autoData.files.created.length + autoData.files.modified.length}`, 'cyan');
  if (autoData.files.created.length > 0) {
    log(`    Created: ${autoData.files.created.length}`, 'green');
  }
  if (autoData.files.modified.length > 0) {
    log(`    Modified: ${autoData.files.modified.length}`, 'yellow');
  }
  if (autoData.files.deleted.length > 0) {
    log(`    Deleted: ${autoData.files.deleted.length}`, 'red');
  }

  log('\n  Metrics (Auto-estimated):', 'bright');
  log(`    CER: ${autoData.metrics.CER.value}%`, 'cyan');
  log(`    TCV: ${autoData.metrics.TCV.value}`, 'cyan');
  log(`    TES: ${autoData.metrics.TES.value}`, 'cyan');
  log(`    RAI: ${autoData.metrics.RAI.value}%`, 'cyan');

  console.log('\n' + '-'.repeat(60));
}

// Collect session information
async function collectSessionInfo() {
  logSection('📋 COLLECTING SESSION INFORMATION');

  // Read active session if exists
  if (fs.existsSync(ACTIVE_SESSION_PATH)) {
    const content = fs.readFileSync(ACTIVE_SESSION_PATH, 'utf8');
    const sessionIdMatch = content.match(/Session ID: (SESSION-[\d-T]+)/);
    if (sessionIdMatch) {
      sessionMetrics.sessionId = sessionIdMatch[1];
      log(`Session ID: ${sessionMetrics.sessionId}`, 'cyan');
    }
  }

  if (!sessionMetrics.sessionId) {
    sessionMetrics.sessionId = `SESSION-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  }

  // Calculate session duration
  const duration = await askQuestion('Session duration (hours): ');
  sessionMetrics.duration = parseFloat(duration) * 60; // Convert to minutes
}

async function collectTaskMetrics() {
  logSection('✅ COLLECTING TASK METRICS');

  // Completed tasks
  const completedCount = await askQuestion('How many tasks did you complete? ');
  for (let i = 0; i < parseInt(completedCount); i++) {
    const task = await askQuestion(`  Task ${i + 1} completed: `);
    sessionMetrics.tasks.completed.push(task);
  }

  // In-progress tasks
  if (await askYesNo('Any tasks still in progress?')) {
    const inProgressCount = await askQuestion('How many? ');
    for (let i = 0; i < parseInt(inProgressCount); i++) {
      const task = await askQuestion(`  Task ${i + 1} in progress: `);
      const completion = await askQuestion(`    Completion % (0-100): `);
      sessionMetrics.tasks.inProgress.push({ task, completion: parseInt(completion) });
    }
  }

  // Blocked tasks
  if (await askYesNo('Any blocked tasks?')) {
    const blockedCount = await askQuestion('How many? ');
    for (let i = 0; i < parseInt(blockedCount); i++) {
      const task = await askQuestion(`  Blocked task ${i + 1}: `);
      const reason = await askQuestion(`    Reason: `);
      sessionMetrics.tasks.blocked.push({ task, reason });
    }
  }
}

async function collectFileChanges() {
  logSection('📁 COLLECTING FILE CHANGES');

  try {
    // Get git status
    const gitStatus = execSync('git status --short', { encoding: 'utf8' });
    const lines = gitStatus.split('\n').filter(l => l.trim());

    lines.forEach(line => {
      const status = line.substring(0, 2).trim();
      const file = line.substring(3);

      if (status === 'A' || status === '??') {
        sessionMetrics.files.created.push(file);
      } else if (status === 'M') {
        sessionMetrics.files.modified.push(file);
      } else if (status === 'D') {
        sessionMetrics.files.deleted.push(file);
      }
    });

    log(`Files created: ${sessionMetrics.files.created.length}`, 'green');
    log(`Files modified: ${sessionMetrics.files.modified.length}`, 'yellow');
    log(`Files deleted: ${sessionMetrics.files.deleted.length}`, 'red');

    // Show file lists
    if (sessionMetrics.files.created.length > 0) {
      log('\nCreated:', 'green');
      sessionMetrics.files.created.slice(0, 5).forEach(f => log(`  + ${f}`, 'green'));
      if (sessionMetrics.files.created.length > 5) {
        log(`  ... and ${sessionMetrics.files.created.length - 5} more`, 'green');
      }
    }

  } catch (error) {
    log('Unable to get git status', 'yellow');
  }
}

async function calculatePerformanceMetrics() {
  logSection('📊 CALCULATING PERFORMANCE METRICS');

  // CER - Context Efficiency Ratio
  log('\n1. Context Efficiency Ratio (CER)', 'bright');
  sessionMetrics.metrics.CER.contextLoaded = parseInt(await askQuestion('   Documents loaded: '));
  sessionMetrics.metrics.CER.contextUsed = parseInt(await askQuestion('   Documents actually used: '));
  sessionMetrics.metrics.CER.value = (sessionMetrics.metrics.CER.contextUsed / sessionMetrics.metrics.CER.contextLoaded * 100).toFixed(1);
  log(`   CER Score: ${sessionMetrics.metrics.CER.value}% (Target: >85%)`, sessionMetrics.metrics.CER.value >= 85 ? 'green' : 'yellow');

  // TCV - Task Completion Velocity
  log('\n2. Task Completion Velocity (TCV)', 'bright');
  sessionMetrics.metrics.TCV.tasksPlanned = parseInt(await askQuestion('   Tasks planned: '));
  sessionMetrics.metrics.TCV.tasksCompleted = sessionMetrics.tasks.completed.length;
  const estimatedTime = parseFloat(await askQuestion('   Estimated time (hours): '));
  const actualTime = sessionMetrics.duration / 60;
  sessionMetrics.metrics.TCV.value = (
    (sessionMetrics.metrics.TCV.tasksCompleted / sessionMetrics.metrics.TCV.tasksPlanned) *
    (estimatedTime / actualTime)
  ).toFixed(2);
  log(`   TCV Score: ${sessionMetrics.metrics.TCV.value} (Target: 0.9-1.1)`,
    sessionMetrics.metrics.TCV.value >= 0.9 && sessionMetrics.metrics.TCV.value <= 1.1 ? 'green' : 'yellow');

  // TES - Token Efficiency Score
  log('\n3. Token Efficiency Score (TES)', 'bright');
  sessionMetrics.metrics.TES.businessValue = parseInt(await askQuestion('   Business value points (0-100): '));
  sessionMetrics.metrics.TES.tokensUsed = parseInt(await askQuestion('   Estimated tokens used (thousands): ')) * 1000;
  sessionMetrics.metrics.TES.value = (
    (sessionMetrics.metrics.TES.businessValue / sessionMetrics.metrics.TES.tokensUsed) * 1000
  ).toFixed(2);
  log(`   TES Score: ${sessionMetrics.metrics.TES.value} (Target: >0.60)`, sessionMetrics.metrics.TES.value >= 0.6 ? 'green' : 'yellow');

  // RAI - Resolution Accuracy Index
  log('\n4. Resolution Accuracy Index (RAI)', 'bright');
  sessionMetrics.metrics.RAI.firstAttempts = parseInt(await askQuestion('   Successful first attempts: '));
  sessionMetrics.metrics.RAI.totalAttempts = parseInt(await askQuestion('   Total attempts: '));
  sessionMetrics.metrics.RAI.value = (
    (sessionMetrics.metrics.RAI.firstAttempts / sessionMetrics.metrics.RAI.totalAttempts) * 100
  ).toFixed(1);
  log(`   RAI Score: ${sessionMetrics.metrics.RAI.value}% (Target: >85%)`, sessionMetrics.metrics.RAI.value >= 85 ? 'green' : 'yellow');
}

async function collectNextSessionPriorities() {
  logSection('🎯 NEXT SESSION PRIORITIES');

  const priorityCount = await askQuestion('Number of priorities for next session (3-5): ');
  for (let i = 0; i < parseInt(priorityCount); i++) {
    const priority = await askQuestion(`  Priority ${i + 1}: `);
    sessionMetrics.nextSession.priorities.push(priority);
  }

  if (await askYesNo('Any blockers for next session?')) {
    const blockerCount = await askQuestion('How many? ');
    for (let i = 0; i < parseInt(blockerCount); i++) {
      const blocker = await askQuestion(`  Blocker ${i + 1}: `);
      sessionMetrics.nextSession.blockers.push(blocker);
    }
  }

  log('\nKey files for next session:', 'bright');
  const contextCount = await askQuestion('Number of key files (2-4): ');
  for (let i = 0; i < parseInt(contextCount); i++) {
    const file = await askQuestion(`  File ${i + 1}: `);
    sessionMetrics.nextSession.context.push(file);
  }
}

function updateActiveSession() {
  logSection('📝 UPDATING ACTIVE SESSION');

  const now = new Date();
  const activeSessionContent = `# 🔄 Active Session State - Claude Handoff

**Session ID**: ${sessionMetrics.sessionId}
**Last Update**: ${now.toISOString()}
**Session Duration**: ${sessionMetrics.duration} minutes
**Overall Progress**: Calculate from MASTER_DEV_LIST.md

---

## 🎯 IMMEDIATE CONTEXT (Start Here!)

### Last Session Summary
- Completed ${sessionMetrics.tasks.completed.length} tasks
- ${sessionMetrics.tasks.inProgress.length} tasks in progress
- ${sessionMetrics.tasks.blocked.length} blocked tasks

### Tasks Completed
${sessionMetrics.tasks.completed.map(t => `✅ ${t}`).join('\n')}

### Tasks In Progress
${sessionMetrics.tasks.inProgress.map(t => `🔄 ${t.task} (${t.completion}% complete)`).join('\n')}

### Blocked Tasks
${sessionMetrics.tasks.blocked.map(t => `❌ ${t.task} - Blocked by: ${t.reason}`).join('\n')}

---

## 🌿 CURRENT WORKING STATE

### Files Modified
${sessionMetrics.files.modified.slice(0, 10).map(f => `- ${f}`).join('\n')}

### Files Created
${sessionMetrics.files.created.slice(0, 10).map(f => `- ${f} 🆕`).join('\n')}

---

## 📊 SESSION METRICS

### Performance Scores
- **CER**: ${sessionMetrics.metrics.CER.value}% (Context Efficiency)
- **TCV**: ${sessionMetrics.metrics.TCV.value} (Task Velocity)
- **TES**: ${sessionMetrics.metrics.TES.value} (Token Efficiency)
- **RAI**: ${sessionMetrics.metrics.RAI.value}% (Resolution Accuracy)

### Session Stats
- Tasks Completed: ${sessionMetrics.tasks.completed.length}/${sessionMetrics.metrics.TCV.tasksPlanned}
- Files Changed: ${sessionMetrics.files.created.length + sessionMetrics.files.modified.length}
- Duration: ${sessionMetrics.duration} minutes
- Efficiency Score: ${((parseFloat(sessionMetrics.metrics.CER.value) + parseFloat(sessionMetrics.metrics.RAI.value)) / 200).toFixed(2)}

---

## 🎯 NEXT ACTIONS (Priority Order)

### Immediate Priorities
${sessionMetrics.nextSession.priorities.map((p, i) => `${i + 1}. ${p}`).join('\n')}

### Blockers to Resolve
${sessionMetrics.nextSession.blockers.map(b => `- ⚠️ ${b}`).join('\n') || 'None'}

### Key Context Files
${sessionMetrics.nextSession.context.map(f => `- ${f}`).join('\n')}

---

## 🔥 HOT RELOAD (Critical Info for Next Session)

### Continue From Here
${sessionMetrics.tasks.inProgress.length > 0 ?
  sessionMetrics.tasks.inProgress.map(t => `- Continue: ${t.task} (${t.completion}% done)`).join('\n') :
  '- Start with first priority above'}

### Quick Commands
\`\`\`bash
# Start next session
node .claude/claude-automation/start-session.js

# Check this file
cat KARVIA_STRATEGY/3-DELIVERY/handoffs/SESSION_MANAGEMENT/ACTIVE_SESSION.md

# Navigate to work
cd ${PROJECT_ROOT}
\`\`\`

---

**Updated**: ${now.toISOString()}
**Next Session**: Use start-session.js to begin
`;

  fs.writeFileSync(ACTIVE_SESSION_PATH, activeSessionContent);
  log('✅ Active session updated', 'green');
}

function archiveSession() {
  logSection('📦 ARCHIVING SESSION');

  const sessionDir = path.join(SESSION_MGMT_PATH, 'sessions', sessionMetrics.sessionId);

  // Create session directory
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }

  // Save session metrics
  const metricsPath = path.join(sessionDir, 'SESSION_METRICS.json');
  fs.writeFileSync(metricsPath, JSON.stringify(sessionMetrics, null, 2));
  log(`✅ Session metrics saved to: ${metricsPath}`, 'green');

  // Copy active session as session state
  const sessionStatePath = path.join(sessionDir, 'SESSION_STATE.md');
  fs.copyFileSync(ACTIVE_SESSION_PATH, sessionStatePath);
  log(`✅ Session state archived`, 'green');

  return sessionDir;
}

function updateMasterTrees() {
  logSection('🌳 UPDATING MASTER TREE DOCUMENTATION');

  const masterTreeCodePath = path.join(SESSION_MGMT_PATH, 'MASTER_TREE_CODE.md');
  const masterTreeDocsPath = path.join(SESSION_MGMT_PATH, 'MASTER_TREE_DOCS.md');

  // Update MASTER_TREE_CODE.md
  if (fs.existsSync(masterTreeCodePath)) {
    try {
      let content = fs.readFileSync(masterTreeCodePath, 'utf8');

      // Update session ID and date in header
      content = content.replace(
        /\*\*Last Updated\*\*: .+/,
        `**Last Updated**: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`
      );
      content = content.replace(
        /\*\*Session\*\*: .+/,
        `**Session**: ${sessionMetrics.sessionId}`
      );

      // Update modification summary counts
      const createdCount = sessionMetrics.files.created.length;
      const modifiedCount = sessionMetrics.files.modified.length;
      const deletedCount = sessionMetrics.files.deleted.length;

      content = content.replace(
        /- \*\*Created\*\*: \d+ code files/,
        `- **Created**: ${createdCount} code files`
      );
      content = content.replace(
        /- \*\*Modified\*\*: \d+ code files/,
        `- **Modified**: ${modifiedCount} code files`
      );
      content = content.replace(
        /- \*\*Deleted\*\*: \d+ code files/,
        `- **Deleted**: ${deletedCount} code files`
      );

      fs.writeFileSync(masterTreeCodePath, content);
      log('✅ MASTER_TREE_CODE.md updated', 'green');
    } catch (error) {
      log(`⚠️  Failed to update MASTER_TREE_CODE.md: ${error.message}`, 'yellow');
    }
  }

  // Update MASTER_TREE_DOCS.md
  if (fs.existsSync(masterTreeDocsPath)) {
    try {
      let content = fs.readFileSync(masterTreeDocsPath, 'utf8');

      // Update session ID and date in header
      content = content.replace(
        /\*\*Last Updated\*\*: .+/,
        `**Last Updated**: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`
      );
      content = content.replace(
        /\*\*Session\*\*: .+/,
        `**Session**: ${sessionMetrics.sessionId}`
      );

      fs.writeFileSync(masterTreeDocsPath, content);
      log('✅ MASTER_TREE_DOCS.md updated', 'green');
    } catch (error) {
      log(`⚠️  Failed to update MASTER_TREE_DOCS.md: ${error.message}`, 'yellow');
    }
  }

  log('\n📝 Note: Detailed file modifications tracked in git history', 'cyan');
}

async function generateEndReport() {
  logSection('📊 GENERATING SESSION END REPORT');

  const report = `# Session End Report

## Session: ${sessionMetrics.sessionId}

### Duration: ${sessionMetrics.duration} minutes

### Accomplishments
- Tasks Completed: ${sessionMetrics.tasks.completed.length}
- Files Created: ${sessionMetrics.files.created.length}
- Files Modified: ${sessionMetrics.files.modified.length}

### Performance
- CER: ${sessionMetrics.metrics.CER.value}% ${sessionMetrics.metrics.CER.value >= 85 ? '✅' : '⚠️'}
- TCV: ${sessionMetrics.metrics.TCV.value} ${sessionMetrics.metrics.TCV.value >= 0.9 && sessionMetrics.metrics.TCV.value <= 1.1 ? '✅' : '⚠️'}
- TES: ${sessionMetrics.metrics.TES.value} ${sessionMetrics.metrics.TES.value >= 0.6 ? '✅' : '⚠️'}
- RAI: ${sessionMetrics.metrics.RAI.value}% ${sessionMetrics.metrics.RAI.value >= 85 ? '✅' : '⚠️'}

### Next Session
${sessionMetrics.nextSession.priorities.map(p => `- ${p}`).join('\n')}

### Notes
- Session ended: ${new Date().toISOString()}
- Handoff prepared: ✅
`;

  console.log('\n' + '='.repeat(60));
  console.log(report);
  console.log('='.repeat(60));

  return report;
}

async function commitChanges() {
  if (await askYesNo('\nCommit changes to git?')) {
    const message = await askQuestion('Commit message: ');
    try {
      execSync('git add .', { encoding: 'utf8' });
      execSync(`git commit -m "Session ${sessionMetrics.sessionId}: ${message}"`, { encoding: 'utf8' });
      log('✅ Changes committed', 'green');
    } catch (error) {
      log('⚠️  Commit failed - please commit manually', 'yellow');
    }
  }
}

function showHelp() {
  console.log(`
${colors.bright}Claude Session End - Smart Auto Mode${colors.reset}

${colors.cyan}Usage:${colors.reset}
  node end-session.js [options]

${colors.cyan}Options:${colors.reset}
  ${colors.green}--auto, -a${colors.reset}           Enable auto-mode (no prompts, git-based detection)
  ${colors.green}--duration, -d <hours>${colors.reset} Manually specify session duration
  ${colors.green}--skip-commit${colors.reset}        Skip git commit at the end
  ${colors.green}--help, -h${colors.reset}           Show this help message

${colors.cyan}Auto Mode:${colors.reset}
  Auto-mode automatically detects:
  - Session duration (from last session timestamp)
  - Completed tasks (from git commit messages)
  - File changes (from git status)
  - Performance metrics (estimated based on work done)

${colors.cyan}Config File:${colors.reset}
  Create ${colors.yellow}.session-config.json${colors.reset} in project root:
  {
    "autoMode": true,
    "defaultCommit": true
  }

${colors.cyan}Examples:${colors.reset}
  ${colors.yellow}# Auto mode (zero input required)${colors.reset}
  node end-session.js --auto

  ${colors.yellow}# Auto mode with manual duration override${colors.reset}
  node end-session.js --auto --duration 2.5

  ${colors.yellow}# Auto mode, skip commit${colors.reset}
  node end-session.js --auto --skip-commit

  ${colors.yellow}# Interactive mode (original behavior)${colors.reset}
  node end-session.js
`);
}

// Main execution with auto-mode support
async function main() {
  // Show help if requested
  if (CLI_ARGS.help) {
    showHelp();
    process.exit(0);
  }

  console.clear();
  log('🤖 CLAUDE SESSION END PROCEDURE', 'bright');

  if (AUTO_MODE) {
    log('Running in AUTO MODE (git-based detection)', 'magenta');
  } else {
    log('Running in INTERACTIVE MODE', 'cyan');
  }

  log('This will update handoffs and prepare for next session\n', 'cyan');

  try {
    if (AUTO_MODE) {
      // Auto-mode: detect everything from git
      await runAutoMode();
    } else {
      // Interactive mode: ask questions
      await runInteractiveMode();
    }

    logSection('✅ SESSION END COMPLETE');
    log(`Session ${sessionMetrics.sessionId} has been archived`, 'green');
    log('\nHandoff is ready for next session!', 'bright');
    log('Next session should start with: node .claude/3-CLAUDE_AI/claude-automation/start-session.js\n', 'cyan');

  } catch (error) {
    log(`\n❌ Error during session end: ${error.message}`, 'red');
    console.error(error.stack);
  } finally {
    rl.close();
  }
}

async function runInteractiveMode() {
  await collectSessionInfo();
  await collectTaskMetrics();
  await collectFileChanges();
  await calculatePerformanceMetrics();
  await collectNextSessionPriorities();

  updateActiveSession();
  archiveSession();
  updateMasterTrees();
  await generateEndReport();
  await commitChanges();
}

async function runAutoMode() {
  logSection('🔍 AUTO-DETECTING SESSION DATA');

  // Read active session for context
  if (fs.existsSync(ACTIVE_SESSION_PATH)) {
    const content = fs.readFileSync(ACTIVE_SESSION_PATH, 'utf8');
    const sessionIdMatch = content.match(/Session ID: (SESSION-[\d-T]+)/);
    if (sessionIdMatch) {
      sessionMetrics.sessionId = sessionIdMatch[1];
      log(`✓ Session ID: ${sessionMetrics.sessionId}`, 'green');
    }
  }

  if (!sessionMetrics.sessionId) {
    sessionMetrics.sessionId = `SESSION-${new Date().toISOString().replace(/[:.]/g, '-')}`;
    log(`✓ Generated Session ID: ${sessionMetrics.sessionId}`, 'green');
  }

  // Auto-detect duration
  const detectedDuration = CLI_ARGS.duration || autoDetectDuration();
  sessionMetrics.duration = parseFloat(detectedDuration) * 60; // Convert to minutes
  log(`✓ Duration: ${detectedDuration} hours (${sessionMetrics.duration} minutes)`, 'green');

  // Auto-detect tasks
  const detectedTasks = autoDetectTasks();
  sessionMetrics.tasks.completed = detectedTasks;
  log(`✓ Tasks completed: ${detectedTasks.length}`, 'green');

  // Auto-detect file changes
  const detectedFiles = autoDetectFileChanges();
  sessionMetrics.files = detectedFiles;
  log(`✓ Files changed: ${detectedFiles.created.length} created, ${detectedFiles.modified.length} modified, ${detectedFiles.deleted.length} deleted`, 'green');

  // Auto-calculate metrics (estimated)
  const totalFiles = detectedFiles.created.length + detectedFiles.modified.length;
  const tasksCompleted = detectedTasks.length;

  // CER - Assume high efficiency in auto mode
  sessionMetrics.metrics.CER = {
    contextLoaded: 10,
    contextUsed: Math.min(10, totalFiles + 2),
    value: Math.min(100, ((totalFiles + 2) / 10) * 100).toFixed(1)
  };

  // TCV - Based on tasks and time
  sessionMetrics.metrics.TCV = {
    tasksPlanned: Math.max(tasksCompleted, 3),
    tasksCompleted: tasksCompleted,
    value: tasksCompleted > 0 ? (tasksCompleted / Math.max(tasksCompleted, 3)).toFixed(2) : '0.00'
  };

  // TES - Estimate based on files changed
  sessionMetrics.metrics.TES = {
    businessValue: totalFiles * 10,
    tokensUsed: Math.max(10000, totalFiles * 5000),
    value: totalFiles > 0 ? ((totalFiles * 10) / (totalFiles * 5)).toFixed(2) : '0.00'
  };

  // RAI - Assume good accuracy for committed work
  sessionMetrics.metrics.RAI = {
    firstAttempts: Math.max(1, tasksCompleted),
    totalAttempts: Math.max(1, tasksCompleted + 1),
    value: ((tasksCompleted / (tasksCompleted + 1)) * 100).toFixed(1)
  };

  log(`✓ Metrics calculated (CER: ${sessionMetrics.metrics.CER.value}%, TCV: ${sessionMetrics.metrics.TCV.value}, RAI: ${sessionMetrics.metrics.RAI.value}%)`, 'green');

  // Auto-generate next session priorities
  if (detectedTasks.length > 0) {
    sessionMetrics.nextSession.priorities = [
      'Continue from last session tasks',
      'Review and test recent changes',
      'Check for any remaining TODOs'
    ];
  } else {
    sessionMetrics.nextSession.priorities = [
      'Review ACTIVE_SESSION.md for priorities',
      'Check MASTER_DEV_LIST.md for pending tasks'
    ];
  }

  sessionMetrics.nextSession.blockers = [];
  sessionMetrics.nextSession.context = detectedFiles.modified.slice(0, 4);

  // Show summary
  showAutoDetectedSummary({
    duration: detectedDuration,
    tasks: sessionMetrics.tasks,
    files: detectedFiles,
    metrics: sessionMetrics.metrics
  });

  // Ask for confirmation in auto mode
  const proceed = await askYesNo('\nProceed with session end using this data?');
  if (!proceed) {
    log('\nSession end cancelled.', 'yellow');
    process.exit(0);
  }

  // Update documents
  updateActiveSession();
  archiveSession();
  updateMasterTrees();
  await generateEndReport();

  // Auto-commit if not skipped
  if (!CLI_ARGS.skipCommit) {
    const commitMessage = generateAutoCommitMessage(detectedTasks);
    log(`\n📝 Auto-committing with message: "${commitMessage}"`, 'cyan');

    try {
      execSync('git add .', { encoding: 'utf8', cwd: PROJECT_ROOT });
      execSync(`git commit -m "Session ${sessionMetrics.sessionId}: ${commitMessage}"`, {
        encoding: 'utf8',
        cwd: PROJECT_ROOT
      });
      log('✅ Changes committed', 'green');
    } catch (error) {
      log('⚠️  Commit failed - please commit manually', 'yellow');
    }
  } else {
    log('\n⏭️  Skipping git commit (--skip-commit flag)', 'yellow');
  }
}

// Run the script
main();