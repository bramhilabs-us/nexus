# Quick PDF Creation Guide

**2-Minute Guide**: Create shareable PDFs from KARVIA Pro HTML presentations

---

## ✅ Recommended Method (Easiest - 60 seconds per deck)

### **Step 1: Open in Browser**

```bash
# Product Overview
open /Users/sagarrs/Desktop/official_dev/karvia_business/KARVIA_STRATEGY/01_PRODUCT_OVERVIEW/product_overview.html

# Technical Overview
open /Users/sagarrs/Desktop/official_dev/karvia_business/KARVIA_STRATEGY/02_TECHNICAL_OVERVIEW/technical_overview.html
```

### **Step 2: Print to PDF**

**In Chrome** (Recommended):
1. Press `Cmd + P` (or File → Print)
2. **Destination**: Click "Save as PDF"
3. **Layout**: Landscape
4. **Margins**: Minimum
5. **Options**: ✅ Check "Background graphics"
6. Click **Save**
7. Save as `KARVIA_Pro_Product_Overview.pdf`

**In Safari**:
1. Press `Cmd + P`
2. Click PDF → "Save as PDF"
3. Same settings as above

---

## 📋 Alternative: Print Each Slide Separately (Higher Quality)

If the above method doesn't capture all slides properly:

### **Method: Navigate & Screenshot Each Slide**

1. Open HTML file in browser
2. Use arrow keys (→) to navigate through slides
3. For each slide:
   - Press `Cmd + P`
   - Print/Save that slide as PDF
   - Repeat for all 17 slides (Product) or 15 slides (Technical)
4. Merge PDFs:
   - Open first PDF in Preview
   - Drag remaining PDFs into sidebar
   - File → Export as PDF

---

## 🎯 Expected Results

### **Product Overview**
- **Filename**: `KARVIA_Pro_Product_Overview.pdf`
- **Pages**: 17
- **File Size**: 5-10 MB
- **Content**: All slides with Bramhi styling (purple gradients, Playfair+Inter fonts)

### **Technical Overview**
- **Filename**: `KARVIA_Pro_Technical_Overview.pdf`
- **Pages**: 15
- **File Size**: 4-8 MB
- **Content**: All technical slides with code blocks and diagrams

---

## ✅ Print Settings Checklist

Before clicking "Save", verify:

- ✅ **Layout**: Landscape (NOT portrait)
- ✅ **Paper Size**: A4 or Letter
- ✅ **Margins**: Minimum (0.5 inch)
- ✅ **Background graphics**: ON (critical for purple gradients!)
- ✅ **Headers/Footers**: OFF
- ✅ **Scale**: 100%

---

## 📤 Sharing

Once PDFs are created, they're ready to:
- ✉️ Email to stakeholders
- ☁️ Upload to Google Drive / Dropbox
- 📊 Present in meetings
- 📄 Include in handover documentation

---

**Note**: The automated Chrome headless method has limitations with multi-slide JavaScript presentations. The manual browser Print to PDF method works best and takes only ~60 seconds per deck.

---

**Created**: October 21, 2025
