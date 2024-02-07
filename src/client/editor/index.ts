import { setupListeners } from "./events";
// import { DiscriminateUnion } from "../../types/utils";
// import { ChangeEvent } from "../../types/events";
import { changeLog } from "./changeLog";

/*
type EventHandlers = { 
  [V in ChangeEvent['type']]: (event: DiscriminateUnion<ChangeEvent, 'type', V> ) => void 
};
*/

// TODO: abstract to change listeners registration step, which creates sensible events. Then convert these events to changelog events!?
export const setupEditor = (inputElement: HTMLInputElement, initialValue: string) => {
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