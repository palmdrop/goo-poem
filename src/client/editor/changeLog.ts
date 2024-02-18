import { compact, debounce } from "lodash";
import { ChangeEvent } from "../../types/events";
import { chunkWith } from "../utils/array";
import { ACTION_DEBOUNCE, MERGE_DEBOUNCE } from "../constants";

export type ChangeLogListener = (event: ChangeEvent, log: ChangeEvent[]) => void;
export type LogKind = 'log' | 'action';

const log: ChangeEvent[] = [];
const actionLog: ChangeEvent[] = [];
const logListeners: Set<ChangeLogListener> = new Set<ChangeLogListener>();
const actionListeners: Set<ChangeLogListener> = new Set<ChangeLogListener>();

let mergedUntilIndex = 0;
let storedToIndex = 0;

const initialize = (initialLog: ChangeEvent[], kind: LogKind) => {
  if(kind === 'log') {
    log.length = 0;
    log.push(...initialLog);
  } else {
    actionLog.length = 0;
    actionLog.push(...initialLog);
  }
}

const reset = () => {
  log.length = 0;
  actionLog.length = 0;
  mergedUntilIndex = 0;
}

const addEvent = (event: ChangeEvent) => {
  log.push(event);
  notifyListeners(event, 'log');
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

const mergeToActionEvents = debounce(() => {
  const toProcess = log.slice(mergedUntilIndex);

  const selectionEvents: ChangeEvent['type'][] = ['select', 'deselect'];

  type ChunkState = 'adding' | 'selecting' | 'removing' | 'replacing' | 'undoing';
  let chunkState: ChunkState  | undefined = undefined;
  const chunks = chunkWith(toProcess, (current, next) => {
    const withinTimeRange = (next.timestamp.getTime() - current.timestamp.getTime()) < ACTION_DEBOUNCE;

    const type = current.type;

    if(!withinTimeRange || type === 'init') return false;

    if(!chunkState) {
      switch(type) {
        case 'add':      chunkState = 'adding'; break;
        case 'remove':   chunkState = 'removing'; break;
        case 'select': 
        case 'deselect': chunkState = 'selecting'; break;
        case 'replace':  chunkState = 'replacing'; break;
        case 'undo':  chunkState = 'undoing'; break;
      }
    }

    if(
      chunkState && (
        (chunkState === 'adding' && next.type !== 'add') ||
        (chunkState === 'removing' && next.type !== 'remove') ||
        (chunkState === 'undoing' && !['undo', 'select'].includes(next.type)) ||
        (chunkState === 'replacing' && !['add', 'deselect'].includes(next.type)) ||
        (chunkState === 'selecting' && !selectionEvents.includes(next.type))
      )
    ) {
      chunkState = undefined;
      return false;
    }

    return true;
  });

  const mergeChunk = (chunk: ChangeEvent[]): ChangeEvent | undefined => {
    if(!chunk.length) return undefined;

    const initialEvent = chunk[0];
    if(chunk.length === 1) return initialEvent;

    const initialEventType = initialEvent.type;
    // NOTE: This is managed separately from the solo events and selection events lists. Possible to reconcile?
    switch(initialEventType) {
      case 'select':
      case 'deselect': {
        return chunk.at(-1);
      }
      case 'add': {
        let from = Infinity;
        let to = 0;
        chunk.forEach(event => {
          // NOTE: just a type guard, should never return here
          if(event.type !== 'add') return;
          from = Math.min(event.from, from);
          to = Math.max(event.from + 1, to);
        });

        const lastEvent = chunk.at(-1)!;
        const addition = lastEvent.value!.slice(from, to + 1)!;
        console.log({
          type: 'add',
          from, to,
          addition
        })
        return {
          type: 'add',
          addition,
          from,
          change: true,
          value: lastEvent.value,
          previousValue: initialEvent.previousValue,
          timestamp: lastEvent.timestamp,
        }
      }
      case 'remove': {
        let from = Infinity;
        let to = 0;
        chunk.forEach(event => {
          // NOTE: just a type guard, should never return here
          if(event.type !== 'remove') return;
          from = Math.min(event.from, from);
          to = Math.max(event.to, to);
        });

        const lastEvent = chunk.at(-1)!;
        const value = lastEvent.value;
        const removal = initialEvent.previousValue.slice(from, to + 1);

        return {
          type: 'remove',
          removal,
          from,
          to,
          value, 
          change: true,
          previousValue: initialEvent.previousValue,
          timestamp: lastEvent.timestamp
        }
      }
      case 'replace': {
        let removedFrom = Infinity;
        let removedTo = 0;
        let removed = "";

        let addedFrom = Infinity;
        let addedTo = 0;
        let added = "";

        const lastEvent = chunk.at(-1)!;
        const value = lastEvent.value;

        chunk.forEach(chunk => {
          if(chunk.type === 'deselect') return;
          if(chunk.type === 'replace') {
            removedFrom = chunk.previousFrom;
            removedTo = chunk.previousTo;
            removed = chunk.removed;

            addedFrom = chunk.currentFrom;
            addedTo = chunk.currentTo;
            added = chunk.added;
          }

          if(chunk.type === 'add') {
            addedTo = chunk.from + chunk.addition.length;
            added = added + chunk.addition;
          }
        });

        return {
          type: 'replace',
          previousFrom: removedFrom,
          previousTo: removedTo,
          currentFrom: addedFrom,
          currentTo: addedTo,
          value,
          removed,
          added,
          previousValue: initialEvent.previousValue,
          timestamp: lastEvent.timestamp,
          change: true
        };
      }
      case 'undo': {
        for(let i = chunk.length - 1; i >= 0; i--) {
          const event = chunk[i];
          if(event.type === 'undo') return event;
        }
        return undefined;
      }
      default: {
        throw new Error(`Unhandled chunk type: ${initialEventType}`);
      }
    }
  }

  const actions = compact(chunks.map(mergeChunk));

  actions.forEach(action => {
    actionLog.push(action);
    notifyListeners(action, 'action');
  });

  mergedUntilIndex = log.length;
}, MERGE_DEBOUNCE);

const getListeners = (kind: LogKind) => {
  return kind === 'log' ? logListeners : actionListeners;
}

const addListener = (listener: ChangeLogListener, kind: LogKind) => {
  getListeners(kind).add(listener);
}

const removeListener = (listener: ChangeLogListener, kind: LogKind) => {
  getListeners(kind).delete(listener);
}

const clearListeners = () => {
  logListeners.clear();
  actionListeners.clear();
}

const notifyListeners = (event: ChangeEvent, kind: LogKind) => {
  getListeners(kind).forEach(
    listener => listener(event, kind === 'log' ? log : actionLog)
  );
}

export const changeLog = {
  log,
  actionLog,
  storedToIndex,
  reset,
  initialize,
  addEvent,
  printEvent,
  addListener,
  removeListener,
  clearListeners,
}