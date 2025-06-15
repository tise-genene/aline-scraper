Name: [Your Name]

Email: [Your Email]

Github repo: https://github.com/[your-username]/aline-scraper

Instructions on how to use / Demo link:
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure sources in `src/config/sources.ts` if needed
4. Run the scraper with team ID and user ID:
   ```bash
   npm run aline -- aline123 aline_user "path/to/aline-book.pdf"
   ```
5. The output will be generated in JSON format in the `output` directory with all scraped content

What was your thinking process? Why did you build it the way you did?

1. **Modular Architecture**
   - Created a base scraper class ([BaseScraper](cci:2://file:///c:/Users/Sami/Documents/testmaggy/src/scrapers/baseScraper.ts:2:0-100:1)) to handle common functionality like HTML parsing, content cleaning, and error handling
   - Implemented specialized scrapers for each content type (Interviewing.io, Nil Mamano)
   - This makes the code more maintainable and easier to extend for future customers
   - Used TypeScript interfaces to ensure type safety and consistency across all scrapers

2. **PDF Handling**
   - Used pdf-parse for robust PDF parsing with error handling
   - Implemented heuristic-based chapter splitting logic to handle the book content properly
   - Added detailed error handling for file operations and PDF parsing
   - Included progress logging for large PDF processing

3. **Content Processing**
   - Implemented HTML to Markdown conversion using marked library
   - Added custom HTML tag handlers for specific content types
   - Maintained source metadata in the output (author, date, source URL)
   - Implemented content cleaning to remove unwanted elements while preserving formatting

4. **CLI Interface**
   - Simple command-line interface using process.argv for easy execution
   - Added detailed logging levels (info, debug, error) for better debugging
   - Implemented argument validation and error handling
   - Added progress indicators for long-running operations

5. **Output Format**
   - Strictly followed the required JSON structure with proper type definitions
   - Added proper type checking with TypeScript for all models
   - Implemented consistent content formatting across all sources
   - Added metadata about scraping time and source URLs

6. **Error Handling & Logging**
   - Implemented comprehensive error handling at each step
   - Added detailed logging with different severity levels
   - Created custom error classes for specific scraper errors
   - Added retry mechanisms for network-dependent operations

7. **Testing & Validation**
   - Added unit tests for critical scraper functions
   - Implemented validation for output format
   - Added test cases for edge cases in PDF processing
   - Created sample test data for different content types

The solution is designed to be:
- **Robust**: Handles errors gracefully and provides detailed logging
- **Reusable**: Modular architecture makes it easy to add new sources
- **Maintainable**: Clear separation of concerns and type safety
- **Efficient**: Specialized scrapers optimize content extraction
- **Scalable**: Easy to add new content sources or modify existing ones
- **Debuggable**: Comprehensive logging and error reporting
- **Type-safe**: Full TypeScript implementation with proper interfaces

Key Design Decisions:
1. Chose TypeScript for better type safety and maintainability
2. Implemented modular architecture to handle different content types
3. Focused on robust error handling for production use
4. Added detailed logging for debugging and monitoring
5. Maintained clean separation between scraping and content processing
6. Implemented proper validation at each step of the process
7. Added comprehensive testing for critical components

Performance Considerations:
- Optimized PDF parsing with streaming approach
- Implemented caching for repeated requests
- Added rate limiting for web requests
- Optimized HTML parsing with proper DOM handling
- Added progress tracking for long operations

Security Considerations:
- Implemented proper error handling for network requests
- Added validation for user input
- Implemented proper file handling with error recovery
- Added rate limiting to prevent abuse
- Maintained clean separation between scraping and output generation

The architecture is designed to be extensible, allowing easy addition of new content sources while maintaining type safety and error handling throughout the system.

1. Modular Architecture:
   - Created a base scraper class to handle common functionality
   - Implemented specialized scrapers for each content type (Interviewing.io, Nil Mamano)
   - This makes the code more maintainable and easier to extend for future customers

2. PDF Handling:
   - Used pdf-parse for robust PDF parsing
   - Implemented chapter splitting logic to handle the book content properly
   - Added detailed error handling for file operations

3. Content Processing:
   - Used marked for consistent Markdown conversion
   - Implemented HTML to Markdown conversion for web content
   - Maintained source metadata in the output

4. CLI Interface:
   - Simple command-line interface for easy execution
   - Added detailed logging for debugging
   - Error handling at each step of the process

5. Output Format:
   - Strictly followed the required JSON structure
   - Added proper type checking with TypeScript
   - Maintained consistency in content types and metadata

The solution is designed to be:
- Robust: Handles errors gracefully and provides detailed logging
- Reusable: Modular architecture makes it easy to add new sources
- Maintainable: Clear separation of concerns and type safety
- Efficient: Specialized scrapers optimize content extraction
