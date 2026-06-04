#!/bin/bash

#######################################
# Karvia Business - BST Test Execution
# Basic Smoke Tests (P0 - Critical)
#
# Run this script to execute all 50 critical path tests
# Execution time: ~30-45 minutes
# Pass rate required: 100%
#######################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../../../.." && pwd)"

echo -e "${BLUE}=================================${NC}"
echo -e "${BLUE}Karvia Business - BST Test Suite${NC}"
echo -e "${BLUE}=================================${NC}"
echo ""
echo -e "Test Category: ${YELLOW}Basic Smoke Tests (BST)${NC}"
echo -e "Priority: ${RED}P0 (Critical - Blocking)${NC}"
echo -e "Total Tests: ${YELLOW}50 tests${NC}"
echo -e "Estimated Time: ${YELLOW}30-45 minutes${NC}"
echo -e "Required Pass Rate: ${RED}100%${NC}"
echo ""

# Check if MongoDB is running
echo -e "${BLUE}[1/7]${NC} Checking prerequisites..."
if ! pgrep -x "mongod" > /dev/null; then
    echo -e "${RED}✗ MongoDB is not running${NC}"
    echo -e "${YELLOW}Please start MongoDB:${NC} brew services start mongodb-community"
    exit 1
fi
echo -e "${GREEN}✓ MongoDB is running${NC}"

# Navigate to project root
cd "$PROJECT_ROOT" || exit 1

# Check if server is already running
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${GREEN}✓ Server is already running on port 8080${NC}"
    SERVER_ALREADY_RUNNING=true
else
    echo -e "${YELLOW}  Server not running, will start automatically${NC}"
    SERVER_ALREADY_RUNNING=false
fi

# Install dependencies if needed
if [ ! -d "node_modules/@playwright" ]; then
    echo -e "${BLUE}[2/7]${NC} Installing Playwright dependencies..."
    npm install --save-dev @playwright/test
    npx playwright install chromium
else
    echo -e "${GREEN}✓ Playwright dependencies installed${NC}"
fi

# Reset test database
echo -e "${BLUE}[3/7]${NC} Resetting test database..."
mongosh karvia_business_test --eval "db.dropDatabase()" --quiet 2>/dev/null || true
echo -e "${GREEN}✓ Test database reset${NC}"

# Seed test data
echo -e "${BLUE}[4/7]${NC} Seeding test data..."
# This will be handled by Playwright's globalSetup
echo -e "${GREEN}✓ Test data seeding configured${NC}"

# Set environment variables for testing
export NODE_ENV=test
export MONGODB_URI="mongodb://localhost:27017/karvia_business_test"
export PORT=8080
export JWT_SECRET="test-secret-key-change-in-production"
export FEATURE_OPENAI_ENABLED=false  # Mock OpenAI for tests

# Run BST tests
echo -e "${BLUE}[5/7]${NC} Running BST tests..."
echo ""

# Use Playwright to run only BST tests
npx playwright test tests/bst \
  --project=chromium \
  --reporter=html \
  --reporter=list \
  --output=test-results/bst

TEST_EXIT_CODE=$?

# Generate report
echo ""
echo -e "${BLUE}[6/7]${NC} Generating test report..."

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✓ All BST tests passed!${NC}"
    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   ✓ BST TEST SUITE PASSED (100%)     ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════╝${NC}"
else
    echo -e "${RED}✗ Some BST tests failed${NC}"
    echo ""
    echo -e "${RED}╔═══════════════════════════════════════╗${NC}"
    echo -e "${RED}║   ✗ BST TEST SUITE FAILED             ║${NC}"
    echo -e "${RED}║   Deployment BLOCKED                  ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════╝${NC}"
fi

# Show report
echo -e "${BLUE}[7/7]${NC} Opening test report..."
echo ""
echo -e "HTML Report: ${BLUE}file://$PROJECT_ROOT/playwright-report/index.html${NC}"
echo -e "JSON Results: ${BLUE}$PROJECT_ROOT/test-results/bst/results.json${NC}"
echo ""

# Open HTML report in browser
if command -v open &> /dev/null; then
    open "$PROJECT_ROOT/playwright-report/index.html"
fi

# Cleanup
if [ "$SERVER_ALREADY_RUNNING" = false ]; then
    echo -e "${YELLOW}Note: Server was started automatically${NC}"
fi

echo ""
echo -e "${BLUE}Test Execution Summary:${NC}"
echo -e "  Test Suite: BST (Basic Smoke Tests)"
echo -e "  Priority: P0 (Critical)"
echo -e "  Status: $([ $TEST_EXIT_CODE -eq 0 ] && echo -e "${GREEN}PASSED${NC}" || echo -e "${RED}FAILED${NC}")"
echo -e "  Report: playwright-report/index.html"
echo ""

# Exit with test exit code
exit $TEST_EXIT_CODE
