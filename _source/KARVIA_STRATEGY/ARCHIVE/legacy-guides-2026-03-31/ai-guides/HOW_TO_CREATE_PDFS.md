# How to Create PDFs from HTML Decks

**Quick Guide**: Convert KARVIA Pro HTML presentations to PDF format for sharing

---

## 📄 Method 1: Using Chrome/Safari (Recommended - Easiest)

### **Product Overview PDF**

1. **Open the file**:
   ```bash
   open KARVIA_STRATEGY/01_PRODUCT_OVERVIEW/product_overview.html
   ```
   Or double-click `product_overview.html` in Finder

2. **Print to PDF** (in Chrome or Safari):
   - Press `Cmd + P` (or File → Print)
   - In the print dialog:
     - **Destination**: "Save as PDF"
     - **Layout**: Landscape
     - **Paper Size**: A4 or Letter
     - **Margins**: Minimum
     - ✅ **Check**: "Background graphics"
   - Click **Save**
   - Save as: `KARVIA_Pro_Product_Overview.pdf`

3. **Result**: 17-page PDF with all slides

### **Technical Overview PDF**

1. **Open the file**:
   ```bash
   open KARVIA_STRATEGY/02_TECHNICAL_OVERVIEW/technical_overview.html
   ```

2. **Print to PDF** (same steps as above)
   - Save as: `KARVIA_Pro_Technical_Overview.pdf`

3. **Result**: 15-page PDF with all slides

---

## 📄 Method 2: Using Automated Script (Advanced)

If you want a fully automated solution, use the Node.js script:

### **Setup** (one-time):
```bash
cd KARVIA_STRATEGY/scripts
npm install puppeteer
```

### **Run**:
```bash
cd KARVIA_STRATEGY/scripts
node html-to-pdf.js
```

**Output**:
- `01_PRODUCT_OVERVIEW/KARVIA_Pro_Product_Overview.pdf`
- `02_TECHNICAL_OVERVIEW/KARVIA_Pro_Technical_Overview.pdf`

---

## 📄 Method 3: Using macOS Shortcuts (One-Click)

I've created a quick Automator script for you:

1. **Open Automator** (Cmd + Space → type "Automator")
2. **New Document** → **Quick Action**
3. **Add Action**: "Run Shell Script"
4. **Paste this**:
   ```bash
   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
     --headless \
     --disable-gpu \
     --print-to-pdf="$HOME/Desktop/KARVIA_Pro_Product_Overview.pdf" \
     "file://$HOME/Desktop/official_dev/karvia_business/KARVIA_STRATEGY/01_PRODUCT_OVERVIEW/product_overview.html"
   ```
5. **Save** as "Convert KARVIA Decks to PDF"
6. **Right-click** HTML file → Services → Convert KARVIA Decks to PDF

---

## 🎨 Print Settings for Best Quality

### **Chrome** (Recommended):
- **Layout**: Landscape
- **Paper**: A4 (210 x 297 mm)
- **Margins**: Minimum (0.5 in)
- **Scale**: 100%
- ✅ **Background graphics**: ON
- ✅ **Headers and footers**: OFF

### **Safari**:
- **Layout**: Landscape
- **Paper**: US Letter or A4
- **Scale**: 100%
- ✅ **Print backgrounds**: ON

### **Firefox**:
- **Orientation**: Landscape
- **Paper Size**: A4
- **Margins**: None
- ✅ **Print background colors**: ON
- ✅ **Print background images**: ON

---

## 📊 Expected Output

### **Product Overview PDF**
- **Pages**: 17
- **File Size**: ~5-8 MB (with embedded fonts + graphics)
- **Slides**:
  1. Story Map
  2. Market Signals
  3. SMB Personas Overview
  4-6. Persona Deep Dives
  7. Pain Points & Outcomes
  8. Solution Overview
  9. Core Features
  10. iBrain Integration
  11. NSMs & Pillars
  12. Functional Requirements
  13. Non-Functional Requirements
  14. Operating Model
  15. Roadmap
  16. Risks & Mitigations
  17. Appendix Library

### **Technical Overview PDF**
- **Pages**: 15
- **File Size**: ~4-6 MB
- **Slides**:
  1. Technical Story Map
  2. Architecture Overview
  3. Tech Stack
  4. Database Schema
  5. Data Relationships
  6. Service Layer
  7. iBrain Integration
  8. API Routes
  9. Authentication & Authorization
  10. Cloud Infrastructure
  11. Monitoring & Observability
  12. Frontend Architecture
  13. Security & Compliance
  14. Testing Strategy
  15. Deployment & CI/CD

---

## ✅ Quality Checklist

After creating PDFs, verify:

- ✅ All pages rendered correctly
- ✅ Purple gradient backgrounds visible
- ✅ Fonts (Playfair Display + Inter) embedded
- ✅ Code blocks readable
- ✅ Charts and diagrams clear
- ✅ No cut-off content
- ✅ File size reasonable (<10 MB each)

---

## 🚀 Quick Command (Copy-Paste)

**For Chrome users** (paste in Terminal):
```bash
# Product Overview
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$HOME/Desktop/KARVIA_Pro_Product_Overview.pdf" \
  "file://$HOME/Desktop/official_dev/karvia_business/KARVIA_STRATEGY/01_PRODUCT_OVERVIEW/product_overview.html"

# Technical Overview
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$HOME/Desktop/KARVIA_Pro_Technical_Overview.pdf" \
  "file://$HOME/Desktop/official_dev/karvia_business/KARVIA_STRATEGY/02_TECHNICAL_OVERVIEW/technical_overview.html"

echo "✅ PDFs created on Desktop!"
```

---

## 📧 Sharing PDFs

Once created, the PDFs are ready to:
- Email to stakeholders
- Upload to Google Drive / Dropbox
- Include in project handover documentation
- Present in meetings (full-screen mode)
- Print for physical presentations

**Recommended file names**:
- `KARVIA_Pro_Product_Overview_v1.0.pdf`
- `KARVIA_Pro_Technical_Overview_v1.0.pdf`

---

**Created**: October 21, 2025
**Last Updated**: October 21, 2025
