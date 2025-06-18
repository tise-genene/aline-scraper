import { ScraperConfig, ContentItem, ContentType } from '../types/index';
import { ContentExtractor } from './ContentExtractor';
import { SmartContentProcessor } from './ContentProcessor';
import { SmartChapterSplitter } from './ChapterSplitter';

export abstract class Scraper {
    protected config: ScraperConfig;

    constructor(config: ScraperConfig) {
        this.config = config;
    }

    protected createContentExtractor(): ContentExtractor {
        return new ContentExtractor();
    }

    protected createContentProcessor(): SmartContentProcessor {
        return new SmartContentProcessor();
    }

    protected createChapterSplitter(): SmartChapterSplitter {
        return new SmartChapterSplitter();
    }

    protected getContentExtractor(): ContentExtractor {
        return this.createContentExtractor();
    }

    protected getContentProcessor(): SmartContentProcessor {
        return this.createContentProcessor();
    }

    protected getChapterSplitter(): SmartChapterSplitter {
        return this.createChapterSplitter();
    }

    protected async scrape(): Promise<ContentItem[]> {
        try {
            const contentExtractor = this.getContentExtractor();
            const content = await contentExtractor.extract(this.config.baseUrl);
            const contentProcessor = this.getContentProcessor();
            const processedContent = contentProcessor.process(content);
            
            if (this.config.type === 'book') {
                const chapterSplitter = this.getChapterSplitter();
                return this.splitIntoChapters(processedContent, chapterSplitter);
            }
            
            return [this.createContentItem(processedContent)];
        } catch (error) {
            console.error(`Error scraping ${this.config.baseUrl}:`, error);
            return [];
        }
    }

    protected splitIntoChapters(content: string, chapterSplitter: SmartChapterSplitter): ContentItem[] {
        const chapters = chapterSplitter.split(content);
        return chapters.map(chapter => this.createContentItem(chapter.content, chapter.title));
    }

    protected createContentItem(content: string, title?: string): ContentItem {
        return {
            title: title || this.config.baseUrl,
            content,
            content_type: this.config.type,
            source_url: this.config.baseUrl,
            author: this.config.author || ''
        };
    }
}
