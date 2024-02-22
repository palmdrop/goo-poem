import data from '../../data.json';

export type GooPoem = typeof data;
export type ChangeLog = GooPoem['log'];
export type ChangeEvent = ChangeLog[number];