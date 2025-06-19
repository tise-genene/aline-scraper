import { chromium } from 'playwright';
import pdfParse from 'pdf-parse';
import { ContentExtractor as ContentExtractorInterface } from '../types/index';
import { JSDOM } from 'jsdom';
import { readFile } from 'fs/promises';

export interface IContentExtractor extends ContentExtractorInterface {
    setSelectors(selectors: string[]): void;
    extractPDF(filePath: string): Promise<string>;
    analyzeContentStructure(html: string): Promise<{
        mainContent: string;
        headings: string[];
        paragraphs: string[];
    }>;
}

export class ContentExtractor implements IContentExtractor {
    private browser: any | null = null;
    private page: any | null = null;
    private selectors: string[] = [
        'article',
        'div.content',
        'div.post-content',
        'div.entry-content',
        'main',
        'div.article-content',
        'div#content',
        'div.post',
        'section.content',
        'div.post-body',
        'div.entry-content-single',
        'div.post-content-single'
    ];

    setSelectors(selectors: string[]): void {
        this.selectors = selectors;
    }

    async extract(url: string): Promise<string> {
        try {
            console.log(`Starting content extraction for ${url}`);
            console.log(`Navigating to ${url}`);
            
            if (!this.browser) {
                this.browser = await chromium.launch({
                    timeout: 60000, // 60 seconds
                    headless: true
                });
            }
            if (!this.page) {
                const context = await this.browser.newContext();
                this.page = await context.newPage();
                await this.page.setDefaultTimeout(60000);
            }

            await this.page.goto(url, {
                waitUntil: 'networkidle',
                timeout: 60000
            });

            console.log('Page loaded, analyzing content structure');
            const { mainContent } = await this.analyzeContentStructure(await this.page.content());
            
            if (!mainContent.trim()) {
                console.log('No main content found, trying fallback selectors');
                return this.tryFallbackSelectors();
            }

            console.log('Main content found');
            return mainContent;
        } catch (error) {
            console.error('Error extracting content:', error);
            throw error;
        } finally {
            if (this.page) {
                await this.page.close();
                this.page = null;
            }
        }
    }

    private async tryFallbackSelectors(): Promise<string> {
        console.log('Trying fallback selectors');
        for (const selector of this.selectors) {
            const content = await this.page.evaluate((sel: string) => {
                const element = document.querySelector(sel);
                if (element) {
                    return element.textContent?.trim() || '';
                }
                return '';
            }, selector);

            if (content.trim()) {
                console.log(`Content found with selector: ${selector}`);
                return content;
            }
        }
        return '';
    }

    async analyzeContentStructure(html: string): Promise<{
        mainContent: string;
        headings: string[];
        paragraphs: string[];
    }> {
        try {
            const dom = new JSDOM(html);
            const document = dom.window.document;

            // Find main content area
            const mainContent = this.findMainContent(document);
            
            // Extract headings
            const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
                .map((h: Element) => h.textContent?.trim())
                .filter((text: string | undefined) => typeof text === 'string' && text.trim())
                .slice(0, 5) as string[]; // Limit to top 5 headings

            // Extract paragraphs
            const paragraphs = Array.from(document.querySelectorAll('p'))
                .map((p: Element) => p.textContent?.trim())
                .filter((text: string | undefined) => typeof text === 'string' && text.trim())
                .slice(0, 10) as string[]; // Limit to top 10 paragraphs

            return {
                mainContent: mainContent || '',
                headings,
                paragraphs
            };
        } catch (error) {
            console.error('Error analyzing content structure:', error);
            throw error;
        }
    }

    private findMainContent(document: Document): string {
        // Try to find main content based on semantic HTML
        const mainElements = [
            document.querySelector('main'),
            document.querySelector('article'),
            document.querySelector('div.content'),
            document.querySelector('div.post-content'),
            document.querySelector('div.entry-content')
        ];

        for (const element of mainElements) {
            if (element && element.textContent?.trim()) {
                return element.textContent.trim();
            }
        }

        // If no semantic elements found, try to find largest text block
        const textBlocks = Array.from(document.querySelectorAll('div, article, section'))
            .map(element => ({
                element,
                textLength: element.textContent?.trim().length || 0
            }))
            .filter(block => block.textLength > 500) // Minimum length for main content
            .sort((a, b) => b.textLength - a.textLength);

        return textBlocks[0]?.element.textContent?.trim() || '';
    }

    async extractPDF(filePath: string): Promise<string> {
        try {
            const buffer = await readFile(filePath);
            const data = await pdfParse(buffer);
            return data.text || '';
        } catch (error) {
            console.error('Error extracting PDF:', error);
            throw error;
        }
    }

    async extractContent(url: string): Promise<string> {
        return this.extract(url);
    }

    async closeBrowser(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}