import { ContentType, ContentItem, ScraperConfig, Chapter } from '../types/index';
import { IContentExtractor, ContentExtractor } from '../core/ContentExtractor';
import { SmartContentProcessor } from '../core/ContentProcessor';
import { SmartChapterSplitter } from '../core/ChapterSplitter';
import { FileUtils } from '../utils/fileUtils';
import { TextUtils } from '../utils/textUtils';
import { PdfParser } from '../utils/pdfParser';

interface GenericScraperOptions {
    teamId: string;
    userId: string;
    sources?: ScraperConfig[];
    pdfPath?: string;
}

export class GenericScraper {
    private readonly options: GenericScraperOptions;
    private readonly contentExtractor: ContentExtractor;
    private readonly contentProcessor: SmartContentProcessor;
    private readonly chapterSplitter: SmartChapterSplitter;
    private readonly pdfParser: PdfParser;

    constructor(options: GenericScraperOptions) {
        if (!options.teamId || !options.userId) {
            throw new Error('teamId and userId are required options');
        }
        this.options = options;
        this.contentExtractor = new ContentExtractor();
        this.contentProcessor = new SmartContentProcessor();
        this.chapterSplitter = new SmartChapterSplitter();
        this.pdfParser = new PdfParser();
    }

    async scrape(): Promise<ContentItem[]> {
        const items: ContentItem[] = [];

        // Handle PDF if provided
        if (this.options.pdfPath) {
            try {
                const text = await PdfParser.parsePdf(this.options.pdfPath);
                const chapters = this.chapterSplitter.split(text);
                items.push(...chapters.map(chapter => ({
                    title: chapter.title,
                    content: this.contentProcessor.process(chapter.content),
                    content_type: 'book' as ContentType,
                    source_url: this.options.pdfPath,
                    author: 'Aline Lerner'
                })));
            } catch (error) {
                console.error('Error parsing PDF:', error);
            }
        }

        // Handle web sources
        if (this.options.sources) {
            for (const source of this.options.sources) {
                try {
                    const content = await this.contentExtractor.extract(source.baseUrl);
                    const processedContent = this.contentProcessor.process(content);
                    
                    // Create a single item for non-book content
                    if (source.type !== 'book') {
                        items.push({
                            title: source.baseUrl,
                            content: processedContent,
                            content_type: source.type as ContentType,
                            source_url: source.baseUrl,
                            author: source.author || ''
                        });
                    } else {
                        // Split into chapters for book content
                        const chapters = this.chapterSplitter.split(processedContent);
                        items.push(...chapters.map(chapter => ({
                            title: chapter.title,
                            content: chapter.content,
                            content_type: 'book' as ContentType,
                            source_url: source.baseUrl,
                            author: source.author || ''
                        })));
                    }
                } catch (error) {
                    console.error(`Error scraping ${source.baseUrl}:`, error);
                }
            }
        }

        return items;
    }

    async exportKnowledgeBase(): Promise<string> {
        const items = await this.scrape();
        return JSON.stringify({
            team_id: this.options.teamId,
            items
        }, null, 2);
    }
}
