import { GenericScraper } from '../scrapers/genericScraper';
import { ALINE_SOURCES, BOOK_CHAPTERS } from '../config/alineSources';
import { access, constants } from 'fs/promises';

async function main() {
    const [teamId, userId, pdfPath] = process.argv.slice(2);

    if (!teamId || !userId) {
        console.error('Usage: npm run aline -- <teamId> <userId> [pdfPath]');
        console.error('Example: npm run aline -- aline123 aline_user test/test-chapter.pdf');
        process.exit(1);
    }

    console.log('Starting Aline knowledgebase scraper...');
    console.log(`Team ID: ${teamId}`);
    console.log(`User ID: ${userId}`);
    if (pdfPath) {
        console.log(`PDF Path: ${pdfPath}`);
        try {
            // Verify PDF file exists
            await access(pdfPath, constants.R_OK);
            console.log('PDF file exists and is readable');
        } catch (error: any) {
            console.error(`Error accessing PDF file: ${error.message}`);
            process.exit(1);
        }
    }

    const scraper = new GenericScraper({
        teamId,
        userId,
        sources: ALINE_SOURCES,
        pdfPath: pdfPath || undefined
    });

    try {
        const result = await scraper.scrape();
        console.log('Scraping completed successfully!');
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error during scraping:', error);
    }
}

main();
