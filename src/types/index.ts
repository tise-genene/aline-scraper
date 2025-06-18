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

export interface Chapter {
    title: string;
    content: string;
}

export interface ContentItem {
    title: string;
    content: string;
    content_type: ContentType;
    source_url?: string;
    author?: string;
}

export type ContentItemArray = ContentItem[];

export interface ScraperConfig {
    baseUrl: string;
    type: ContentType;
    author?: string;
    selectors?: {
        content?: string[];
        pagination?: string[];
    };
}

export interface ScraperOptions {
    team_id: string;
    user_id: string;
    pdf_path?: string;
    sources?: Omit<ScraperConfig, 'user_id'>[];
}

export interface KnowledgeBase {
    team_id: string;
    items: ContentItem[];
}


