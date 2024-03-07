import { Component } from "solid-js";

import styles from './Footer.module.css';

export const Footer: Component<{}> = props => {
  return (
    <footer class={styles.footer}>
      <a
        href=""
        class={`${styles.link} ${styles.leftLink}`}
      >
        goo poem (?)
      </a>
      <span class={styles.by}>by</span>
      <a
        href="https://palmdrop.site"
        target="_blank"
        rel="noreferrer noopener"
        class={`${styles.link} ${styles.rightLink}`}
      >
        palmdrop (!)
      </a>
    </footer>
  );
}