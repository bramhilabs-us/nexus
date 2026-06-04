# CONSULTANT Access Fix - Testing Checklist

## Session Summary
**Date:** 2026-01-26
**Branch:** SPRINT3
**Commits:**
- `cd182f2` - Add CONSULTANT to Team members role enum
- `378ab8c` - Fix CONSULTANT access to team details and member management

---

## Changes Made

### 1. User Model (`server/models/User.js`)
- `hasPermission()` method now treats CONSULTANT same as BUSINESS_OWNER (super admin)

### 2. Team Model (`server/models/Team.js`)
- Added `CONSULTANT` to `members[].role` enum validation

### 3. Teams Routes (`server/routes/teams.js`)
**Permission checks updated to include CONSULTANT:**
- POST `/api/teams/create` - Create team
- GET `/api/teams` - List teams (sees all teams in business)
- GET `/api/teams/:teamId` - View team details
- PUT `/api/teams/:teamId` - Update team
- DELETE `/api/teams/:teamId` - Delete team
- POST `/api/teams/:teamId/members` - Add member
- DELETE `/api/teams/:teamId/members/:userId` - Remove member
- POST `/api/teams/:teamId/members/create-user` - Create user and add to team

**Null-safe company_id handling:**
- All routes now handle null `companyId` for consultants
- Consultants can access teams in managed businesses (via `managed_businesses` array)

### 4. Invitations Routes (`server/routes/invitations.js`)
- Added `team_id` filter support to GET `/api/invitations`
- Added `invitations` key to response for frontend compatibility

### 5. Frontend (`client/pages/scripts/teams.js`)
- Create button visible for CONSULTANT
- CONSULTANT can be selected as team manager
- `isAdmin` checks include CONSULTANT

### 6. Auth Check (`client/js/auth-check.js`)
- CONSULTANT added to team.html and analytics.html page access

---

## Test Scenarios by User Role

### A. CONSULTANT User Tests

#### A1. Team Management
- [ ] **Create Team** - Can create a new team with themselves as manager
- [ ] **Create Team** - Can add other users as initial members
- [ ] **View Teams List** - Sees all teams in the business
- [ ] **View Team Details** - Modal loads properly (not stuck on "Loading...")
- [ ] **Update Team** - Can change team name, description, department
- [ ] **Change Manager** - Can assign new manager from team members
- [ ] **Delete Team** - Can soft-delete a team
- [ ] **Add Member** - Can add existing users to team
- [ ] **Create & Add Member** - Can create new user and add to team
- [ ] **Remove Member** - Can remove members from team

#### A2. Cross-Company Access (if applicable)
- [ ] Can access teams in managed businesses (check `managed_businesses` array)
- [ ] Cannot access teams in unmanaged businesses

#### A3. Invitations
- [ ] Can view pending invitations for a team
- [ ] Invitations filter by `team_id` works correctly

### B. BUSINESS_OWNER User Tests

#### B1. Team Management (should work as before)
- [ ] **Create Team** - Can create team with any manager
- [ ] **View Teams List** - Sees all teams in their business
- [ ] **View Team Details** - Modal loads properly
- [ ] **Update Team** - Can update any team
- [ ] **Delete Team** - Can delete any team
- [ ] **Add Member** - Can add members to any team
- [ ] **Remove Member** - Can remove members from any team

#### B2. Access Control
- [ ] Cannot see teams from other businesses
- [ ] Cannot modify teams from other businesses

### C. EXECUTIVE User Tests

#### C1. Team Management
- [ ] **Create Team** - Can create teams
- [ ] **View Teams List** - Sees all teams in business
- [ ] **View Team Details** - Modal loads properly
- [ ] **Update Team** - Can update teams they manage or have exec access to
- [ ] **Delete Team** - Can delete teams
- [ ] **Add/Remove Members** - Works correctly

### D. MANAGER User Tests

#### D1. Team Management (limited)
- [ ] **Cannot Create Team** - Create button hidden
- [ ] **View Teams List** - Only sees teams they manage
- [ ] **View Team Details** - Can view teams they manage
- [ ] **Update Team** - Can update teams they manage
- [ ] **Cannot Delete Team** - Delete option not available
- [ ] **Add/Remove Members** - Can manage members in their teams

### E. EMPLOYEE User Tests

#### E1. Team Management (view only)
- [ ] **Cannot Create Team** - Create button hidden
- [ ] **View Teams List** - Only sees teams they're a member of
- [ ] **View Team Details** - Can view team details
- [ ] **Cannot Update Team** - Edit options not available
- [ ] **Cannot Delete Team** - Delete option not available
- [ ] **Cannot Add/Remove Members** - Options not available

---

## Edge Cases to Test

### 1. Null Company ID Scenarios
- [ ] Consultant with null `company_id` can still create teams (uses manager's company)
- [ ] Consultant with null `company_id` can view team details
- [ ] Error handling when no company can be determined

### 2. Team Creation Edge Cases
- [ ] Duplicate team name in same business - should fail
- [ ] Duplicate team name in different business - should succeed
- [ ] Creating team with no initial members (only manager)
- [ ] Creating team with multiple initial members

### 3. Member Management Edge Cases
- [ ] Cannot remove the last member from a team
- [ ] Cannot add same user twice to a team
- [ ] Manager is automatically added as first member

### 4. Response Format Verification
- [ ] Team creation returns `data.team` structure
- [ ] Team list returns `data.teams` array
- [ ] Team details returns `data.team` object
- [ ] Invitations returns both `data` and `invitations` arrays

---

## API Endpoints to Test Directly

```bash
# As CONSULTANT user:
GET    /api/teams                           # List all teams
POST   /api/teams/create                    # Create team
GET    /api/teams/:teamId                   # Get team details
PUT    /api/teams/:teamId                   # Update team
DELETE /api/teams/:teamId                   # Delete team
POST   /api/teams/:teamId/members           # Add member
DELETE /api/teams/:teamId/members/:userId   # Remove member
POST   /api/teams/:teamId/members/create-user # Create & add member
GET    /api/invitations?team_id=X&status=pending # Get team invitations
```

---

## Test Data Requirements

### Test Users Needed:
1. **CONSULTANT** user with:
   - Own `company_id` (consulting firm)
   - `managed_businesses` array with at least one managed company

2. **BUSINESS_OWNER** user with:
   - `company_id` set to their business

3. **EXECUTIVE** user in same business as BUSINESS_OWNER

4. **MANAGER** user in same business

5. **EMPLOYEE** user in same business

### Test Teams Needed:
- At least one team per business
- Teams with multiple members
- Teams with different managers

---

## Regression Testing Focus

These existing features should continue working:
1. User authentication and login
2. Role-based page access
3. Team creation for BUSINESS_OWNER (original flow)
4. Member management for existing users
5. Team deletion preserves data (soft delete)
6. Company isolation (multi-tenancy)

---

## How to Start Testing Session

```bash
# 1. Ensure server is running
npm run dev

# 2. Login as each user role and test flows
# 3. Check browser console for errors
# 4. Check server logs for 500 errors
# 5. Verify database state after operations
```

---

## Known Issues Fixed This Session

1. **Modal stuck on "Loading..."** - Fixed null `companyId.toString()` error
2. **500 error on team creation** - Fixed Team model enum missing CONSULTANT
3. **Manager dropdown empty** - Added CONSULTANT to manager role filter
4. **Create button hidden** - Added CONSULTANT to permission checks

---

## Files Modified (for code review)

1. `server/models/User.js` - hasPermission method
2. `server/models/Team.js` - members.role enum
3. `server/routes/teams.js` - all permission checks
4. `server/routes/invitations.js` - team_id filter, response format
5. `client/pages/scripts/teams.js` - UI permission checks
6. `client/js/auth-check.js` - page access permissions
