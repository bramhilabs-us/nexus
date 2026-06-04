# Epic T: Navigation Visual Enhancement

**Epic ID**: T
**Sprint**: 13 (or can be added to Sprint 11)
**Story Points**: 5 pts
**Priority**: Medium
**Status**: SPECIFICATION COMPLETE

---

## Executive Summary

Enhance the navigation bar with visual grouping that reflects the **PLAY → ASSESS → ALIGN → PLAN** product philosophy. This is a UI-only change with no backend modifications.

### Key Changes

| Aspect | Before | After |
|--------|--------|-------|
| Order | Dashboard, Objectives, Assessments, Teams, Planning | Dashboard, Assessments, Teams, Objectives, Planning |
| Grouping | None | Visual dividers between philosophy groups |
| Accent | Gray underline on active | Color-coded underline per philosophy |
| Tooltip | None | Custom tooltip with philosophy description |

---

## Product Philosophy Mapping

```
PLAY → ASSESS → ALIGN → PLAN
  │       │        │       │
  │       │        │       └── Objectives + Planning (set direction, execute)
  │       │        └── Teams (get everyone aligned)
  │       └── Assessments (understand organization)
  └── Dashboard (daily focus, your work)
```

**User Journey:**
1. **PLAY** - Where am I today? What do I do now?
2. **ASSESS** - How is our organization performing?
3. **ALIGN** - Are our teams structured and aligned?
4. **PLAN** - What objectives do we set? How do we execute?

---

## Visual Design Specification

### Navigation Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [Logo]                                                        [User ▼]     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Dashboard  │  Assessments  │  Teams  │  Objectives   Planning             │
│      ▔▔▔           ▔▔▔▔          ▔▔▔▔       ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔                │
│   (purple)       (blue)       (green)          (orange)                     │
│     PLAY         ASSESS        ALIGN              PLAN                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Divider Placement

```
Dashboard  │  Assessments  │  Teams  │  Objectives   Planning
    ↑              ↑            ↑              ↑
   PLAY          ASSESS       ALIGN          PLAN
                                        (no divider - same group)
```

**3 dividers:**
1. After Dashboard (PLAY | ASSESS)
2. After Assessments (ASSESS | ALIGN)
3. After Teams (ALIGN | PLAN)

### Color Palette

| Philosophy | Color Name | Hex | Nav Items |
|------------|------------|-----|-----------|
| **PLAY** | Purple | `#8B5CF6` | Dashboard |
| **ASSESS** | Blue | `#3B82F6` | Assessments |
| **ALIGN** | Green | `#10B981` | Teams |
| **PLAN** | Orange | `#F59E0B` | Objectives, Planning |

### Tooltip Content

| Nav Item | Tooltip |
|----------|---------|
| Dashboard | "Play - Your daily focus and tasks" |
| Assessments | "Assess - Understand your organization" |
| Teams | "Align - Get everyone on the same page" |
| Objectives | "Plan - Set strategic direction" |
| Planning | "Plan - Execute your weekly goals" |

**Tooltip Behavior:**
- Custom styled (matches brand)
- 500ms hover delay before showing
- Dark background (#1F2937), white text
- Positioned below nav item
- Subtle fade-in animation

---

## Technical Specification

### Files to Modify

| File | Changes |
|------|---------|
| `client/js/navigation.js` | Reorder items, add philosophy metadata, render dividers & tooltips |

### Code Changes

#### navigation.js - Updated navItems Config

```javascript
this.navItems = {
    CONSULTANT: [
        {
            label: 'Dashboard',
            href: '/pages/dashboard.html',
            enabled: true,
            philosophy: 'play',
            color: '#8B5CF6',
            tooltip: 'Play - Your daily focus and tasks',
            dividerAfter: true
        },
        {
            label: 'Assessments',
            href: '/pages/assessment-hub.html',
            enabled: true,
            philosophy: 'assess',
            color: '#3B82F6',
            tooltip: 'Assess - Understand your organization',
            dividerAfter: true
        },
        {
            label: 'Teams',
            href: '/pages/teams.html',
            enabled: true,
            philosophy: 'align',
            color: '#10B981',
            tooltip: 'Align - Get everyone on the same page',
            dividerAfter: true
        },
        {
            label: 'Objectives',
            href: '/pages/objectives.html',
            enabled: true,
            philosophy: 'plan',
            color: '#F59E0B',
            tooltip: 'Plan - Set strategic direction',
            dividerAfter: false
        },
        {
            label: 'Planning',
            href: '/pages/planning.html',
            enabled: true,
            philosophy: 'plan',
            color: '#F59E0B',
            tooltip: 'Plan - Execute your weekly goals',
            dividerAfter: false
        }
    ],
    // Same pattern for BUSINESS_OWNER, EXECUTIVE, MANAGER, EMPLOYEE
};
```

#### navigation.js - Updated renderNavigation()

```javascript
renderNavigation() {
    // ... existing setup code ...

    const navHTML = `
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center space-x-3">
                    <img src="/images/CD_Logo_WSlogan.png" alt="Cultural Discipline" class="h-8">
                </div>
                <div class="flex items-center">
                    ${items.map((item, index) => {
                        const isActive = currentPath.includes(item.href.replace('/pages/', ''));
                        const activeStyle = isActive ? \`border-bottom: 2px solid \${item.color}\` : '';

                        return \`
                            <a href="\${item.href}"
                               class="nav-item \${isActive ? 'active' : ''} px-3 py-2 text-sm font-medium transition-colors text-gray-600 hover:text-gray-900 relative group"
                               style="\${activeStyle}"
                               data-philosophy="\${item.philosophy}"
                               data-color="\${item.color}">
                                \${item.label}
                                <span class="nav-tooltip">\${item.tooltip}</span>
                            </a>
                            \${item.dividerAfter ? '<span class="nav-divider"></span>' : ''}
                        \`;
                    }).join('')}
                </div>
                <!-- User menu (unchanged) -->
            </div>
        </div>
        <style>
            .nav-divider {
                display: inline-block;
                width: 1px;
                height: 20px;
                background-color: #E5E7EB;
                margin: 0 4px;
                vertical-align: middle;
            }
            .nav-item:hover {
                border-bottom: 2px solid var(--hover-color, #6B7280);
            }
            .nav-item[data-philosophy="play"]:hover { border-bottom-color: #8B5CF6; }
            .nav-item[data-philosophy="assess"]:hover { border-bottom-color: #3B82F6; }
            .nav-item[data-philosophy="align"]:hover { border-bottom-color: #10B981; }
            .nav-item[data-philosophy="plan"]:hover { border-bottom-color: #F59E0B; }
            .nav-tooltip {
                position: absolute;
                bottom: -35px;
                left: 50%;
                transform: translateX(-50%);
                background: #1F2937;
                color: white;
                padding: 6px 10px;
                border-radius: 6px;
                font-size: 12px;
                white-space: nowrap;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.2s ease, visibility 0.2s ease;
                pointer-events: none;
                z-index: 100;
            }
            .nav-tooltip::before {
                content: '';
                position: absolute;
                top: -6px;
                left: 50%;
                transform: translateX(-50%);
                border-width: 0 6px 6px 6px;
                border-style: solid;
                border-color: transparent transparent #1F2937 transparent;
            }
            .nav-item:hover .nav-tooltip {
                opacity: 1;
                visibility: visible;
                transition-delay: 500ms;
            }
            @media (max-width: 768px) {
                .nav-divider { height: 16px; margin: 0 2px; }
                .nav-tooltip { display: none; }
            }
        </style>
    `;

    navContainer.innerHTML = navHTML;
    // ... rest of existing code ...
}
```

---

## User Stories

### T1: Reorder Navigation Items (1 pt)

**As a** user
**I want** the navigation to follow the PLAY → ASSESS → ALIGN → PLAN order
**So that** the navigation reflects the natural workflow

**Acceptance Criteria:**
- [ ] Navigation order: Dashboard, Assessments, Teams, Objectives, Planning
- [ ] All roles see the same order (with role-appropriate items)
- [ ] No broken links

### T2: Add Visual Dividers (1 pt)

**As a** user
**I want** visual dividers between navigation groups
**So that** I understand the logical grouping of features

**Acceptance Criteria:**
- [ ] 1px gray divider after Dashboard
- [ ] 1px gray divider after Assessments
- [ ] 1px gray divider after Teams
- [ ] No divider between Objectives and Planning (same group)
- [ ] Dividers are 60% height, vertically centered

### T3: Add Philosophy Color Accents (1 pt)

**As a** user
**I want** color-coded accents on navigation items
**So that** I can visually identify feature groups

**Acceptance Criteria:**
- [ ] Purple (#8B5CF6) accent on Dashboard hover/active
- [ ] Blue (#3B82F6) accent on Assessments hover/active
- [ ] Green (#10B981) accent on Teams hover/active
- [ ] Orange (#F59E0B) accent on Objectives and Planning hover/active
- [ ] Accent appears as 2px bottom border
- [ ] No accent on inactive items (clean look)

### T4: Add Custom Tooltips (2 pts)

**As a** user
**I want** informative tooltips on navigation items
**So that** I understand the purpose of each section

**Acceptance Criteria:**
- [ ] Tooltip appears after 500ms hover delay
- [ ] Tooltip styled with dark background (#1F2937), white text
- [ ] Tooltip positioned below nav item with arrow
- [ ] Tooltip fades in smoothly
- [ ] Tooltips hidden on mobile (< 768px)
- [ ] Tooltip content matches specification

---

## Implementation Plan

| Phase | Tasks | Time |
|-------|-------|------|
| 1 | Update navItems config with new order and metadata | 30 min |
| 2 | Add divider rendering in renderNavigation() | 30 min |
| 3 | Add CSS for dividers and accent colors | 30 min |
| 4 | Implement custom tooltip component | 45 min |
| 5 | Test all roles and responsive behavior | 30 min |
| **Total** | | **~2.5 hours** |

---

## Testing Checklist

### Functional Tests
- [ ] Navigation order correct for all roles
- [ ] All links work correctly
- [ ] Dividers appear in correct positions
- [ ] Accent colors match specification
- [ ] Tooltips appear after 500ms delay
- [ ] Tooltips display correct content

### Visual Tests
- [ ] Colors match brand palette
- [ ] Dividers are subtle (not distracting)
- [ ] Active state clearly visible
- [ ] Hover state smooth transition

### Responsive Tests
- [ ] Desktop (> 1024px) - Full layout
- [ ] Tablet (768px - 1024px) - Adjusted spacing
- [ ] Mobile (< 768px) - Dividers smaller, no tooltips

### Role Tests
- [ ] CONSULTANT sees all 5 items
- [ ] BUSINESS_OWNER sees all 5 items
- [ ] EXECUTIVE sees appropriate items
- [ ] MANAGER sees appropriate items
- [ ] EMPLOYEE sees appropriate items

---

## Success Criteria

- [ ] Navigation follows PLAY → ASSESS → ALIGN → PLAN philosophy
- [ ] Visual dividers clearly separate groups
- [ ] Color accents reinforce grouping
- [ ] Tooltips educate users on product methodology
- [ ] No regression in existing functionality
- [ ] Responsive design maintained

---

## Story Point Summary

| Story | Points | Description |
|-------|--------|-------------|
| T1 | 1 | Reorder navigation items |
| T2 | 1 | Add visual dividers |
| T3 | 1 | Add philosophy color accents |
| T4 | 2 | Add custom tooltips |
| **Total** | **5** | |

---

## Sprint Allocation Options

**Previous Epic T:** 38 pts (full card-based redesign - ARCHIVED)
**Updated Epic T:** 5 pts (visual enhancement only)

**Options:**
1. **Add to Sprint 11** - (69 + 5 = 74 pts) - Quick win
2. **Keep in Sprint 13** - Minimal sprint, add other work
3. **Do as hotfix** - Small enough to implement anytime

---

## Archived: Original Full Redesign Spec

The original 38-point card-based hub redesign specification has been archived. If needed in the future, it included:
- Dashboard hub with role-adaptive cards
- Breadcrumb navigation for inner pages
- New API endpoints for dashboard data
- 21+ page integrations

This simplified approach achieves the philosophy communication goal with minimal effort.

---

## References

- [navigation.js](../../../client/js/navigation.js) - Current navigation implementation
- [Sprint 13 Master Plan](./SPRINT-13-MASTER-PLAN.md) - Sprint overview
