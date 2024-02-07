export type ForceChangeEventPattern<T> = T extends ({
  type: string,
  value: string,
  change?: boolean,
  previousValue?: string
}) ? T : "ERROR: Change event does not conform to pattern";

export type ChangeEvent = ForceChangeEventPattern<
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
      previousValue: string,
      addition: string,
      from: number,
      change: true
    } | {
      type: 'remove',
      previousValue: string,
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
      previousValue: string,
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