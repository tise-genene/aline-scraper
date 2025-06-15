declare module 'pdf-parse' {
    interface Result {
        text: string;
        info: any;
        metadata: any;
    }

    interface Options {
        normalize?: boolean;
        normalizeWhitespace?: boolean;
        withMetadata?: boolean;
        withInfo?: boolean;
    }

    export default function parse(dataBuffer: Buffer, options?: Options): Promise<Result>;
}

// Declare our wrapper module
declare module '../utils/pdfParser' {
    export class PdfParser {
        static parsePdf(filePath: string): Promise<string>;
        static parsePdfBuffer(buffer: Buffer): Promise<string>;
    }
}
