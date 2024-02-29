import { Component, Index, createMemo } from "solid-js";
import { ChangeLog } from "../../types/poem";

import styles from './Progress.module.css';
import { getDelay } from "../../core/flow";

const padding = 0.01;

export const Progress: Component<{ 
  index: number, 
  delay: number, 
  log: ChangeLog,
  onTimestepClick: (index: number) => void
}> = props => {
  const durations = createMemo(() => {
    let accumulator = 0;

    return props.log.map((_, i) => {
      const value = accumulator;
      accumulator += getDelay(props.log, i);
      return value;
    });
  });

  const completeDuration = createMemo(() => durations().at(-1)!);

  const getProgress = (index: number, padded = false) => {
    const actualProgress = durations()[index] / completeDuration();
    if(!padded) return actualProgress;
    
    if(index === 0) return padding + actualProgress;
    if(index === props.log.length - 1) return actualProgress - padding;
    return actualProgress;
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
        const progress = getProgress(i, true);
        return (
          <div
            class={`${styles.indicator} ${i <= props.index ? styles.passed : ''}`}
            style={`
              --progress: ${progress};
            `}
          >
            <div class={styles.line}></div>
            <button 
              class={styles.button}
              onClick={() => props.onTimestepClick(i)}
            />
          </div>
        );
      }}</Index>
    </div>
  )
}