// import { exec } from 'child_process';
// import fs from 'fs/promises';
import express from 'express';

(async () => {
  /*
  exec('git status', (_, out) => {
  });
  */
  const app = express();
  const port = 3000;

  app.get('/ping', (_, response) => {
    console.log('Received ping, sending pong');
    response.send('pong');
  });

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  })
})();



