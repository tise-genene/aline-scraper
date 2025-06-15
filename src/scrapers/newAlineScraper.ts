import { SourceConfig, ALINE_SOURCES } from '../config/alineSources';
import { KnowledgeItem } from '../types';
import { InterviewingIoScraper } from './interviewingIoScraper';
import { NilMamanoScraper } from './nilMamanoScraper';
import { PdfParser } from '../utils/pdfParser';

interface ScraperOptions {
    teamId: string;
    userId: string;
    pdfPath?: string;
}

export class NewAlineScraper {
    private readonly options: ScraperOptions;
    private readonly sources: SourceConfig[];

    constructor(options: ScraperOptions) {
        this.options = options;
        this.sources = ALINE_SOURCES;
    }

    private splitPdfIntoChapters(text: string): string[] {
        // Split text into chapters based on chapter headings
        const chapters = [];
        const chapterRegex = /Chapter\s+\d+/g;
        let lastIndex = 0;

        let match;
        while ((match = chapterRegex.exec(text)) !== null) {
            const chapterText = text.substring(lastIndex, match.index).trim();
            if (chapterText) {
                chapters.push(chapterText);
            }
            lastIndex = match.index;
        }

        // Add the last chapter
        if (lastIndex < text.length) {
            chapters.push(text.substring(lastIndex).trim());
        }

        return chapters;
    }

    async scrape(): Promise<{ team_id: string; items: KnowledgeItem[] }> {
        const items: KnowledgeItem[] = [];

        // Scrape web sources
        for (const source of this.sources) {
            try {
                let scraper;
                let content = '';

                // Create appropriate scraper based on source type
                switch (source.baseUrl) {
                    case 'https://interviewing.io/blog':
                    case 'https://interviewing.io/topics#companies':
                    case 'https://interviewing.io/learn#interview-guides':
                        scraper = new InterviewingIoScraper({
                            baseUrl: source.baseUrl,
                            type: source.type,
                            author: source.author
                        });
                        content = await scraper.scrape();
                        break;

                    case 'https://nilmamano.com/blog/category/dsa':
                        scraper = new NilMamanoScraper({
                            baseUrl: source.baseUrl,
                            type: 'blog',
                            author: 'Nil Mamano'
                        });
                        content = await scraper.scrape();
                        break;

                    default:
                        console.warn(`No scraper implemented for source: ${source.baseUrl}`);
                        continue;
                }

                if (content) {
                    items.push({
                        title: source.baseUrl,
                        content,
                        content_type: source.type,
                        source_url: source.baseUrl,
                        author: source.author || '',
                        user_id: this.options.userId
                    });
                }
            } catch (error) {
                console.error(`Error scraping ${source.baseUrl}:`, error);
            }
        }

        // Parse PDF if provided
        if (this.options.pdfPath) {
            try {
                const pdfText = await PdfParser.parsePdf(this.options.pdfPath);
                // Split PDF into chapters
                const chapters = this.splitPdfIntoChapters(pdfText);
                for (let i = 0; i < chapters.length; i++) {
                    items.push({
                        title: `Chapter ${i + 1}`,
                        content: chapters[i],
                        content_type: 'book',
                        source_url: this.options.pdfPath,
                        author: 'Aline',
                        user_id: this.options.userId
                    });
                }
            } catch (error) {
                console.error('Error parsing PDF:', error);
            }
        }

        return {
            team_id: this.options.teamId,
            items
        };
    }
}
