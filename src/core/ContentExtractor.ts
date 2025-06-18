import { chromium } from 'playwright';
import { ContentExtractor as ContentExtractorInterface } from '../types/index';

export interface IContentExtractor extends ContentExtractorInterface {}

export class ContentExtractor implements IContentExtractor {
    private browser: any | null = null;
    private page: any | null = null;

    async extract(url: string): Promise<string> {
        try {
            console.log(`Starting content extraction for ${url}`);
            
            // Configure browser with longer timeout
            const browser = await chromium.launch({
                timeout: 60000, // 60 seconds
                headless: true
            });
            
            const context = await browser.newContext();
            this.page = await context.newPage();
            
            // Set page timeout
            await this.page.setDefaultTimeout(60000);
            
            console.log(`Navigating to ${url}`);
            await this.page.goto(url, {
                waitUntil: 'networkidle',
                timeout: 60000
            });
            
            console.log(`Page loaded, extracting content`);
            const content = await this.extractContent();
            
            console.log(`Content extraction complete. Length: ${content.length} characters`);
            return content.trim();
        } catch (error: any) {
            console.error(`Error extracting content from ${url}: ${error.message}`);
            console.error(`Error details: ${error.stack}`);
            await this.closeBrowser();
            return '';
        } finally {
            await this.closeBrowser();
        }
    }

    private async extractContent(): Promise<string> {
        let content = '';
        
        // Try main selectors first
        const mainSelectors = [
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
            'div.post-content-single',
            'div.article-content-single'
        ];
        
        // 2. Try heading-based content
        const headingSelectors = 'h1, h2, h3, h4, h5, h6, p';
        
        // 3. Try blog post specific selectors
        const blogSelectors = [
            'div.post-body',
            'div.post-content',
            'div.article',
            'div.entry',
            'div.content',
            'div.post-content-single',
            'div.entry-content-single',
            'div.article-content-single'
        ];
        
        // Try main selectors first
        for (const selector of mainSelectors) {
            console.log(`Trying selector: ${selector}`);
            const element = await this.page.$(selector);
            if (element) {
                const text = await element.textContent();
                if (text?.trim()) {
                    content = text.trim();
                    console.log(`Found content using selector: ${selector}`);
                    break;
                }
            }
        }
        
        // If no content found, try heading-based approach
        if (!content) {
            console.log('No content found, trying heading-based extraction...');
            const headingElements = await this.page.$$(headingSelectors);
            if (headingElements.length > 0) {
                console.log(`Found ${headingElements.length} heading elements`);
                for (const element of headingElements) {
                    const text = await element.textContent();
                    if (text?.trim()) {
                        content += text.trim() + '\n\n'; // Add double newline for better readability
                    }
                }
            }
        }
        
        // If still no content, try blog post selectors
        if (!content) {
            console.log('No content found, trying blog post selectors...');
            for (const selector of blogSelectors) {
                console.log(`Trying selector: ${selector}`);
                const element = await this.page.$(selector);
                if (element) {
                    const text = await element.textContent();
                    if (text?.trim()) {
                        content = text.trim();
                        console.log(`Found content using selector: ${selector}`);
                        break;
                    }
                }
            }
        }
        
        if (!content) {
            console.log('No content found using standard selectors, trying fallback...');
            // Try a fallback approach - get all visible text
            const allText = await this.page.evaluate(() => {
                const body = document.body;
                if (!body) return '';
                const text = body.textContent || '';
                // Remove extra whitespace and newlines
                return text.replace(/\s+/g, ' ').trim();
            });
            content = allText.trim();
        }
        
        // Clean up content
        content = content
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/\n\s+/g, '\n') // Remove extra spaces after newlines
            .trim();
        
        return content;
    }

    private async closeBrowser(): Promise<void> {
        if (this.browser) {
            try {
                await this.browser.close();
            } catch (error: any) {
                console.error(`Error closing browser: ${error}`);
            }
        }
    }
}