import { IContentSource } from './IContentSource';
import { ContentItem } from '../types/index';
import { JSDOM } from 'jsdom';
import { marked } from 'marked';

export abstract class ContentProcessor {
    protected content: string;
    protected metadata: any;

    constructor(content: string, metadata: any) {
        this.content = content;
        this.metadata = metadata;
    }

    abstract process(): Promise<string>;

    protected cleanHtml(html: string): string {
        if (!html) return '';
        
        try {
            const dom = new JSDOM(html);
            const document = dom.window.document;
            const body = document.body;

            if (!body) return '';

            // Remove non-content elements
            ['script', 'style', 'iframe', 'noscript', 'svg'].forEach(tag => {
                const elements = document.querySelectorAll(tag);
                if (elements) {
                    elements.forEach(el => el.remove());
                }
            });

            // Remove ads and analytics
            const adElements = document.querySelectorAll('[class*="ad"], [id*="ad"], [data-ad], [data-analytics]');
            if (adElements) {
                adElements.forEach(el => el.remove());
            }

            // Remove navigation and footer
            const navElements = document.querySelectorAll('nav, footer, header');
            if (navElements) {
                navElements.forEach(el => el.remove());
            }

            return body.innerHTML || '';
        } catch (error) {
            console.error('Error cleaning HTML:', error);
            return '';
        }
    }

    protected extractText(html: string): string {
        if (!html) return '';
        
        try {
            const dom = new JSDOM(html);
            const body = dom.window.document.body;
            const text = body ? body.textContent : '';
            return text ? text.trim() : '';
        } catch (error) {
            console.error('Error extracting text:', error);
            return '';
        }
    }

    protected createContentItem(content: string): ContentItem {
        return {
            title: this.metadata.title || 'Untitled',
            content,
            content_type: this.metadata.type,
            source_url: this.metadata.url,
            author: this.metadata.author
        };
    }
}

export class SmartContentProcessor extends ContentProcessor {
    async process(): Promise<string> {
        if (!this.content) return '';
        
        try {
            // Basic cleaning
            let content = this.content.trim();
            
            // Remove extra newlines
            content = content.replace(/\n+/g, '\n');
            
            // Remove extra spaces
            content = content.replace(/\s+/g, ' ').trim();
            
            content = await this.convertToMarkdown(content);
            
            return content;
        } catch (error) {
            console.error('Error processing content:', error);
            return '';
        }
    }

    private async convertToMarkdown(content: string): Promise<string> {
        if (!content) return '';
        
        try {
            // Convert to markdown
            const markdown = marked.parse(content);
            
            // Clean markdown
            return markdown
                .replace(/\n+/g, '\n')
                .replace(/\s+/g, ' ')
                .trim();
        } catch (error) {
            console.error('Error converting to markdown:', error);
            return content || '';
        }
    }
}
