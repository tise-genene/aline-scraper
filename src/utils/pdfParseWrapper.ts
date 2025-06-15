import pdfParse from 'pdf-parse';

export async function parsePdf(buffer: Buffer) {
    try {
        const data = await pdfParse(buffer);
        return data;
    } catch (error) {
        throw error;
    }
}
