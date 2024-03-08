import { Component } from "solid-js";

import styles from './Footer.module.css';

export const Footer: Component<{
  onToggleInfo: () => void
}> = props => {
  return (
    <footer class={styles.footer}>
      <button
        class={`hoverable ${styles.link} ${styles.leftLink}`}
        onClick={props.onToggleInfo}
        onKeyPress={event => event.stopPropagation()}
      >
        goo poem (?)
      </button>
      <span class={styles.by}>by</span>
      <a
        href="https://palmdrop.site/nodes/about"
        target="_blank"
        rel="noreferrer noopener"
        class={`hoverable ${styles.link} ${styles.rightLink}`}
      >
        palmdrop (!)
      </a>
    </footer>
  );
}