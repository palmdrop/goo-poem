import fs from 'fs/promises';
import { DATA_FILE } from '../constants';

fs.appendFile(DATA_FILE, `\n${new Date().toISOString()}: `);