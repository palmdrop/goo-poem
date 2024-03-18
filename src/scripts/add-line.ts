import fs from 'fs/promises';
import { DATA_FILE, LOG_FILE } from '../constants';
import { GooPoem } from '../types/poem';

const readLog = async () => {
  const data = await fs.readFile(LOG_FILE, 'utf8');
  return JSON.parse(data) as GooPoem;
}

const appendDataLine = async (value: string) => {
  fs.appendFile(
    DATA_FILE, `\n${new Date().toISOString()}: ${value}`
  );
}

(async () => {
  const log = await readLog();
  const previousValue = log?.value ?? "";
  appendDataLine(previousValue);
})();
