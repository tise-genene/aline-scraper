import { ChapterSplitter, Chapter } from '../types/index';

export class SmartChapterSplitter implements ChapterSplitter {
    private static readonly DEFAULT_DELIMITERS = [
        /Chapter\s+\d+/i,
        /Part\s+\d+/i,
        /Section\s+\d+/i,
        /^\d+\.\s+/,
        /^\d+\./
    ];

    split(content: string): Chapter[] {
        const chapters: Chapter[] = [];
        let lastIndex = 0;

        // Try each delimiter in order of priority
        for (const delimiter of SmartChapterSplitter.DEFAULT_DELIMITERS) {
            let match;
            while ((match = delimiter.exec(content)) !== null) {
                const chapterText = content.substring(lastIndex, match.index).trim();
                if (chapterText) {
                    chapters.push({
                        title: match[0],
                        content: chapterText
                    });
                }
                lastIndex = match.index;
            }
        }

        // Add the last chapter
        if (lastIndex < content.length) {
            const lastChapter = content.substring(lastIndex).trim();
            if (lastChapter) {
                chapters.push({
                    title: 'Chapter ' + (chapters.length + 1),
                    content: lastChapter
                });
            }
        }

        return chapters;
    }
}
