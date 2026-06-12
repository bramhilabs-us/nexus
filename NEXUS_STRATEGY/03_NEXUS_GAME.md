---
id: nexus.game-model
title: "Nexus: The Game — the whitepaper"
tier: T0
status: active
owner: founder
updated: 2026-06-12
summary: >
  The game view of the whole system: the constitution's stages as levels, the
  drivers as the character sheet, NOF as the quest tree, NBM as the hint
  arrow, provenance as fog of war, the binding articles as anti-cheat.
  Contains the stage-responsive page matrix (every page serves any player at
  any stage — the page-philosophy rule), a full playthrough at a fictional
  ICP-true company, the two-pass friction audit (fourteen frictions, every
  one with a designed fix: Sponsor bridge, instrumentation quest line,
  first-session contract + subtraction rule, the Steward + Calibration
  Review, bedside-manner rules, cohort floor, freshness floor, data covenant,
  triangulation rule, fractal rule), the SaaS value bridge (drivers → the
  financial lines a board already tracks), and the architecture-fit verdict
  (the stage machine is the one missing piece). Reference whitepaper; binding
  implications propagate per the §9 consequence queue; the four candidate
  constitutional additions were ratified with the paper (C-017).
parents:
  - NEXUS_STRATEGY/01_NEXUS_MODEL.md
  - NEXUS_STRATEGY/1-PRODUCT/PRODUCT_STRATEGY.md
children:
  - NEXUS_STRATEGY/0-BUSINESS/COMPANY_JOURNEY.md
  - NEXUS_STRATEGY/04_RUNTIME_MODEL.md
revisit:
  - on: "the first real engagement playtests the game — re-verdict every friction (F1–F8) against what actually happened"
    stage: always
  - on: "the stage-responsive page contract lands in PRODUCT_STRATEGY/TECH_STRATEGY (F5) — update §4's pointers"
    stage: N2
---

# Nexus: The Game

> A whitepaper. The constitution (01) states what Nexus is; the NBM model (02) states
> how it advises; this paper asks whether the whole thing **plays** — stages, rules,
> players, scores, deliverables — from the consultant's first move to the day a company
> reads its own number and knows its own move. It is also an honesty exercise:
> a game on paper is a hypothesis; the friction audit (§6) is the playtest list.

## 0 · Why a game

Transformation run as a *project* fails predictably: the mandate decays, the consultants
leave, the binder gathers dust. Games are the only known social technology that sustains
voluntary, repeated effort over months — because a well-designed game provides what a
mandate cannot: **visible state, immediate feedback, earned advancement, and a win
condition you actually want.**

Nexus does not need gamification sprinkled on top. The constitutional design *already is*
a game, formally: the MATE loop is a game loop (read state → decide → act → learn), the
Staircase is a level map, the drivers are a character sheet, NOF is a quest tree, and the
BOQ ⇄ NBM equality is a win condition with a precise definition. This paper makes the
mapping explicit, then stress-tests it.

## 1 · The game, formally

| Game element | Nexus element | Where defined |
|---|---|---|
| **The board / levels** | The Staircase: Measure → Align → Transform → Evolve; Prospect is the lobby | Constitution §4 |
| **Level entry rule** | Each level opens on the previous level's deliverable (the Roadmap → the Cadence → the Measured Engine → the equality) | Constitution §4 |
| **Character sheet** | The six drivers (ARS · BPI · CFS · BRQ · FLS · CRS) — the company's stats | Constitution §5, Appendix B |
| **Rank / league** | BOQ (the composite) read on the five bands: Reactive → Operational → Structured → AI-Ready → AI-Native | Constitution §5.2–5.3 |
| **Fog of war** | Provenance: Proxy → Partially Measured → Measured. Climbing the ladder *is* lifting the fog — at Evolve the whole map is lit | Constitution Article 2 |
| **Quest tree** | NOF: Objective = campaign · KR = chapter · Milestone = quest (~1 week) · Task = action | NOF.md |
| **Hint arrow** | NBM at three altitudes: company (which driver to attack) · team (which objective) · person (which task, today) | 02_NBM_MODEL §3.2 |
| **The dice vs the DM** | Nexus computes (auditable arithmetic — the dice everyone can read); iBrain predicts (the game master who suggests, with a confidence and a why) | Article 13 |
| **The codex** | @nexus/knowledge — institutional memory; outcome records are the lore the next campaign builds on | TECH_STRATEGY |
| **The referee** | @nexus/governance + the fourteen articles (C-017) | Constitution §7 |
| **Anti-cheat** | Validity floors (no numbers from noise), provenance labels (no silent blending), calibrate-never-invent (no invented scores), the restatement rule (no moving rulers) | Articles 1–4, 10, §5.3 |
| **Season patches** | Anchor packs: dated, versioned, per segment; trends restate on patch day — re-ranked against the new frontier, recomputed from stored signals | Constitution §5.3 |
| **Expansion packs** | Assessment packages: AIR is the launch campaign; any future vertical is a new package on the same engine | Constitution §5.5, C-012 |
| **Win condition** | The equality: BOQ ⇄ NBM — measurement and next move become the same fact in two notations; the loop spins without a guide | Constitution §4, C-015 |

One mapping deserves emphasis because it is the game's deepest mechanic: **the fog of war
is the business model.** Measure sells the first look at the map (all proxy). The
engagement is paid exploration. Evolve is the subscription to a fully-lit, continuously
re-benchmarked map. The player never pays for features — they pay for *visibility and the
moves it makes possible*.

## 2 · The players

Five characters. Four are the constitutional archetypes; the fifth — the Taker — is the
tutorial player, and the game is won or lost with them first (conviction flows up).

| Player | Archetype | Home page | Plays for | Their win | Lost if |
|---|---|---|---|---|---|
| **The Taker** | (any employee, week 1) | the flashcard deck (chrome-less) | being heard — the deck is the first Nexus experience most client employees ever have | "that was respectful, even enjoyable" | it feels like a compliance survey |
| **The Worker** | Worker | Planning | knowing exactly what to do today, and having it count | daily tracking lighter than whatever it replaced; their work visibly rolls up | tracking feels like surveillance or duplicate bookkeeping |
| **The Manager** | Manager | Objectives | turning the roadmap into motion; their objectives advancing | a living board where progress rolls up without chasing people | the board goes stale and they're back to status meetings |
| **The Business Owner** | Business Owner | Dashboard | the program being real; unblocking what isn't | the pulse answers "are we on track, what needs me" in 20 seconds | the dashboard becomes a vanity wall |
| **The Guide** | Consultant | My Clients | the engagement succeeding — *and their own retirement* | handover happens and the client keeps playing | the client's game depends on them (Article 9 violation) |

The Guide is the game's most unusual character: **designed to be deleted.** Article 9 (no
consultant hardcoded) is, in game terms, the rule that the campaign must be soloable. The
Guide walks the first lap, then hands over the controller. BRAMHI's side of the
relationship after that belongs to a second, economically opposite character — the
**Steward** (one-to-many, subscription-side; §6.4), who runs the Calibration Review and
curates the cohort without ever becoming a dependency.

**Authority flows down, conviction flows up** (constitution §4): the CEO authorizes the
game before any Worker touches it, but the game is *won* bottom-up — Taker first, then
Worker, then Manager and Owner, with the buyer convinced last and most durably (BOQ next
to revenue). Every stage's "who must be won" column names the player one level below
where the stage was authorized.

## 3 · PBL — and why Nexus refuses half of it

The classic gamification triad — **Points, Badges, Leaderboards** — is exactly what this
game must *not* naively install. Cosmetic points get farmed (Goodhart's law); badges for
activity reward busywork; leaderboards inside a company turn colleagues into rivals and
gauges into surveillance. Nexus's stances, each grounded in a ratified decision:

- **Points = real scores, or nothing.** Every number is signal-traceable (Article 1),
  floored against noise (Article 3), and labeled with its provenance (Article 2). You
  cannot farm a score whose only source is your actual operation. The floors are the
  anti-grind mechanic: below real activity, the game honestly says *"insufficient
  signal"* instead of awarding points for motion.
- **Badges = transitions, not stickers.** The only badges are the band names and the
  stage entries — and both are *measurability achievements*, not activity counts
  (constitution §4: "a state is a statement of what can be honestly measured").
  Reaching Transform is not a reward; it is the fact that your productivity is now
  measured rather than guessed. Unfakeable by design.
- **Leaderboards = the cohort, never the colleagues.** The benchmark distribution
  (segment-anchored, anonymous) is the only ranking. The company plays against the
  frontier and its own history — never employee vs employee.

That last point is the game's constitutional stance, worth a name:

> **The PvE principle.** Nexus is a co-op game: the company, as one party, versus
> entropy and the frontier. It is never player-versus-player inside the company. No
> individual leaderboards; no gauge feeds a colleague-vs-colleague comparison. The
> appraisal posture stays deliberately open (C-016.4) — but openness means *adapting to
> each company's rhythm*, not drifting into surveillance; the revisit trigger is armed.

This is also the honest answer to "why will Workers play": not points — **relief**. The
game's reward at person altitude is subtractive: fewer status meetings, no duplicate
bookkeeping, a clear answer to "what should I do today." NBM at person altitude is the
hint arrow, and a hint arrow is only welcome when it saves you effort.

## 4 · The pages as places — the stage-responsive contract

The founder's page philosophy, stated as a rule:

> **Every page serves any player at any stage.** A page knows which stage the program is
> in, and delivers what *that* player at *that* stage expects — same place, different
> weather. A page that renders identically at Measure and at Evolve is breaking its
> promise to one of them.

The existing page contract (PRODUCT_STRATEGY) was **player-aware** (primary role, CTA,
empty state) but **stage-blind** — this paper's main architectural finding (friction F5).
The matrix below is what stage-responsiveness means, page by page. **Landed**: the
contract gained its stage-weather and rules-surface fields in PRODUCT_STRATEGY
(N1-P3-07, 2026-06-12); the row logic ships as the **stage machine** (§8), designed in
TECH_STRATEGY at N1-P3-06.

| Page | Prospect (lobby) | Measure | Align | Transform | Evolve |
|---|---|---|---|---|---|
| **My Clients** | prospect tile, *Start assessment* CTA | sprint progress ring, days elapsed | engagement badge, roadmap status | portfolio gauges lighting up | alumni view: subscription health, re-assessment cadence *(F4: whose page is this now?)* |
| **Dashboard** | — (no program yet) | **sprint pulse**: instruments done, participants assessed, days to workshop | commitment view: roadmap → objectives conversion, owners assigned | **execution pulse**: tasks, milestones, at-risk (today's contract) | rhythm view: cadence adherence, BOQ trend, band position |
| **Objectives** | — | teaser: "your assessment will seed these" (empty state already says this) | **seeding**: Opportunity Register → objectives, KRs drafted | the living board: lifecycle ribbons, roll-ups | Sustained KPIs tracked year-over-year |
| **Assessments** | invitation pending | **the stage itself**: the two-week workspace, evidence, scoring workshop | results → *Create objectives* handoff (the product's most important exit) | pulses; instrumentation quests as telemetry connects | recurring decks with deltas; re-benchmarking against the moving frontier |
| **Teams** | — | the interview matrix: who's being assessed, participation | role labels → objective owners mapping | daily fabric: who's in which program | the org map matured: profiles rich, match-grade tags everywhere |
| **Planning** | — | — (Workers aren't in the game yet — their entry is the deck, not this page) | first milestones drafted by Managers | **the stage itself**: the Worker's daily home | cadence on rails; milestone streaks without nudges (the dance) |

Two structural observations fall out of writing this matrix:

1. **Each stage has exactly one "home page" where that stage is *played*** — Measure
   lives on Assessments, Align on Objectives, Transform on Planning, Evolve on Dashboard.
   The staircase maps onto the nav. The game always has a "you are here."
2. **Empty states are stage states.** What the current contract calls an empty state is
   really the page's *pre-stage weather* — "your assessment will seed these" is
   Objectives rendered at Measure. The concept generalizes: a page is never empty, it is
   *early*.

## 5 · The playthrough

**Meridian Systems** — fictional, ICP-true (C-016.5): a 140-person B2B logistics SaaS,
45 engineers, modern pipeline, US-based. The cast: **Maya** (BRAMHI consultant — the
Guide), **Tom** (CEO — Business Owner), **Priya** (VP Engineering — Manager), **Ana**
(staff architect — "Architect" role label → Worker archetype), **Dev** and **Sam**
(senior engineer, product designer — Workers).

**Lobby.** Maya adds Meridian on My Clients. AIR auto-initiates — no manual send. The
game's first human bridge: Tom names a sponsor, the sponsor uploads the interview matrix
to Teams, invitations go out *(friction F1 lives exactly here — see §6)*.

**Measure (weeks 1–2).** Forty-three Meridian people meet Nexus for the first time as a
flashcard deck — chrome-less, the why always on screen. Ana's deck asks how decisions
actually route; Dev's asks where knowledge lives when a teammate leaves. Maya walks the
floor; the tool inventory lands; Day-10 scoring workshop: every adjustment cites its
evidence (Article 4). **ARS 52 — Structured, all proxy.** The Organizational Map plots
Meridian as Productive-but-Fragmented. Deliverable handed over: **the Roadmap**. Tom sees
a number with a band, a provenance label, and a tap-through to every signal under it —
the display rule doing its sales job.

**Align (weeks 3–8).** The Catalyst moment: Tom signs. On Objectives, the Opportunity
Register seeds five objectives — weakest-driver-first (Article 7 says the assessment
prescribes the order; for Meridian, CFS is weakest: decision latency 11 days). Priya owns
two objectives; KRs are drafted; FLS and CFS begin accruing from real planning behavior.
Deliverable forming: **the Cadence** — visible as the first milestone reviews happening
on time without Maya prompting.

**Transform (months 2–7).** Dev and Sam enter the game — Planning is now their home page.
The instrumentation quests run: git connected (week 9), CI connected (week 10), AI-usage
billing (week 12), incident tracker (week 15). **This is the proxy valley** — Meridian is
paying engagement fees while BPI still reads *"insufficient signal"* (the team is below
the AI-utilization floor for the first six weeks). The honest progress display carries
the relationship: **"gauges lit: 5 of 9"** moves visibly every fortnight even when the
scores can't yet. By month 5, BPI comes alive — Measured, not estimated: build-to-burn
61%, cost per ship $11.40. Not elite. *Real.* The first outcome record closes the
decision-latency objective: 11 days → 4 days, evidence attached. Deliverable handed
over: **the Measured Engine.**

**Handover.** Maya's access ends — the Guide retires. Meridian keeps everything.

**Evolve (month 8 →).** The recurring deck greets Ana with her deltas. Quarterly
re-assessment re-benchmarks ARS against the *current* frontier (it moved; her company's
2026 score is restated under the 2027 anchor pack on patch day — same signals, new
ruler, stated openly). BRQ becomes measurable: cadence holding without nudges — the
dance. Eleven months in, Tom's board deck carries a new slide: **BOQ 64, Structured,
Partially Measured → trending Measured**, next to revenue. Under it, one line generated
with a confidence and a why (Article 13): *"Your weakest driver is CRS — three planning
tools doing one job. Recommended next move: consolidate sprint planning into Nexus;
projected +4 BOQ, evidence attached."* Tom doesn't call Maya. He doesn't need to. **The
number and the move are the same fact in two notations. Meridian is playing solo.**

That last paragraph is the entire company strategy in one scene: the win condition isn't
a score — it's the moment the client stops needing anyone to read the score to them.

## 6 · The friction audit — is it a perfect game?

Two audit passes. The first played the game end-to-end and surfaced eight frictions; the
second hunted deliberately for what the first missed and found six more (§6.6). Every
friction now carries either **SOLVED** (the existing design answers it) or **DESIGNED**
(this paper supplies the fix; the consequence queue encodes it).

| # | Friction | What it is | Verdict |
|---|---|---|---|
| **F1** | **The lobby gap** | Add Client auto-initiates AIR — but the client has *zero users* at that moment. Between Maya's click and the first Taker answering sits an unmodeled human bridge. | **DESIGNED** — the Sponsor bridge (§6.1) |
| **F2** | **The proxy valley** | Fees peak (Align–Transform) exactly when measured proof is lowest — the grind levels where players quit MMOs. | **DESIGNED** — the instrumentation quest line (§6.2) |
| **F3** | **The Worker's cold start** | Workers enter at Transform never having seen the game; their first session must be *relief*, not onboarding homework. | **DESIGNED** — the first-session contract + the subtraction rule (§6.3) |
| **F4** | **The Guide's deletion** | Handover revokes consultant access — but Evolve still needs a BRAMHI-side player. Org-direct has *nobody*. | **DESIGNED** — the Steward (§6.4) |
| **F5** | **Stage-blind pages** | Page contracts know their player but not their stage. | **SOLVED on paper** — §4's matrix → PRODUCT_STRATEGY + the stage machine (§8) |
| **F6** | **Hard truths to the king** | FLS tells the founder *he* is the bottleneck. At Evolve the product must deliver hard truths kindly, alone. | **DESIGNED** — the bedside-manner rules (§6.5) |
| **F7** | **Multi-program noise** | A player in two programs context-switches; BOQ is company-level but work is program-level. | **SOLVED** — C-005 switcher + C-016.2 program gauges; watch in beta |
| **F8** | **Endgame legibility** | "BOQ + NBM creates value" must cash out in numbers a board already tracks, or the win condition is self-referential. | **SOLVED by §7** — the value bridge |

### 6.1 · Fix F1 — the Sponsor bridge

The lobby gets a host. **Add Client captures a named Sponsor** — the client's player one
(name + email, one field). The auto-initiated AIR goes to a *person*, never to "the
client." The Sponsor's onboarding is flashcard-grade (the first-impression rule applies
to them hardest of all — they are the engagement's first conviction): a ten-minute deck
covering what AIR is, what the two weeks look like, and what's needed from them. Their
first three actions happen **inside Nexus**: load the interview matrix on Teams (the
playbook's ~35-person matrix becomes a guided import, not a spreadsheet emailed around),
confirm the sprint dates, name the tool-inventory contact. Prospect's exit criterion
becomes crisp and observable, constitutional-style: **sponsor activated + matrix loaded +
sprint scheduled.** The cutscene is now a playable level.

### 6.2 · Fix F2 — the instrumentation quest line

The valley becomes a quest chain with visible XP. Every gauge declares its **arming
checklist** — the telemetry connections and floors (volume *and* recency) it needs before
it may display a number. The Dashboard at Transform renders the quest line as a
first-class object: *"Gauges lit: 5 of 9 — next: connect the incident tracker; MTTR arms
after two weeks of data."* The engagement script sells instrumentation progress as the
mid-game deliverable in its own right: the client is buying visibility, and watching the
fog lift *is* the product working. The valley's emotional design problem — months of
fees with few measured numbers — is answered by making the *approach* to measurement as
legible as measurement itself.

### 6.3 · Fix F3 — the first-session contract + the subtraction rule

A Worker's first session obeys four rules: **(1)** it greets them with their own thread —
*"in week one you told us X; here's what changed because of it"* (the Taker→Worker
continuity, paid off explicitly); **(2)** zero setup — their milestone and tasks arrive
pre-seeded by the Manager's planning; **(3)** it ends inside ten minutes with one real
action logged; **(4)** — **the subtraction rule** — within the first week, the team names
at least one standing meeting or status artifact that the roll-up now makes redundant,
and kills it, visibly. Adoption is purchased with removal, never with features. The
Worker's reward at person altitude is structural relief; rule 4 makes the relief
undeniable and dated.

### 6.4 · Fix F4 — the Steward

BRAMHI's presence splits into two characters with opposite economics. The **Guide**
(consultant): one-to-one, engagement-priced, retires at handover — unchanged. The
**Steward**: one-to-many, subscription-side, BRAMHI's standing character in Evolve. The
productized core runs alone — automated re-assessments, pulses, benchmark context, NBM
cards — preserving Article 9 (no consultant dependency; org-direct works fully). The
Steward adds **one human touchpoint per cycle: the Calibration Review** — a
consultant-grade session that (a) delivers the cycle's hardest truths with human craft
(the F6 valve), (b) runs calibrate-never-invent on the re-assessment (Article 4 needs a
qualified human anyway), (c) owns the renewal conversation, and (d) **curates the
cohort** — every review sharpens the anchors, making the Steward the flywheel's named
operator rather than its absentee landlord. Org-direct clients can buy the review as an
add-on; they never need it. Pricing folds into the existing Builder-pricing TODO
(BUSINESS_MODEL — deliberately unpriced until 2–3 real handovers).

### 6.5 · Fix F6 — the bedside-manner rules

Five display rules for negative gauges — how a product tells a king he is the bottleneck:

1. **No verdict without a path.** A score below its band's midpoint never renders without
   its paired NBM. Position and gradient arrive together — the equality, used as
   kindness. A number alone is a judgment; a number with a move is a plan.
2. **The implicated see it first.** FLS-grade findings render privately to the player
   they implicate before any shared surface shows them. Nobody learns about their own
   weakness from a meeting.
3. **Trend before position.** Negative gauges lead with you-vs-your-last-measurement,
   then you-vs-frontier. Losing to yourself motivates; losing to the world shames.
4. **Evidence is dignity.** The drill-down (Article 1) means a hard truth is never an
   opinion — it is a walk down to facts the player can inspect and contest.
5. **The Steward valve.** Each cycle's hardest truth routes through the human
   Calibration Review, never through a push notification.

### 6.6 · The second audit — six more frictions, found and fixed

Hunting deliberately for what the first pass missed:

| # | Friction | The fix |
|---|---|---|
| **F9** | **The Manager's squeeze.** Managers do the most data entry (KRs, milestones, reviews) while the gauges mostly judge the company and the founder — the middle player carries the game and gets the least personal payoff. Classic middle-management adoption death. | Team-altitude NBM is *the Manager's* surface — their hint arrow ("which objective deserves focus now") goes first-class on Objectives. Planner-seam AI drafting takes the clerical weight of KRs/milestones (the mockups' quiet AI-draft CTA, promoted to strategy). And the subtraction rule applies doubly to them: status meetings die first, and the roll-up ends status-chasing — the Manager's relief is the largest in the company. |
| **F10** | **The empty league.** Early clients join a leaderboard with nobody on it — benchmarks are borrowed research + Karvia (n=1), and a fake percentile would poison the standard. | **The cohort floor** (candidate honesty rule): below N measured companies in a segment, show anchor placement (labeled research-grade) and self-trend only. Percentiles appear only when the segment cohort is real. The league displays honestly as *forming*, never as fake. |
| **F11** | **Stale fuel.** Gauges depend on humans logging; if logging decays mid-Transform, the game shows old state as current truth — save-game corruption that flatters everyone. | **Freshness joins the floors** (candidate Article 3 extension): validity floors gain a recency dimension; every gauge carries data-freshness; a stale gauge says *"running on old data"* instead of displaying confidently. Logging cadence itself feeds BRQ — letting the fuel decay *is* a rhythm failure, and the game says so. |
| **F12** | **The two-clock conflict.** BRAMHI's flywheel wants cohort data; the client wants results. Unmanaged, the conflict shows up as re-assessment cadences set by BRAMHI's data hunger, and as ambiguity over who owns the signals — which enterprise procurement will ask about on day one. | **The data covenant**: the client owns their signals, raw and forever; BRAMHI receives anonymized, segment-aggregated derivatives by contract; the flywheel never touches raw client data; re-assessment cadence is set by the client's calendar. Stated in the playbook and the contract before anyone asks. |
| **F13** | **Sandbagging the baseline.** Entry assessments can be gamed in both directions — down (a low baseline makes the sponsor's transformation story heroic) or up (impression management). Proxy-stage scores carry human motives. | **The triangulation rule**: no stakes-bearing driver is scored from a single channel. Survey claims are cross-checked by observation at Measure (the sprint already collects both — the cross-check becomes mandatory at the scoring workshop, Article 4's evidence requirement doing double duty) and by telemetry from Transform onward, which quietly re-scores the baseline's honesty. |
| **F14** | **The builder game has no win condition.** Post-handover product teams never saw the staircase — their game is NOF + gauges, and nothing tells them what winning looks like. A game without a win condition is a chore list. | **The fractal rule**: the game is self-similar at every scale. Each objective is a mini-lap of MATE — baseline (measure) → KRs (align) → execution (transform) → outcome record (evolve). The company's lap is made of objective laps; a week's milestone beat is the smallest lap of all. Builder mode's win condition is already in NOF — outcome records and Sustained KPIs are the trophy room — it just needed *saying*. The staircase the client climbed once, their objectives now climb forever. |

**Verdict, revised: every known friction now has a designed answer on paper — eight from
the first audit, six from the second.** What remains genuinely open is only what paper
cannot settle: whether the designs survive contact with real players. Two items are
*watched* rather than fixed: time-to-first-truth (fourteen days from lobby to ARS — paid
diagnosis buyers accept it; org-direct buyers someday may not) and Steward pricing
(deliberately folded into the Builder-pricing TODO). The playtest is BRAMHI dogfooding
plus engagement #1, and this section is the playtest scorecard — the revisit trigger
re-verdicts every row against reality.

## 7 · What "value" means in a SaaS business — the endgame, grounded

The industry's best-understood value language for a software company, in rough order of
board attention: **revenue growth · net revenue retention (NRR) · gross margin · Rule of
40** (growth % + free-cash-flow margin % ≥ 40) · **LTV/CAC · burn multiple · ARR
multiple** (valuation). Any claim that Nexus "creates value" must cash out in those
units. The bridge, driver by driver:

| Driver | Financial line it moves | Mechanism |
|---|---|---|
| **BPI** | R&D ROI; gross margin; the cost side of Rule of 40 | TLO recovery — wasted AI spend, $/shipped change, velocity. The Eight Metrics literally denominate in dollars ($1.4–2.5M per 10 engineers at stake) |
| **CFS** | Opex; management overhead | The coordination tax: meeting load, decision latency, dependency delays — measured, then reduced |
| **BRQ** | Forecast accuracy; predictability | A company on cadence ships when it says it will; predictability is what boards actually buy with "operational excellence" |
| **FLS** | Key-man risk; valuation discount; succession | A company that runs through one person is worth less — measurably; owners eyeing exit feel this driver personally |
| **CRS** | Tool spend; consolidation savings | The $40–80k/yr stack rationalized; capability-replication time shortened |
| **ARS** | Optionality; future-proofing | Readiness against a moving frontier — the insurance line, re-priced every cycle |

The honest scope (C-016.3) bounds the claim: **Nexus moves the engine's side of Rule of
40 — efficiency, predictability, cost — not the steering's side** (growth from
product-market fit). A BOQ-90 company building the wrong product is still possible, and
we say so (constitution §9).

So the endgame, precisely: **the game is won when ΔBOQ visibly co-moves with numbers the
board already tracked before Nexus existed** — R&D efficiency, opex per engineer,
forecast hit-rate, Rule of 40 — *and* the planning cadence runs on NBM without external
prompting. Two clocks run simultaneously: the client's win (the equality, §5's final
scene) and BRAMHI's win (every measured company densifies the cohort that makes BOQ the
standard — the flywheel, which is BRAMHI's game, not the client's).

## 8 · Does the lego architecture support the game?

The four layers are the game's anatomy: **pages are the board, business logic is the
rules, models are the state, and the intelligence layer is the game master's voice**
(the fourth layer entered by 04_RUNTIME_MODEL / C-020 after this paper was ratified).
Module by module:

| Module | Game subsystem |
|---|---|
| @nexus/crm | the lobby: tenancy, players, roles, the pipeline |
| @nexus/assessment | character creation + the recurring exam engine (expansion packs plug here) |
| @nexus/objectives · key-results · milestones · tasks | the quest tree (NOF), with the roll-up as the score pipeline |
| @nexus/governance | the referee: decision rights, accountability, the articles in code |
| @nexus/knowledge | the codex: outcome records, institutional memory |
| iBrain (external) | the game master: pattern detection, planning, prediction — always behind the computes/predicts seam (Article 13) |

The fit is strong, with **one missing piece the game frame exposes: the stage machine.**
The program lifecycle (Prospect → Measure → Align → Transform → Evolve) is the game's
level controller — every stage-responsive page (§4), every gauge-unlock, every
deliverable handover keys off it. Today it exists as a pipeline badge on a client tile;
the game needs it as a first-class Layer-2 engine: a program carries its stage, stages
transition on the constitutional entry moments (crisp, observable — §4 of the
constitution), and transitions emit the events everything else subscribes to (pages
re-weather, gauges arm, decks re-schedule, the registry updates). This is the single
concrete engineering requirement this whitepaper adds to the TECH_STRATEGY queue.

Everything else the game needs, the architecture already promised: pluggable assessments
are expansion packs; anchor packs are season patches with restatement as the re-rank;
the signal store is the replay file (any score recomputable under any ruler, forever —
Article 1's quiet superpower).

## 9 · The paper's binding outputs

This is a reference document; these are the items it hands to the consequence queue:

1. **The stage-responsive page contract** (F5): PRODUCT_STRATEGY's page contract gains a
   stage dimension; §4's matrix is the draft content. Empty states reframe as *early*
   states.
2. **The stage machine** (§8): program stage as a first-class Layer-2 engine →
   TECH_STRATEGY.
3. **The Sponsor bridge** (§6.1) → AI_CONSULTING_PLAYBOOK (sponsor onboarding step) +
   My Clients/Teams contracts (sponsor field, guided matrix import) + the Prospect exit
   criterion.
4. **The instrumentation quest line** (§6.2) → Dashboard's Transform-stage contract +
   the engagement script; arming checklists live per-gauge in the scores library.
5. **The first-session contract + the subtraction rule** (§6.3) → PRODUCT_STRATEGY
   (Planning) + N3 UI design; the subtraction rule is also a playbook move.
6. **The Steward + the Calibration Review** (§6.4) → BUSINESS_MODEL (subscription
   service shape; pricing stays in the Builder TODO) + AI_CONSULTING_PLAYBOOK (the
   review's format) — *founder ratifies the model at read-through*.
7. **The bedside-manner rules** (§6.5) → DESIGN_LANGUAGE / display doctrine + N3 UI
   exploration.
8. **The data covenant** (F12) → AI_CONSULTING_PLAYBOOK + the engagement contract
   template — *founder ratifies at read-through*.
9. **The triangulation rule** (F13) → SCORING_MODEL (mandatory cross-channel check at
   the scoring workshop).
10. **The fractal rule** (F14) → NOF.md (the objective as a MATE mini-lap) +
    PRODUCT_STRATEGY (builder mode's win condition stated).
11. **The value bridge** (§7) → AI_CONSULTING_PLAYBOOK collateral (the board-language
    translation of the drivers).
12. **Candidate constitutional additions** — four small honesty/display rules this paper
    surfaced, for founder ratification at the constitution read-through (Article 12):
    the **cohort floor** (F10 — no percentile below a real segment cohort), the
    **freshness floor** (F11 — validity floors gain a recency dimension), **no verdict
    without a path** (§6.5 rule 1 — an Article 6 display extension), and the **PvE
    principle** (§3 — no gauge ever feeds colleague-vs-colleague comparison).

The thesis of the paper, one line: **Nexus is a co-op game where a company plays against
its own entropy on a board it progressively lights up — and the business model is simply
that visibility is worth paying for, stage after stage, until the player no longer needs
the guide.**
