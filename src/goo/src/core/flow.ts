import { LOOP_ITERATION_DELAY, MAX_CHANGE_DELAY } from "../constants";
import { ChangeEvent, ChangeLog } from "../types/goo-poem";

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
    const currentTime = new Date(event.timestamp).getTime();
    const nextAction = log[index + 1];
    const delay = !nextAction
      ? LOOP_ITERATION_DELAY
      : Math.min((new Date(nextAction.timestamp).getTime() - currentTime), MAX_CHANGE_DELAY);

    callback(event, delay, index);

    index++;

    if(playing) {
      timeout = setTimeout(loop, delay);
    }
  };

  const play = () => {
    if(playing) return;

    loop();
    playing = true;
  }

  const stop = () => {
    if(!playing) return;

    clearTimeout(timeout);
    playing = false;
  }

  if(playInitially) {
    loop();
  }

  return {
    play,
    stop,
    isPlaying: () => playing
  };
}