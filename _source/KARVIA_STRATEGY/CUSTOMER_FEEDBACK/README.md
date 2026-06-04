# KARVIA Pro - Customer Feedback System
## Product Management Framework for Beta Launch

**Created**: October 21, 2025
**Owner**: Product Management Team
**Purpose**: Collect, analyze, and act on early user feedback

---

## 📁 **FILES IN THIS FOLDER**

1. **[index.html](index.html)** — Feedback Hub home (tiles → forms)
   - 2x2 tile overview covering feedback, bugs, feature ideas, SSI pulse
   - One-click access to lightweight forms that email `rsm@karvia.ai`
   - Great for GitHub Pages or in-app webview

2. **[FEEDBACK_QUESTIONNAIRE.md](FEEDBACK_QUESTIONNAIRE.md)** (33 questions, 8 sections)
   - Complete questionnaire framework
   - Product manager's analysis guide
   - Key metrics and thresholds
   - Action items based on responses

3. **[feedback-form.html](feedback-form.html)** (Interactive survey)
   - Beautiful, responsive HTML form
   - Multi-step progress (8 sections)
   - Email submission to rsm@karvia.ai
   - ~10-12 minute completion time

---

## 🚀 **QUICK START**

### **Option 1: Host on GitHub Pages** (Recommended)

1. **Copy feedback-form.html to repository root or docs folder**:
   ```bash
   cp feedback-form.html /path/to/karvia-business/docs/feedback.html
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from branch "main"
   - Folder: "/docs"
   - Save

3. **Access URL** (after 2-3 minutes):
   ```
   https://myrhydm.github.io/karvia-business/feedback.html
   ```

4. **Share with users**:
   - Email campaign to active users
   - In-app banner for 2 weeks
   - Post-onboarding email (Day 7)

---

### **Option 2: Host Locally** (For Testing)

1. **Open feedback-form.html in browser**:
   ```bash
   open feedback-form.html
   # or
   python3 -m http.server 8000
   # Then visit: http://localhost:8000/feedback-form.html
   ```

2. **Test all 8 sections**:
   - Section 1: User Profile
   - Section 2: Product-Market Fit (PMF)
   - Section 3: User Experience
   - Section 4: Feature Validation
   - Section 5: Net Promoter Score (NPS)
   - Section 6: iBrain Feedback
   - Section 7: Business Impact
   - Section 8: Open Feedback & Contact

3. **Submit test response**:
   - Will be sent to rsm@karvia.ai
   - Check email for JSON formatted response

---

## 📊 **KEY METRICS TO TRACK**

### **1. Product-Market Fit (PMF)**
**Question 6**: "How would you feel if you could no longer use KARVIA Pro?"

**Calculation**:
```
PMF Score = % of "Very disappointed" responses
```

**Thresholds**:
- **< 40%**: ❌ Weak PMF - Don't scale marketing yet
- **40-50%**: 🟡 Good PMF - Continue iterating
- **> 50%**: ✅ Strong PMF - Ready to scale

**Action if < 40%**:
1. Analyze Q7 (primary benefit) - understand value prop gaps
2. Fix top 3 pain points from Q13 (what to improve first)
3. Interview "Very disappointed" users
4. Iterate on core value prop before scaling

---

### **2. Net Promoter Score (NPS)**
**Question 21**: "How likely are you to recommend KARVIA Pro?" (0-10)

**Calculation**:
```
Promoters = Score 9-10
Passives = Score 7-8
Detractors = Score 0-6

NPS = % Promoters - % Detractors
```

**Thresholds** (B2B SaaS):
- **< 0**: 🔴 Critical - High churn risk
- **0-30**: 🟡 Fair - Room for improvement
- **30-50**: 🟢 Good - Healthy product
- **> 50**: 🌟 Excellent - World-class

**Action if < 30**:
1. Call detractors to understand churn drivers
2. Fix top frustration from Q12 immediately
3. Focus on activation (Q14 - successful creation)

---

### **3. Activation Rate**
**Question 14**: "Have you successfully created and tracked objectives?"

**Calculation**:
```
Activation Rate = % "Yes, and I'm actively tracking them"
```

**Target**: > 60% activated

**Action if < 60%**:
1. Simplify onboarding flow
2. Add in-app tutorials
3. Personalized onboarding emails
4. Interview non-activated users (why they didn't finish)

---

### **4. Usage Frequency**
**Question 15**: "How often do you use KARVIA Pro?"

**Calculation**:
```
Active Users = Daily + 2-3 times/week + Weekly
Active User % = Active / Total Responses
```

**Target**: > 40% weekly or more

**Action if < 40%**:
1. Add email reminders (weekly progress updates)
2. Add notifications for objective updates
3. Create habit-forming features (daily check-ins)

---

### **5. Willingness to Pay**
**Question 18**: "Would you pay for KARVIA Pro?"

**Calculation**:
```
WTP = % "Yes, definitely" + % "Yes, probably"
```

**Target**: > 50%

**Insights from Q19 (Price point)**:
- Median willingness-to-pay price
- Price sensitivity analysis

**Insights from Q20 (Pricing model)**:
- Most preferred pricing model
- Segment by company size

---

## 📈 **ANALYSIS WORKFLOW**

### **Step 1: Collect Responses** (Week 1-3)
- Minimum: 30 responses (statistical significance)
- Target: 50+ responses (segmentation)
- Ideal: 100+ responses (robust insights)

**Distribution Channels**:
- Email all active users (last 30 days)
- In-app banner for 2 weeks
- Post-onboarding email (Day 7)
- Social media (Twitter, LinkedIn)

---

### **Step 2: Calculate Metrics** (Week 4)

Use this Google Sheets template to analyze:

**Tab 1: Raw Data**
- Import all responses from email
- One row per response

**Tab 2: Key Metrics**
```
=COUNTIF(Q6, "very_disappointed") / COUNTA(Q6)  // PMF Score
=COUNTIF(Q21, ">=9") / COUNTA(Q21) - COUNTIF(Q21, "<=6") / COUNTA(Q21)  // NPS
=COUNTIF(Q14, "yes_tracking") / COUNTA(Q14)  // Activation Rate
```

**Tab 3: Segments**
- Pivot by Role (Q1)
- Pivot by Company Size (Q2)
- Pivot by Usage Frequency (Q15)

**Tab 4: Open Text Analysis**
- Export Q7, Q12, Q13, Q16, Q22, Q31
- Code for themes (manual or use GPT-4)
- Count frequency of each theme

---

### **Step 3: Identify Insights** (Week 4)

**PMF Analysis**:
- Who are the "Very disappointed" users? (segment by Q1, Q2)
- What features do they use most? (Q9)
- What outcomes have they achieved? (Q28)
- **Hypothesis**: Ideal Customer Profile (ICP)

**NPS Analysis**:
- What are top reasons for Promoters (9-10)? (Q22)
- What are top reasons for Detractors (0-6)? (Q22)
- Correlation: NPS vs Feature usage (Q9)
- Correlation: NPS vs Time saved (Q29)

**Feature Prioritization**:
- Q17: Matrix of importance scores
- Calculate average importance per feature
- Prioritize features with >50% "Critical" ratings

**Pricing Insights**:
- Q19: Median willingness-to-pay
- Segment by company size (Q2)
- Segment by outcomes achieved (Q28)
- Recommend pricing tiers

---

### **Step 4: Take Action** (Week 5+)

**If PMF > 40% AND NPS > 30**:
✅ **Product has found market fit - SCALE!**

1. **Marketing**:
   - Use Q7 language for landing page copy
   - Create case studies from Promoters (Q23)
   - Target similar user segments (Q1, Q2)

2. **Product Roadmap**:
   - Build top 3 features from Q17 (Critical ratings)
   - Address top frustration from Q12
   - Build Q16 (missing features) with >10 mentions

3. **Pricing**:
   - Launch paid plans based on Q19, Q20
   - Test pricing tiers (Free, Pro, Enterprise)
   - Offer iBrain as add-on if Q26 shows demand

4. **Growth**:
   - Create referral program (leverage Q23 advocates)
   - Expand to additional personas (Q1 analysis)
   - Scale marketing budget

---

**If PMF < 40% OR NPS < 30**:
❌ **Product hasn't found fit yet - ITERATE!**

1. **Stop All Marketing**:
   - Don't scale until PMF achieved
   - Focus on current users only

2. **Deep User Research**:
   - Call 10-15 users (mix of Promoters/Detractors)
   - Understand Q7 (benefit) vs Q12 (frustration)
   - Watch users interact with product (screen share)

3. **Fix Core Issues**:
   - Address top 3 frustrations from Q13
   - Simplify onboarding (if Q14 activation low)
   - Fix top blocker preventing usage (Q15 frequency)

4. **Iterate Core Value Prop**:
   - Pivot based on Q8 (what they'd use instead)
   - Double down on Q9 (most valuable feature)
   - Re-survey after 4-6 weeks

---

## 🎯 **SEGMENTATION ANALYSIS**

### **By Role (Q1)**:
| Role | PMF | NPS | Activation | Insights |
|------|-----|-----|------------|----------|
| Business Owner | % | Score | % | Primary buyer persona? |
| Manager | % | Score | % | Day-to-day user? |
| Team Lead | % | Score | % | Influencer? |
| IC | % | Score | % | End user adoption? |

**Action**: Focus product on segment with highest PMF + NPS

---

### **By Company Size (Q2)**:
| Size | PMF | NPS | WTP | Price Point |
|------|-----|-----|-----|-------------|
| 1-10 | % | Score | % | $X/user |
| 11-50 | % | Score | % | $X/user |
| 51-100 | % | Score | % | $X/user |
| 101-200 | % | Score | % | $X/user |

**Action**: Segment pricing by company size

---

### **By Usage Frequency (Q15)**:
| Frequency | Count | PMF | NPS | Outcomes (Q28) |
|-----------|-------|-----|-----|----------------|
| Daily | # | % | Score | Top outcomes |
| Weekly | # | % | Score | Top outcomes |
| Rarely | # | % | Score | Top outcomes |

**Action**: Understand drivers of frequent usage

---

### **By Activation Status (Q14)**:
| Status | Count | NPS | Frustration (Q12) |
|--------|-------|-----|-------------------|
| Activated | # | Score | Top themes |
| Not Activated | # | Score | Blockers |

**Action**: Fix onboarding for non-activated users

---

## 📧 **EMAIL SUBMISSION DETAILS**

**Recipient**: rsm@karvia.ai

**Format**: JSON via FormSubmit.co

**Sample Response**:
```json
{
  "subject": "🎯 KARVIA Pro Feedback Survey Response",
  "q1_role": "manager",
  "q2_size": "11-50",
  "q3_reason": "better_goals",
  "q6_pmf": "very_disappointed",
  "q7_benefit": "Helps me align my team on quarterly goals...",
  "q21_nps": "9",
  "q22_nps_reason": "Game-changer for our team alignment",
  "submitted_at": "2025-10-21T14:30:00Z"
}
```

**Processing**:
1. Responses arrive in rsm@karvia.ai inbox
2. Copy to Google Sheets (manual or Zapier automation)
3. Run analysis formulas
4. Generate weekly summary report

---

## 🛠️ **CUSTOMIZATION**

### **To Change Email Recipient**:
Edit line 1820 in feedback-form.html:
```javascript
const response = await fetch('https://formsubmit.co/YOUR_EMAIL@example.com', {
```

### **To Add/Remove Questions**:
1. Update FEEDBACK_QUESTIONNAIRE.md (framework)
2. Add HTML question to feedback-form.html
3. Update section count (currently 8 sections)
4. Update progress calculation

### **To Change Branding**:
1. Update colors in `<style>` section (currently purple gradient)
2. Replace "KARVIA Pro" with your product name
3. Update logo/favicon

---

## 📞 **SUPPORT**

**Questions about the survey?**
- Email: rsm@karvia.ai
- Slack: #customer-feedback (internal)

**Need help with analysis?**
- See FEEDBACK_QUESTIONNAIRE.md § Analysis Framework
- Book 1:1 with Product team

---

## ✅ **CHECKLIST FOR LAUNCH**

**Before sending survey**:
- [ ] Test all 8 sections on desktop
- [ ] Test all 8 sections on mobile
- [ ] Submit test response → verify email received
- [ ] Customize branding (if needed)
- [ ] Set up Google Sheets for analysis
- [ ] Draft email copy for survey distribution

**Survey distribution**:
- [ ] Email active users (last 30 days)
- [ ] Add in-app banner (2 weeks)
- [ ] Send Day 7 post-onboarding email
- [ ] Post on social media (Twitter, LinkedIn)
- [ ] Share in community channels

**After survey closes**:
- [ ] Export responses to Google Sheets
- [ ] Calculate key metrics (PMF, NPS, Activation)
- [ ] Run segmentation analysis
- [ ] Code open-text responses for themes
- [ ] Create summary presentation for team
- [ ] Share insights with stakeholders
- [ ] Create action plan (roadmap updates)
- [ ] Follow up with interview volunteers (Q32)

---

**Last Updated**: October 21, 2025
**Version**: 1.0 (Beta Launch)
**Status**: ✅ Ready for Distribution
