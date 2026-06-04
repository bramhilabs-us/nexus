# Epic 3: Consultant Dashboard - Implementation Spec

**Sprint**: 6
**Priority**: P1 - HIGH
**Points**: 13
**Hours**: 8h
**Status**: 70% Routes Done - Ready for Remaining Work

---

## Overview

Consultants need a dashboard to view all companies they manage, switch between them, and see aggregated statistics.

---

## Existing Code (70% Complete!)

### Routes Already Done in businesses.js

**File**: [server/routes/businesses.js](server/routes/businesses.js) (482 lines)

| Endpoint | Lines | Status |
|----------|-------|--------|
| `GET /api/businesses/:id` | 25-66 | ✅ Done |
| `GET /api/businesses/:id/stats` | 74-173 | ✅ Done |
| `GET /api/businesses/:id/users` | 188-260 | ✅ Done |
| `GET /api/businesses/:id/teams` | 271-334 | ✅ Done |
| `PUT /api/businesses/:id` | 344-430 | ✅ Done |
| `DELETE /api/businesses/:id` | 442-479 | ✅ Done |

### What's Missing

| Endpoint | Purpose | Status |
|----------|---------|--------|
| `GET /api/consultant/companies` | List all companies consultant manages | ❌ Missing |
| `GET /api/consultant/dashboard` | Aggregated stats across all companies | ❌ Missing |

---

## Task 1: Multi-Company Listing API (1.5h)

### Endpoint: GET /api/consultant/companies

Returns all companies a consultant has been assigned to or created invitations for.

### Create New File: server/routes/consultant.js

```javascript
/**
 * Consultant Routes
 * Dashboard and multi-company management for consultants
 *
 * Sprint 6 - Epic 3
 */

const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const User = require('../models/User');
const Objective = require('../models/Objective');
const Assessment = require('../models/Assessment');
const Invitation = require('../models/Invitation');
const { authenticateToken } = require('../middleware/authGuards');
const { requireRole } = require('../middleware/roleGuards');

/**
 * GET /api/consultant/companies
 * List all companies the consultant has access to
 *
 * Access: CONSULTANT only
 */
router.get('/companies', authenticateToken, requireRole('CONSULTANT'), async (req, res) => {
    try {
        const consultantId = req.user.id;

        // Find companies through invitations created by this consultant
        const invitations = await Invitation.find({
            sent_by: consultantId,
            status: { $in: ['accepted', 'pending'] }
        }).distinct('company_id');

        // Also find companies where consultant has direct assignments
        // (This covers cases where consultant was added to company without invitation)
        const directAssignments = await User.find({
            _id: consultantId
        }).select('company_id');

        // Combine all company IDs
        const companyIds = [...new Set([
            ...invitations.map(id => id.toString()),
            ...directAssignments.map(u => u.company_id?.toString()).filter(Boolean)
        ])];

        if (companyIds.length === 0) {
            return res.json({
                success: true,
                data: [],
                count: 0,
                message: 'No companies found. Create company invitations to get started.'
            });
        }

        // Fetch company details with stats
        const companies = await Company.find({
            _id: { $in: companyIds },
            status: { $ne: 'inactive' }
        }).select('name industry size_category employee_count status assessment_scores okr_generation created_at')
          .sort({ name: 1 })
          .lean();

        // Enrich with quick stats
        const enrichedCompanies = await Promise.all(companies.map(async (company) => {
            const [userCount, objectiveCount, assessmentCount] = await Promise.all([
                User.countDocuments({ company_id: company._id, status: 'active' }),
                Objective.countDocuments({ company_id: company._id, status: { $ne: 'cancelled' } }),
                Assessment.countDocuments({ company_id: company._id, completed_at: { $exists: true } })
            ]);

            return {
                ...company,
                stats: {
                    users: userCount,
                    objectives: objectiveCount,
                    assessments: assessmentCount,
                    okr_generated: company.okr_generation?.generated || false
                }
            };
        }));

        res.json({
            success: true,
            data: enrichedCompanies,
            count: enrichedCompanies.length
        });

    } catch (error) {
        console.error('Error fetching consultant companies:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch companies',
            error: error.message
        });
    }
});

/**
 * GET /api/consultant/dashboard
 * Aggregated statistics across all managed companies
 *
 * Access: CONSULTANT only
 */
router.get('/dashboard', authenticateToken, requireRole('CONSULTANT'), async (req, res) => {
    try {
        const consultantId = req.user.id;

        // Get all company IDs this consultant manages
        const invitations = await Invitation.find({
            sent_by: consultantId,
            status: { $in: ['accepted', 'pending'] }
        }).distinct('company_id');

        const companyIds = invitations.map(id => id.toString());

        if (companyIds.length === 0) {
            return res.json({
                success: true,
                data: {
                    total_companies: 0,
                    total_users: 0,
                    total_objectives: 0,
                    total_assessments: 0,
                    companies_with_okr: 0,
                    avg_assessment_completion: 0,
                    companies_needing_attention: []
                }
            });
        }

        // Aggregate stats
        const [
            totalUsers,
            totalObjectives,
            activeObjectives,
            totalAssessments,
            completedAssessments
        ] = await Promise.all([
            User.countDocuments({ company_id: { $in: companyIds }, status: 'active' }),
            Objective.countDocuments({ company_id: { $in: companyIds } }),
            Objective.countDocuments({ company_id: { $in: companyIds }, status: 'active' }),
            Assessment.countDocuments({ company_id: { $in: companyIds } }),
            Assessment.countDocuments({ company_id: { $in: companyIds }, completed_at: { $exists: true } })
        ]);

        // Get companies with OKR generated
        const companiesWithOKR = await Company.countDocuments({
            _id: { $in: companyIds },
            'okr_generation.generated': true
        });

        // Find companies needing attention (low completion, no OKR, etc.)
        const companiesData = await Company.find({
            _id: { $in: companyIds }
        }).select('name assessment_scores okr_generation').lean();

        const companiesNeedingAttention = companiesData
            .filter(c => {
                const hasLowScore = (c.assessment_scores?.overall_score || 0) < 50;
                const noOKR = !c.okr_generation?.generated;
                return hasLowScore || noOKR;
            })
            .map(c => ({
                id: c._id,
                name: c.name,
                issues: [
                    ...(c.assessment_scores?.overall_score < 50 ? ['Low assessment score'] : []),
                    ...(!c.okr_generation?.generated ? ['No OKRs generated'] : [])
                ]
            }))
            .slice(0, 5); // Top 5

        res.json({
            success: true,
            data: {
                total_companies: companyIds.length,
                total_users: totalUsers,
                total_objectives: totalObjectives,
                active_objectives: activeObjectives,
                total_assessments: totalAssessments,
                completed_assessments: completedAssessments,
                assessment_completion_rate: totalAssessments > 0
                    ? Math.round((completedAssessments / totalAssessments) * 100)
                    : 0,
                companies_with_okr: companiesWithOKR,
                okr_adoption_rate: companyIds.length > 0
                    ? Math.round((companiesWithOKR / companyIds.length) * 100)
                    : 0,
                companies_needing_attention: companiesNeedingAttention
            }
        });

    } catch (error) {
        console.error('Error fetching consultant dashboard:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard data',
            error: error.message
        });
    }
});

module.exports = router;
```

### Register Route in server/index.js

Add after other route imports (around line 45-50):
```javascript
const consultantRoutes = require('./routes/consultant');
```

Add after other route registrations (around line 75-80):
```javascript
app.use('/api/consultant', consultantRoutes);
```

---

## Task 2: Dashboard UI Page (4h)

### Create New File: client/pages/consultant-dashboard.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KARVIA Pro - Consultant Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background: #f9fafb; }
        .karvia-gradient { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .company-card { transition: all 0.2s ease; }
        .company-card:hover { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1); }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div id="main-navigation"></div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-8">
        <!-- Page Header -->
        <div class="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-8">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 mb-2">Consultant Dashboard</h1>
                    <p class="text-gray-600">Manage all your client companies from one place</p>
                </div>
                <button onclick="location.href='/pages/invitations.html'" class="karvia-gradient px-5 py-2.5 rounded-lg text-white hover:opacity-90 transition-opacity flex items-center space-x-2 font-medium">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
                    </svg>
                    <span>Add Company</span>
                </button>
            </div>
        </div>

        <!-- Stats Overview -->
        <div id="stats-section" class="grid md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white border border-gray-200 rounded-xl p-6">
                <div class="flex items-center justify-between mb-2">
                    <div class="text-sm font-medium text-gray-600">Companies</div>
                    <div class="text-purple-600">
                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd"/>
                        </svg>
                    </div>
                </div>
                <div id="stat-companies" class="text-3xl font-bold text-gray-900 mb-1">-</div>
                <div class="text-sm text-purple-600">Total managed</div>
            </div>

            <div class="bg-white border border-gray-200 rounded-xl p-6">
                <div class="flex items-center justify-between mb-2">
                    <div class="text-sm font-medium text-gray-600">Users</div>
                    <div class="text-blue-600">
                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                        </svg>
                    </div>
                </div>
                <div id="stat-users" class="text-3xl font-bold text-gray-900 mb-1">-</div>
                <div class="text-sm text-blue-600">Active users</div>
            </div>

            <div class="bg-white border border-gray-200 rounded-xl p-6">
                <div class="flex items-center justify-between mb-2">
                    <div class="text-sm font-medium text-gray-600">OKR Adoption</div>
                    <div class="text-green-600">
                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                    </div>
                </div>
                <div id="stat-okr-rate" class="text-3xl font-bold text-gray-900 mb-1">-</div>
                <div class="text-sm text-green-600">Companies with OKRs</div>
            </div>

            <div class="bg-white border border-gray-200 rounded-xl p-6">
                <div class="flex items-center justify-between mb-2">
                    <div class="text-sm font-medium text-gray-600">Assessments</div>
                    <div class="text-orange-600">
                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                            <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
                        </svg>
                    </div>
                </div>
                <div id="stat-assessments" class="text-3xl font-bold text-gray-900 mb-1">-</div>
                <div class="text-sm text-orange-600">Completion rate</div>
            </div>
        </div>

        <!-- Needs Attention Section -->
        <div id="attention-section" class="hidden mb-8">
            <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                <h3 class="font-semibold text-yellow-800 mb-3 flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    Companies Needing Attention
                </h3>
                <div id="attention-list" class="space-y-2">
                    <!-- Populated by JS -->
                </div>
            </div>
        </div>

        <!-- Companies Grid -->
        <div class="mb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Your Companies</h2>
        </div>

        <!-- Loading State -->
        <div id="loading-state" class="text-center py-16">
            <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
            <p class="text-gray-600 mt-4">Loading companies...</p>
        </div>

        <!-- Empty State -->
        <div id="empty-state" class="hidden">
            <div class="bg-blue-50 border border-blue-200 rounded-xl p-12 text-center">
                <svg class="h-16 w-16 text-blue-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4z" clip-rule="evenodd"/>
                </svg>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">No Companies Yet</h3>
                <p class="text-gray-600 mb-6">Create company invitations to start managing client OKRs</p>
                <a href="/pages/invitations.html" class="karvia-gradient text-white px-6 py-3 rounded-lg hover:opacity-90 transition font-semibold inline-block">
                    Send Company Invitation
                </a>
            </div>
        </div>

        <!-- Companies Grid -->
        <div id="companies-grid" class="hidden grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Company cards will be inserted here -->
        </div>
    </div>

    <!-- Scripts -->
    <script src="/js/common.js"></script>
    <script src="/js/navigation.js"></script>
    <script src="/js/toast.js"></script>
    <script>
        let dashboardData = null;
        let companiesData = [];

        document.addEventListener('DOMContentLoaded', async () => {
            // Initialize navigation
            const user = JSON.parse(localStorage.getItem('karvia_user') || '{}');
            if (window.NavigationManager) {
                window.NavigationManager.init(user);
            }

            // Verify consultant role
            if (user.role !== 'CONSULTANT') {
                showToast('Access denied. Consultants only.', 'error');
                setTimeout(() => location.href = '/pages/dashboard.html', 2000);
                return;
            }

            await loadDashboard();
        });

        async function loadDashboard() {
            try {
                const token = localStorage.getItem('karvia_auth_token');

                // Fetch dashboard stats and companies in parallel
                const [dashboardRes, companiesRes] = await Promise.all([
                    fetch('/api/consultant/dashboard', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch('/api/consultant/companies', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                if (!dashboardRes.ok || !companiesRes.ok) {
                    throw new Error('Failed to fetch data');
                }

                const dashboardResult = await dashboardRes.json();
                const companiesResult = await companiesRes.json();

                dashboardData = dashboardResult.data;
                companiesData = companiesResult.data || [];

                renderDashboard();
                renderCompanies();

            } catch (error) {
                console.error('Dashboard load error:', error);
                showToast('Failed to load dashboard', 'error');
            }
        }

        function renderDashboard() {
            // Update stats
            document.getElementById('stat-companies').textContent = dashboardData.total_companies;
            document.getElementById('stat-users').textContent = dashboardData.total_users;
            document.getElementById('stat-okr-rate').textContent = `${dashboardData.okr_adoption_rate}%`;
            document.getElementById('stat-assessments').textContent = `${dashboardData.assessment_completion_rate}%`;

            // Show attention section if needed
            if (dashboardData.companies_needing_attention?.length > 0) {
                document.getElementById('attention-section').classList.remove('hidden');
                document.getElementById('attention-list').innerHTML = dashboardData.companies_needing_attention
                    .map(c => `
                        <div class="flex items-center justify-between bg-white p-3 rounded-lg">
                            <span class="font-medium text-gray-900">${escapeHtml(c.name)}</span>
                            <span class="text-sm text-yellow-700">${c.issues.join(', ')}</span>
                        </div>
                    `).join('');
            }
        }

        function renderCompanies() {
            document.getElementById('loading-state').classList.add('hidden');

            if (companiesData.length === 0) {
                document.getElementById('empty-state').classList.remove('hidden');
                return;
            }

            const grid = document.getElementById('companies-grid');
            grid.classList.remove('hidden');
            grid.innerHTML = companiesData.map(company => createCompanyCard(company)).join('');
        }

        function createCompanyCard(company) {
            const healthScore = company.assessment_scores?.overall_score || 0;
            const healthColor = healthScore >= 70 ? 'text-green-600' :
                               healthScore >= 50 ? 'text-yellow-600' : 'text-red-600';

            return `
                <div class="company-card bg-white border border-gray-200 rounded-xl p-5 cursor-pointer"
                     onclick="selectCompany('${company._id}')">
                    <div class="flex items-start justify-between mb-4">
                        <div>
                            <h3 class="text-lg font-bold text-gray-900">${escapeHtml(company.name)}</h3>
                            <p class="text-sm text-gray-600">${company.industry || 'General'} • ${company.employee_count || 0} employees</p>
                        </div>
                        <div class="text-right">
                            <div class="text-xl font-bold ${healthColor}">${healthScore}%</div>
                            <div class="text-xs text-gray-500">Health Score</div>
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-3 mb-4 text-center">
                        <div class="bg-gray-50 rounded-lg p-2">
                            <div class="text-lg font-bold text-gray-900">${company.stats?.users || 0}</div>
                            <div class="text-xs text-gray-600">Users</div>
                        </div>
                        <div class="bg-gray-50 rounded-lg p-2">
                            <div class="text-lg font-bold text-gray-900">${company.stats?.objectives || 0}</div>
                            <div class="text-xs text-gray-600">Objectives</div>
                        </div>
                        <div class="bg-gray-50 rounded-lg p-2">
                            <div class="text-lg font-bold text-gray-900">${company.stats?.assessments || 0}</div>
                            <div class="text-xs text-gray-600">Assessments</div>
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <span class="px-2 py-1 rounded text-xs font-medium ${company.stats?.okr_generated
                            ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">
                            ${company.stats?.okr_generated ? 'OKRs Generated' : 'No OKRs'}
                        </span>
                        <button class="text-purple-600 hover:text-purple-800 text-sm font-medium">
                            View Details →
                        </button>
                    </div>
                </div>
            `;
        }

        function selectCompany(companyId) {
            // Store selected company and navigate
            sessionStorage.setItem('consultant_selected_company', companyId);
            location.href = `/pages/dashboard.html?company=${companyId}`;
        }

        function escapeHtml(text) {
            if (!text) return '';
            const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
            return text.replace(/[&<>"']/g, m => map[m]);
        }

        function showToast(message, type) {
            if (window.Toast) {
                window.Toast[type](message);
            } else {
                alert(message);
            }
        }
    </script>
</body>
</html>
```

---

## Task 3: Update Navigation for Consultants (0.5h)

### File: client/js/navigation.js

Add "Consultant Dashboard" to CONSULTANT nav items:

**Current (line 11-17)**:
```javascript
CONSULTANT: [
    { label: 'Dashboard', href: '/pages/dashboard.html', enabled: true },
    { label: 'Objectives', href: '/pages/objectives.html', enabled: true },
    { label: 'Assessments', href: '/pages/assessment-hub.html', enabled: true },
    { label: 'Teams', href: '/pages/teams.html', enabled: true },
    { label: 'Planning', href: '/pages/planning.html', enabled: true }
],
```

**Change To**:
```javascript
CONSULTANT: [
    { label: 'My Companies', href: '/pages/consultant-dashboard.html', enabled: true },
    { label: 'Dashboard', href: '/pages/dashboard.html', enabled: true },
    { label: 'Objectives', href: '/pages/objectives.html', enabled: true },
    { label: 'Assessments', href: '/pages/assessment-hub.html', enabled: true },
    { label: 'Teams', href: '/pages/teams.html', enabled: true },
    { label: 'Planning', href: '/pages/planning.html', enabled: true }
],
```

---

## Task 4: Testing (2h)

### Test Cases

| Test | Expected Result |
|------|-----------------|
| Load /consultant-dashboard.html as CONSULTANT | Dashboard loads with stats |
| Load as non-CONSULTANT | Redirects to dashboard |
| GET /api/consultant/companies | Returns array of companies with stats |
| GET /api/consultant/dashboard | Returns aggregated statistics |
| Click company card | Navigates to company-specific dashboard |
| No companies | Shows empty state with CTA |

### Multi-Tenant Isolation Tests

| Test | Expected Result |
|------|-----------------|
| Consultant A sees only their companies | No cross-consultant data |
| Company stats isolated | Each company's stats are accurate |
| Navigation shows correct items | "My Companies" only for CONSULTANT role |

---

## Implementation Checklist

### Pre-Implementation
- [ ] Read this spec completely
- [ ] Review existing businesses.js routes

### Task 1: Backend Routes
- [ ] Create `server/routes/consultant.js`
- [ ] Add `GET /companies` endpoint
- [ ] Add `GET /dashboard` endpoint
- [ ] Register route in `server/index.js`
- [ ] Test endpoints with Postman/curl

### Task 2: Frontend Page
- [ ] Create `client/pages/consultant-dashboard.html`
- [ ] Add stats cards
- [ ] Add companies grid
- [ ] Add attention section
- [ ] Test page load and rendering

### Task 3: Navigation
- [ ] Add "My Companies" to CONSULTANT nav
- [ ] Test navigation visibility by role

### Task 4: Testing
- [ ] Test all endpoints
- [ ] Test multi-tenant isolation
- [ ] Test role-based access
- [ ] Test empty states

---

## Dependencies

- **Depends On**: None
- **Blocks**: None

---

## Success Criteria

- [ ] Consultant can view all managed companies
- [ ] Dashboard shows aggregated statistics
- [ ] Company cards link to company-specific views
- [ ] Multi-tenant isolation verified
- [ ] Navigation updated for consultants

---

*Spec created: November 26, 2025*
*Ready for implementation*
