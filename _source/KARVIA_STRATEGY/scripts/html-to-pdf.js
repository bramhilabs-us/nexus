#!/usr/bin/env node
/**
 * HTML to PDF Converter
 * Converts KARVIA Pro HTML decks to PDF format for sharing
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function convertHTMLtoPDF(htmlPath, pdfPath) {
  console.log(`Converting ${htmlPath} to PDF...`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Load the HTML file
  await page.goto(`file://${htmlPath}`, {
    waitUntil: 'networkidle0'
  });

  // Wait for fonts to load
  await page.evaluateHandle('document.fonts.ready');

  // Get total slides
  const totalSlides = await page.evaluate(() => {
    return document.querySelectorAll('.slide').length;
  });

  console.log(`Found ${totalSlides} slides`);

  // Generate PDF with all slides
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: {
      top: '0.5in',
      right: '0.5in',
      bottom: '0.5in',
      left: '0.5in'
    },
    preferCSSPageSize: false
  });

  await browser.close();
  console.log(`✅ PDF created: ${pdfPath}`);
}

async function main() {
  const baseDir = path.join(__dirname, '..');

  // Convert Product Overview
  const productOverviewHTML = path.join(baseDir, '01_PRODUCT_OVERVIEW', 'product_overview.html');
  const productOverviewPDF = path.join(baseDir, '01_PRODUCT_OVERVIEW', 'KARVIA_Pro_Product_Overview.pdf');

  if (fs.existsSync(productOverviewHTML)) {
    await convertHTMLtoPDF(productOverviewHTML, productOverviewPDF);
  } else {
    console.error(`❌ File not found: ${productOverviewHTML}`);
  }

  // Convert Technical Overview
  const technicalOverviewHTML = path.join(baseDir, '02_TECHNICAL_OVERVIEW', 'technical_overview.html');
  const technicalOverviewPDF = path.join(baseDir, '02_TECHNICAL_OVERVIEW', 'KARVIA_Pro_Technical_Overview.pdf');

  if (fs.existsSync(technicalOverviewHTML)) {
    await convertHTMLtoPDF(technicalOverviewHTML, technicalOverviewPDF);
  } else {
    console.error(`❌ File not found: ${technicalOverviewHTML}`);
  }

  console.log('\n✅ All conversions complete!');
  console.log('\nGenerated PDFs:');
  console.log(`  - ${productOverviewPDF}`);
  console.log(`  - ${technicalOverviewPDF}`);
}

main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
