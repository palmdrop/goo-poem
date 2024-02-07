import { ChangeLogListener, changeLog } from "../editor/changeLog";

export const setupPoem = (
  poemElement: HTMLParagraphElement,
  initialValue: string,
) => {
  const updatePoem = (value: string) => {
    poemElement.innerText = value;
  }

  updatePoem(initialValue);

  const changeLogListener: ChangeLogListener = (event, _log) => {
    if(!event.change) return;
    updatePoem(event.value);
  }

  changeLog.addListener(changeLogListener, 'log');
  return () => {
    changeLog.removeListener(changeLogListener, 'log');
  }
}