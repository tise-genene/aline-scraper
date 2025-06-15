import { ScraperConfig } from '../types.js';

export const SOURCES: ScraperConfig[] = [
    {
        baseUrl: 'https://interviewing.io/blog',
        type: 'blog',
        author: 'Interviewing.io'
    },
    {
        baseUrl: 'https://nilmamano.github.io/DSA',
        type: 'guide',
        author: 'Nil Mamano'
    },
    {
        baseUrl: 'https://interviewing.io/guide',
        type: 'guide',
        author: 'Interviewing.io'
    }
];

// PDF configuration is handled through command line arguments
export const PDF_CONFIG: ScraperConfig = {
    type: 'book' as const,
    baseUrl: ''
};
