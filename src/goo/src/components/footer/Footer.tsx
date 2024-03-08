import { Component } from "solid-js";

import styles from './Footer.module.css';

export const Footer: Component<{}> = props => {
  return (
    <footer class={styles.footer}>
      <button
        class={`hoverable ${styles.link} ${styles.leftLink}`}
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