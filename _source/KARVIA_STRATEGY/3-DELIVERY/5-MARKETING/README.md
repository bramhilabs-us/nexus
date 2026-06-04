# Marketing Collaterals

**Version**: 1.0.0
**Created**: March 10, 2026
**Purpose**: Central hub for all marketing, education, and communication materials

---

## Folder Structure

```
5-MARKETING/
├── 1-RELEASE-COMMUNICATIONS/    # Release emails, announcements, changelogs
├── 2-PRODUCT-EDUCATION/         # Feature explainers, how-to content
├── 3-VALUE-PROPOSITION/         # ROI calculators, case studies, benefits
├── 4-USER-GUIDES/               # Onboarding, tutorials, quick starts
├── 5-FEEDBACK-SURVEYS/          # NPS surveys, feature requests, feedback forms
├── 6-SOCIAL-MEDIA/              # LinkedIn posts, tweets, social assets
├── 7-SALES-ENABLEMENT/          # Pitch decks, one-pagers, demos
├── 8-TEMPLATES/                 # Reusable templates for all content types
└── README.md                    # This file
```

---

## Folder Descriptions

### 1-RELEASE-COMMUNICATIONS
Release-related communications sent to users.

| Content Type | Description |
|--------------|-------------|
| Release Emails | Sprint release announcements |
| Changelogs | Version-specific feature lists |
| What's New | In-app notification content |
| Maintenance Notices | Downtime/update notifications |

**Naming**: `RELEASE-SXX-EMAIL.md`, `CHANGELOG-vX.X.X.md`

---

### 2-PRODUCT-EDUCATION
Content that teaches users about features and capabilities.

| Content Type | Description |
|--------------|-------------|
| Feature Explainers | Deep-dives into specific features |
| Best Practices | How to get the most from Karvia |
| Use Cases | Industry-specific applications |
| Video Scripts | Scripts for tutorial videos |

**Naming**: `EXPLAINER-[feature].md`, `USECASE-[industry].md`

---

### 3-VALUE-PROPOSITION
Materials demonstrating Karvia's business value.

| Content Type | Description |
|--------------|-------------|
| ROI Calculator | Excel/interactive ROI tools |
| Case Studies | Customer success stories |
| Competitive Analysis | vs. competitors positioning |
| Benefits Matrix | Feature-to-benefit mapping |

**Naming**: `CASESTUDY-[company].md`, `ROI-CALCULATOR.xlsx`

---

### 4-USER-GUIDES
Step-by-step guidance for users.

| Content Type | Description |
|--------------|-------------|
| Onboarding Guide | First-time user walkthrough |
| Quick Start | 5-minute setup guide |
| Role Guides | Per-role (Owner, Manager, Employee) |
| Admin Guide | System administration |

**Naming**: `GUIDE-[topic].md`, `QUICKSTART-[role].md`

---

### 5-FEEDBACK-SURVEYS
User feedback collection materials.

| Content Type | Description |
|--------------|-------------|
| NPS Surveys | Net Promoter Score templates |
| Feature Requests | Feature voting forms |
| Exit Surveys | Churn analysis questions |
| Satisfaction Polls | In-app micro-surveys |

**Naming**: `SURVEY-[type].md`, `NPS-TEMPLATE.md`

---

### 6-SOCIAL-MEDIA
Social platform content.

| Content Type | Description |
|--------------|-------------|
| LinkedIn Posts | Professional network content |
| Twitter/X | Short-form announcements |
| Product Hunt | Launch materials |
| Visual Assets | Images, GIFs, short videos |

**Naming**: `LINKEDIN-[topic].md`, `VISUAL-[name].png`

---

### 7-SALES-ENABLEMENT
Materials for sales conversations.

| Content Type | Description |
|--------------|-------------|
| Pitch Decks | Presentation slides |
| One-Pagers | Single-page product summaries |
| Demo Scripts | Product demonstration guides |
| Objection Handling | FAQ for sales calls |

**Naming**: `PITCH-[audience].pptx`, `ONEPAGER-[focus].pdf`

---

### 8-TEMPLATES
Reusable templates for consistency.

| Content Type | Description |
|--------------|-------------|
| Email Templates | Release, onboarding, follow-up |
| Document Templates | Headers, footers, styling |
| Presentation Templates | Slide masters |
| Social Templates | Post formats |

**Naming**: `TEMPLATE-[type].md`

---

## Relationship to Release Engineering

This folder works alongside [3-RELEASE-ENGINEERING](../3-RELEASE-ENGINEERING/):

| Release Engineering | Marketing |
|---------------------|-----------|
| Technical deployment | User communication |
| Changelog generation | Release email creation |
| Version management | Feature announcement |
| Production checks | User education updates |

**Workflow**: After each sprint release, create materials in `1-RELEASE-COMMUNICATIONS/` to announce to users.

---

## File Naming Convention

```
[TYPE]-[TOPIC/VERSION]-[DATE].ext

Examples:
- RELEASE-S18-EMAIL-20260310.md
- EXPLAINER-SSI-SCORING.md
- CASESTUDY-AIRPRODUCTS.md
- GUIDE-ONBOARDING-OWNER.md
```

---

## Quality Standards

All marketing content should follow:

1. **Brand Voice**: Professional, helpful, clear
2. **Design**: Navy/Gold color palette (see `.claude/DESIGN_SYSTEM.md`)
3. **Accessibility**: Alt text, readable fonts
4. **Accuracy**: Verified against current product state
5. **Review**: Spell-checked, fact-checked before publish

---

**Maintained By**: Product & Marketing Team
**Last Updated**: March 10, 2026
