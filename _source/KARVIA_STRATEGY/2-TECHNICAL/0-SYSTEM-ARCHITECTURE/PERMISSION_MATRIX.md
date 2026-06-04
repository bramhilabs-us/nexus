# PERMISSION MATRIX - Role-Based Access Control

<!-- @GENOME T2-ARC-013 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/coding | linked:/strategy -->

**Version**: 1.0.0
**Created**: 2025-10-22
**Purpose**: Define who can view/create/edit/delete each entity in the system

---

## 📋 OVERVIEW

This document defines the complete permission system for Karvia OKR platform across all 5 personas:
- **EMPLOYEE**: Individual contributors
- **MANAGER**: Team leaders
- **EXECUTIVE**: Company leadership
- **CONSULTANT**: External advisors (multi-company access)
- **ADMIN**: Platform administrators

---

## 🎯 PERMISSION LEVELS

- **👁️ VIEW**: Can see the entity
- **➕ CREATE**: Can create new entities
- **✏️ EDIT**: Can modify existing entities
- **🗑️ DELETE**: Can remove entities
- **🔒 ADMIN**: Full control (create, edit, delete, configure)

---

## 📊 ENTITY PERMISSIONS

### **1. ASSESSMENTS**

| Entity | Employee | Manager | Executive | Consultant | Admin |
|--------|----------|---------|-----------|------------|-------|
| **Assessment Template** | | | | | |
| - View templates | ✅ Assigned only | ✅ Business templates | ✅ Business templates | ✅ All (multi-company) | ✅ All |
| - Create template | ❌ | ❌ | ❌ | ✅ Global/Business | ✅ Global only |
| - Edit template | ❌ | ❌ | ❌ | ✅ Own templates only | ✅ All |
| - Delete template | ❌ | ❌ | ❌ | ✅ Own templates (if unused) | ✅ All (if unused) |
| **Assessment Invitation** | | | | | |
| - Send invitation | ❌ | ✅ To team members | ✅ Company-wide | ✅ To clients | ✅ All |
| - View sent invitations | ❌ | ✅ Own invitations | ✅ All in business | ✅ Own invitations | ✅ All |
| - Cancel invitation | ❌ | ✅ Own invitations | ✅ All in business | ✅ Own invitations | ✅ All |
| **Assessment Response** | | | | | |
| - Take assessment | ✅ If invited | ✅ If invited | ✅ If invited | ✅ If invited | ✅ If invited |
| - View own results | ✅ Own results | ✅ Own results | ✅ Own results | ✅ Own results | ✅ All |
| - View team results | ❌ | ✅ Team aggregate | ✅ All aggregates | ✅ Client aggregates | ✅ All |
| - View individual results | ❌ Own only | ✅ Team members | ✅ All in business | ✅ Client employees | ✅ All |
| - Edit responses | ✅ Before submit | ✅ Before submit | ✅ Before submit | ❌ | ✅ Admin override |
| - Delete assessment | ❌ | ❌ | ❌ | ❌ | ✅ If no OKRs derived |

---

### **2. OBJECTIVES (OKRs)**

| Entity | Employee | Manager | Executive | Consultant | Admin |
|--------|----------|---------|-----------|------------|-------|
| **Objectives** | | | | | |
| - View objectives | ✅ Assigned to me | ✅ Team objectives | ✅ All company | ✅ Client objectives | ✅ All |
| - Create objective | ❌ | ❌ | ✅ Company objectives | ✅ Client objectives | ✅ All |
| - Edit objective | ❌ | ✅ If owner | ✅ If owner/creator | ✅ If creator | ✅ All |
| - Delete objective | ❌ | ❌ | ✅ If no goals linked | ✅ If no goals linked | ✅ If no dependencies |
| - Assign objective | ❌ | ❌ | ✅ To teams/managers | ✅ To client managers | ✅ All |
| **Key Results** | | | | | |
| - View KRs | ✅ If can view objective | ✅ If can view objective | ✅ All | ✅ Client KRs | ✅ All |
| - Create KR | ❌ | ❌ | ✅ On own objectives | ✅ On client objectives | ✅ All |
| - Edit KR | ❌ | ✅ If objective owner | ✅ If objective owner | ✅ If objective creator | ✅ All |
| - Update KR progress | ❌ | ✅ If objective owner | ✅ If objective owner | ❌ | ✅ All |
| - Delete KR | ❌ | ❌ | ✅ If no goals linked | ✅ If no goals linked | ✅ If no dependencies |

**CRITICAL RULE**:
- **Objectives created by AI (EXEC-002)**: Owner = Executive who approved them
- **Editing after approval**: Only owner can edit title/description. Progress is auto-calculated from KRs.
- **Cascading ownership**: Objective owner → Assigns to Manager → Manager becomes "assigned owner" (can track, not edit)

---

### **3. TEAMS**

| Entity | Employee | Manager | Executive | Consultant | Admin |
|--------|----------|---------|-----------|------------|-------|
| **Teams** | | | | | |
| - View teams | ✅ Own team only | ✅ All in business | ✅ All in business | ✅ Client teams | ✅ All |
| - Create team | ❌ | ✅ Own teams | ✅ All | ❌ | ✅ All |
| - Edit team info | ❌ | ✅ If team manager | ✅ All | ❌ | ✅ All |
| - Delete team | ❌ | ❌ | ✅ If no active goals | ❌ | ✅ If no dependencies |
| **Team Members** | | | | | |
| - View members | ✅ Own team | ✅ All teams | ✅ All teams | ✅ Client teams | ✅ All |
| - Add members | ❌ | ✅ To own teams | ✅ To any team | ❌ | ✅ All |
| - Remove members | ❌ | ✅ From own teams | ✅ From any team | ❌ | ✅ All |
| - Change member role | ❌ | ✅ In own teams | ✅ In any team | ❌ | ✅ All |

---

### **4. GOALS (Quarterly & Weekly)**

| Entity | Employee | Manager | Executive | Consultant | Admin |
|--------|----------|---------|-----------|------------|-------|
| **Quarterly Goals** | | | | | |
| - View goals | ✅ Assigned to me | ✅ Team goals | ✅ All company | ✅ Client goals | ✅ All |
| - Create goal | ❌ | ✅ For team | ✅ Company-wide | ❌ | ✅ All |
| - Edit goal | ❌ | ✅ If creator | ✅ If owner | ❌ | ✅ All |
| - Delete goal | ❌ | ✅ If no tasks | ✅ If no tasks | ❌ | ✅ If no dependencies |
| - Assign goal | ❌ | ✅ To team members | ✅ To any employee | ❌ | ✅ All |
| - Update progress | ❌ | ✅ If owner | ✅ If owner | ❌ | ✅ All |
| **Weekly Goals** | | | | | |
| - View goals | ✅ Assigned to me | ✅ Team goals | ✅ All company | ✅ Client goals | ✅ All |
| - Create goal | ❌ | ✅ For team | ✅ Company-wide | ❌ | ✅ All |
| - Edit goal | ❌ | ✅ If creator | ✅ If owner | ❌ | ✅ All |
| - Delete goal | ❌ | ✅ If no tasks | ✅ If no tasks | ❌ | ✅ If no dependencies |
| - Update progress | ✅ If assigned | ✅ If owner | ✅ If owner | ❌ | ✅ All |

**CRITICAL RULE**:
- **Progress auto-calculated**: From linked tasks (cannot manually override)
- **Status can be changed**: Manager/Executive can mark as "Blocked", "At Risk", "On Track"

---

### **5. TASKS**

| Entity | Employee | Manager | Executive | Consultant | Admin |
|--------|----------|---------|-----------|------------|-------|
| **Tasks** | | | | | |
| - View tasks | ✅ Assigned to me | ✅ Team tasks | ✅ All company | ✅ Client tasks (read-only) | ✅ All |
| - Create task | ❌ | ✅ For team members | ✅ For any employee | ❌ | ✅ All |
| - Edit task | ✅ If assigned to me | ✅ If creator | ✅ All | ❌ | ✅ All |
| - Delete task | ❌ | ✅ If creator | ✅ All | ❌ | ✅ All |
| - Reassign task | ❌ | ✅ Team tasks | ✅ All tasks | ❌ | ✅ All |
| - Mark complete | ✅ If assigned to me | ✅ If creator | ✅ All | ❌ | ✅ All |
| - Update progress | ✅ If assigned to me | ✅ If creator | ✅ All | ❌ | ✅ All |

**CRITICAL RULE**:
- **Employee can only edit tasks assigned to them** (cannot reassign or delete)
- **Manager can reassign tasks** within their team (MGR-026 Intervention workflow)
- **Progress updates trigger rollup** to weekly goal → quarterly goal → KR → Objective

---

### **6. PLANNING (Quarterly Plans)**

| Entity | Employee | Manager | Executive | Consultant | Admin |
|--------|----------|---------|-----------|------------|-------|
| **Quarterly Plans** | | | | | |
| - View plans | ✅ Team plan (read-only) | ✅ Own team plans | ✅ All plans | ✅ Client plans | ✅ All |
| - Create plan | ❌ | ✅ For own team | ❌ | ❌ | ✅ All |
| - Edit plan | ❌ | ✅ If status=draft/changes_requested | ❌ | ❌ | ✅ All |
| - Submit for approval | ❌ | ✅ Own plans | ❌ | ❌ | ✅ All |
| - Approve plan | ❌ | ❌ | ✅ Team plans | ❌ | ✅ All |
| - Request changes | ❌ | ❌ | ✅ Team plans | ❌ | ✅ All |
| - Delete plan | ❌ | ✅ If status=draft | ✅ If not approved | ❌ | ✅ All |

**CRITICAL RULE** (EXEC-011B):
- **After executive approves**: Plan status → 'approved', Goals → status='active', Team members notified
- **If executive requests changes**: Plan status → 'changes_requested', Manager can edit and resubmit

---

### **7. NOTIFICATIONS**

| Entity | Employee | Manager | Executive | Consultant | Admin |
|--------|----------|---------|-----------|------------|-------|
| **Notifications** | | | | | |
| - View notifications | ✅ Own only | ✅ Own only | ✅ Own only | ✅ Own only | ✅ All |
| - Mark as read | ✅ Own only | ✅ Own only | ✅ Own only | ✅ Own only | ✅ All |
| - Delete notification | ✅ Own only | ✅ Own only | ✅ Own only | ✅ Own only | ✅ All |
| - Configure preferences | ✅ Own settings | ✅ Own settings | ✅ Own settings | ✅ Own settings | ✅ All users |

---

### **8. PROFILES**

| Entity | Employee | Manager | Executive | Consultant | Admin |
|--------|----------|---------|-----------|------------|-------|
| **User Profiles** | | | | | |
| - View profile | ✅ Own profile | ✅ Own + team members | ✅ All in business | ✅ Client users | ✅ All |
| - Edit profile | ✅ Own only | ✅ Own only | ✅ Own only | ✅ Own only | ✅ All |
| - Upload avatar | ✅ Own only | ✅ Own only | ✅ Own only | ✅ Own only | ✅ All |
| - View assessment history | ✅ Own only | ✅ Own + team members | ✅ All in business | ✅ Client users | ✅ All |
| - Change password | ✅ Own only | ✅ Own only | ✅ Own only | ✅ Own only | ✅ All (reset) |
| - Deactivate account | ❌ | ❌ | ❌ | ❌ | ✅ All |

---

### **9. ANALYTICS**

| Entity | Employee | Manager | Executive | Consultant | Admin |
|--------|----------|---------|-----------|------------|-------|
| **Analytics Dashboard** | | | | | |
| - View personal analytics | ✅ Own stats | ✅ Own stats | ✅ Own stats | ✅ Own stats | ✅ All |
| - View team analytics | ❌ | ✅ Own teams | ✅ All teams | ✅ Client teams | ✅ All |
| - View company analytics | ❌ | ❌ | ✅ Own company | ✅ Client companies | ✅ All |
| - Export reports | ❌ | ✅ Team reports | ✅ Company reports | ✅ Client reports | ✅ All |
| - Multi-company view | ❌ | ❌ | ❌ | ✅ All clients | ✅ All |

---

### **10. ADMIN FUNCTIONS**

| Entity | Employee | Manager | Executive | Consultant | Admin |
|--------|----------|---------|-----------|------------|-------|
| **System Settings** | | | | | |
| - View settings | ❌ | ❌ | ❌ | ❌ | ✅ All |
| - Edit settings | ❌ | ❌ | ❌ | ❌ | ✅ All |
| **User Management** | | | | | |
| - Create users | ❌ | ❌ | ❌ | ❌ | ✅ All |
| - Edit user roles | ❌ | ❌ | ❌ | ❌ | ✅ All |
| - Deactivate users | ❌ | ❌ | ❌ | ❌ | ✅ All |
| - Bulk import users | ❌ | ❌ | ❌ | ❌ | ✅ All |
| **Question Library** | | | | | |
| - View questions | ❌ | ❌ | ❌ | ✅ All | ✅ All |
| - Create questions | ❌ | ❌ | ❌ | ❌ | ✅ All |
| - Edit questions | ❌ | ❌ | ❌ | ❌ | ✅ All |
| - Delete questions | ❌ | ❌ | ❌ | ❌ | ✅ If unused |
| **System Logs** | | | | | |
| - View logs | ❌ | ❌ | ❌ | ❌ | ✅ All |

---

## 🔒 SPECIAL PERMISSION RULES

### **Rule 1: Cascade Ownership**
When Executive assigns Objective to Manager:
- **Executive**: Retains "creator" status (can edit)
- **Manager**: Becomes "assigned owner" (can track progress, cannot edit objective itself)
- **Manager CAN**: Create goals from objective, assign tasks, track progress
- **Manager CANNOT**: Edit objective title, description, or key results

### **Rule 2: Team Hierarchy**
- **Manager of Team A** cannot view/edit Team B (unless also Executive)
- **Executive** can view/edit all teams in their business
- **Consultant** can view all teams across multiple client businesses (read-only unless explicitly granted)

### **Rule 3: Multi-Company Access (Consultant Only)**
- **Consultant** has array of `business_id` values
- Can switch between clients using business selector dropdown
- All queries filtered by selected `business_id`
- Analytics can show cross-company comparisons (opt-in by client)

### **Rule 4: Soft Delete**
Most entities use **soft delete** (is_active = false):
- **Assessments**: Cannot delete if OKRs derived (hard constraint)
- **Objectives**: Cannot delete if goals linked (hard constraint)
- **Goals**: Cannot delete if tasks linked (hard constraint)
- **Tasks**: Can delete (orphan from goal, mark as deleted)
- **Teams**: Soft delete only (preserve historical data)
- **Users**: Soft delete only (deactivate, preserve all associations)

### **Rule 5: Data Visibility (Context Level)**
Each persona sees their level + one level up (except Admin):
- **Employee**: Own tasks + weekly goals + team objectives (limited)
- **Manager**: Team tasks + goals + team objectives + company OKRs (read-only)
- **Executive**: All company data (full CRUD)
- **Consultant**: Multi-company read access + limited CRUD on assessments/templates
- **Admin**: Platform-wide access (all businesses, all data)

---

## 🔐 IMPLEMENTATION NOTES

### **Backend Middleware**
```javascript
// Permission check middleware
const checkPermission = (entity, action) => {
  return async (req, res, next) => {
    const { user } = req;
    const { role, business_id, team_id } = user;

    // Get entity being accessed
    const entityId = req.params.id;
    const entityData = await Entity.findById(entityId);

    // Check permissions matrix
    const canPerform = PermissionMatrix[entity][action][role];

    if (!canPerform) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    // Additional checks (ownership, business scope, etc.)
    if (action === 'edit' && entity === 'objective') {
      if (entityData.creator_id !== user._id && role !== 'ADMIN') {
        return res.status(403).json({ error: 'Only creator can edit objective' });
      }
    }

    next();
  };
};

// Usage
router.put('/objectives/:id',
  checkPermission('objective', 'edit'),
  updateObjective
);
```

### **Frontend Authorization**
```javascript
// Hide/show UI elements based on permissions
const canEditObjective = (objective, user) => {
  if (user.role === 'ADMIN') return true;
  if (user.role === 'EXECUTIVE' && objective.creator_id === user._id) return true;
  if (user.role === 'MANAGER' && objective.assigned_owner_id === user._id) return false; // Can track, not edit
  return false;
};

// In UI
{canEditObjective(objective, currentUser) && (
  <button onClick={handleEdit}>Edit Objective</button>
)}
```

---

## 📊 PERMISSION SUMMARY

| Role | Primary Access | Key Limitations |
|------|----------------|-----------------|
| **EMPLOYEE** | Own tasks, goals, objectives (assigned) | Cannot create/edit entities, read-only on team data |
| **MANAGER** | Team management, task/goal creation | Cannot edit company objectives, needs exec approval for plans |
| **EXECUTIVE** | Company-wide CRUD, approvals | Cannot edit consultant templates, limited multi-company view |
| **CONSULTANT** | Multi-company read access, template creation | Cannot edit client data (read-only), no admin functions |
| **ADMIN** | Platform-wide access | Cannot edit user-created content unless necessary |

---

## 🔗 RELATED DOCUMENTATION

- [SYSTEM_DEPENDENCY_AUDIT.md](./SYSTEM_DEPENDENCY_AUDIT.md) - Dependency analysis
- [CASCADE_DELETE_POLICY.md](./CASCADE_DELETE_POLICY.md) - Data retention rules
- [MVP_USER_STORIES.md](./01_MVP/MVP_USER_STORIES.md) - User stories

---

**Version**: 1.0.0
**Last Updated**: 2025-10-22
**Status**: ✅ Ready for implementation
