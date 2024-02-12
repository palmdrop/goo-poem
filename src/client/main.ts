import { SERVER_PORT } from '../server/constants';
import { Data } from '../server/types';
import { APP_ID, GOO_POEM_ID, INPUT_ID, LOG_ID, PROGRESS_ID, SAVE_BUTTON_ID } from './constants';
import './css/global.css';
import './css/reset.css';
import './css/theme.css';
import { setupEditor } from './editor';
import { changeLog } from './editor/changeLog';
import { setupLog } from './log';
import { setupPoem } from './poem';

const INITIAL_VALUE = "";

(async () => {
  const rootElement = document.querySelector<HTMLDivElement>(APP_ID);
  const saveButtonElement = document.querySelector<HTMLButtonElement>(SAVE_BUTTON_ID);

  if(!rootElement || !saveButtonElement) {
    alert("Something went wrong!")
    return;
  }

  const parseLog = (log: any[]) => {
    log.forEach((event: any) => {
      event.timestamp = new Date(event.timestamp);
    });

    return log;
  }

  const parseData = (data: Record<string, any>) => {
    parseLog(data.log);
    return data as Data;
  }

  const data = parseData(
    await fetch(`http://localhost:${SERVER_PORT}/`, {
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => response.json())
  );

  const { log, value = log.at(-1)?.value } = data;

  const cleanupLog = setupLog();
  const cleanupEditor = setupEditor(value ?? INITIAL_VALUE);
  const { updateLog } = setupPoem(value ?? INITIAL_VALUE);

  updateLog(log);

  saveButtonElement.onclick = async () => {
    try {
      const response = await fetch(`http://localhost:${SERVER_PORT}/push`, {
        method: 'POST',
        body: JSON.stringify({
          log: changeLog.actionLog,     
          value: changeLog.log.at(-1)?.value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if(response.ok) {
        const log = parseLog(await response.json());
        changeLog.reset();
        updateLog(log);

        console.log("Data stored!");
      } else {
        console.error("Error, data not stored", response);
      }
    } catch (error) {
      console.error(error)
    }
  }

  window.addEventListener('unload', () => {
    cleanupLog();
    // cleanupPoem();
    cleanupEditor();
  });
})();