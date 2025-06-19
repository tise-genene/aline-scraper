import { ScraperConfig, ContentItem, ContentType, Chapter } from '../types/index';
import { IContentExtractor } from './ContentExtractor';
import { SmartContentProcessor } from './ContentProcessor';
import { SmartChapterSplitter } from './ChapterSplitter';

export abstract class Scraper {
    protected config: ScraperConfig;

    constructor(config: ScraperConfig) {
        this.config = config;
    }

    protected abstract createContentExtractor(): IContentExtractor;

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

    protected async scrape(): Promise<ContentItem[]> {
        try {
            const extractor = this.createContentExtractor();
            const content = await extractor.extract(this.config.baseUrl);
            const processor = this.createContentProcessor();
            const processedContent = await processor.process(content);
            
            const splitter = this.createChapterSplitter();
            const chapters = splitter.split(processedContent);
            
            return chapters.length > 0 
                ? chapters.map((chapter: Chapter) => this.createContentItem(chapter.content, chapter.title))
                : [this.createContentItem(processedContent)];
        } catch (error) {
            console.error(`Error scraping ${this.config.baseUrl}:`, error);
            return [];
        }
    }

    protected createContentItem(content: string, title?: string): ContentItem {
        return {
            title: title || this.config.title || this.config.baseUrl,
            content,
            content_type: this.config.type,
            source_url: this.config.baseUrl,
            author: this.config.author || '',
            user_id: this.config.user_id || '',
            team_id: this.config.team_id || ''
        };
    }
}
