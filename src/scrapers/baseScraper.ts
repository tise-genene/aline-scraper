import { KnowledgeItem, ScraperConfig } from '../types.js';
import { marked } from 'marked';
import { CONTENT_TYPES } from '../types.js';

export abstract class BaseScraper {
    protected config: ScraperConfig;

    constructor(config: ScraperConfig) {
        this.config = config;
    }

    protected abstract extractContent(): Promise<string>;

    protected formatContent(htmlContent: string): string {
        // Convert HTML to Markdown
        return marked.parse(htmlContent);
    }

    public async scrape(): Promise<KnowledgeItem[]> {
        try {
            const htmlContent = await this.extractContent();
            const markdownContent = this.formatContent(htmlContent);
            
            // Validate content type
            if (!CONTENT_TYPES.includes(this.config.type)) {
                throw new Error(`Invalid content type: ${this.config.type}`);
            }

            return [
                {
                    title: this.config.baseUrl.split('/').pop() || 'Untitled',
                    content: markdownContent,
                    content_type: this.config.type,
                    source_url: this.config.baseUrl,
                    author: this.config.author || '',
                    user_id: ''
                }
            ];
        } catch (error) {
            console.error(`Error scraping ${this.config.baseUrl}:`, error);
            return [];
        }
    }
}
