import { PDFScraper } from '../src/scrapers/PDFScraper';
import { WebScraper } from '../src/scrapers/WebScraper';
import { ContentType } from '../src/types/index';

describe('Scraper Tests', () => {
    describe('WebScraper', () => {
        it('should scrape web content', async () => {
            const config = {
                baseUrl: 'https://example.com',
                type: ContentType.BLOG,
                title: 'Test Blog Post',
                author: 'Test Author'
            };

            const scraper = new WebScraper(config);
            const result = await scraper.scrape();

            expect(result).toBeDefined();
            expect(result.length).toBeGreaterThan(0);
            expect(result[0].content_type).toBe(ContentType.BLOG);
            expect(result[0].title).toBe('Test Blog Post');
            expect(result[0].author).toBe('Test Author');
        });
    });

    describe('PDFScraper', () => {
        it('should scrape PDF content', async () => {
            const config = {
                baseUrl: './test/sample.pdf',
                type: ContentType.BOOK,
                title: 'Test Book',
                author: 'Test Author'
            };

            const scraper = new PDFScraper('./test/sample.pdf', config);
            const result = await scraper.scrape();

            expect(result).toBeDefined();
            expect(result.length).toBeGreaterThan(0);
            expect(result[0].content_type).toBe(ContentType.BOOK);
            expect(result[0].title).toBe('Test Book');
            expect(result[0].author).toBe('Test Author');
        });
    });
});
