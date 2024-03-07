import { Component } from "solid-js"
import styles from './Controller.module.css';
import { ChangeLog } from "../../types/poem";

export const Controller: Component<{ 
  log: ChangeLog,
  playing: boolean,
  onTimestepClick: (index: number) => void
  onTogglePlayClick: () => void,
}> = (props) => {
  return (
    <div class={styles.controller}>
      <button 
        class={`${styles.controllerButton} ${styles.toStartButton}`}
        onClick={() => props.onTimestepClick(0)}
      >
        {"➺"}
      </button>
      <button 
        class={styles.controllerButton}
        onClick={props.onTogglePlayClick}
      >
        { props.playing ? 'pause' : 'play' }
      </button>
      <button 
        class={`${styles.controllerButton} ${styles.toEndButton}`}
        onClick={() => props.onTimestepClick(props.log.length - 1)}
      >
        {"➺"}
      </button>
    </div>
  );
}