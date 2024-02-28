import { Component, Index, createMemo } from "solid-js";
import { ChangeLog } from "../../types/poem";

import styles from './Progress.module.css';
import { getDelay } from "../../core/flow";

const padding = 0.01;

export const Progress: Component<{ index: number, delay: number, log: ChangeLog }> = props => {
  const durations = createMemo(() => {
    let accumulator = 0;

    return props.log.map((_, i) => {
      const value = accumulator;
      accumulator += getDelay(props.log, i);
      return value;
    });
  });

  const completeDuration = createMemo(() => durations().at(-1)!);

  const getProgress = (index: number) => {
    return padding + (durations()[index] / completeDuration()) * (1 - 2 * padding);
  }

  const progress = createMemo(
    () => getProgress(props.index)
  );

  return (
    <div 
      class={styles.wrapper}
      style={`
        --progress: ${progress()};
        --delay: ${props.delay}ms;
      `}
    >
      <div class={styles.progress}>
        <div class={styles.bar} />
      </div>
      <Index
        each={props.log}
      >{(_, i) => {
        const progress = getProgress(i);
        return (
          <div
            class={`${styles.indicator} ${i <= props.index ? styles.passed : ''}`}
            style={`
              --progress: ${progress};
            `}
          >
            <button 
              class={styles.button}
            />
            <div class={styles.line}></div>
          </div>
        );
      }}</Index>
    </div>
  )
}