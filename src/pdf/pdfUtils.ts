import * as fs from 'fs/promises';
import { PdfParser } from '../utils/pdfParser.js';

interface Chapter {
    title: string;
    content: string;
}

export class PdfUtils {
    static async parsePdf(filePath: string): Promise<string> {
        try {
            return await PdfParser.parsePdf(filePath);
        } catch (error) {
            console.error(`Error parsing PDF:`, error);
            throw error;
        }
    }

    static getChapterTitles(text: string): string[] {
        const chapterPattern = /Chapter\s+\d+:\s+([^\n]+)/g;
        const chapters: string[] = [];
        let match;
        
        while ((match = chapterPattern.exec(text)) !== null) {
            chapters.push(match[1].trim());
        }

        return chapters;
    }

    static extractChapters(text: string, numChapters: number = 8): Chapter[] {
        const chapterPattern = /Chapter\s+\d+:\s+([^\n]+)/g;
        const chapters: Chapter[] = [];
        let currentChapter = '';
        let currentTitle = '';
        let match;
        let chapterCount = 0;

        while ((match = chapterPattern.exec(text)) !== null) {
            if (chapterCount >= numChapters) break;

            currentTitle = match[1].trim();
            currentChapter = text.substring(match.index);
            
            // Find the next chapter or end of document
            const nextMatch = chapterPattern.exec(text);
            if (nextMatch) {
                currentChapter = currentChapter.substring(0, nextMatch.index);
            }

            chapters.push({
                title: currentTitle,
                content: currentChapter.trim()
            });
            chapterCount++;
        }

        return chapters;
    }
}
