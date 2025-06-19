import { BaseScraper } from './BaseScraper';
import { KnowledgeItem, ScraperConfig } from '../types.js';
import { chromium } from 'playwright';
import { CONFIG } from '../config/config.js';

export class HtmlScraper extends BaseScraper {
    constructor(config: ScraperConfig) {
        super(config);
    }

    protected async extractContent(): Promise<string> {
        const browser = await chromium.launch();
        try {
            const page = await browser.newPage();
            await page.goto(this.config.baseUrl, { waitUntil: 'networkidle' });

            let content = await page.evaluate(() => {
                // Try to get content from various selectors
                const selectors = [
                    'main',
                    'article',
                    'div.content',
                    'div.post-content',
                    'div.article-content'
                ];

                for (const selector of selectors) {
                    const element = document.querySelector(selector);
                    if (element) {
                        // Remove scripts and styles
                        const scripts = element.getElementsByTagName('script');
                        const styles = element.getElementsByTagName('style');
                        
                        Array.from(scripts).forEach(script => script.remove());
                        Array.from(styles).forEach(style => style.remove());
                        
                        return element.outerHTML;
                    }
                }

                throw new Error('Could not find content on page');
            });

            // Try to get additional content from pagination if available
            const paginationLinks = await page.evaluate(() => {
                const paginationSelectors = [
                    'a.next',
                    'a[rel="next"]',
                    '.pagination a',
                    '.next-page a'
                ];

                for (const selector of paginationSelectors) {
                    const link = document.querySelector(selector);
                    if (link) {
                        return link.getAttribute('href');
                    }
                }
                return null;
            });

            if (paginationLinks) {
                const additionalContent = [];
                for (const link of paginationLinks) {
                    try {
                        await page.goto(link, { waitUntil: 'networkidle' });
                        const nextPageContent = await page.evaluate(() => {
                            const selectors = [
                                'main',
                                'article',
                                'div.content',
                                'div.post-content',
                                'div.article-content'
                            ];

                            for (const selector of selectors) {
                                const element = document.querySelector(selector);
                                if (element) {
                                    const scripts = element.getElementsByTagName('script');
                                    const styles = element.getElementsByTagName('style');
                                    
                                    Array.from(scripts).forEach(script => script.remove());
                                    Array.from(styles).forEach(style => style.remove());
                                    
                                    return element.outerHTML;
                                }
                            }
                            return '';
                        });
                        if (nextPageContent) {
                            additionalContent.push(nextPageContent);
                        }
                    } catch (error) {
                        console.error(`Failed to scrape pagination link ${link}:`, error);
                    }
                }

                if (additionalContent.length > 0) {
                    content += additionalContent.join('\n');
                }
            }

            return content;
        } catch (error) {
            console.error(`Failed to scrape ${this.config.baseUrl}:`, error);
            throw error;
        } finally {
            await browser.close();
        }
    }
}
