# Release Engineering

Everything related to releases, onboarding, branding, and deployment.

---

## Folder Structure

```
3-RELEASE-ENGINEERING/
│
├── 1-DEPLOYMENT/           # Deployment guides and checklists
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── PRODUCTION_BRANCH_GUIDE.md
│   └── SECRETS_MANAGEMENT.md
│
├── 2-ONBOARDING/           # Customer onboarding materials
│   ├── CUSTOMER_LANDING.html      # Chief AI landing page
│   ├── CUSTOMER_ONBOARDING.html   # Onboarding flow
│   ├── ONBOARDING_EMAIL.html      # Welcome email
│   ├── KARVIA_QUICK_START_GUIDE.md
│   └── QUICK_MESSAGE_5_STEPS.md
│
├── 3-BRANDING/             # Logo assets by brand
│   ├── chief-ai/           # Chief AI rebrand assets
│   ├── bramhi/             # Bramhi brand assets
│   ├── forge-ai/           # ForgeAI brand assets
│   └── karvia/             # Current Karvia assets
│
├── 4-RELEASES/             # Sprint release emails
│   ├── assets/             # Shared release assets
│   │   ├── css/
│   │   ├── icons/
│   │   └── logos/
│   ├── sprint-XX/          # Current sprint release (create as needed)
│   ├── previews/           # Landing page previews
│   └── templates/          # Reusable templates
│       ├── release-template.html
│       └── email-template.html
│
├── ARCHIVE/                # Historical/duplicate docs
│   ├── old-releases/       # Sprint 2, 10, 11 releases
│   └── duplicate-docs/     # Duplicate root files
│
└── README.md               # This file
```

---

## Quick Links

### For Release Emails

1. **Create new release**: Copy `4-RELEASES/templates/` to `4-RELEASES/sprint-XX/`
2. **Replace placeholders**: Fill in `[PLACEHOLDERS]` with actual content
3. **Gmail version**: Open `email.html` in browser → Cmd+A → Cmd+C → Paste in Gmail

### For Deployment

- Pre-deployment: `1-DEPLOYMENT/DEPLOYMENT_CHECKLIST.md`
- Branch strategy: `1-DEPLOYMENT/PRODUCTION_BRANCH_GUIDE.md`
- Secrets: `1-DEPLOYMENT/SECRETS_MANAGEMENT.md`

### For Onboarding

- Landing page: `2-ONBOARDING/CUSTOMER_LANDING.html`
- Quick start guide: `2-ONBOARDING/KARVIA_QUICK_START_GUIDE.md`
- Welcome email: `2-ONBOARDING/ONBOARDING_EMAIL.html`

---

## The 4-Step Flow (Brand Messaging)

```
ASSESS  →  ALIGN  →  PLAN  →  PLAY
  📊        🎯       📋       ▶️
```

**Tagline**: "SSI shapes goals. Goals shape weeks. Weeks shape results."

| Step | Page | Description |
|------|------|-------------|
| Assess | Assessment | 5-15 min SSI measurement |
| Align | Objectives | AI-generated goals from SSI |
| Plan | Planning | Weekly breakdown |
| Play | Dashboard | Execute and track |

---

## Release Email Process

### Per-Sprint Checklist

```
□ Copy templates to sprint-XX folder
□ Fill in story points and features (2-4 cards)
□ List bug fixes (keep it short)
□ Add CTAs with UTM params
□ Optional: Add vote/feedback section
□ Test Gmail version (copy-paste to draft)
□ Send via Gmail to consultant list
```

### UTM Parameters

Always add tracking:
```
?utm_source=release&utm_campaign=sprintXX
```

### Subject Line Patterns

- `"XX points shipped + [highlight]"`
- `"New: [Feature name]"`
- `"Sprint XX: [Theme]"`

---

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Navy | `#1e3a5f` | Primary, headers |
| Navy Light | `#2d5a87` | Gradients |
| Gold | `#d4a853` | Accents (Chief AI) |
| Green | `#22c55e` | Success, fixes |
| Amber | `#f59e0b` | Warnings, votes |

---

## Logo Assets

| Brand | Location | Status |
|-------|----------|--------|
| Chief AI | `3-BRANDING/chief-ai/` | Proposed rebrand |
| Karvia | `3-BRANDING/karvia/` | Current |
| ForgeAI | `3-BRANDING/forge-ai/` | Alternative |
| Bramhi | `3-BRANDING/bramhi/` | Alternative |

---

*Last Updated: March 6, 2026*
