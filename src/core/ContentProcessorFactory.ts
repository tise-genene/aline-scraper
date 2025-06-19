import { ContentType, ContentItem } from '../types/index';
import { ContentProcessor, SmartContentProcessor } from './ContentProcessor';
import { PdfContentProcessor } from './PdfContentProcessor';
import { MarkdownContentProcessor } from './MarkdownContentProcessor';

export class ContentProcessorFactory {
    private static processors: Map<ContentType, (content: string, metadata: any) => ContentProcessor> = new Map();

    static initialize() {
        // Register default processors
        this.registerProcessor('blog', (content, metadata) => new SmartContentProcessor(content, metadata));
        this.registerProcessor('guide', (content, metadata) => new MarkdownContentProcessor(content, metadata));
        this.registerProcessor('book', (content, metadata) => new PdfContentProcessor(content, metadata));
    }

    static registerProcessor(type: ContentType, creator: (content: string, metadata: any) => ContentProcessor): void {
        this.processors.set(type, creator);
    }

    static createProcessor(
        type: ContentType,
        content: string,
        metadata: any
    ): ContentProcessor {
        const creator = this.processors.get(type);
        if (!creator) {
            throw new Error(`No processor registered for content type: ${type}`);
        }
        const processor = creator(content, metadata);
        if (!processor) {
            throw new Error(`Failed to create processor for type: ${type}`);
        }
        return processor;
    }

    static async processContent(
        type: ContentType,
        content: string,
        metadata: any
    ): Promise<ContentItem> {
        const processor = this.createProcessor(type, content, metadata);
        const processedContent = await processor.process();
        return {
            title: metadata.title || 'Untitled',
            content: processedContent,
            content_type: metadata.type,
            source_url: metadata.url,
            author: metadata.author
        };
    }
}
