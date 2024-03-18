// import data from '../../data.json';
// import data from '../../data-minimal.json';
import data from '../log.json';

type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type GooPoem = typeof data;
export type ChangeLog = GooPoem['log'];
export type ChangeEvent = ArrayElement<ChangeLog>;

export type ChangeEventData = { action: ChangeEvent, delay: number, index: number };