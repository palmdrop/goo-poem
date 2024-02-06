import { debounce } from "lodash";
import { Listeners, assignListeners } from "../utils/listeners";
import { ChangeEvent } from "../../types/events";
import { DiscriminateUnion, MapDiscriminatedUnion } from "../../types/utils";

type InputEventWithTarget<E = Event> = E & { target: HTMLInputElement | null };
type Listener<K extends keyof HTMLElementEventMap> = (event: InputEventWithTarget<HTMLElementEventMap[K]>) => void;
type EventManagers = { 
  [V in ChangeEvent['type']]: (event: DiscriminateUnion<ChangeEvent, 'type', V> ) => void 
};

const makeListener = <K extends keyof HTMLElementEventMap>(
  callback: Listener<K>
) => {
  return callback as (event: HTMLElementEventMap[K]) => void;
}

// TODO: abstract to change listeners registration step, which creates sensible events. Then convert these events to changelog events!?
export const setupListeners = (inputElement: HTMLInputElement, eventManagers: EventManagers) => {
  let selection: {
    from: number,
    to: number
  } | undefined = undefined;

  let edgeJump: 'up' | 'down' | undefined = undefined;

  const selectionUpdateDebounced = debounce((event: InputEventWithTarget<Event>, deselect?: boolean) => {
    if(deselect) selection = undefined;
    const value = event.target?.value!;

    if(selection) {
      eventManagers.select({
        type: 'select',
        ...selection,
        value,
        selection: value.slice(selection.from, selection.to)
      })
    } else {
      eventManagers.deselect({
        type: 'deselect',
        value
      });
    }
  }, 10);

  const onSelect = makeListener<'selectionchange'>(event => {
    selection = {
      from: event.target?.selectionStart!,
      to: event.target?.selectionEnd!,
    }

    selectionUpdateDebounced(event);
  });

  // NOTE: still possible to trick this by selecting everything then pressing shift+up/down twice!
  const onDeselect = makeListener<'blur' | 'click' | 'keydown'>(event => {
    let deselected = false;
    if(event.type === 'keydown') {
      const key = (event as KeyboardEvent).key;
      const isShifted = (event as KeyboardEvent).getModifierState('Shift');
      const value = event.target?.value ?? "";
      const previousEdgeJump = edgeJump;

      if(isShifted && (key === 'ArrowUp' || key === 'ArrowDown')) {
        edgeJump = key === 'ArrowUp' ? 'up' : 'down';
      } else {
        edgeJump = undefined;
      }

      if(!selection) return;

      // Only update deselection status if neither...
      if(!(
        // The user has performed two "edge jumps" (pressing shift + up/down) twice in a row (no selection change)
        (previousEdgeJump && previousEdgeJump === edgeJump) ||
        // Or the user has moved the cursor using shift to the edge of the input (no selection change)
        (
          isShifted && (
            key === 'ArrowLeft' && selection.from === 0 ||
            key === 'ArrowRight' && selection.to === value.length
          )
        )
      )) {
        deselected = !['Shift', 'Meta', 'CapsLock', 'Control'].includes(key);
      }
    } else {
      if(!selection) return;
      deselected = true;
    }

    if(deselected) {
      // selection = undefined;
      selectionUpdateDebounced(event, true);
    }
  });

  let previousValue = inputElement.value ?? "";
  const onChange = makeListener<'input'>(event => {
    const inputEvent = event as InputEvent;

    const from = event.target?.selectionStart!;
    const value = event.target?.value!;


    switch(inputEvent.inputType) {
      case 'insertText': {
        // TODO: this should include the current selection itself?
        const addition = (event as unknown as { data: string }).data;
        if(!selection) {
          eventManagers.add({
            type: 'add',
            addition,
            value,
            from: from - 1,
            change: true
          });
        } else {
          const removed = previousValue.slice(selection.from, selection.to);
          eventManagers.replace({
            type: 'replace',
            removed,
            added: addition,
            previousFrom: selection.from,
            previousTo: selection.to,
            currentFrom: selection.from,
            currentTo: selection.from + 1,
            change: true,
            value
          });
        }
      } break;
      // TODO: backwards and forwards needs to take current selection into account! if it exist, that is the deletion
      case 'deleteContentBackward': 
      case 'deleteContentForward': {
        eventManagers.remove(
          selection ? {
            type: 'remove',
            removal: previousValue.slice(selection.from, selection.to),
            ...selection,
            change: true,
            value
          } : {
            type: 'remove',
            removal: previousValue.charAt(event.target?.selectionStart!),
            from,
            to: from + 1,
            change: true,
            value
          }
        );
      } break;
      case 'deleteByCut': {
        // NOTE: could be merged with previous cases?
        if(!selection) break;
        eventManagers.remove({
          type: 'remove',
          removal: previousValue.slice(selection.from, selection.to),
          ...selection,
          change: true,
          value
        })
      } break;
      case 'insertFromPaste': {
        if(!selection) {
          const insertionFrom = from - (value.length - previousValue.length);
          const insertionTo = from;
          const addition = value.slice(insertionFrom, insertionTo);
          eventManagers.add({
            type: 'add',
            addition,
            from: insertionFrom,
            change: true,
            value
          })
        } else {
          const additionLength = (selection.to - selection.from + (value.length - previousValue.length));
          const removed = previousValue.slice(selection.from, selection.to);
          const added = value.slice(selection.from, selection.from + additionLength);
          if(removed === added) break;
          eventManagers.replace({
            type: 'replace',
            removed,
            added,
            previousFrom: selection.from,
            previousTo: selection.to,
            currentFrom: selection.from,
            currentTo: selection.from + additionLength,
            change: true,
            value
          });
        }
      } break;
      case 'historyUndo': {
        if(value === previousValue) break;
        eventManagers.undo({
          type: 'undo',
          value,
          previousValue,
          change: true
        });
      } break;
      default: {
        console.log(event);
        throw new Error(`Input type not managed! ${inputEvent.inputType}`);
      }
    }
    
    previousValue = event.target?.value!;
  });

  const listeners = {
    // Selection
    'select': onSelect,

    'blur': [onDeselect],
    'click': [onDeselect],

    // Input
    'keydown': [onDeselect],

    // Any change
    'input': onChange
  } satisfies Listeners;

  const cleanupListeners = assignListeners(inputElement, listeners)

  return () => {
    cleanupListeners();
  }
}