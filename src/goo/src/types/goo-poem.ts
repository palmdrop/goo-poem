import data from '../../data.json';

type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type GooPoem = typeof data;
export type ChangeLog = GooPoem['log'];
export type ChangeEvent = ArrayElement<ChangeLog>;