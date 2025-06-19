import { BaseScraper } from './BaseScraper';
import { KnowledgeItem, ScraperConfig } from '../types';
import { marked } from 'marked';
import axios from 'axios';
import cheerio from 'cheerio';

export class InterviewingIoScraper extends BaseScraper {
    private readonly baseUrl: string;

    constructor(config: ScraperConfig) {
        super(config);
        this.baseUrl = config.baseUrl;
    }

    protected async extractContent(): Promise<string> {
        try {
            console.log(`Scraping interviewing.io content from: ${this.baseUrl}`);
            const response = await axios.get(this.baseUrl);
            const $ = cheerio.load(response.data);

            let content = '';

            // Handle different content types
            switch (this.config.type) {
                case 'blog':
                    // Extract blog posts
                    $('article').each((_, element) => {
                        content += $(element).html() || '';
                    });
                    break;

                case 'guide':
                    // Extract guide content
                    $('.guide-content').each((_, element) => {
                        content += $(element).html() || '';
                    });
                    break;

                default:
                    throw new Error(`Unsupported content type: ${this.config.type}`);
            }

            return content;
        } catch (error) {
            console.error(`Error scraping interviewing.io content:`, error);
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
