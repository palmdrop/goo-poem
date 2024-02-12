import { setupListeners } from "./events";
import { changeLog } from "./changeLog";
import { INPUT_ID } from "../constants";
// import { DiscriminateUnion } from "../../types/utils";
// import { ChangeEvent } from "../../types/events";

/*
type EventHandlers = { 
  [V in ChangeEvent['type']]: (event: DiscriminateUnion<ChangeEvent, 'type', V> ) => void 
};
*/

// TODO: abstract to change listeners registration step, which creates sensible events. Then convert these events to changelog events!?
export const setupEditor = (initialValue: string) => {
  const inputElement = document.querySelector<HTMLInputElement>(INPUT_ID);

  if(!inputElement) throw new Error('Editor element is missing');

  inputElement.value = initialValue;

  const cleanupListeners = setupListeners(
    inputElement, 
    event => {
      const timestamp = new Date();
      changeLog.addEvent({ ...event, timestamp });
    },
  );

  return () => {
    cleanupListeners();
  }
}