import { Component, Index } from "solid-js"
import { ChangeLog } from "../../../types/poem";

import styles from './Orbs.module.css';
import { getDelay, normalizeDelay } from "../../../core/flow";
import { ORB_MAX_SIZE_MULTIPLIER, ORB_MIN_SIZE_MULTIPLIER } from "../../../constants";

export const Orbs: Component<{
  index: number,
  log: ChangeLog,
  onTimestepClick: (index: number) => void
}> = props => {
  return (
    <div class={styles.progress}>
      <div class={styles.orbContainer}>
        <Index
          each={props.log}
        >{(_, i) => (
            <button 
              class={`${styles.orb} ${i === props.index ? styles.orbActive : ''}`}
              onKeyPress={event => event.stopPropagation()}
              onClick={() => props.onTimestepClick(i)}
              style={`
                --size: ${normalizeDelay(getDelay(props.log, i)) * (ORB_MAX_SIZE_MULTIPLIER - ORB_MIN_SIZE_MULTIPLIER) + ORB_MIN_SIZE_MULTIPLIER};
              `}
            >
              <div class={`${styles.orbContents}`} />
            </button>
        )}</Index>
      </div>
    </div>
  );
}