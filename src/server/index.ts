import express from 'express';
import cors from 'cors';
import { Request } from 'express';
import fs from 'fs/promises';
import { DATA_FILE, MINIMAL_DATA_FILE, SERVER_PORT } from './constants';
import { Data } from './types';
import { ChangeEvent } from '../types/events';

const PATH = `./${DATA_FILE}`;
const MINIMAL_PATH = `./${MINIMAL_DATA_FILE}`;

let data: Data;

const writeMinimalData = async (updatedData: Data) => {
  let minimalData: Data;
  try {
    minimalData = await readData(MINIMAL_PATH);
  } catch(error) {
    minimalData = {
      log: [],
      value: ''
    }
  }

  let event: ChangeEvent;
  const timestamp = updatedData.log.at(-1)!.timestamp;
  if(!data.log.length) {
    event = {
      type: 'add',
      value: updatedData.value,
      previousValue: '',
      addition: updatedData.value,
      timestamp,
      from: 0,
      change: true
    }
  } else {
    let sameToFromStart: number;
    let sameToFromEnd: number;

    const previousValue = minimalData.value;
    const value = updatedData.value;

    const maxIndex = Math.max(value.length, previousValue.length);
    let index = 0;
    while(index <= maxIndex && previousValue.at(index) === value.at(index)) {
      index++;
    }
    sameToFromStart = index;

    index = 0;
    while(index <= maxIndex && previousValue.at(-index - 1) === value.at(-index - 1)) {
      index++;
    }
    sameToFromEnd = index + 1;

    const previousFrom = sameToFromStart; 
    const previousTo = Math.max(previousFrom, previousValue.length - sameToFromEnd + 1);

    const currentFrom = sameToFromStart; 
    const currentTo = Math.max(currentFrom, value.length - sameToFromEnd + 1);

    const removed = previousValue.slice(previousFrom, previousTo);
    const added = value.slice(currentFrom, currentTo);

    event = {
      type: 'replace',
      value,
      previousValue,
      removed,
      added,
      previousFrom,
      previousTo,
      currentFrom,
      currentTo,
      change: true,
      timestamp,
    } 
  }

  minimalData.log.push(event);
  minimalData.value = event.value;

  await fs.writeFile(
    MINIMAL_PATH, 
    JSON.stringify(minimalData, null, 2)
  );
}

const writeData = async (data: Data) => {
  await fs.writeFile(
    PATH, 
    JSON.stringify(data, null, 2)
  );
}

const readData = async (path = PATH) => {
  const buffer = await fs.readFile(path, 'utf8');
  return JSON.parse(buffer) as Data;
}

const updateCache = async (force = false) => {
  if(data && !force) {
    console.log("Cache already populated. No data read.")
    return;
  }
  console.log("Reading data...")
  data = await readData();
  console.log("Cache updated!")
}

const app = express();

app.use(async (request, _, next) => {
  if(request.method === 'GET') {
    await updateCache();
  }

  next();
});

app.use(express.json());
app.use(cors());

app.get('/ping', (_, response) => {
  console.log('Received ping, sending pong');
  response.send('pong');
});

app.get('/', (_, response) => {
  console.log("Data queried...")
  response.json(data);
});

app.get('/value', async (_, response) => {
  console.log("Getting value...")
  response.json(data.value);
});

app.get('/log', (_, response) => {
  console.log('Getting log...')
  response.json(data.log);
});

app.post('/push', async (request: Request<{}, {}, Data>, response) => {
  await updateCache();
  console.log("Pushing data...")

  const { value, log } = request.body;

  if(!log.length) {
    console.warn("Log empty. Nothing to store...")
    return;
  }
  
  data.log.push(...log);
  data.value = value;

  // Write full log
  await writeData(data);;

  // Write minimal log
  await writeMinimalData(data);;

  response.status(200);
  response.json(data.log);
});

app.listen(SERVER_PORT, () => {
  console.log(`Listening on port ${SERVER_PORT}`);
});