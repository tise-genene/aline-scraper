import { ContentProcessor } from './ContentProcessor';
import { ContentItem } from '../types/index';
import { marked } from 'marked';

export class MarkdownContentProcessor extends ContentProcessor {
    constructor(content: string, metadata: any) {
        super(content, metadata);
    }

    async process(): Promise<string> {
        try {
            // Convert HTML to markdown
            const markdown = marked.parse(this.content);
            
            // Clean and structure markdown content
            let text = await this.cleanMarkdown(markdown);
            
            // Split into sections if it's a guide
            if (this.metadata.type === 'guide') {
                text = await this.splitIntoSections(text);
            }
            
            return text;
        } catch (error) {
            console.error('Error processing markdown:', error);
            throw error;
        }
    }

    private cleanMarkdown(markdown: string): string {
        // Remove unnecessary markdown formatting
        return markdown
            .replace(/\n\n+/g, '\n\n') // Normalize newlines
            .replace(/\s+/g, ' ') // Remove extra spaces
            .trim();
    }

    private splitIntoSections(text: string): string {
        // Split by headings
        const sections = text.split(/\n# /).map(section => section.trim());
        return sections.join('\n# ');
    }
}
