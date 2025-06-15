import { join } from 'path';
import { fileURLToPath } from 'url';
import { type Config } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

export const CONFIG: Config = {
    OUTPUT_DIR: join(__dirname, '..', 'output'),
    TEAM_ID: 'aline123',
    PDF_PATH: process.env.PDF_PATH || '',
    DEBUG: process.env.DEBUG === 'true'
};
