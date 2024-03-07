import { Component } from "solid-js";

import styles from "./TimeIndicator.module.css";

export const TimeIndicator: Component<{ 
  date: string,
  time: string,
  index: number
}> = (props) => {
  return (
    <div class={styles.info}>
      <span class={styles.infoLeft}>
        {props.date}
      </span>
      <span class={styles.t}>
        {props.index + 1}.
      </span>
      <span class={styles.infoRight}>
        {props.time}
      </span>
    </div>
  );
}