import { Scraper } from '../../core/Scraper';
import { ScraperConfig, ContentItem, ContentType } from '../../types/index';
import { PdfParser } from '../../utils/pdfParser';
import { SmartChapterSplitter } from '../../core/ChapterSplitter';

export class PdfScraper extends Scraper {
    private static readonly DEFAULT_CONFIG: ScraperConfig = {
        baseUrl: '',
        type: 'book' as ContentType,
        author: ''
    };

    constructor(config: ScraperConfig) {
        super({ ...PdfScraper.DEFAULT_CONFIG, ...config });
    }

    public async scrape(): Promise<ContentItem[]> {
        try {
            const pdfText = await PdfParser.parsePdf(this.config.baseUrl);
            const processedContent = this.getContentProcessor().process(pdfText);
            
            if (this.config.type === 'book') {
                const chapterSplitter = this.getChapterSplitter();
                return this.splitIntoChapters(processedContent, chapterSplitter);
            }
            
            return [this.createContentItem(processedContent)];
        } catch (error) {
            console.error(`Error scraping PDF ${this.config.baseUrl}:`, error);
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
