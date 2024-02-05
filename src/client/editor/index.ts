import { setupListeners } from "./events";

const INITIAL_VALUE = "Type here...";

// TODO: abstract to change listeners registration step, which creates sensible events. Then convert these events to changelog events!?
export const setupEditor = (inputElement: HTMLInputElement) => {
  inputElement.value = INITIAL_VALUE;

  const cleanupListeners = setupListeners(inputElement, {
    'add': event => {
      console.log("ADD", event);
    },
    'remove': event => { console.log("REMOVE", event )},
    'select': event => {
      console.log('SELECT', event);
    },
    'deselect': event => {
      console.log('DESELECT', event)
    },
    'replace': event => {},
  });

  return () => {
    cleanupListeners();
  }
}