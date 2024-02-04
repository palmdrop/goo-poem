/*
  TODO: 
  TODO: Figure out if I can use node + git to automatically do this? use git to detect changes, additions, etc...?
    * then extract this using fancy git commands in the shell... automatically commit to git using node server?
  - [ ] detect all changes as events
    - [ ] select (start, end)
    - [ ] delete (backspace/delete, take selection into account)
      - start/end
    - [ ] paste (replace)
    - [ ] write (addition, from start of writing to reasonable end?)
  - [ ] changelog has infinite length, until user stops typing

  - [ ] merge events close in time
    - [ ] debounced, merges only occur after a delay in regular changelog
    - delete + add => replace
    - many writes => one change
*/

export const EVENT_BUFFER = 30;
export const BASE_DEBOUNCE = 1000;

// TODO: make this error if type is wrong
export type ChangeEventPattern<T> = T extends ({
  type: string,
  value: string,
}) ? T : "ERROR: Change event does not conform to pattern";

export type ChangeEvent = ChangeEventPattern<
  {
    value: string
  } & (
    {
      type: 'add',
      addition: string,
      from: number,
      to: number
    } | {
      type: 'remove',
      removal: string,
      from: number,
      to: number
    } | {
      type: 'select',
      from: number,
      to: number
    } | {
      type: 'paste',
      from: number,
      to: number,
      overwrite: boolean
    } | {
      type: 'cut',
      from: number,
      to: number
    }
  )
>;

export const log: ChangeEvent[] = [];
export const actionLog: ChangeEvent[] = [];
  
const handleEvent = (event: ChangeEvent) => {
  switch(event.type) {
    case "add":
    case "remove":
    case "select":
    case "paste":
    case "cut": 
      return;
    default: {
      const _assertNever: never = event;
      return _assertNever;
    }
  }
}

export const addEvent = (event: ChangeEvent) => {
  handleEvent(event);
}