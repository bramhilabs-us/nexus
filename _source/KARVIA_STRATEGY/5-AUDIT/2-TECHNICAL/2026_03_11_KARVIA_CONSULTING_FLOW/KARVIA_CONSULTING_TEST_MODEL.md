# KARVIA Consulting Test Model (Profile -> SSI -> OKRs -> Daily Tasks)

## 1) Data Flow (matches current implementation)

1. Company Profile is saved from `client/js/company-profile.js` to `PUT /api/companies/:id`.
2. Profile data lands in:
   - `business_context.profile`
   - `business_context.metrics.current`
   - `business_context.targets`
   - `business_context.strategic_vision`
3. SSI data is read by AI from latest assessments via `AIContextService.getFullSSIScores()` and optionally enriched by latest diagnostic report.
4. OKRs are generated with `POST /api/ai-okr/generate-from-company` (uses profile + metrics + SSI + diagnostic signals).
5. Approved OKRs create `Objective` docs with embedded `key_results`.
6. Planning cascades with:
   - `POST /api/planning/generate-weekly-plan` (KR -> quarterly goal -> weekly goals + tasks)
   - `POST /api/planning/generate-tasks` (context-aware task suggestions per weekly goal)
   - `POST /api/planning/tasks/bulk` (persist generated tasks)

## 2) Company Profile Values (use in Company Profile page)

### The Business
- Company Name: `KARVIA Consulting`
- Industry: `consulting`
- Industry Subtype: `it_consulting`
- Employee Count: `58`
- Year Founded: `2017`
- Website: `https://karvia-consulting.com`
- Business Description:
  `KARVIA Consulting helps mid-market service companies design and execute AI-enabled operating models. We combine strategy, data modernization, and implementation sprints to deliver measurable business impact in 90-day cycles.`
- Business Model:
  `Hybrid model: strategy advisory retainers + fixed-fee implementation sprints + managed optimization support.`
- Value Proposition:
  `We turn AI strategy into executed workflows, with clear commercial and operational outcomes, not just recommendations.`
- Primary Revenue Driver:
  `Monthly AI advisory retainers and implementation sprints`
- Ideal Client Profile:
  `US-based service businesses (50-500 employees, $10M-$200M revenue) with fragmented operations and growth pressure.`

### The Numbers (current metrics)
- Annual Revenue: `6800000`
- Revenue Growth %: `9.2`
- Profit Margin %: `18.5`
- Top 5 Clients Revenue %: `43`
- Total Client Families (accounts): `84`
- Client Retention Rate %: `88`
- Avg Client Tenure Years: `2.8`
- Next Gen Engagement %: `22`
- Clients Over 65 %: `0`
- Succession Plans Active: `4`
- Total Advisors (consultants): `36`
- Clients Per Advisor: `7`
- Avg Advisor Age: `37`
- Support Staff Count: `22`

### The Vision
- #1 Priority for Next 12 Months:
  `Scale recurring AI advisory revenue to 40% of total revenue while maintaining delivery quality.`
- Biggest Obstacle:
  `Inconsistent delivery playbooks and utilization volatility across consultant teams.`
- If You Could Change One Thing:
  `Standardize service packaging and implementation methods into repeatable offerings.`
- 12-Month Targets:
  - Target Revenue: `8200000`
  - Target Growth Rate %: `20`
  - Target Client Retention %: `92`
- Long-Term Vision (3-5 years):
  `Become the most trusted AI transformation partner for mid-market service firms on the US West Coast, with productized services, 120 active clients, and 30% EBITDA.`

## 3) SSI Diagnostic Input (test baseline)

### Dimension Scores (0-10)
- Speed: `5.8`
- Strength: `6.2`
- Intelligence: `5.4`

### 12-Block Scores (0-10)
- delivery: `5.3`
- decisions: `5.6`
- change: `6.0`
- response: `6.2`
- financial: `6.4`
- operations: `5.7`
- people: `6.1`
- quality: `6.5`
- market: `5.1`
- data: `5.2`
- strategy: `5.0`
- learning: `6.0`

### Priority Blocks (weakest first)
1. strategy (5.0)
2. market (5.1)
3. data (5.2)
4. delivery (5.3)

## 4) Target OKRs to Approve (quarterly cycle, 4 objectives)

### Objective 1 (growth, high)
Title: `Become the go-to AI growth partner for mid-market service firms`
- KR Q1: `Increase annual revenue run-rate from $6.8M to $7.2M`
- KR Q2: `Increase revenue growth from 9.2% to 13%`
- KR Q3: `Increase active client accounts from 84 to 98`
- KR Q4: `Reduce top-5 client concentration from 43% to 35%`

### Objective 2 (operations, high)
Title: `Deliver consulting outcomes faster with a repeatable execution system`
- KR Q1: `Improve Delivery SSI block from 5.3 to 6.1`
- KR Q2: `Improve Decisions SSI block from 5.6 to 6.4`
- KR Q3: `Increase clients per advisor from 7 to 8.5`
- KR Q4: `Improve project on-time delivery from 71% to 90%`

### Objective 3 (innovation, high)
Title: `Make every client engagement data-driven and strategy-led`
- KR Q1: `Improve Data SSI block from 5.2 to 6.2`
- KR Q2: `Improve Strategy SSI block from 5.0 to 6.3`
- KR Q3: `Increase engagements with AI KPI dashboards from 20% to 70%`
- KR Q4: `Increase clients with 12-month AI roadmap from 15% to 60%`

### Objective 4 (people_culture, medium)
Title: `Build a high-leverage consulting team that scales quality with growth`
- KR Q1: `Increase client retention from 88% to 90%`
- KR Q2: `Increase consultant utilization from 68% to 75%`
- KR Q3: `Reduce voluntary consultant attrition from 18% to 12%`
- KR Q4: `Improve Learning SSI block from 6.0 to 7.0`

## 5) Stakeholder Cascade to Daily Impact Tasks

## Stakeholders
- Managing Partner (Executive Sponsor)
- Head of Delivery
- Strategy Lead
- Data/AI Practice Lead
- RevOps/Sales Lead
- People Ops Lead
- Finance Lead
- Consultant Pods (3 pods)

## Daily recurring tasks by stakeholder
- Managing Partner: Review dashboard by 9:00 AM, clear top blocker, approve one strategic decision.
- Head of Delivery: Run 15-minute daily delivery standup, update utilization and at-risk engagements.
- Strategy Lead: Review roadmap progress for top 5 accounts, escalate any scope drift.
- Data/AI Practice Lead: Track dashboard adoption metrics, unblock data dependencies.
- RevOps/Sales Lead: Update pipeline and proposal conversion metrics, push next best action for top opportunities.
- People Ops Lead: Monitor staffing gaps and hiring pipeline, track attrition risk signals.
- Finance Lead: Validate margin by engagement, flag accounts below target margin threshold.
- Consultant Pods: Complete planned tasks, log progress and blockers in end-of-day update.

## Example Week 1 planning tasks (seed in Planning page)
- CEO: `Approve standardized AI advisory package v1`
- CEO: `Run weekly account risk review with Delivery and Finance`
- Head of Delivery: `Publish delivery playbook template for all pods`
- Head of Delivery: `Create weekly utilization tracker by pod`
- Strategy Lead: `Define account segmentation for top 30 clients`
- Strategy Lead: `Draft 90-day value realization template`
- Data/AI Lead: `Set up client KPI dashboard starter kit`
- Data/AI Lead: `Create data readiness checklist for discovery phase`
- RevOps Lead: `Map proposal stages and baseline win-rate tracking`
- RevOps Lead: `Create top-20 opportunity pursuit plan`
- People Ops Lead: `Launch consultant skills matrix update`
- People Ops Lead: `Publish role-based capability development plan`
- Finance Lead: `Create margin by engagement scorecard`
- Finance Lead: `Set alert for concentration risk >40%`
- Pod A Lead: `Run client discovery for accounts 1-5`
- Pod B Lead: `Run client discovery for accounts 6-10`
- Pod C Lead: `Run client discovery for accounts 11-15`
- All Pods: `Log daily progress and blocker by 5:30 PM`

## 6) Expected Test Outcomes in Tool

- OKR generation should strongly align to:
  - Strategic priority (`recurring revenue mix`)
  - Weak SSI blocks (`strategy`, `market`, `data`, `delivery`)
  - Existing baseline metrics (revenue, growth, retention, concentration, clients/advisor)
- Planning should produce:
  - weekly milestones tied to each KR
  - 3-5 tasks per week
  - assignment inheritance from KR/objective owner (or explicit owner override)
  - visible lineage: Objective -> KR -> Goal -> Task
