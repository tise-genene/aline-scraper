import { BaseScraper } from './baseScraper';
import { KnowledgeItem, ScraperConfig } from '../types';
import { marked } from 'marked';
import axios from 'axios';
import cheerio from 'cheerio';

export class NilMamanoScraper extends BaseScraper {
    private readonly baseUrl: string;

    constructor(config: ScraperConfig) {
        super(config);
        this.baseUrl = config.baseUrl;
    }

    protected async extractContent(): Promise<string> {
        try {
            console.log(`Scraping Nil Mamano content from: ${this.baseUrl}`);
            const response = await axios.get(this.baseUrl);
            const $ = cheerio.load(response.data);

            let content = '';

            // Extract blog posts from DSA category
            $('.post-list-item').each((_, element) => {
                const title = $(element).find('.post-title').text().trim();
                const postContent = $(element).find('.post-content').html() || '';
                content += `## ${title}\n\n${postContent}\n\n`;
            });

            return content;
        } catch (error) {
            console.error(`Error scraping Nil Mamano content:`, error);
            throw error;
        }
    }

    protected formatContent(htmlContent: string): string {
        // Convert HTML to Markdown
        const markdownContent = marked.parse(htmlContent);
        
        // Add metadata
        const metadata = `## Source: ${this.baseUrl}\n\n${markdownContent}`;
        
        return metadata;
    }
}
