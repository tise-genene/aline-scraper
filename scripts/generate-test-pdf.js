import { PDFCreator } from 'pdf-creator-node';
import fs from 'fs/promises';

async function createTestPDF() {
    const pdf = new PDFCreator();
    
    // Create a new PDF document
    const doc = await pdf.newDocument();
    
    // Add title
    await doc.addText('Test PDF Document', {
        fontSize: 25,
        align: 'center',
        x: 'center',
        y: 50
    });

    // Add content
    const content = [
        'This is a test PDF file created for the knowledgebase scraper project.',
        'Chapter 1: Introduction',
        'This is the first chapter of our test document. It contains some sample text to demonstrate the PDF parsing functionality.',
        'Chapter 2: Implementation Details',
        'In this chapter, we explore the implementation details of the scraper.'
    ];

    let y = 100;
    for (const text of content) {
        await doc.addText(text, {
            fontSize: 12,
            x: 50,
            y: y
        });
        y += 20;
    }

    // Save the PDF
    await doc.save('test/data/05-versions-space.pdf');
}

createTestPDF();
