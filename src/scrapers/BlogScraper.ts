import { BaseScraper } from './BaseScraper';
import { ContentType } from '../types/index';

export class BlogScraper extends BaseScraper {
    constructor(url: string) {
        super(url, {
            selectors: [
                'article',
                'div.content',
                'div.post',
                'div.entry-content'
            ],
            type: ContentType.BLOG
        });
    }

    async extractContent(): Promise<string> {
        const content = await super.extractContent();
        // Add blog-specific content extraction logic
        return content;
    }
}
