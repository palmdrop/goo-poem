import { exec } from 'child_process';
import fs from 'fs/promises';

exec('git status', (_, out) => {
  console.log(out);
});


