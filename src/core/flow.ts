import { DELAY_CONTRAST_THRESHOLD, LONG_DELAY_CONTRAST, LOOP_ITERATION_DELAY, MAX_CHANGE_DELAY, MIN_CHANGE_DELAY, SHORT_DELAY_CONTRAST } from "../constants";
import { ChangeEvent, ChangeLog } from "../types/poem";
import { clamp } from "../utils";

export const normalizeDelay = (delay: number) => {
  return (delay - MIN_CHANGE_DELAY) / (MAX_CHANGE_DELAY - MIN_CHANGE_DELAY);
}

const applyDelayContrast = (delay: number) => {
  const normalized = normalizeDelay(delay);

  let contrasted: number
  if(normalized < DELAY_CONTRAST_THRESHOLD) {
    contrasted = normalized ** SHORT_DELAY_CONTRAST;
  } else {
    contrasted = normalized ** (1 / LONG_DELAY_CONTRAST);
  }

  return (contrasted * (MAX_CHANGE_DELAY - MIN_CHANGE_DELAY)) + MIN_CHANGE_DELAY;
}

export const getDelay = (log: ChangeLog, index: number) => {
  const event = log[index];
  const currentTime = new Date(event.timestamp).getTime();
  const nextAction = log[index + 1];

  if(!nextAction) return LOOP_ITERATION_DELAY;

  const delay = clamp(
    new Date(nextAction.timestamp).getTime() - currentTime, 
    MIN_CHANGE_DELAY, 
    MAX_CHANGE_DELAY
  );

  return applyDelayContrast(delay);
}

export const flowLoop = (
  log: ChangeLog,
  callback: (action: ChangeEvent, delay: number, index: number) => void,
  playInitially = true
) => {
  let timeout: NodeJS.Timeout;

  let playing = playInitially;
  let index = 0;
  const loop = () => {
    if(index >= log.length) {
      index = 0;
    }

    const event = log[index];
    const delay = getDelay(log, index);
    callback(event, delay, index);

    index++;

    if(playing) {
      timeout = setTimeout(loop, delay);
    }
  };

  if(playInitially) {
    loop();
  }

  const play = () => {
    if(playing) return;

    playing = true;
    loop();
  }

  const stop = () => {
    if(!playing) return;

    clearTimeout(timeout);
    playing = false;
  }

  const isPlaying = () => playing;

  const setIndex = (newIndex: number) => {
    index = clamp(newIndex, 0, log.length - 1);
    if(!playing) return;

    clearTimeout(timeout);
    loop();
  }

  return {
    play,
    stop,
    isPlaying,
    setIndex,
    once: loop,
  };
}