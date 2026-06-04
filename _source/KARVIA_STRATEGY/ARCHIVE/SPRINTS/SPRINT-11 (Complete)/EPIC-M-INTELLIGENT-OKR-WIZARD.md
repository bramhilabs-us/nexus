# Epic M: Intelligent OKR Wizard with Cascade & Gap-Filling

**Epic**: M - Enhanced OKR Creation Experience
**Created**: January 9, 2026
**Story Points**: 45 pts
**Priority**: P1 (High - Core Workflow Enhancement)
**Status**: PLANNING
**Dependencies**: Epic K (Business Metrics) - Sprint 10

---

## Executive Summary

This epic transforms the OKR creation experience with three major enhancements:

1. **Guided Wizard Flow** - Replace modal-based creation with intuitive 4-step wizard
2. **Company → Team Cascade** - AI generates aligned team-level OKRs from company objectives
3. **Gap-Filling Mode** - AI analyzes existing objectives, identifies category gaps, suggests fill-ins

**Primary Goal**: Improve AI-generated OKR quality through better context gathering and intelligent targeting.

---

## Problem Statement

### Current State Pain Points

| Issue | Impact | User Feedback |
|-------|--------|---------------|
| One-time generation only | Can't add OKRs after initial generation | "Feels rigid" |
| No team-level OKRs | Only company-level objectives exist | "Teams need their own goals" |
| Category imbalance | Users create 3 Growth objectives, 0 Operations | "AI doesn't help balance" |
| Modal-based UX | Limited space for guidance/context | "Felt rushed" |
| Generic AI output | Same prompts regardless of what's already created | "Not personalized enough" |

### Business Value

- **30% faster OKR completion** - Guided wizard reduces confusion
- **Better strategic alignment** - Cascade ensures team → company alignment
- **Balanced portfolio** - Gap-filling prevents category blind spots
- **Higher AI relevance** - Context-aware generation improves output quality

---

## Solution Architecture

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        INTELLIGENT OKR WIZARD                                │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────────┐
                    │         ENTRY POINT                  │
                    │   "Create OKRs" on objectives.html   │
                    └─────────────────┬───────────────────┘
                                      │
                    ┌─────────────────▼───────────────────┐
                    │          MODE SELECTION              │
                    │                                      │
                    │   ○ Create New Company OKRs          │
                    │   ○ Fill Category Gaps (AI Suggests) │
                    │   ○ Create Team OKRs (Cascade)       │
                    └─────────────────┬───────────────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         │                            │                            │
         ▼                            ▼                            ▼
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│   NEW COMPANY OKRs   │  │     GAP-FILLING     │  │    TEAM CASCADE     │
│                      │  │                      │  │                      │
│ Step 1: Context      │  │ Step 1: Analysis     │  │ Step 1: Select Team  │
│ - Company profile    │  │ - Existing portfolio │  │ - Choose department  │
│ - SSI scores         │  │ - Category coverage  │  │ - Show team members  │
│ - Business metrics   │  │ - AI gap detection   │  │                      │
│                      │  │                      │  │                      │
│ Step 2: Category     │  │ Step 2: Select Gaps  │  │ Step 2: Parent OKRs  │
│ - Choose MECE cat    │  │ - Show recommended   │  │ - Select company obj │
│ - See SSI scores     │  │ - Allow deselect     │  │ - AI suggests align  │
│ - # to generate      │  │                      │  │                      │
│                      │  │                      │  │                      │
│ Step 3: Generate     │  │ Step 3: Generate     │  │ Step 3: Generate     │
│ - AI creates 1-3     │  │ - AI fills gaps      │  │ - AI creates team    │
│ - Show reasoning     │  │ - Personalized       │  │ - Aligned to parent  │
│                      │  │                      │  │                      │
│ Step 4: Review       │  │ Step 4: Review       │  │ Step 4: Review       │
│ - Edit objectives    │  │ - Edit objectives    │  │ - Edit objectives    │
│ - Edit key results   │  │ - Edit key results   │  │ - Edit key results   │
│ - Approve/dismiss    │  │ - Approve/dismiss    │  │ - Approve/dismiss    │
└──────────┬───────────┘  └──────────┬───────────┘  └──────────┬───────────┘
           │                         │                         │
           └─────────────────────────┼─────────────────────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │         SAVE TO DATABASE         │
                    │                                  │
                    │ - Create Objective documents     │
                    │ - Link team objectives to parent │
                    │ - Update category coverage       │
                    └──────────────────────────────────┘
```

---

## Feature 1: Guided Wizard Flow

### 4-Step Wizard Structure

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Step 1        Step 2         Step 3        Step 4                         │
│  ●───────────○───────────○───────────○                                     │
│  Context       Category       Generate      Review                          │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  STEP 1: Context Review                                                     │
│  ═══════════════════════                                                    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐
│  │ YOUR COMPANY PROFILE                                          [Edit →] │
│  │                                                                         │
│  │ Company: Acme Financial Services                                        │
│  │ Industry: Financial Services → Legacy & Succession                      │
│  │ Employees: 45                                                           │
│  │ Profile Completion: ████████░░ 80%                                      │
│  └─────────────────────────────────────────────────────────────────────────┘
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐
│  │ YOUR SSI SCORES (Speed · Strength · Intelligence)                       │
│  │                                                                         │
│  │ SPEED:        ███████░░░░ 68%   STRENGTH:    █████████░░ 82%           │
│  │                                                                         │
│  │ Weakest Blocks:                 Strongest Blocks:                       │
│  │ ⚠ Decisions (45%)               ✓ People (91%)                          │
│  │ ⚠ Change (52%)                  ✓ Operations (88%)                      │
│  └─────────────────────────────────────────────────────────────────────────┘
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐
│  │ BUSINESS METRICS INSIGHTS                                    [Edit →]   │
│  │                                                                         │
│  │ ⚠ Next-Gen Engagement: 32% (below benchmark 40%)                        │
│  │ ✓ Client Tenure: 12 years (above median)                                │
│  │ ⚠ Succession Plan Rate: 35% (opportunity for growth)                    │
│  └─────────────────────────────────────────────────────────────────────────┘
│                                                                             │
│  Based on your profile and SSI scores, AI will prioritize objectives       │
│  that address your weak areas: Decisions, Change, and Next-Gen Engagement. │
│                                                                             │
│                                              [Cancel]    [Next: Category →] │
└────────────────────────────────────────────────────────────────────────────┘
```

### Step 2: Category Selection

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Step 1        Step 2         Step 3        Step 4                         │
│  ✓───────────●───────────○───────────○                                     │
│  Context       Category       Generate      Review                          │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  STEP 2: Choose Categories                                                  │
│  ═════════════════════════                                                  │
│                                                                             │
│  Select 1-3 categories for AI to generate objectives:                       │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐
│  │ YOUR CURRENT PORTFOLIO                                                  │
│  │                                                                         │
│  │ Growth          ██████████░░░░░░ 2 objectives                          │
│  │ Customer        ████░░░░░░░░░░░░ 1 objective                           │
│  │ Operations      ░░░░░░░░░░░░░░░░ 0 objectives  ← AI RECOMMENDS         │
│  │ People          ░░░░░░░░░░░░░░░░ 0 objectives  ← AI RECOMMENDS         │
│  │ Innovation      ░░░░░░░░░░░░░░░░ 0 objectives                          │
│  │ Financial       ████░░░░░░░░░░░░ 1 objective                           │
│  │                                                                         │
│  │ ⚠ Your portfolio is unbalanced. AI recommends Operations & People.     │
│  └─────────────────────────────────────────────────────────────────────────┘
│                                                                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │ ☑ Operations     │  │ ☑ People         │  │ ☐ Innovation     │          │
│  │                  │  │                  │  │                  │          │
│  │ RECOMMENDED      │  │ RECOMMENDED      │  │                  │          │
│  │ SSI: 88%         │  │ SSI: 91%         │  │ SSI: 65%         │          │
│  │ Existing: 0      │  │ Existing: 0      │  │ Existing: 0      │          │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘          │
│                                                                             │
│  Number of objectives per category:  [ 1 ▼]                                 │
│                                                                             │
│                                        [← Back]    [Next: Generate →]       │
└────────────────────────────────────────────────────────────────────────────┘
```

### Step 3: Generation (with AI Reasoning)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Step 1        Step 2         Step 3        Step 4                         │
│  ✓───────────✓───────────●───────────○                                     │
│  Context       Category       Generate      Review                          │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  STEP 3: AI Generation                                                      │
│  ═════════════════════                                                      │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐
│  │ 🧠 AI REASONING                                                         │
│  │                                                                         │
│  │ Based on your context, I'm generating objectives that:                  │
│  │                                                                         │
│  │ ✓ Target your weakest SSI blocks (Decisions: 45%, Change: 52%)          │
│  │ ✓ Address next-gen engagement gap (32% → target 50%)                    │
│  │ ✓ Fill empty categories (Operations, People)                            │
│  │ ✓ Align with Legacy/Succession industry best practices                  │
│  │                                                                         │
│  │ Generation time: ~5 seconds                                             │
│  └─────────────────────────────────────────────────────────────────────────┘
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐
│  │                                                                         │
│  │             ◐ Generating 2 objectives...                                │
│  │                                                                         │
│  │             [████████████████░░░░░░░░░░░░░░░] 60%                       │
│  │                                                                         │
│  │             Analyzing SSI weak blocks...                                │
│  │             Building industry context...                                │
│  │             Creating Operations objective...                            │
│  │                                                                         │
│  └─────────────────────────────────────────────────────────────────────────┘
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
```

### Step 4: Review & Edit

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Step 1        Step 2         Step 3        Step 4                         │
│  ✓───────────✓───────────✓───────────●                                     │
│  Context       Category       Generate      Review                          │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  STEP 4: Review & Approve                                                   │
│  ════════════════════════                                                   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐
│  │ OBJECTIVE 1                                          Operations │ Edit │ │
│  │                                                                         │
│  │ "Streamline succession plan review process to reduce advisor            │
│  │  administrative burden by 40%"                                          │
│  │                                                                         │
│  │ WHY THIS OBJECTIVE:                                                     │
│  │ Your Decisions SSI score (45%) is low. This objective targets          │
│  │ operational efficiency to free up advisor time for client engagement.   │
│  │                                                                         │
│  │ KEY RESULTS:                                                            │
│  │ ☑ KR1: Reduce plan review time from 4 hours to 2.5 hours per client    │
│  │ ☑ KR2: Implement digital document collection for 80% of clients        │
│  │ ☑ KR3: Achieve 95% client satisfaction with review process             │
│  │                                                                         │
│  │                                         [✓ Approve]  [✗ Dismiss]        │
│  └─────────────────────────────────────────────────────────────────────────┘
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐
│  │ OBJECTIVE 2                                              People │ Edit │ │
│  │                                                                         │
│  │ "Increase next-generation client engagement from 32% to 55%            │
│  │  through structured family meeting program"                             │
│  │                                                                         │
│  │ WHY THIS OBJECTIVE:                                                     │
│  │ Your next-gen engagement (32%) is below industry benchmark (40%).      │
│  │ This is critical for retention during wealth transfer events.           │
│  │                                                                         │
│  │ KEY RESULTS:                                                            │
│  │ ☑ KR1: Conduct 30 multi-generational family meetings (up from 12)      │
│  │ ☑ KR2: Establish direct relationships with 50 next-gen contacts        │
│  │ ☑ KR3: Achieve 85% "next-gen included" rate in succession reviews      │
│  │                                                                         │
│  │                                         [✓ Approve]  [✗ Dismiss]        │
│  └─────────────────────────────────────────────────────────────────────────┘
│                                                                             │
│  2 objectives ready · 0 dismissed                                           │
│                                                                             │
│                                        [← Back]    [Save & Close ✓]         │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Feature 2: Company → Team Cascade

### Cascade Data Model

```javascript
// Objective Model Extension (server/models/Objective.js)

/**
 * Cascade fields - Sprint 11 Epic M
 */
level: {
  type: String,
  enum: ['company', 'team', 'individual'],
  default: 'company',
  index: true
},

parent_objective_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Objective',
  default: null,
  index: true,
  description: 'For team/individual objectives - links to parent company objective'
},

team_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Team',
  default: null,
  index: true,
  description: 'For team-level objectives - which team owns this'
},

alignment_score: {
  type: Number,
  min: 0,
  max: 100,
  default: null,
  description: 'AI-calculated alignment score to parent objective (0-100)'
},

cascade_metadata: {
  inherited_from: String,     // Parent objective title
  alignment_rationale: String, // AI explanation of how this aligns
  created_via: String         // 'wizard_cascade', 'manual', 'ai_generated'
}
```

### Team OKR Wizard Flow

```
┌────────────────────────────────────────────────────────────────────────────┐
│  CREATE TEAM OKRs - Cascade from Company Objectives                        │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  STEP 1: Select Team                                                        │
│  ══════════════════                                                         │
│                                                                             │
│  Which team is creating OKRs?                                               │
│                                                                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │ ● Sales          │  │ ○ Operations     │  │ ○ Client Svc     │          │
│  │   8 members      │  │   12 members     │  │   6 members      │          │
│  │   0 team OKRs    │  │   2 team OKRs    │  │   1 team OKR     │          │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘          │
│                                                                             │
│  Team Lead: Sarah Johnson                                                   │
│  Team Members: [Alice, Bob, Carol, David, Eve, Frank, Grace, Henry]        │
│                                                                             │
│                                              [Cancel]    [Next →]           │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│  STEP 2: Select Parent Company Objectives                                   │
│  ════════════════════════════════════════                                   │
│                                                                             │
│  Which company objectives should this team's OKRs align with?               │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐
│  │ ☑ "Increase next-gen client engagement to 55%"         People           │
│  │    Relevance to Sales: HIGH (direct client contact)                     │
│  │    AI suggestion: Create prospecting objectives for next-gen            │
│  └─────────────────────────────────────────────────────────────────────────┘
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐
│  │ ☑ "Streamline succession plan review process"          Operations       │
│  │    Relevance to Sales: MEDIUM (handoff efficiency)                      │
│  │    AI suggestion: Create referral process objectives                    │
│  └─────────────────────────────────────────────────────────────────────────┘
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐
│  │ ☐ "Achieve 15% revenue growth"                         Financial        │
│  │    Relevance to Sales: HIGH (direct ownership)                          │
│  └─────────────────────────────────────────────────────────────────────────┘
│                                                                             │
│  2 company objectives selected                                              │
│                                                                             │
│                                        [← Back]    [Generate Team OKRs →]   │
└────────────────────────────────────────────────────────────────────────────┘
```

### Cascade API

```javascript
/**
 * POST /api/objectives/cascade
 * Generate team-level objectives aligned to company objectives
 */
router.post('/cascade', authenticateToken, requireRole('MANAGER', 'EXECUTIVE', 'BUSINESS_OWNER', 'CONSULTANT'), async (req, res) => {
  const {
    team_id,
    parent_objective_ids,  // Array of company objective IDs to cascade from
    objectives_per_parent  // How many team objectives per parent (default: 1)
  } = req.body;

  // 1. Fetch team details
  const team = await Team.findById(team_id).populate('members');

  // 2. Fetch parent objectives
  const parentObjectives = await Objective.find({
    _id: { $in: parent_objective_ids },
    company_id: req.user.company_id,
    level: 'company'
  });

  // 3. Fetch company context (SSI, metrics, profile)
  const context = await AIContextService.buildFullContext(req.user.company_id);

  // 4. Build cascade prompt
  const cascadePrompt = buildCascadePrompt({
    team,
    parentObjectives,
    context,
    objectivesPerParent: objectives_per_parent
  });

  // 5. Generate via OpenAI
  const suggestions = await aiOKRService.generateCascadeOKRs(cascadePrompt);

  // 6. Return suggestions (not saved yet - user must approve)
  res.json({
    success: true,
    data: {
      team,
      parent_objectives: parentObjectives,
      suggestions: suggestions.map(s => ({
        ...s,
        level: 'team',
        team_id,
        parent_objective_id: s.aligned_to,
        alignment_score: s.alignment_score,
        cascade_metadata: {
          inherited_from: parentObjectives.find(p => p._id.equals(s.aligned_to))?.title,
          alignment_rationale: s.alignment_rationale,
          created_via: 'wizard_cascade'
        }
      }))
    }
  });
});
```

---

## Feature 3: Gap-Filling Mode

### Gap Detection Algorithm

```javascript
/**
 * GapAnalyzer Service
 * Analyzes existing objectives and identifies category gaps
 */

class GapAnalyzer {
  constructor() {
    this.MECE_CATEGORIES = ['growth', 'customer_success', 'operations', 'people_culture', 'innovation', 'financial_health'];
    this.IDEAL_BALANCE = { min: 1, max: 3 }; // Per category
  }

  /**
   * Analyze company's objective portfolio
   * @param {ObjectId} companyId
   * @returns {Object} Gap analysis results
   */
  async analyzeGaps(companyId) {
    // 1. Get existing active objectives
    const objectives = await Objective.find({
      company_id: companyId,
      status: { $in: ['draft', 'active'] },
      level: 'company'
    });

    // 2. Count by category
    const categoryCounts = {};
    this.MECE_CATEGORIES.forEach(cat => categoryCounts[cat] = 0);
    objectives.forEach(obj => {
      if (categoryCounts[obj.category] !== undefined) {
        categoryCounts[obj.category]++;
      }
    });

    // 3. Identify gaps
    const gaps = [];
    const recommendations = [];

    this.MECE_CATEGORIES.forEach(category => {
      const count = categoryCounts[category];

      if (count === 0) {
        gaps.push({
          category,
          severity: 'critical',
          message: `No ${category} objectives - critical gap`,
          recommendation: 'strongly_recommend'
        });
      } else if (count < this.IDEAL_BALANCE.min) {
        gaps.push({
          category,
          severity: 'warning',
          message: `Only ${count} ${category} objective(s) - below minimum`,
          recommendation: 'recommend'
        });
      }
    });

    // 4. Cross-reference with SSI scores
    const ssiData = await this.getCompanySSI(companyId);
    if (ssiData) {
      gaps.forEach(gap => {
        const categoryBlocks = this.getCategoryBlocks(gap.category);
        const avgScore = this.calculateAvgBlockScore(ssiData, categoryBlocks);

        gap.ssi_context = {
          related_blocks: categoryBlocks,
          avg_score: avgScore,
          priority_boost: avgScore < 50 ? 'high' : avgScore < 70 ? 'medium' : 'low'
        };

        // Boost priority if SSI is weak in this area
        if (avgScore < 50 && gap.severity === 'warning') {
          gap.severity = 'critical';
          gap.recommendation = 'strongly_recommend';
        }
      });
    }

    // 5. Sort by priority
    gaps.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, info: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });

    return {
      total_objectives: objectives.length,
      category_counts: categoryCounts,
      gaps,
      overall_balance_score: this.calculateBalanceScore(categoryCounts),
      recommendation: gaps.length > 0
        ? `${gaps.filter(g => g.severity === 'critical').length} critical gaps found`
        : 'Portfolio is well-balanced'
    };
  }

  /**
   * Map MECE categories to 12-block SSI dimensions
   */
  getCategoryBlocks(category) {
    const mapping = {
      growth: ['market', 'strategy'],
      customer_success: ['delivery', 'quality'],
      operations: ['operations', 'response'],
      people_culture: ['people', 'learning'],
      innovation: ['change', 'data'],
      financial_health: ['financial', 'decisions']
    };
    return mapping[category] || [];
  }

  calculateBalanceScore(counts) {
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    if (total === 0) return 0;

    const ideal = total / 6; // Perfectly balanced
    const variance = Object.values(counts).reduce((sum, count) => {
      return sum + Math.abs(count - ideal);
    }, 0);

    // Score 0-100, where 100 = perfectly balanced
    return Math.max(0, 100 - (variance / total) * 50);
  }
}
```

### Gap-Filling UI

```
┌────────────────────────────────────────────────────────────────────────────┐
│  GAP-FILLING MODE - AI Portfolio Analysis                                  │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  STEP 1: Portfolio Analysis                                                 │
│  ═════════════════════════                                                  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐
│  │ YOUR OBJECTIVE PORTFOLIO                        Balance Score: 42/100   │
│  │                                                                         │
│  │ Growth          ████████████░░░░ 3 objectives                          │
│  │ Customer        ████░░░░░░░░░░░░ 1 objective                           │
│  │ Operations      ░░░░░░░░░░░░░░░░ 0 objectives  ⚠ CRITICAL GAP          │
│  │ People          ░░░░░░░░░░░░░░░░ 0 objectives  ⚠ CRITICAL GAP          │
│  │ Innovation      ░░░░░░░░░░░░░░░░ 0 objectives                          │
│  │ Financial       ████░░░░░░░░░░░░ 1 objective                           │
│  │                                                                         │
│  │ Total: 5 objectives · 2 critical gaps · 1 recommended gap              │
│  └─────────────────────────────────────────────────────────────────────────┘
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐
│  │ 🧠 AI RECOMMENDATIONS                                                   │
│  │                                                                         │
│  │ Your portfolio is heavily weighted toward Growth (60%). This creates   │
│  │ blind spots in operational efficiency and team development.             │
│  │                                                                         │
│  │ Critical gaps to address:                                               │
│  │                                                                         │
│  │ ☑ Operations (SSI: 88%) - High capability, no objectives               │
│  │   → "You're operationally strong but not leveraging it strategically"  │
│  │                                                                         │
│  │ ☑ People (SSI: 91%) - High capability, no objectives                   │
│  │   → "Team strength not captured in formal goals"                        │
│  │                                                                         │
│  │ ☐ Innovation (SSI: 65%) - Moderate capability                          │
│  │   → "Optional - consider after critical gaps filled"                    │
│  └─────────────────────────────────────────────────────────────────────────┘
│                                                                             │
│  Fill 2 gaps with AI-generated objectives?                                  │
│                                                                             │
│                                        [Cancel]    [Generate Gap-Fillers →] │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## AI Quality Enhancements

### Enhanced OKR Generation Prompt

```javascript
/**
 * Build comprehensive AI prompt for OKR generation
 * Integrates: SSI 12-blocks, Business Metrics, Industry Context, Gap Analysis
 */
function buildEnhancedOKRPrompt(context) {
  return `
You are an expert OKR consultant specializing in ${context.company.industry} businesses, particularly ${context.company.industry_subtype || 'general services'}.

=== COMPANY CONTEXT ===
Company: ${context.company.name}
Industry: ${context.company.industry}
Specialization: ${context.company.industry_subtype || 'General'}
Size: ${context.company.employee_count} employees

=== SSI ASSESSMENT RESULTS (12-Block MECE Analysis) ===
Overall Scores:
- Speed: ${context.ssi.speed}% (${getScoreLabel(context.ssi.speed)})
- Strength: ${context.ssi.strength}% (${getScoreLabel(context.ssi.strength)})
- Intelligence: ${context.ssi.intelligence}% (${getScoreLabel(context.ssi.intelligence)})

12-Block Breakdown:
${formatBlockScores(context.ssi.blocks)}

WEAKEST BLOCKS (Priority for Improvement):
${context.ssi.weakest_blocks.map(b => `- ${b.name}: ${b.score}% - ${b.insight}`).join('\n')}

STRONGEST BLOCKS (Leverage Points):
${context.ssi.strongest_blocks.map(b => `- ${b.name}: ${b.score}%`).join('\n')}

=== BUSINESS METRICS (Industry-Specific) ===
${formatBusinessMetrics(context.metrics)}

METRICS INSIGHTS:
${generateMetricsInsights(context.metrics, context.company.industry_subtype)}

=== EXISTING OBJECTIVES PORTFOLIO ===
Current objectives by category:
${formatExistingObjectives(context.existing_objectives)}

Portfolio Balance Score: ${context.gap_analysis.balance_score}/100
${context.gap_analysis.gaps.length > 0 ? `
GAPS IDENTIFIED:
${context.gap_analysis.gaps.map(g => `- ${g.category}: ${g.message}`).join('\n')}
` : 'Portfolio is well-balanced.'}

=== GENERATION REQUEST ===
Categories to generate: ${context.request.categories.join(', ')}
Objectives per category: ${context.request.per_category}
${context.request.mode === 'gap_fill' ? 'Mode: Gap-Filling (prioritize underrepresented categories)' : ''}
${context.request.mode === 'cascade' ? `Mode: Team Cascade (align to parent: "${context.request.parent_objective?.title}")` : ''}

=== INSTRUCTIONS ===
Generate ${context.request.total_count} objective(s) following these guidelines:

1. TARGET WEAK SSI BLOCKS: Each objective should address at least one of the weakest blocks identified above.

2. USE BUSINESS METRICS: Reference specific metrics in key results. For example:
   - If next_gen_engagement_percent is 32%, create KRs like "Increase next-gen engagement from 32% to 50%"
   - Use benchmark data to set realistic but ambitious targets

3. INDUSTRY-SPECIFIC LANGUAGE: Use terminology appropriate for ${context.company.industry_subtype || context.company.industry}:
   ${getIndustryTerminology(context.company.industry_subtype)}

4. BALANCED KEY RESULTS: Each objective should have 3-4 key results:
   - 1 leading indicator (activity-based)
   - 1-2 lagging indicators (outcome-based)
   - 1 quality/satisfaction metric

5. PROVIDE REASONING: For each objective, explain WHY it was chosen based on the context provided.

=== OUTPUT FORMAT ===
Return JSON array:
[
  {
    "title": "Objective title (action-oriented, measurable outcome)",
    "description": "2-3 sentence explanation",
    "category": "one of: growth, customer_success, operations, people_culture, innovation, financial_health",
    "reasoning": "Why this objective based on SSI/metrics/gaps",
    "targeted_blocks": ["block1", "block2"],
    "key_results": [
      {
        "title": "KR title with specific metric",
        "metric_type": "number|percentage|currency|boolean",
        "current_value": 0,
        "target_value": 100,
        "rationale": "Why this target"
      }
    ]
  }
]
`;
}
```

---

## User Stories

### Wizard Flow Stories

| ID | Story | Points | Phase |
|----|-------|--------|-------|
| M1 | OKR Wizard Page Structure | 5 | 1 |
| M2 | Step 1 - Context Review | 5 | 1 |
| M3 | Step 2 - Category Selection | 5 | 1 |
| M4 | Step 3 - Generation with Progress | 5 | 2 |
| M5 | Step 4 - Review & Edit | 5 | 2 |
| M6 | Mode Selection (New/Gap/Cascade) | 3 | 1 |

### Gap-Filling Stories

| ID | Story | Points | Phase |
|----|-------|--------|-------|
| M7 | GapAnalyzer Service | 5 | 2 |
| M8 | Gap Analysis API Endpoint | 3 | 2 |
| M9 | Gap-Filling UI Flow | 5 | 3 |

### Cascade Stories

| ID | Story | Points | Phase |
|----|-------|--------|-------|
| M10 | Objective Model Extensions (level, parent) | 3 | 1 |
| M11 | Cascade API Endpoint | 5 | 3 |
| M12 | Team Selection UI | 3 | 3 |
| M13 | Parent Objective Selection UI | 3 | 3 |
| M14 | Team OKR Review UI | 3 | 3 |

### AI Enhancement Stories

| ID | Story | Points | Phase |
|----|-------|--------|-------|
| M15 | Enhanced OKR Prompt Builder | 5 | 2 |
| M16 | AI Reasoning Display | 3 | 2 |

---

## Implementation Order

### Phase 1: Foundation (13 pts) - Week 1
| Story | Points | Dependencies |
|-------|--------|--------------|
| M1: Wizard Page Structure | 5 | None |
| M6: Mode Selection | 3 | M1 |
| M10: Model Extensions | 3 | None |
| M2: Step 1 Context | 5 | M1, Epic K |

### Phase 2: Core Generation (23 pts) - Week 2
| Story | Points | Dependencies |
|-------|--------|--------------|
| M3: Step 2 Categories | 5 | M2 |
| M15: Enhanced Prompt | 5 | M10 |
| M4: Step 3 Generation | 5 | M3, M15 |
| M5: Step 4 Review | 5 | M4 |
| M7: GapAnalyzer | 5 | None |
| M8: Gap API | 3 | M7 |
| M16: AI Reasoning | 3 | M4 |

### Phase 3: Cascade & Polish (9 pts) - Week 3
| Story | Points | Dependencies |
|-------|--------|--------------|
| M9: Gap-Fill UI | 5 | M8 |
| M11: Cascade API | 5 | M10, M15 |
| M12: Team Selection | 3 | M11 |
| M13: Parent Selection | 3 | M12 |
| M14: Team Review | 3 | M13 |

---

## Testing Requirements

### Unit Tests
- [ ] GapAnalyzer service (gap detection, balance scoring)
- [ ] Enhanced prompt builder
- [ ] Cascade data model virtuals

### Integration Tests
- [ ] Wizard flow state persistence
- [ ] Gap analysis API
- [ ] Cascade generation API
- [ ] AI generation with full context

### E2E Tests
- [ ] Complete wizard flow (new objectives)
- [ ] Gap-filling flow
- [ ] Team cascade flow
- [ ] AI reasoning display

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| OKR creation completion rate | 65% | 85% |
| Portfolio balance score (avg) | 45 | 70 |
| Time to create 5 objectives | 25 min | 10 min |
| AI relevance rating (user) | 3.2/5 | 4.2/5 |
| Team OKR adoption | 0% | 50% |

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Wizard too complex | High | Medium | Progressive disclosure, clear CTAs |
| AI prompt too long | Medium | Medium | Summarize context, cap tokens |
| Cascade creates misalignment | High | Low | Show alignment scores, allow override |
| Gap-fill suggests irrelevant | Medium | Medium | Use SSI context, user can dismiss |

---

## Dependencies

| Dependency | Status | Required For |
|------------|--------|--------------|
| Epic K (Business Metrics) | Sprint 10 | M2 (Context), M15 (Prompt) |
| UnifiedSSIScoringService | Complete | M7 (Gap), M15 (Prompt) |
| Team model | Exists | M10-M14 (Cascade) |

---

## Files to Create/Modify

### New Files
| File | Est. Lines | Purpose |
|------|------------|---------|
| `client/pages/okr-wizard.html` | 800 | Main wizard page |
| `client/js/okr-wizard.js` | 600 | Wizard state/flow |
| `server/services/GapAnalyzer.js` | 200 | Gap detection |
| `server/routes/okr-wizard.js` | 300 | Wizard-specific endpoints |

### Modified Files
| File | Changes |
|------|---------|
| `server/models/Objective.js` | +50 lines (cascade fields) |
| `server/routes/ai-okr.js` | +200 lines (enhanced prompt) |
| `server/services/aiOKRService.js` | +100 lines (cascade generation) |
| `client/pages/objectives.html` | Update "Create" button |

---

## Sprint Sequencing

**Recommended Sprint**: Sprint 12 (after Epic K completes in Sprint 10-11)

**Alternative**: Split across sprints:
- Sprint 11: Phase 1 (Foundation) - 13 pts
- Sprint 12: Phase 2 (Core) - 23 pts
- Sprint 13: Phase 3 (Cascade) - 9 pts

---

**Epic Owner**: Product Team
**Technical Lead**: TBD
**Estimated Duration**: 3 weeks
**Total Story Points**: 45 pts

---

*Created: January 9, 2026*
*Status: PLANNING*
