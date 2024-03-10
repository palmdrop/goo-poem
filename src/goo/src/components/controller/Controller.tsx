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
        class={`hoverable ${styles.controllerButton} ${styles.toStartButton}`}
        onClick={() => props.onTimestepClick(0)}
        onKeyPress={event => event.stopPropagation()}
      >
        {"➺"}
      </button>
      <button 
        class={`hoverable ${styles.controllerButton}`}
        onClick={props.onTogglePlayClick}
        onKeyPress={event => event.stopPropagation()}
      >
        { props.playing ? 'pause' : 'play' }
      </button>
      <button 
        class={`hoverable ${styles.controllerButton} ${styles.toEndButton}`}
        onClick={() => props.onTimestepClick(props.log.length - 1)}
        onKeyPress={event => event.stopPropagation()}
      >
        {"➺"}
      </button>
    </div>
  );
}