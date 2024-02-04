import './css/reset.css'
import './css/theme.css'
import './css/global.css'
import { APP_ID, INPUT_ID, POEM_ID } from './constants';
import { setupEditor } from './editor';
import { setupPoem } from './poem';

(() => {
  const root = document.querySelector<HTMLDivElement>(APP_ID);
  const poem = document.querySelector<HTMLDivElement>(POEM_ID);
  const input = document.querySelector<HTMLInputElement>(INPUT_ID);

  if(!root || !poem || !input) {
    alert("Something went wrong!")
    return;
  }

  const cleanupEditor = setupEditor(input);
  const cleanupPoem = setupPoem(poem, input);

  window.addEventListener('unload', () => {
    cleanupEditor();
    cleanupPoem();
  });
})();