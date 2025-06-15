import { SourceConfig, ALINE_SOURCES } from '../config/alineSources';
import { KnowledgeItem, ContentType } from '../types';
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
        if (!options.teamId || !options.userId) {
            throw new Error('teamId and userId are required options');
        }
        this.options = options;
        this.sources = ALINE_SOURCES;
    }

    private splitPdfIntoChapters(text: string): string[] {
        if (!text) {
            return [];
        }

        // Split text into chapters based on chapter headings
        const chapters: string[] = [];
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
            const lastChapter = text.substring(lastIndex).trim();
            if (lastChapter) {
                chapters.push(lastChapter);
            }
        }

        return chapters;
    }

    async scrape(): Promise<{ team_id: string; items: KnowledgeItem[] }> {
        const items: KnowledgeItem[] = [];

        // Scrape web sources
        for (const source of this.sources) {
            try {
                let scraper;

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
                        break;

                    case 'https://nilmamano.com/blog/category/dsa':
                        scraper = new NilMamanoScraper({
                            baseUrl: source.baseUrl,
                            type: 'blog',
                            author: 'Nil Mamano'
                        });
                        break;

                    default:
                        console.warn(`No scraper implemented for source: ${source.baseUrl}`);
                        continue;
                }

                if (!scraper) {
                    console.warn(`No scraper created for source: ${source.baseUrl}`);
                    continue;
                }

                const sourceItems = await scraper.scrape();
                if (sourceItems.length === 0) {
                    console.warn(`No content scraped from ${source.baseUrl}`);
                    continue;
                }

                items.push(...sourceItems);
            } catch (error: unknown) {
                const errorMessage = error instanceof Error 
                    ? error.message 
                    : 'Unknown error occurred';
                console.error(`Error scraping ${source.baseUrl}: ${errorMessage}`);
            }
        }

        // Parse PDF if provided
        if (this.options.pdfPath) {
            try {
                if (!this.options.pdfPath) {
                    throw new Error('PDF path is required');
                }

                const pdfText = await PdfParser.parsePdf(this.options.pdfPath);
                if (!pdfText) {
                    throw new Error('No content found in PDF');
                }

                // Split PDF into chapters
                const chapters = this.splitPdfIntoChapters(pdfText);
                
                if (chapters.length > 0) {
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
                } else {
                    console.warn('No chapters found in PDF');
                }
            } catch (error: unknown) {
                const errorMessage = error instanceof Error 
                    ? error.message 
                    : 'Unknown error occurred';
                console.error(`Error parsing PDF: ${errorMessage}`);
            }
        }

        return {
            team_id: this.options.teamId,
            items
        };
    }
}
