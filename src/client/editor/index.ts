import { setupListeners } from "./events";
import { changeLog } from "./changeLog";
import { INPUT_ID } from "../constants";
import { values } from "lodash";

export const setupEditor = (initialValue: string) => {
  const inputElement = document.querySelector<HTMLInputElement>(INPUT_ID);

  if(!inputElement) throw new Error('Editor element is missing');
  
  const setValue = (value: string) => {
    inputElement.value = value;
  }

  setValue(initialValue);

  const cleanupListeners = setupListeners(
    inputElement, 
    event => {
      const timestamp = new Date();
      changeLog.addEvent({ ...event, timestamp });
    },
  );

  return {
    setValue,
    cleanup: () => {
      cleanupListeners();
    }
  }
}