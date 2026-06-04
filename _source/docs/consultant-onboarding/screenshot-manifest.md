# Consultant Onboarding Screenshot Manifest

## Final assets used in presentation and blog

| Journey Stage | Asset File | Source Screen |
| --- | --- | --- |
| Assessments and choose focus | `assessment-mockup.png` | `Karvia_OKR_Mockups/02_assessment.html` |
| Build teams | `team-mockup.png` | `Karvia_OKR_Mockups/06_team.html` |
| Align objectives | `objectives-mockup.png` | `Karvia_OKR_Mockups/04_objectives.html` |
| Plan journey | `planning-mockup.png` | `Karvia_OKR_Mockups/10_planning.html` |
| Daily tasks | `team-tasks.png` | `client/pages/team-tasks.html` |

Asset directory:
`docs/consultant-onboarding/assets/screenshots/`

## Recapture commands

Run from project root:

```bash
npx playwright screenshot --viewport-size=1600,1000 --full-page --wait-for-timeout=1200 "file:///Users/sagarrs/Desktop/official_dev/karvia_business/Karvia_OKR_Mockups/02_assessment.html" "docs/consultant-onboarding/assets/screenshots/assessment-mockup.png"
npx playwright screenshot --viewport-size=1600,1000 --full-page --wait-for-timeout=1200 "file:///Users/sagarrs/Desktop/official_dev/karvia_business/Karvia_OKR_Mockups/06_team.html" "docs/consultant-onboarding/assets/screenshots/team-mockup.png"
npx playwright screenshot --viewport-size=1600,1000 --full-page --wait-for-timeout=1200 "file:///Users/sagarrs/Desktop/official_dev/karvia_business/Karvia_OKR_Mockups/04_objectives.html" "docs/consultant-onboarding/assets/screenshots/objectives-mockup.png"
npx playwright screenshot --viewport-size=1600,1000 --full-page --wait-for-timeout=1200 "file:///Users/sagarrs/Desktop/official_dev/karvia_business/Karvia_OKR_Mockups/10_planning.html" "docs/consultant-onboarding/assets/screenshots/planning-mockup.png"
npx playwright screenshot --viewport-size=1600,1000 --full-page --wait-for-timeout=1200 "file:///Users/sagarrs/Desktop/official_dev/karvia_business/client/pages/team-tasks.html" "docs/consultant-onboarding/assets/screenshots/team-tasks.png"
```
