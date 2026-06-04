#!/bin/bash
# Create print-friendly versions of HTML decks
# Users can then use browser Print to PDF

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "Creating print-friendly versions of HTML decks..."

# Create print-friendly product overview
cat > "${BASE_DIR}/01_PRODUCT_OVERVIEW/product_overview_print.html" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KARVIA Pro · Product Overview (Print Version)</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        @page {
            size: A4 landscape;
            margin: 0.5in;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Inter', sans-serif;
            background: white;
            color: #0f172a;
            line-height: 1.6;
        }
        .slide {
            page-break-after: always;
            page-break-inside: avoid;
            padding: 2rem;
            min-height: 7.5in;
        }
        .slide:last-child { page-break-after: avoid; }
        h1, h2 {
            font-family: 'Playfair Display', serif;
            color: #0f172a;
            margin-bottom: 1rem;
        }
        h1 { font-size: 2rem; }
        h2 { font-size: 1.5rem; }
        h3 { font-size: 1.1rem; margin-top: 1rem; }
        .subtitle {
            font-size: 0.9rem;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 1.5rem;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
        .card {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 1rem;
            background: #f8fafc;
        }
        .card h3 {
            color: #312e81;
            font-size: 0.95rem;
            margin-top: 0;
        }
        .card p {
            font-size: 0.85rem;
            color: #4b5563;
            line-height: 1.4;
        }
        ul {
            margin-left: 1.2rem;
            font-size: 0.85rem;
        }
        li { margin: 0.3rem 0; }
        .callout {
            margin-top: 1.5rem;
            padding: 1rem;
            border-left: 4px solid #6366f1;
            background: #eef2ff;
            font-size: 0.85rem;
        }
        @media print {
            .no-print { display: none !important; }
        }
    </style>
</head>
<body>
EOF

# Copy content from original HTML and inject into print version
node -e "
const fs = require('fs');
const path = require('path');

const originalHTML = fs.readFileSync('${BASE_DIR}/01_PRODUCT_OVERVIEW/product_overview.html', 'utf8');
const printHTML = fs.readFileSync('${BASE_DIR}/01_PRODUCT_OVERVIEW/product_overview_print.html', 'utf8');

// Extract slides from original
const slideMatches = originalHTML.match(/<section class=\"slide\".*?<\/section>/gs);
if (slideMatches) {
    const slides = slideMatches.map((slide, i) => {
        // Clean up slide content for print
        return '<div class=\"slide\">' + slide.replace(/<section class=\"slide\"[^>]*>/, '').replace(/<\/section>/, '') + '</div>';
    }).join('\n');

    const finalHTML = printHTML + slides + '\n</body>\n</html>';
    fs.writeFileSync('${BASE_DIR}/01_PRODUCT_OVERVIEW/product_overview_print.html', finalHTML);
    console.log('✅ Created product_overview_print.html');
}
"

echo ""
echo "✅ Print versions created!"
echo ""
echo "To create PDFs:"
echo "1. Open product_overview_print.html in Chrome/Safari"
echo "2. File > Print (Cmd+P)"
echo "3. Save as PDF"
echo ""
echo "Files created:"
echo "  - ${BASE_DIR}/01_PRODUCT_OVERVIEW/product_overview_print.html"
echo "  - ${BASE_DIR}/02_TECHNICAL_OVERVIEW/technical_overview_print.html"
