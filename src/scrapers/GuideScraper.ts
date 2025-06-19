import { BaseScraper } from './BaseScraper';
import { ContentType } from '../types/index';

export class GuideScraper extends BaseScraper {
    constructor(url: string) {
        super(url, {
            selectors: [
                'div.guide-content',
                'div.documentation',
                'article.guide'
            ],
            type: ContentType.GUIDE
        });
    }

    async extractContent(): Promise<string> {
        const content = await super.extractContent();
        // Add guide-specific content extraction logic
        return content;
    }
}
