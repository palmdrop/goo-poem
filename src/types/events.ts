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
    } | {
      type: 'remove',
      removal: string,
      from: number,
      to: number
    } | {
      type: 'select',
      from: number,
      to: number,
      selection: string
    } | {
      type: 'deselect'
    } | {
      type: 'replace',
      previous: string,
      current: string,
      previousFrom: number,
      previousTo: number,
      currentFrom: number,
      currentTo: number,
    }
  )
>;