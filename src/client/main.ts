import { ChangeEvent } from '../types/events';
import { cleanLog, fetchData, storeData } from './api';
import { APP_ID, SAVE_BUTTON_ID } from './constants';
import { setupEditor } from './editor';
import { ChangeLogListener, changeLog } from './editor/changeLog';
import { setupLog } from './log';
import { setupPoem } from './poem';

import './css/global.css';
import './css/reset.css';
import './css/theme.css';

const INITIAL_VALUE = "";

(async () => {
  const rootElement = document.querySelector<HTMLDivElement>(APP_ID);
  const saveButtonElement = document.querySelector<HTMLButtonElement>(SAVE_BUTTON_ID);

  if(!rootElement || !saveButtonElement) {
    alert("Something went wrong!")
    return;
  }

  const { 
    log, 
    value = log.at(-1)?.value 
  } = await fetchData();

  const cleanupLog = setupLog();
  const cleanupEditor = setupEditor(value ?? INITIAL_VALUE);
  const { updateLog } = setupPoem(value ?? INITIAL_VALUE);

  updateLog(log);
  changeLog.initialize(log, 'action');
  changeLog.storedToIndex = log.length;

  const onChange: ChangeLogListener = (_, actions) => {
    updateLog(cleanLog(actions));
  }

  changeLog.addListener(onChange, 'action');

  saveButtonElement.onclick = async () => {
    const log = await storeData();
    if(log) {
      updateLog(log);
    }
  }

  window.addEventListener('unload', () => {
    cleanupLog();
    cleanupEditor();
    changeLog.clearListeners();
  });
})();