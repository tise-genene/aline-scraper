import { ScraperConfig, ContentItem, ContentType } from '../../types/index';
import { Scraper } from '../Scraper';
import { ContentExtractor } from '../ContentExtractor';

export class WebScraper extends Scraper {
    constructor(config: ScraperConfig) {
        super(config);
    }

    protected createContentExtractor(): ContentExtractor {
        return new ContentExtractor();
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
}
