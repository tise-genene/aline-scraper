export interface SourceConfig {
    baseUrl: string;
    type: 'blog' | 'guide' | 'book';
    author?: string;
    chapter?: number;
    title?: string;
}

export const ALINE_SOURCES: SourceConfig[] = [
    // Interviewing.io blog posts
    {
        baseUrl: 'https://interviewing.io/blog',
        type: 'blog',
        author: 'Interviewing.io'
    },
    
    // Company guides
    {
        baseUrl: 'https://interviewing.io/topics#companies',
        type: 'guide',
        author: 'Interviewing.io'
    },
    
    // Interview guides
    {
        baseUrl: 'https://interviewing.io/learn#interview-guides',
        type: 'guide',
        author: 'Interviewing.io'
    },
    
    // Nil Mamano's DS&A blog
    {
        baseUrl: 'https://nilmamano.com/blog/category/dsa',
        type: 'blog',
        author: 'Nil Mamano'
    }
];

// Book chapters configuration
export const BOOK_CHAPTERS = 8;
