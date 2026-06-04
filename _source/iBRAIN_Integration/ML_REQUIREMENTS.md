# ML Requirements from KARVIA

<!-- @GENOME T2-INT-004 | ACTIVE | 2026-03-30 | parent:T2-INT-001 | auto:/strategy | linked:/coding -->

> What KARVIA needs from iBrain's ML engines to enhance user experience.

**Status**: DRAFT (Requirements gathering)
**Version**: 0.1

---

## 1. Priority Requirements

### P0: Critical for Post-Beta

#### 1.1 Momentum Detection
**Need**: Know when a user is "in the zone"
**Input**: Task completion patterns, session duration
**Output**: Momentum score (0-100), momentum trend (rising/falling/stable)
**Latency**: < 500ms
**Use Case**: "You're on fire! 3 tasks done before 10am!"

#### 1.2 Risk Prediction
**Need**: Early warning for at-risk objectives
**Input**: Goal progress, velocity, historical patterns
**Output**: Risk score (0-100), predicted completion date, risk factors
**Latency**: < 2s (batch acceptable)
**Use Case**: "This objective may miss target by 2 weeks"

---

### P1: Important for Q3 2026

#### 1.3 Optimal Nudge Timing
**Need**: When to send nudges for maximum impact
**Input**: User activity patterns, response history
**Output**: Best time windows, nudge fatigue score
**Latency**: Background calculation acceptable
**Use Case**: Avoid nudges when user is busy, maximize engagement

#### 1.4 Streak Prediction
**Need**: Predict if user will break streak
**Input**: Recent activity, historical streak data
**Output**: Break probability, intervention recommendation
**Latency**: < 1s
**Use Case**: Proactive "Don't break your streak!" message

---

### P2: Nice to Have

#### 1.5 Task Duration Estimation
**Need**: How long will this task actually take?
**Input**: Task type, user history, similar tasks
**Output**: Estimated duration, confidence interval
**Use Case**: Better planning, more realistic goals

#### 1.6 Team Dynamics
**Need**: Which team members work well together?
**Input**: Collaboration patterns, shared goal success
**Output**: Team synergy scores
**Use Case**: Intelligent task assignment suggestions

---

## 2. Data KARVIA Will Provide

| Data Type | Format | Frequency |
|-----------|--------|-----------|
| Task completions | Event stream | Real-time |
| Goal progress | Event stream | Real-time |
| Session activity | Batch | Hourly |
| User profile (role, tenure) | API | On-demand |
| Historical objectives | Batch | Daily |

---

## 3. Constraints

### KARVIA Cannot Provide:
- Raw user content (task descriptions may contain sensitive info)
- Cross-company data (multi-tenant isolation)
- Financial data (not in our scope)

### KARVIA Requires:
- All ML responses include confidence scores
- Graceful degradation if iBrain unavailable
- No training on KARVIA data without explicit consent

---

## 4. Success Metrics

| Requirement | Success Metric |
|-------------|----------------|
| Momentum detection | 80% user agreement with score |
| Risk prediction | 70% accuracy at 2-week horizon |
| Nudge timing | 20% improvement in response rate |
| Streak prediction | 60% of at-risk streaks saved |

---

## 5. Integration Timeline

| Requirement | Target Release |
|-------------|----------------|
| Momentum detection | Q2 2026 |
| Risk prediction | Q2 2026 |
| Optimal nudge timing | Q3 2026 |
| Streak prediction | Q3 2026 |
| Task duration estimation | Q4 2026 |
| Team dynamics | Q4 2026 |

---

*Requirements owner: KARVIA Product. Implementation owner: iBrain ML team.*
