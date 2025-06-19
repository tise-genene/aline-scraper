import { ContentType, Chapter } from '../types/index';

export interface IContentSource {
    // Extract raw content from the source
    extract(): Promise<string>;

    // Get metadata about the source
    getMetadata(): {
        url?: string;
        title?: string;
        author?: string;
        type: ContentType;
    };

    // Clean and process the content
    processContent?(content: string): string;

    // Split content into chapters/sections if applicable
    splitContent?(content: string): Chapter[];
}
