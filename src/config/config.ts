import { join, dirname } from 'path';
import { type Config } from '../types';

const __dirname = dirname(__filename);

export const CONFIG: Config = {
    OUTPUT_DIR: join(__dirname, '..', 'output'),
    TEAM_ID: 'aline123',
    PDF_PATH: process.env.PDF_PATH || '',
    DEBUG: process.env.DEBUG === 'true'
};
