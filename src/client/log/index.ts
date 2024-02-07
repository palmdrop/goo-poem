import { ChangeEvent } from "../../types/events";
import { ChangeLogListener, changeLog } from "../editor/changeLog"

export const setupLog = (listElement: HTMLUListElement) => {
  let isInitialized = false;

  const addItem = (event: ChangeEvent) => {
    // if(!event.change) return;

    const listItem = document.createElement('li');
    const span = document.createElement('span');
    const content = changeLog.printEvent(event);

    listElement.appendChild(span);
    span.innerText = content;

    listElement.appendChild(listItem);
  }

  const changeLogListener: ChangeLogListener = (event, log) => {
    if(!isInitialized) {
      log.forEach(addItem);
      isInitialized = true;
    } else {
      addItem(event);
    }
  }

  changeLog.addListener(changeLogListener, 'action');
  return () => {
    changeLog.removeListener(changeLogListener, 'action');
  }
}