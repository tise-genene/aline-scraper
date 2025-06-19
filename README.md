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

### Creating a Scraper

1. Extend the base `Scraper` class:
```typescript
import { Scraper } from './core/Scraper';
import { ScraperConfig } from './types/index';

export class MyScraper extends Scraper {
    constructor(config: ScraperConfig) {
        super(config);
    }

    protected createContentExtractor() {
        // Implement content extraction
    }

    protected createContentProcessor() {
        // Implement content processing
    }

    protected createChapterSplitter() {
        // Implement chapter splitting
    }
}
```

### Running a Scraper

```typescript
const config = {
    baseUrl: 'https://example.com',
    type: 'blog',
    title: 'Example Blog Post',
    author: 'John Doe',
    user_id: 'user123',
    team_id: 'team456'
};

const scraper = new MyScraper(config);
const result = await scraper.scrape();
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
