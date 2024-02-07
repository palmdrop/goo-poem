/*
  TODO: 
  TODO: Figure out if I can use node + git to automatically do this? use git to detect changes, additions, etc...?
    * then extract this using fancy git commands in the shell... automatically commit to git using node server?
  - [X] detect all changes as events
    - [X] select (start, end)
    - [X] delete (backspace/delete, take selection into account)
      - start/end
    - [X] paste (replace)
    - [X] write (addition, from start of writing to reasonable end?)
  - [ ] changelog has infinite length, until user stops typing

  - [ ] merge events close in time
    - [ ] debounced, merges only occur after a delay in regular changelog
    - delete + add => replace
    - many writes => one change
*/

import { clone, debounce } from "lodash";
import { ChangeEvent } from "../../types/events";
import { chunkWith } from "../utils/array";

export const EVENT_BUFFER = 30;
export const MERGE_DEBOUNCE = 1000;
// export const ACTION_DEBOUNCE = 500;
export const ACTION_DEBOUNCE = 1000;

export type ChangeLogListener = (event: ChangeEvent, log: ChangeEvent[]) => void;

const log: ChangeEvent[] = [];
const actionLog: ChangeEvent[] = [];
const listeners: Set<ChangeLogListener> = new Set<ChangeLogListener>();

let mergedUntilIndex = 0;

const addEvent = (event: ChangeEvent) => {
  log.push(event);
  notifyListeners(event);
  mergeToActionEvents();
}

const printEvent = (event: ChangeEvent) => {
  const printMessage = () => {
    switch(event.type) {
      case "init":
        return `"${event.value}"`;
      case "add":
        return `+"${event.addition}"`;
      case "remove":
        return `-"${event.removal}"`;
      case "select":
        return `"${event.selection}"`;
      case "deselect":
        return "Nothing selected.";
      case "undo":
        return `Restore to "${event.value}"`;
      case "replace": {
        return `+"${event.added} / -"${event.removed}"`;
      }
      default: {
        const _assertNever: never = event;
        return _assertNever;
      }
    }
  }

  return `${event.type.toUpperCase()} (${event.timestamp.toLocaleTimeString()}): ${printMessage()}`
}

// NOTE: what if I want the entire changelog...? to show edits as well? Just adjust the intervals between the events?
const mergeToActionEvents = debounce(() => {
  /* 
   * EVENTS
    - add
    - remove
    - replace
    - undo
    - select
  */

  // TODO: 
  // * UNDO/REDO: never merge, but check selection at the end. Use selection state for replacement value?

  const toProcess = log.slice(mergedUntilIndex);

  const soloEvents: ChangeEvent['type'][] = ['undo', 'init'];
  const selectionEvents: ChangeEvent['type'][] = ['select', 'deselect'];

  const chunks = chunkWith(toProcess, (current, next) => {
    const withinTimeRange = (next.timestamp.getTime() - current.timestamp.getTime()) < ACTION_DEBOUNCE;

    if(
      soloEvents.includes(current.type) ||
      (selectionEvents.includes(current.type) && !selectionEvents.includes(next.type)) ||
      (selectionEvents.includes(next.type) && !selectionEvents.includes(current.type))
    ) return false;

    return withinTimeRange;
  });

  console.log(chunks);

  mergedUntilIndex = log.length;
}, MERGE_DEBOUNCE);

const addListener = (listener: ChangeLogListener) => {
  listeners.add(listener);
}

const removeListener = (listener: ChangeLogListener) => {
  listeners.delete(listener);
}

const clearListeners = () => {
  listeners.clear();
}

const notifyListeners = (event: ChangeEvent) => {
  listeners.forEach(listener => listener(event, log));
}

export const changeLog = {
  log,
  addEvent,
  printEvent,
  addListener,
  removeListener,
  clearListeners
}