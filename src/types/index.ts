export type ContentType = 'blog' | 'podcast_transcript' | 'call_transcript' | 'linkedin_post' | 'reddit_comment' | 'book' | 'other' | 'guide';

export interface ContentExtractor {
    extract(url: string): Promise<string>;
}

export interface ContentProcessor {
    process(content: string): string;
}

export interface ChapterSplitter {
    split(content: string): Chapter[];
}

/**
 * Represents a chapter or section of content
 * @property {string} title - The title of the chapter
 * @property {string} content - The content of the chapter
 */
export interface Chapter {
    title: string;
    content: string;
}

/**
 * Represents a single item of content
 * @property {string} title - The title of the content
 * @property {string} content - The actual content text
 * @property {ContentType} content_type - The type of content (blog, podcast, etc.)
 * @property {string} [source_url] - Optional URL where the content was sourced from
 * @property {string} [author] - Optional author of the content
 * @property {string} [user_id] - Optional ID of the user who owns this content
 * @property {string} [team_id] - Optional ID of the team this content belongs to
 */
export interface ContentItem {
    title: string;
    content: string;
    content_type: ContentType;
    source_url?: string;
    author?: string;
    user_id?: string;
    team_id?: string;
}

/**
 * Type alias for an array of ContentItems
 */
export type ContentItemArray = ContentItem[];

/**
 * Configuration for a scraper
 * @property {string} baseUrl - The base URL to scrape from
 * @property {ContentType} type - The type of content being scraped
 * @property {string} [author] - Optional author of the content
 * @property {string} [title] - Optional title for the content
 * @property {Object} [selectors] - Optional CSS selectors for content extraction
 * @property {string[]} [selectors.content] - CSS selectors for content
 * @property {string[]} [selectors.pagination] - CSS selectors for pagination
 * @property {string} [team_id] - Optional team ID
 * @property {string} [user_id] - Optional user ID
 */
export interface ScraperConfig {
    baseUrl: string;
    type: ContentType;
    author?: string;
    title?: string;
    selectors?: {
        content?: string[];
        pagination?: string[];
    };
    team_id?: string;
    user_id?: string;
}

/**
 * Options for configuring a scraper
 * @property {string} team_id - Team ID
 * @property {string} user_id - User ID
 * @property {string} [pdf_path] - Optional path to PDF file
 * @property {ScraperConfig[]} [sources] - Optional array of scraper configurations
 */
export interface ScraperOptions {
    team_id: string;
    user_id: string;
    pdf_path?: string;
    sources?: Omit<ScraperConfig, 'user_id'>[];
}

/**
 * Represents a knowledge base of content items
 * @property {string} team_id - Team ID
 * @property {ContentItem[]} items - Array of content items
 */
export interface KnowledgeBase {
    team_id: string;
    items: ContentItem[];
}


