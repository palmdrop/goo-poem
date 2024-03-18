import { Component } from "solid-js"
import styles from './Arrow.module.css';

type Orientation = 'left' | 'right' | 'up' | 'down';

export const Arrow: Component<{ orientation: Orientation }> = props => {
  return (
    <span
      class={`${styles.arrow} ${styles[props.orientation]}`}
    >
      {"\\/"}
    </span>
  )
}