import { setupListeners } from "./events";
import { DiscriminateUnion } from "../../types/utils";
import { ChangeEvent } from "../../types/events";

type EventHandlers = { 
  [V in ChangeEvent['type']]: (event: DiscriminateUnion<ChangeEvent, 'type', V> ) => void 
};

const INITIAL_VALUE = "Type here...";

// TODO: abstract to change listeners registration step, which creates sensible events. Then convert these events to changelog events!?
export const setupEditor = (inputElement: HTMLInputElement) => {
  inputElement.value = INITIAL_VALUE;

  const cleanupListeners = setupListeners(inputElement, 
    event => {
      console.log(event.type, event);
    },
  );

  return () => {
    cleanupListeners();
  }
}