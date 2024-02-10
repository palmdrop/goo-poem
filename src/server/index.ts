import express from 'express';
import cors from 'cors';
import { Request } from 'express';
import fs from 'fs/promises';
import { DATA_FILE, SERVER_PORT } from './constants';
import { Data } from './types';

const PATH = `./${DATA_FILE}`;

let data: Data;

const writeData = async (data: Data) => {
  await fs.writeFile(PATH, JSON.stringify(data));
}

const readData = async () => {
  const buffer = await fs.readFile(PATH, 'utf8');
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
  
  data.log.push(...log);
  data.value = value;
  console.log(data);
  await writeData(data);;

  response.status(200);
  response.json(data.log);
});

app.listen(SERVER_PORT, () => {
  console.log(`Listening on port ${SERVER_PORT}`);
});