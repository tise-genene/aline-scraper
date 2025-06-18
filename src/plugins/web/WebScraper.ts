import { Scraper } from '../../core/Scraper';
import { ScraperConfig, ContentItem, ContentType } from '../../types/index';
import { ContentExtractor } from '../../core/ContentExtractor';
import { SmartContentProcessor } from '../../core/ContentProcessor';
import { SmartChapterSplitter } from '../../core/ChapterSplitter';
import { chromium } from 'playwright';

export class WebScraper extends Scraper {
    protected createContentExtractor(): ContentExtractor {
        return new ContentExtractor();
    }

    protected createContentProcessor(): SmartContentProcessor {
        return new SmartContentProcessor();
    }

    protected createChapterSplitter(): SmartChapterSplitter {
        return new SmartChapterSplitter();
    }

    // Override scrape to handle pagination if needed
    public async scrape(): Promise<ContentItem[]> {
        const items = await super.scrape();
        
        // Check for pagination
        const hasPagination = await this.hasPagination();
        if (hasPagination) {
            const additionalItems = await this.scrapePagination();
            return [...items, ...additionalItems];
        }
        
        return items;
    }

    private async hasPagination(): Promise<boolean> {
        const browser = await chromium.launch();
        try {
            const page = await browser.newPage();
            await page.goto(this.config.baseUrl, { waitUntil: 'networkidle' });
            
            const hasPagination = await page.evaluate(() => {
                const paginationSelectors = [
                    'a.next',
                    'a[rel="next"]',
                    '.pagination a',
                    '.next-page a'
                ];
                
                return paginationSelectors.some(selector => 
                    document.querySelector(selector) !== null
                );
            });
            
            return hasPagination;
        } finally {
            await browser.close();
        }
    }

    private async scrapePagination(): Promise<ContentItem[]> {
        const browser = await chromium.launch();
        try {
            const page = await browser.newPage();
            await page.goto(this.config.baseUrl, { waitUntil: 'networkidle' });
            
            const links = await page.evaluate(() => {
                const paginationSelectors = [
                    'a.next',
                    'a[rel="next"]',
                    '.pagination a',
                    '.next-page a'
                ];
                
                const links = [];
                for (const selector of paginationSelectors) {
                    const element = document.querySelector(selector);
                    if (element) {
                        links.push(element.getAttribute('href'));
                    }
                }
                return links;
            });
            
            const items = [];
            for (const link of links) {
                if (link) {
                    const config = { ...this.config, baseUrl: link };
                    const scraper = new WebScraper(config);
                    const result = await scraper.scrape();
                    items.push(...result);
                }
            }
            
            return items;
        } finally {
            await browser.close();
        }
    }
}
