#!/usr/bin/env python3
"""
HTML to PDF Converter for KARVIA Pro Documentation
Uses weasyprint for conversion (pip install weasyprint)
"""

import os
import sys
from pathlib import Path

try:
    from weasyprint import HTML, CSS
except ImportError:
    print("❌ weasyprint not installed. Installing...")
    os.system(f"{sys.executable} -m pip install weasyprint")
    from weasyprint import HTML, CSS

def convert_html_to_pdf(html_path, pdf_path):
    """Convert HTML file to PDF"""
    print(f"Converting {html_path} to PDF...")

    # Additional CSS for print optimization
    print_css = CSS(string='''
        @page {
            size: A4 landscape;
            margin: 0.5in;
        }
        .slide {
            page-break-after: always;
            page-break-inside: avoid;
        }
        .slide:last-child {
            page-break-after: avoid;
        }
        .nav-btn, .slide-nav, .progress-bar {
            display: none !important;
        }
    ''')

    HTML(filename=html_path).write_pdf(
        pdf_path,
        stylesheets=[print_css]
    )

    print(f"✅ Created: {pdf_path}")

def main():
    base_dir = Path(__file__).parent.parent

    # Product Overview
    product_html = base_dir / '01_PRODUCT_OVERVIEW' / 'product_overview.html'
    product_pdf = base_dir / '01_PRODUCT_OVERVIEW' / 'KARVIA_Pro_Product_Overview.pdf'

    if product_html.exists():
        convert_html_to_pdf(str(product_html), str(product_pdf))
    else:
        print(f"❌ Not found: {product_html}")

    # Technical Overview
    technical_html = base_dir / '02_TECHNICAL_OVERVIEW' / 'technical_overview.html'
    technical_pdf = base_dir / '02_TECHNICAL_OVERVIEW' / 'KARVIA_Pro_Technical_Overview.pdf'

    if technical_html.exists():
        convert_html_to_pdf(str(technical_html), str(technical_pdf))
    else:
        print(f"❌ Not found: {technical_html}")

    print("\n✅ All conversions complete!")
    print("\nGenerated PDFs:")
    print(f"  1. {product_pdf.name}")
    print(f"  2. {technical_pdf.name}")

if __name__ == '__main__':
    main()
