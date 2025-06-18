# Aline's Knowledgebase Scraper

A specialized tool for scraping technical content into knowledgebase.

A TypeScript-based tool for scraping knowledgebase content from various sources into a structured JSON format.

## Features

- Specialized scrapers for each content source:
  - Interviewing.io blog posts
  - Interviewing.io company guides
  - Interviewing.io interview guides
  - Nil Mamano's DS&A blog
  - PDF chapters (up to 8 chapters)
- Modular architecture with base scraper class
- HTML to Markdown conversion for consistent output
- PDF chapter splitting with heuristic detection
- Detailed error handling and debug logging
- CLI interface for easy execution

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure sources in `src/config/sources.ts`

2. Run the scraper:
```bash
npm run aline -- aline123 aline_user [pdfPath]
```

Example:
```bash
npm run aline -- aline123 aline_user "path/to/aline-book.pdf"
```

## Project Structure

```
src/
├── config/        # Configuration files
├── scrapers/      # Individual scraper implementations
├── utils/         # Utility functions
├── pdf/           # PDF processing
└── index.ts       # Main entry point
```

## Output

The tool generates a JSON file in `output/aline_knowledge.json` with the following structure:

```json
{
  "team_id": "aline123",
  "items": [
    {
      "title": "Item Title",
      "content": "Markdown content",
      "content_type": "blog|guide|book",
      "source_url": "source-url",
      "author": "author-name",
      "user_id": "user-id"
    }
  ]
}
```

## Technologies Used

- TypeScript
- Axios
- Cheerio
- pdf-parse
- marked
- yargs (CLI argument parsing)
