import { PDFScraper } from '../scrapers/PDFScraper';
import { WebScraper } from '../scrapers/WebScraper';
import { ContentType } from '../types/index';

describe('Scraper Tests', () => {
    describe('WebScraper', () => {
        it('should create instance with valid config', () => {
            const config = {
                baseUrl: 'https://example.com',
                type: ContentType.BLOG,
                title: 'Test Blog Post',
                author: 'Test Author'
            };

            const scraper = new WebScraper(config);
            expect(scraper).toBeInstanceOf(WebScraper);
            expect(scraper.config).toEqual(config);
        });
    });

    describe('PDFScraper', () => {
        it('should create instance with valid config', () => {
            const config = {
                baseUrl: './test/sample.pdf',
                type: ContentType.BOOK,
                title: 'Test Book',
                author: 'Test Author'
            };

            const scraper = new PDFScraper('./test/sample.pdf', config);
            expect(scraper).toBeInstanceOf(PDFScraper);
            expect(scraper.config).toEqual(config);
        });
    });
});
