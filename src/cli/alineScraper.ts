import { NewAlineScraper } from '../scrapers/newAlineScraper';
import { ALINE_SOURCES, BOOK_CHAPTERS } from '../config/alineSources';

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
    }

    const scraper = new NewAlineScraper({
        teamId,
        userId,
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
