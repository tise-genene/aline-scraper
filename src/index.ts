import { HtmlScraper, PdfScraper } from './scrapers/index.js';
import { SOURCES, PDF_CONFIG } from './config/sources.js';
import { KnowledgeBase } from './types.js';
import { FileUtils } from './utils/fileUtils.js';
import { TextUtils } from './utils/textUtils.js';
import { PdfUtils } from './pdf/pdfUtils.js';
import { ScraperConfig } from './types.js';
import { KnowledgeItem } from './types.js';
import { access, constants } from 'fs/promises';

async function main() {
    const knowledgeBase: KnowledgeBase = {
        team_id: 'aline123',
        items: []
    };

    // Ensure output directory exists
    await FileUtils.ensureDirectory('output');

    // Scrape HTML sources
    for (const config of SOURCES) {
        const scraper = new HtmlScraper(config);
        const items = await scraper.scrape();
        
        // Clean and format items
        const formattedItems = items.map((item: KnowledgeItem) => ({
            ...item,
            title: TextUtils.cleanText(item.title),
            content: TextUtils.convertToMarkdown(item.content)
        }));
        
        knowledgeBase.items.push(...formattedItems);
    }

    // Scrape PDF if configured
    if (PDF_CONFIG) {
        try {
            // Get PDF path from command line argument
            const args = process.argv.slice(2);
            const pdfPath = args[0];
            
            if (!pdfPath) {
                console.warn('No PDF path provided. Skipping PDF scraping.');
                return;
            }

            // Check if file exists
            try {
                await access(pdfPath, constants.R_OK);
            } catch (err) {
                console.error(`Error: PDF file not found at path: ${pdfPath}`);
                console.error('Please provide a valid path to Aline\'s book PDF as the first argument.');
                return;
            }

            const pdfScraper = new PdfScraper(PDF_CONFIG, pdfPath);
            const pdfItems = await pdfScraper.scrape();
            
            if (pdfItems.length > 0) {
                knowledgeBase.items.push(...pdfItems);
            }
        } catch (error) {
            console.error('Error processing PDF:', error);
        }
    }

    // Write to output file
    await FileUtils.writeFile('output/aline_knowledge.json', 
        JSON.stringify(knowledgeBase, null, 2)
    );

    console.log('Scraping completed! Output saved to output/aline_knowledge.json');
}

main().catch(console.error);
