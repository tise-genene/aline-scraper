import { BaseScraper } from './baseScraper.js';
import { KnowledgeItem, ScraperConfig } from '../types.js';
import * as fs from 'fs/promises';
import { PdfParser } from '../utils/pdfParser.js';

export class PdfScraper extends BaseScraper {
    private filePath: string;

    constructor(config: ScraperConfig, filePath: string) {
        super(config);
        this.filePath = filePath;
    }

    protected async extractContent(): Promise<string> {
        try {
            return await PdfParser.parsePdf(this.filePath);
        } catch (error) {
            console.error(`Error parsing PDF:`, error);
            throw error;
        }
    }

    public async scrape(): Promise<KnowledgeItem[]> {
        try {
            const content = await this.extractContent();
            const markdownContent = this.formatContent(content);
            
            return [
                {
                    title: 'PDF Document',
                    content: markdownContent,
                    content_type: this.config.type,
                    source_url: '',
                    author: this.config.author || '',
                    user_id: ''
                }
            ];
        } catch (error) {
            console.error('Error processing PDF:', error);
            return [];
        }
    }
}
