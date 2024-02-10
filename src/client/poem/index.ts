import { CHANGE_MAX_DELAY, LOOP_ITERATION_DELAY } from "../constants";
import { ChangeEvent } from "../../types/events";

export const setupPoem = (
  gooPoemElement: HTMLParagraphElement,
  progressElement: HTMLProgressElement,
  value: string
) => {
  let actions: ChangeEvent[] = [];
  let nextActions: ChangeEvent[] | undefined = undefined;

  const updatePoem = (value: string, element: HTMLParagraphElement) => {
    let lines = value.split('/');

    if(lines.length > 1) lines = lines
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => `${line} /`);

    element.innerHTML = '';

    lines.forEach(line => {
      const pElement = document.createElement('p');
      pElement.innerText = line;
      element.appendChild(pElement);
    });
  }

  const updateProgress = (value: number) => {
    progressElement.value = value;
  }

  updatePoem(value, gooPoemElement);

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

  return {
    updateLog: (log: ChangeEvent[]) => {
      if(!started && log.length) {
        actions = log;
        started = true;
        animate();
      }

      nextActions = log;
    }
  }
}