Name: [Your Name]

Email: [Your Email]

Github repo: https://github.com/[your-username]/aline-scraper

Instructions on how to use / Demo link:
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the scraper with team ID and user ID:
   ```bash
   npm run aline -- aline123 aline_user "path/to/aline-book.pdf"
   ```
4. The output will be generated in JSON format with all scraped content

What was your thinking process? Why did you build it the way you did?

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
