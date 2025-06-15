const PDFDocument = require('pdfkit');
const fs = require('fs');

function createTestPDF() {
    // Create a new PDF document
    const doc = new PDFDocument();
    
    // Pipe its output somewhere, like to a file or HTTP response
    doc.pipe(fs.createWriteStream('test/test-document.pdf'));
    
    // Add content
    doc.fontSize(24).text('Test PDF Document', 50, 50);
    doc.fontSize(18).text('Chapter 1: Introduction', 50, 100);
    doc.fontSize(12).text('This is a test PDF document created for the knowledgebase scraper.', 50, 150);
    
    // Finalize PDF file
    doc.end();
}

createTestPDF();

createTestPDF();
