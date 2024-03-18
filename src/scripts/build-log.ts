import fs from 'fs/promises';
import { DATA_FILE, DATE_END_INDEX, LOG_FILE, POEM_START_INDEX } from '../constants';

const readData = async () => {
  return await fs.readFile(DATA_FILE, 'utf8');
}

const parseData = (data: string): [string, string][] => {
  return data
    .split('\n')
    .filter(Boolean)
    .map(line => ([line.slice(0, DATE_END_INDEX), line.slice(POEM_START_INDEX)]));
}

const buildEvent = (line: [string, string], previousLine?: [string, string]) => {
  const [timestamp, poem] = line;
  if(!previousLine) {
    return {
      value: poem,
      previousValue: "",
      removed: "",
      added: poem,
      previousFrom: 0,
      previousTo: 0,
      currentFrom: 0,
      currentTo: poem.length,
      timestamp,
    }
  }

  const [, previousPoem] = previousLine;

  let sameToFromStart: number;
  let sameToFromEnd: number;

  const maxIndex = Math.max(poem.length, previousPoem.length);
  let index = 0;
  while(index <= maxIndex && previousPoem.at(index) === poem.at(index)) {
    index++;
  }
  sameToFromStart = index;

  index = 0;
  while(index <= maxIndex && previousPoem.at(-index - 1) === poem.at(-index - 1)) {
    index++;
  }
  sameToFromEnd = index + 1;

  const previousFrom = sameToFromStart; 
  const previousTo = Math.max(previousFrom, previousPoem.length - sameToFromEnd + 1);

  const currentFrom = sameToFromStart; 
  const currentTo = Math.max(currentFrom, poem.length - sameToFromEnd + 1);

  const removed = previousPoem.slice(previousFrom, previousTo);
  const added = poem.slice(currentFrom, currentTo);

  return {
    value: poem,
    previousValue: previousPoem,
    removed,
    added,
    previousFrom,
    previousTo,
    currentFrom,
    currentTo,
    timestamp,
  } 
}

const buildLog = (lines: [string, string][]) => {
  const events = lines.map((line, index) => {
    const previous = index > 0 ? lines.at(index - 1) : undefined;
    return buildEvent(line, previous);
  });

  return {
    log: events,
    value: events.at(-1)?.value ?? ""
  }
}

const writeLog = async (log: ReturnType<typeof buildLog>) => {
  fs.writeFile(
    LOG_FILE, 
    JSON.stringify(log, null, 2)
  );
}

(async () => {
  const data = await readData(); 
  const lines = parseData(data);
  const log = buildLog(lines);
  await writeLog(log);
})();