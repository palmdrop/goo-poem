import './css/reset.css'
import './css/theme.css'
import './css/global.css'
import { APP_ID, LOG_ID, INPUT_ID, POEM_ID, PROGRESS_ID, GOO_POEM_ID } from '../constants';
import { setupEditor } from './editor';
import { setupPoem } from './poem';
import { setupLog } from './log';

const INITIAL_VALUE = "";

(() => {
  const root = document.querySelector<HTMLDivElement>(APP_ID);
  const poem = document.querySelector<HTMLDivElement>(POEM_ID);
  const gooPoem = document.querySelector<HTMLDivElement>(GOO_POEM_ID);
  const input = document.querySelector<HTMLInputElement>(INPUT_ID);
  const log = document.querySelector<HTMLUListElement>(LOG_ID);
  const progress = document.querySelector<HTMLProgressElement>(PROGRESS_ID);

  if(!root || !poem || !gooPoem || !input || !log || !progress) {
    alert("Something went wrong!")
    return;
  }

  const cleanupLog = setupLog(log);
  const cleanupPoem = setupPoem(poem, gooPoem, progress, INITIAL_VALUE);
  const cleanupEditor = setupEditor(input, INITIAL_VALUE);

  fetch('http://localhost:3000/ping', {
    method: 'GET',
    mode: 'no-cors'
  }).catch(error => {
    console.log(error);
  })

  window.addEventListener('unload', () => {
    cleanupLog();
    cleanupPoem();
    cleanupEditor();
  });
})();