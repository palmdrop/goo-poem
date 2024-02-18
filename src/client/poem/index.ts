import { CHANGE_MAX_DELAY, GOO_POEM_ID, LOOP_ITERATION_DELAY, POEM_INDEX_ID, POEM_MAX_INDEX_ID, POEM_MIN_INDEX_ID, PROGRESS_BAR_ID, PROGRESS_ID, START_BUTTON_ID, START_FROM_SAVE_BUTTON, STOP_BUTTON_ID } from "../constants";
import { ChangeEvent } from "../../types/events";
import { changeLog } from "../editor/changeLog";

const setIndex = (span: HTMLSpanElement, index: number) => {
  span.innerText = `${index + 1}`;
}

export const setupPoem = (
  value: string
) => {
  const gooPoemElement = document.querySelector<HTMLDivElement>(GOO_POEM_ID);
  const progressElement = document.querySelector<HTMLDivElement>(PROGRESS_ID);
  const progressBarElement = document.querySelector<HTMLSpanElement>(PROGRESS_BAR_ID);

  const minIndexSpan = document.querySelector<HTMLSpanElement>(POEM_MIN_INDEX_ID);
  const maxIndexSpan = document.querySelector<HTMLSpanElement>(POEM_MAX_INDEX_ID);
  const indexSpan = document.querySelector<HTMLSpanElement>(POEM_INDEX_ID);
  const startButton = document.querySelector<HTMLButtonElement>(START_BUTTON_ID);
  const stopButton = document.querySelector<HTMLButtonElement>(STOP_BUTTON_ID);
  const startFromSaveButton = document.querySelector<HTMLButtonElement>(START_FROM_SAVE_BUTTON);

  if(
    !gooPoemElement || 
    !progressElement || 
    !progressBarElement ||
    !minIndexSpan ||
    !maxIndexSpan ||
    !indexSpan ||
    !startButton ||
    !stopButton ||
    !startFromSaveButton
  ) throw new Error('Missing goo poem or progress element');

  let actions: ChangeEvent[] | undefined = undefined;
  let nextActions: ChangeEvent[] | undefined = undefined;
  let playing = false;
  let startIndex = 0;

  setIndex(minIndexSpan, startIndex);

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

  let index = 0;
  let timeout: NodeJS.Timeout;
  const animate = () => {
    if(!actions) return;

    if(index >= actions.length) {
      index = startIndex;
    }

    if(nextActions?.length && index < nextActions.length) {
      actions = nextActions;
      nextActions = undefined;

      setIndex(maxIndexSpan, actions.length - 1);
    }

    setIndex(indexSpan, index);

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

    if(playing) {
      timeout = setTimeout(animate, delay);
    }
  };

  const play = () => {
    if(playing) return;
    playing = true;
    animate();
  };

  const stop = () => {
    playing = false;
    clearTimeout(timeout);
  };

  
  let startingFromSave = false;

  const setStartingFromSaveButtonText = () => {
    startFromSaveButton.innerText = startingFromSave 
      ? 'From beginning'
      : 'From last save';
  }

  const toggleStartFromSave = () => {
    startingFromSave = !startingFromSave;

    startIndex = startingFromSave 
      ? (changeLog.storedToIndex - 1)
      : 0;

    if(index < startIndex) {
      index = startIndex;
    }

    setIndex(minIndexSpan, startIndex);
    setStartingFromSaveButtonText();
  }

  startButton.onclick = play;
  stopButton.onclick = stop;

  setStartingFromSaveButtonText();
  startFromSaveButton.onclick = toggleStartFromSave;

  return {
    updateLog: (log: ChangeEvent[]) => {
      if(!actions && log.length) {
        actions = log;
        playing = true;
        animate();
        setIndex(maxIndexSpan, log.length - 1);
      }

      nextActions = log;
    },

  }
}