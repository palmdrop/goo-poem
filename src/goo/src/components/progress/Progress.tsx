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

  const event = createMemo(
    () => props.log[props.index]
  );

  const datePart1 = createMemo(
    () => {
      const date = new Date(event().timestamp);
      return date.toISOString().slice(0, 10);
    }
  );

  const datePart2 = createMemo(
    () => {
      const date = new Date(event().timestamp);
      return date.toISOString().slice(11);
    }
  );

  return (
    <div 
      class={styles.wrapper}
      style={`
        --progress: ${progress()};
        --linear-progress: ${props.index / props.log.length};
        --delay: ${props.delay}ms;
        --orbs: ${props.log.length};
      `}
    >
      <div class={styles.info}>
        <span class={styles.infoLeft}>
          {datePart1()}
        </span>
        <span class={styles.t}>
          #{props.index + 1}.
        </span>
        <span class={styles.infoRight}>
          {datePart2()}
        </span>
      </div>
      <div class={styles.progress}>
        <div class={styles.orbContainer}>
          <Index
            each={props.log}
          >{(_, i) => (
              <button 
                class={`${styles.orb} ${i === props.index ? styles.orbActive : ''}`}
                onClick={() => props.onTimestepClick(i)}
              >
              </button>
          )}</Index>
        </div>
      </div>
      <div class={styles.controller}>
        <button 
          class={`${styles.controllerButton} ${styles.toStartButton}`}
          onClick={() => props.onTimestepClick(0)}
        >
          {"➺"}
        </button>
        <button class={styles.controllerButton}>
          play
        </button>
        <button 
          class={`${styles.controllerButton} ${styles.toEndButton}`}
          onClick={() => props.onTimestepClick(props.log.length - 1)}
        >
          {"➺"}
        </button>
      </div>
    </div>
  )
}