import { cleanLog, fetchData, storeData } from './api';
import { APP_ID, RESET_BUTTON_ID, SAVE_BUTTON_ID } from './constants';
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
  const resetButtonElement = document.querySelector<HTMLButtonElement>(RESET_BUTTON_ID);

  if(!rootElement || !saveButtonElement || !resetButtonElement) {
    alert("Something went wrong!")
    return;
  }

  const { 
    log: actionLog, 
    value = actionLog.at(-1)?.value 
  } = await fetchData();

  const cleanupLog = setupLog();
  const { 
    setValue: setEditorValue,
    cleanup: cleanupEditor
  } = setupEditor(value ?? INITIAL_VALUE);
  const { updateLog, updateStartIndex } = setupPoem(value ?? INITIAL_VALUE);

  updateLog(actionLog);
  changeLog.initialize(actionLog);

  const onChange: ChangeLogListener = (_, actions) => {
    const cleanedLog = cleanLog(actions);
    updateLog(cleanedLog);
    const saveDisabled = !cleanLog(changeLog.getUnstoredActions()).length;
    saveButtonElement.disabled = saveDisabled;
  }

  changeLog.addListener(onChange, 'action');

  saveButtonElement.disabled = true;
  saveButtonElement.onclick = async () => {
    const log = await storeData();
    if(log) {
      updateLog(log);
      updateStartIndex();
      saveButtonElement.disabled = true;
    }
  }

  resetButtonElement.onclick = () => {
    changeLog.reset(); 
    updateLog(changeLog.actionLog, true);
    setEditorValue(changeLog.actionLog.at(-1)?.value ?? INITIAL_VALUE);
  }

  window.addEventListener('unload', () => {
    cleanupLog();
    cleanupEditor();
    changeLog.clearListeners();
  });
})();