# 🌱 SEED PRE-PRODUCTION DATABASE

**Purpose**: Populate pre-prod database with assessment questions and templates
**When to Run**: After deploying to Render pre-prod for the first time
**Time Required**: 2 minutes

---

## 🚀 Quick Start

Run this command from your local machine:

```bash
MONGODB_URI="mongodb+srv://[REDACTED]:[REDACTED]@cluster0.lpzcrvy.mongodb.net/karvia_business_preprod?retryWrites=true&w=majority" node server/scripts/seed-preprod.js
```

---

## ✅ Expected Output

```
🌱 Seeding Database...
📊 Database: karvia_business_preprod
🔗 URI: mongodb+srv://[REDACTED]:[REDACTED]@cluster0.lpzcrvy.mongodb.net/karvia_business_preprod

✅ Connected to MongoDB

📄 Seeding Assessment Questions...
   Loaded 146 questions from JSON
✅ Questions Seeded!
   Created: 146
   Updated: 0
   Errors: 0
   Total in DB: 146

📈 By Dimension:
   Speed: 48
   Strength: 46
   Intelligence: 52

📝 Seeding Default Template...
✅ Template Created!
   ID: SSI-PULSE-PRO-SERVICES
   Name: SSI Pulse – Professional Services
   Questions: 47

✅ Database seeding complete!

👋 Disconnected from MongoDB
```

---

## 📊 What Gets Seeded

### 1. Assessment Questions (146 total)
- **Speed**: 48 questions (Agility & change readiness)
- **Strength**: 46 questions (Operational resilience)
- **Intelligence**: 52 questions (Insight & foresight)

### 2. Default Template (1 template)
- **Name**: SSI Pulse – Professional Services
- **Questions**: 47 (16 Speed, 15 Strength, 16 Intelligence)
- **Duration**: ~19 minutes
- **Weights**: Speed 35%, Strength 35%, Intelligence 30%
- **Industry Tags**: professional_services, consulting, agency

---

## 🔄 For Different Environments

### Local Development
```bash
npm run seed:questions
npm run seed:templates
```

### Pre-Production
```bash
MONGODB_URI="mongodb+srv://[REDACTED]:[REDACTED]@cluster0.lpzcrvy.mongodb.net/karvia_business_preprod?retryWrites=true&w=majority" node server/scripts/seed-preprod.js
```

### Production (After Pre-Prod Success)
```bash
MONGODB_URI="mongodb+srv://[REDACTED]:[REDACTED]@cluster0.lpzcrvy.mongodb.net/karvia_business_prod?retryWrites=true&w=majority" node server/scripts/seed-preprod.js
```

---

## ⚠️ Important Notes

1. **Safe to Re-run**: The script checks for existing questions and only creates new ones
2. **Idempotent**: Running multiple times won't create duplicates
3. **Database Specific**: Make sure the MONGODB_URI has the correct database name:
   - Pre-Prod: `karvia_business_preprod`
   - Production: `karvia_business_prod`
4. **No Downtime**: Safe to run on live environment (creates data, doesn't modify existing)

---

## 🧪 Verify Seeding Success

After seeding, test the assessment page:

1. **Open**: `https://your-preprod-url.onrender.com/pages/assessment-question-library.html`
2. **Verify**:
   - Speed Library shows: **48 prompts**
   - Strength Library shows: **46 prompts**
   - Intelligence Library shows: **52 prompts**
   - Total Prompts shows: **146**

---

## 🐛 Troubleshooting

### Issue: "Error: connect ETIMEDOUT"
**Cause**: Network connection to MongoDB Atlas failed
**Fix**:
- Check internet connection
- Verify MongoDB Atlas allows your IP address
- Check Network Access in MongoDB Atlas dashboard

### Issue: "Error: Authentication failed"
**Cause**: MongoDB credentials incorrect
**Fix**:
- Verify MONGODB_URI is correct
- Check password doesn't have special characters that need URL encoding

### Issue: "Questions file not found"
**Cause**: Running from wrong directory
**Fix**:
- Make sure you're in the project root directory
- File should exist at: `server/seeds/assessment_questions.json`

---

## 📁 Related Files

- **Seed Script**: [server/scripts/seed-preprod.js](server/scripts/seed-preprod.js)
- **Questions Data**: [server/seeds/assessment_questions.json](server/seeds/assessment_questions.json)
- **Question Model**: [server/models/AssessmentQuestion.js](server/models/AssessmentQuestion.js)
- **Template Model**: [server/models/AssessmentTemplate.js](server/models/AssessmentTemplate.js)

---

## ✅ Checklist

- [ ] Run seed command with correct MONGODB_URI
- [ ] Verify output shows 146 questions created
- [ ] Verify output shows template created
- [ ] No errors in output
- [ ] Open assessment page on pre-prod
- [ ] Verify question counts display correctly
- [ ] Try creating a template to ensure questions load

---

**Last Updated**: November 19, 2025
**Status**: ✅ READY TO USE
