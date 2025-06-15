export interface KnowledgeItem {
    title: string;
    content: string;
    content_type: ContentType;
    source_url: string;
    author: string;
    user_id: string;
}

export interface KnowledgeBase {
    team_id: string;
    items: KnowledgeItem[];
}

export type ContentType = 'blog' | 'guide' | 'book' | 'podcast_transcript' | 'call_transcript' | 'linkedin_post' | 'reddit_comment' | 'other';

export interface ScraperConfig {
    baseUrl: string;
    type: ContentType;
    author?: string;
}

export interface Config {
    OUTPUT_DIR: string;
    TEAM_ID: string;
    PDF_PATH: string;
    DEBUG: boolean;
}

// Constants
export const CONTENT_TYPES: ContentType[] = [
    'blog',
    'guide',
    'book',
    'podcast_transcript',
    'call_transcript',
    'linkedin_post',
    'reddit_comment',
    'other'
];
