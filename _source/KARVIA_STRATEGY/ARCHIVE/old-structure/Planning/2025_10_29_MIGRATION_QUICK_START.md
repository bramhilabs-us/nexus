# 🚀 Company Migration - Quick Start Guide

**TL;DR**: We migrated from `business_id` to `company_id` everywhere. Here's what you need to know.

---

## 🎯 What Changed?

### **Before** ❌
```javascript
// Models
business_id: ObjectId

// Routes
const business_id = req.user.business_id;
const query = { business_id };

// Frontend
localStorage.getItem('business_id');
fetch('/api/businesses');
```

### **After** ✅
```javascript
// Models
company_id: ObjectId

// Routes
const company_id = req.user.company_id;
const query = { company_id };

// Frontend
localStorage.getItem('company_id');
fetch('/api/companies');
```

---

## 🏃 Quick Deploy

### **1. Run Migration** (5 minutes)
```bash
node server/scripts/migrate-business-to-company.js
```

### **2. Restart Server**
```bash
npm start
```

### **3. Test**
```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","first_name":"Test","last_name":"User","company_name":"Test Co"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### **4. Done!** ✅

---

## 📝 New API Contracts

### **Signup**
```javascript
POST /api/auth/signup
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "company_name": "Acme Corp",  // NEW - required
  "industry": "technology",      // Optional
  "employee_count": 10          // Optional
}

Response:
{
  "success": true,
  "token": "jwt...",
  "user": { ... },
  "company": {                  // NEW
    "_id": "...",
    "name": "Acme Corp",
    "status": "trial"
  }
}
```

### **Login**
```javascript
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt...",
  "user": {
    "company_id": "..."  // NEW in JWT payload
  },
  "company": { ... }     // NEW
}
```

### **JWT Payload**
```javascript
{
  "user_id": "...",
  "email": "...",
  "role": "BUSINESS_OWNER",
  "company_id": "..."  // NEW - included in all tokens
}
```

---

## 🔧 Common Code Patterns

### **Creating Resources**
```javascript
// Goals, Tasks, Objectives, Teams, etc.
const resource = new Resource({
  company_id: req.user.company_id,  // From JWT
  // ... other fields
});
```

### **Querying Resources**
```javascript
// Simple query
const goals = await Goal.find({ company_id: req.user.company_id });

// With filters
const query = { company_id: req.user.company_id };
if (status) query.status = status;
const goals = await Goal.find(query);
```

### **Authorization Checks**
```javascript
// Check if user belongs to company
if (req.user.company_id.toString() !== resource.company_id.toString()) {
  return res.status(403).json({ message: 'Unauthorized' });
}

// Consultants
if (req.user.role === 'CONSULTANT') {
  if (!req.user.managed_companies.includes(companyId)) {
    return res.status(403).json({ message: 'Not managed' });
  }
}
```

---

## 🎨 Frontend Updates

### **API Calls**
```javascript
// OLD
const response = await fetch(`/api/businesses/${businessId}`);

// NEW
const response = await fetch(`/api/companies/${companyId}`);
```

### **LocalStorage**
```javascript
// OLD
localStorage.setItem('business_id', id);
const id = localStorage.getItem('business_id');

// NEW
localStorage.setItem('company_id', id);
const id = localStorage.getItem('company_id');
```

### **Token Decoding**
```javascript
const payload = JSON.parse(atob(token.split('.')[1]));
const companyId = payload.company_id;  // NEW field
```

---

## ⚠️ Important Notes

### **For Developers**

1. **All users must re-login** after deployment
2. **Clear localStorage** in your browser
3. **No more business_id** - use company_id everywhere
4. **JWT structure changed** - includes company_id

### **For Database**

1. **Backup first!** before running migration
2. **Migration is idempotent** - safe to run multiple times
3. **Old Business collection preserved** (for reference)
4. **No data loss** - all IDs preserved

### **For Testing**

```bash
# Check migration status
mongo karvia_business
db.users.count({ company_id: { $exists: true } })  # Should match total users
db.users.count({ business_id: { $exists: true } }) # Should be 0

# Check companies
db.companies.count()  # Should match old business count
```

---

## 🐛 Troubleshooting

### **"company_id is required" error**
```javascript
// User model requires company_id for non-consultants
// Make sure JWT includes company_id
// Users may need to re-login
```

### **"Cannot read property 'company_id' of undefined"**
```javascript
// req.user not populated - check authGuards middleware
// Token may be invalid - user needs to re-login
```

### **"Company not found"**
```javascript
// Run migration script if not already run
// Check if Company documents exist in database
node server/scripts/migrate-business-to-company.js
```

---

## 📚 Full Documentation

- **[MIGRATION_COMPLETE.md](Karvia_OKR_Product_Planning/Daily_Handoffs/Week_7/MIGRATION_COMPLETE.md)** - Complete migration details
- **[COMPANY_MIGRATION_COMPLETE_SUMMARY.md](Karvia_OKR_Product_Planning/Daily_Handoffs/Week_7/COMPANY_MIGRATION_COMPLETE_SUMMARY.md)** - Technical summary

---

## ✅ Deployment Checklist

- [ ] Database backup created
- [ ] Migration script tested on staging
- [ ] All developers aware of changes
- [ ] Migration script executed
- [ ] Server restarted
- [ ] Signup tested
- [ ] Login tested
- [ ] API endpoints tested
- [ ] Frontend tested
- [ ] No errors in logs
- [ ] Users notified of re-login requirement

---

**Questions?** Check the full documentation or contact the development team.

**Status**: ✅ COMPLETE - Ready for Production
