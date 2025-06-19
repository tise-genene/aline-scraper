import { ScraperConfig, ContentItem, ContentType } from '../types/index';
import { Scraper } from '../core/Scraper';
import { ContentExtractor } from '../core/ContentExtractor';
import { SmartContentProcessor } from '../core/ContentProcessor';
import { SmartChapterSplitter } from '../core/ChapterSplitter';
import * as fs from 'fs/promises';
import { PdfParser } from '../utils/pdfParser';

export class PDFScraper extends Scraper {
    private filePath: string;

    constructor(filePath: string, config: ScraperConfig) {
        super({
            ...config,
            baseUrl: filePath
        });
        this.filePath = filePath;
    }

    protected createContentExtractor(): ContentExtractor {
        return new ContentExtractor(this.filePath, {
            selectors: [],
            type: this.config.type || ContentType.BOOK
        });
    }

    protected createContentProcessor(): SmartContentProcessor {
        return new SmartContentProcessor(this.config.baseUrl, {
            title: this.config.title,
            type: this.config.type,
            url: this.config.baseUrl,
            author: this.config.author
        });
    }

    protected createChapterSplitter(): SmartChapterSplitter {
        return new SmartChapterSplitter();
    }

    protected async extractContent(): Promise<string> {
        try {
            if (!this.filePath) {
                throw new Error('No file path provided');
            }
            
            const fileExists = await fs.access(this.filePath).then(() => true).catch(() => false);
            if (!fileExists) {
                throw new Error(`File not found: ${this.filePath}`);
            }

            return await PdfParser.parsePdf(this.filePath);
        } catch (error) {
            console.error(`Error parsing PDF: ${error.message}`);
            throw error;
        }
    }

    private formatContent(content: string): string {
        if (!content) return '';
        
        // Split content into chapters/sections
        const sections = content.split('\n\n');
        
        // Convert to markdown format
        let markdown = '';
        sections.forEach((section, index) => {
            if (index === 0) {
                markdown += `# ${this.config.title || 'Chapter 1'}\n\n`;
            } else {
                markdown += `## Chapter ${index + 1}\n\n`;
            }
            markdown += section.trim() + '\n\n';
        });
        
        return markdown.trim();
    }

    public async scrape(): Promise<ContentItem[]> {
        try {
            const content = await this.extractContent();
            const markdownContent = this.formatContent(content);
            
            return [
                {
                    title: this.config.title || 'PDF Document',
                    content: markdownContent,
                    content_type: this.config.type,
                    source_url: this.config.url || '',
                    author: this.config.author || '',
                    team_id: this.config.team_id || ''
                }
            ];
        } catch (error) {
            console.error('Error processing PDF:', error);
            return [];
        }
    }
}
