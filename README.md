# Knowledgebase Scraper Framework

A scalable and extensible TypeScript framework for scraping and processing content into a structured knowledgebase format.

## Features

- Scalable architecture with abstract base classes
- Modular pipeline for content processing:
  - Content extraction
  - Content processing
  - Chapter splitting
- Built-in implementations:
  - Web content scraper
  - PDF scraper
- Fully typed with TypeScript
- Extensible interface design
- Error handling and logging

## Usage

### Installation

1. Install dependencies:
```bash
npm install
```

### Basic Usage

1. Create a configuration object:
```typescript
const config = {
    baseUrl: 'https://example.com',  // URL to scrape
    type: 'blog',                    // Content type (blog, book, article, etc.)
    title: 'Example Blog Post',      // Title of the content
    author: 'John Doe',             // Author name
    user_id: 'user123',             // User ID
    team_id: 'team456',             // Team ID
    selectors: ['article', 'div.content'],  // Optional: CSS selectors for content
    metadata: {                     // Optional: Additional metadata
        tags: ['javascript', 'webdev'],
        date: '2025-06-19'
    }
};
```

2. Create and run a scraper:
```typescript
import { WebScraper } from './scrapers/WebScraper';
import { PDFScraper } from './scrapers/PDFScraper';

// For web content
const webScraper = new WebScraper(config);
const webContent = await webScraper.scrape();

// For PDF content
const pdfConfig = {
    ...config,
    baseUrl: './path/to/document.pdf'
};

const pdfScraper = new PDFScraper('./path/to/document.pdf', pdfConfig);
const pdfContent = await pdfScraper.scrape();
```

### Example: Scraping a Blog Post

```typescript
import { WebScraper } from './scrapers/WebScraper';

// Configuration for a blog post
const blogConfig = {
    baseUrl: 'https://example.com/blog/post',
    type: 'blog',
    title: 'Understanding TypeScript Generics',
    author: 'John Doe',
    user_id: 'user123',
    team_id: 'team456',
    selectors: ['div.article-content', 'article'],
    metadata: {
        tags: ['typescript', 'programming', 'webdev'],
        date: '2025-06-19'
    }
};

// Create and run the scraper
const scraper = new WebScraper(blogConfig);
const contentItems = await scraper.scrape();

// Output will be an array of ContentItem objects
console.log(contentItems[0]);
// {
//   title: 'Understanding TypeScript Generics',
//   content: 'Markdown formatted content...',
//   content_type: 'blog',
//   source_url: 'https://example.com/blog/post',
//   author: 'John Doe',
//   user_id: 'user123',
//   team_id: 'team456'
// }
```

### Example: Processing a PDF Book

```typescript
import { PDFScraper } from './scrapers/PDFScraper';

// Configuration for a PDF book
const pdfConfig = {
    baseUrl: './books/typescript-essentials.pdf',
    type: 'book',
    title: 'TypeScript Essentials',
    author: 'John Smith',
    user_id: 'user123',
    team_id: 'team456',
    selectors: []  // PDF doesn't use selectors
};

// Create and run the PDF scraper
const scraper = new PDFScraper('./books/typescript-essentials.pdf', pdfConfig);
const chapters = await scraper.scrape();

// Output will be an array of chapters
console.log(chapters[0]);
// {
//   title: 'Chapter 1: Introduction',
//   content: 'Markdown formatted chapter content...',
//   content_type: 'book',
//   source_url: './books/typescript-essentials.pdf',
//   author: 'John Smith',
//   user_id: 'user123',
//   team_id: 'team456'
// }
```

## Project Structure

```
src/
├── core/          # Core framework classes
│   ├── Scraper.ts         # Base scraper class
│   ├── ContentExtractor.ts # Content extraction interface
│   ├── ContentProcessor.ts # Content processing interface
│   └── ChapterSplitter.ts  # Chapter splitting interface
├── scrapers/      # Concrete scraper implementations
│   ├── WebScraper.ts
│   └── PDFScraper.ts
├── types/         # TypeScript interfaces
└── test/          # Test files
```

## Output Format

The scraper returns an array of `ContentItem` objects:

```typescript
interface ContentItem {
    title: string;
    content: string;
    content_type: ContentType;
    source_url: string;
    author: string;
    user_id: string;
    team_id: string;
}
```

## Technologies Used

- TypeScript
- Playwright (for web scraping)
- JSDOM (for HTML processing)
- pdf-parse (for PDF processing)
- marked (for markdown conversion)
