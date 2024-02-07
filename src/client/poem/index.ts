import { CHANGE_MAX_DELAY, LOOP_ITERATION_DELAY } from "../../constants";
import { ChangeEvent } from "../../types/events";
import { ChangeLogListener, changeLog } from "../editor/changeLog";

export const setupPoem = (
  poemElement: HTMLParagraphElement,
  gooPoemElement: HTMLParagraphElement,
  progressElement: HTMLProgressElement,
  initialValue: string,
) => {
  let actions: ChangeEvent[] = [];
  let nextActions: ChangeEvent[] | undefined = undefined;

  const updatePoem = (value: string, element: HTMLParagraphElement) => {
    element.innerText = value;
  }

  const updateProgress = (value: number) => {
    progressElement.value = value;
  }

  updatePoem(initialValue, poemElement);
  updatePoem(initialValue, gooPoemElement);

  let started = false;
  let index = 0;
  const animate = () => {
    if(index >= actions.length) {
      index = 0;
      if(nextActions) {
        actions = nextActions;
        nextActions = undefined;
      }
    }

    const action = actions[index];
    updatePoem(action.value, gooPoemElement);

    const progress = 100 * index / Math.max((actions.length - 1), 1);
    updateProgress(progress);

    index++;

    const currentTime = action.timestamp.getTime();
    const nextAction = actions[index];
    const delay = !nextAction
      ? LOOP_ITERATION_DELAY
      : Math.min((nextAction.timestamp.getTime() - currentTime), CHANGE_MAX_DELAY);

    setTimeout(animate, delay);
  };

  const logAnimationListener: ChangeLogListener = (_, log) => {
    if(!started) {
      actions = log;
      started = true;
      animate();
    }

    nextActions = log;
  }

  const poemListener: ChangeLogListener = event => {
    updatePoem(event.value, poemElement);
  }

  changeLog.addListener(logAnimationListener, 'action');
  changeLog.addListener(poemListener, 'log');
  return () => {
    changeLog.removeListener(logAnimationListener, 'action');
    changeLog.removeListener(poemListener, 'log');
  }
}