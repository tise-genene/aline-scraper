import { WebScraper, PdfScraper } from './plugins/index';
import { FileUtils } from './utils/fileUtils.js';
import { TextUtils } from './utils/textUtils.js';
import { PdfUtils } from './pdf/pdfUtils.js';
import { access, constants } from 'fs/promises';
import { ScraperConfig, ContentType } from './types/index';
import { ContentItem } from './types/index';
import { SOURCES } from './config/sources';

async function main() {
    const options = {
        teamId: 'aline123',
        userId: 'aline123',
        sources: SOURCES,
        pdfPath: process.argv[2]
    };

    const knowledgeBase = await scrape(options);

    // Write to output file
    await FileUtils.writeFile('output/aline_knowledge.json', 
        JSON.stringify(knowledgeBase, null, 2)
    );
    console.log('Scraping completed! Output saved to output/aline_knowledge.json');
}

async function scrape(options: {
    teamId: string;
    userId: string;
    sources?: ScraperConfig[];
    pdfPath?: string;
}): Promise<{ team_id: string; items: ContentItem[] }> {
    const items: ContentItem[] = [];

    // Scrape web sources
    if (options.sources) {
        for (const source of options.sources) {
            try {
                const scraper = new WebScraper(source);
                const sourceItems = await scraper.scrape();
                items.push(...sourceItems);
            } catch (error) {
                console.error(`Error scraping ${source.baseUrl}:`, error);
            }
        }
    }

    // Parse PDF if provided
    if (options.pdfPath) {
        try {
            const config = {
                baseUrl: options.pdfPath,
                type: 'book' as ContentType,
                selectors: {}
            };
            const scraper = new PdfScraper(config);
            const pdfItems = await scraper.scrape();
            items.push(...pdfItems);
        } catch (error) {
            console.error('Error parsing PDF:', error);
        }
    }

    return {
        team_id: options.teamId,
        items
    };
}

main().catch(console.error);
