import { Component, Index, createMemo } from "solid-js";
import { ChangeLog } from "../../types/poem";

import styles from './Progress.module.css';
import { getDelay } from "../../core/flow";
import { Controller } from "../controller/Controller";
import { TimeIndicator } from "./time-indicator/TimeIndicator";
import { Orbs } from "./orbs/Orbs";

const padding = 0.01;

// TODO: split into multiple components
export const Progress: Component<{ 
  index: number, 
  delay: number, 
  log: ChangeLog,
  onTimestepClick: (index: number) => void
  onTogglePlayClick: () => void,
  playing: boolean
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

  const date = createMemo(
    () => {
      const date = new Date(event().timestamp);
      return date.toISOString().slice(0, 10);
    }
  );

  const time = createMemo(
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
      <TimeIndicator 
        date={date()}
        time={time()}
        index={props.index}
      />
      <Orbs 
        log={props.log}
        index={props.index}
        onTimestepClick={props.onTimestepClick}
      />
      <Controller
        onTimestepClick={props.onTimestepClick}
        onTogglePlayClick={props.onTogglePlayClick}
        playing={props.playing}
        log={props.log}
      />
    </div>
  )
}