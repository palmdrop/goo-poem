import { Component, Index } from "solid-js"
import { ChangeLog } from "../../../types/poem";

import styles from './Orbs.module.css';

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
            >
            </button>
        )}</Index>
      </div>
    </div>
  );
}