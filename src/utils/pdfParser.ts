import { access, constants, readFile } from 'fs/promises';
import * as pdfParse from 'pdf-parse';

interface PdfParseResult {
    text: string;
    info: Record<string, unknown>;
    metadata: Record<string, unknown>;
}

export class PdfParser {
    static async parsePdf(filePath: string): Promise<string> {
        try {
            console.log(`Attempting to parse PDF at path: ${filePath}`);
            
            // First check if file exists and is readable
            await access(filePath, constants.R_OK);
            console.log(`File exists and is readable`);
            
            // Read file as buffer
            const dataBuffer = await readFile(filePath);
            console.log(`File read successfully, buffer size: ${dataBuffer.length} bytes`);
            
            // Parse PDF
            console.log('Starting PDF parsing...');
            const result = await pdfParse(dataBuffer);
            console.log('PDF parsing completed successfully');
            return result.text;
        } catch (error: any) {
            console.error(`Error details:`, {
                message: error.message,
                stack: error.stack,
                name: error.name,
                code: error.code
            });
            
            if (error.code === 'ENOENT') {
                throw new Error(`PDF file not found at path: ${filePath}`);
            } else if (error.code === 'EACCES') {
                throw new Error(`Cannot read PDF file at path: ${filePath}. Permission denied.`);
            }
            console.error(`Error parsing PDF:`, error);
            throw error;
        }
    }

    static async parsePdfBuffer(buffer: Buffer): Promise<string> {
        try {
            console.log('Starting PDF parsing from buffer...');
            const result = await pdfParse(buffer);
            console.log('PDF parsing completed successfully');
            return result.text;
        } catch (error) {
            console.error('Error parsing PDF from buffer:', error);
            throw error;
        }
    }
}
