import { ChangeEvent } from "../../types/events";
import { LOG_ID } from "../constants";
import { ChangeLogListener, changeLog } from "../editor/changeLog"

export const setupLog = () => {
  const element = document.querySelector<HTMLUListElement>(LOG_ID);
  let isInitialized = false;

  if(!element) throw new Error('Log element is missing');

  const addItem = (event: ChangeEvent) => {
    const listItem = document.createElement('li');
    const span = document.createElement('span');
    const content = changeLog.printEvent(event);

    element.appendChild(span);
    span.innerText = content;

    element.appendChild(listItem);
  }

  const changeLogListener: ChangeLogListener = (event, log) => {
    if(!isInitialized) {
      log.forEach(addItem);
      isInitialized = true;
    } else {
      addItem(event);
    }

    console.log({ log: changeLog.log, actions: changeLog.actionLog, value: changeLog.log.at(-1)?.value });
  }

  changeLog.addListener(changeLogListener, 'action');
  return () => {
    changeLog.removeListener(changeLogListener, 'action');
  }
}