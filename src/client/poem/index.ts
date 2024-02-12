import { CHANGE_MAX_DELAY, GOO_POEM_ID, LOOP_ITERATION_DELAY, PROGRESS_BAR_ID, PROGRESS_ID } from "../constants";
import { ChangeEvent } from "../../types/events";

export const setupPoem = (
  value: string
) => {
  const gooPoemElement = document.querySelector<HTMLDivElement>(GOO_POEM_ID);
  const progressElement = document.querySelector<HTMLDivElement>(PROGRESS_ID);
  const progressBarElement = document.querySelector<HTMLSpanElement>(PROGRESS_BAR_ID);

  if(!gooPoemElement || !progressElement || !progressBarElement) throw new Error('Missing goo poem or progress element');

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
    progressBarElement.style.width = `${value}%`;
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