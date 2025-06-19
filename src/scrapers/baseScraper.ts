import { chromium } from 'playwright';
import { IContentSource } from '../core/IContentSource';
import { ContentType, Chapter, ScraperConfig, ContentItem } from '../types/index';

export class BaseScraper implements IContentSource {
    protected config: ScraperConfig;
    private browser: any | null = null;
    private page: any | null = null;

    constructor(config: ScraperConfig) {
        this.config = config;
    }

    async extract(): Promise<string> {
        try {
            // Launch browser
            this.browser = await chromium.launch({
                headless: true,
                args: ['--no-sandbox']
            });

            // Create new page
            this.page = await this.browser.newPage();

            // Navigate to URL
            await this.page.goto(this.config.baseUrl);

            // Wait for content to load
            await this.page.waitForLoadState('networkidle');

            // Extract content
            let content = '';
            for (const selector of this.config.selectors?.content || []) {
                try {
                    const element = await this.page.$(selector);
                    if (element) {
                        content += await element.textContent();
                    }
                } catch (error) {
                    console.error(`Error extracting content with selector ${selector}:`, error);
                }
            }

            // Clean content
            content = this.cleanContent(content);

            return content;
        } finally {
            // Close browser
            if (this.page) {
                await this.page.close();
            }
            if (this.browser) {
                await this.browser.close();
            }
        }
    }

    getMetadata(): {
        url?: string;
        title?: string;
        author?: string;
        type: ContentType;
    } {
        return {
            url: this.config.baseUrl,
            title: this.config.title || '',
            author: this.config.author || '',
            type: this.config.type
        };
    }

    processContent?(content: string): string {
        return this.formatContent(content);
    }

    splitContent?(content: string): Chapter[] {
        return [];
    }

    protected cleanContent(content: string): string {
        // Basic cleaning
        return content
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/\n+/g, '\n');
    }

    protected formatContent(content: string): string {
        return content;
    }

    public async scrape(): Promise<ContentItem[]> {
        try {
            const content = await this.extract();
            const processedContent = this.processContent?.(content) || content;
            const chapters = this.splitContent?.(processedContent) || [];

            if (chapters.length > 0) {
                return chapters.map(chapter => ({
                    title: chapter.title,
                    content: chapter.content,
                    content_type: this.config.type,
                    source_url: this.config.baseUrl,
                    author: this.config.author || '',
                    user_id: this.config.user_id || '',
                    team_id: this.config.team_id || ''
                }));
            }

            return [{
                title: this.config.title || this.config.baseUrl.split('/').pop() || 'Untitled',
                content: processedContent,
                content_type: this.config.type,
                source_url: this.config.baseUrl,
                author: this.config.author || '',
                user_id: this.config.user_id || '',
                team_id: this.config.team_id || ''
            }];
        } catch (error) {
            console.error(`Error scraping ${this.config.baseUrl}:`, error);
            return [];
        }
    }
}
