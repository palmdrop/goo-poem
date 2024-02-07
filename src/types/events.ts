export type ChangeEventPattern<T> = T extends ({
  type: string,
  value: string,
  change?: boolean
}) ? T : "ERROR: Change event does not conform to pattern";

export type ChangeEvent = ChangeEventPattern<
  {
    value: string
    change?: boolean,
    timestamp: Date
  } & (
    {
      type: 'init',
      change: true
    } | {
      type: 'add',
      addition: string,
      from: number,
      change: true
    } | {
      type: 'remove',
      removal: string,
      from: number,
      to: number
      change: true,
    } | {
      type: 'select',
      from: number,
      to: number,
      selection: string
    } | {
      type: 'deselect'
    } | {
      type: 'replace',
      removed: string,
      added: string,
      previousFrom: number,
      previousTo: number,
      currentFrom: number,
      currentTo: number,
      change: true
    } | {
      type: 'undo',
      previousValue: string,
      change: true
    }
  )
>;