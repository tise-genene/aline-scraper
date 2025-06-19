import { ContentProcessor } from './ContentProcessor';
import { ContentItem } from '../types/index';
import pdfParse from 'pdf-parse';

export class PdfContentProcessor extends ContentProcessor {
    constructor(content: string, metadata: any) {
        super(content, metadata);
    }

    async process(): Promise<string> {
        try {
            const pdfBuffer = Buffer.from(this.content, 'base64');
            const data = await pdfParse(pdfBuffer);
            
            // Clean and structure PDF text
            let text = data.text;
            text = text.replace(/\s+/g, ' ').trim();
            
            // Split into chapters if it's a book
            if (this.metadata.type === 'book') {
                text = this.splitIntoChapters(text);
            }
            
            return text;
        } catch (error) {
            console.error('Error processing PDF:', error);
            throw error;
        }
    }

    private splitIntoChapters(text: string): string {
        // Simple chapter detection - can be made more sophisticated
        const chapters = text.split(/\n\n\n/).map(chapter => chapter.trim());
        return chapters.join('\n\n');
    }
}
