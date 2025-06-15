export class TextUtils {
    static cleanText(text: string): string {
        return text
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
            .trim();
    }

    static extractTitle(text: string): string {
        const titleMatch = text.match(/<h1[^>]*>(.*?)<\/h1>/i);
        return titleMatch ? TextUtils.cleanText(titleMatch[1]) : 'Untitled';
    }

    static extractAuthor(text: string): string {
        const authorMatch = text.match(/by\s+([^\s,]+)/i);
        return authorMatch ? authorMatch[1] : '';
    }

    static convertToMarkdown(html: string): string {
        // Basic HTML to Markdown conversion
        return html
            .replace(/<h1>(.*?)<\/h1>/g, '# $1\n\n')
            .replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n')
            .replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n')
            .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
            .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
            .replace(/<em>(.*?)<\/em>/g, '*$1*')
            .replace(/<a\s+href=['"]([^'"]+)['"]>(.*?)<\/a>/g, '[$2]($1)')
            .replace(/<br\s*\/>/g, '\n');
    }
}
