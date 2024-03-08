import { Component, onCleanup } from "solid-js";

import styles from './Info.module.css';

export const Info: Component<{
  onClose: () => void
}> = props => {
  return (
    <div class={styles.container}
      onClick={props.onClose}
    >
      <div
        class={styles.modal}
        onClick={event => event.stopPropagation()}
      >
        <button 
          class={`hoverable ${styles.closeButton}`}
          onClick={props.onClose}
          onKeyPress={event => event.stopPropagation()}
        >
          X
        </button>
        <section class={styles.section}>
          <h1 class={styles.heading}>
            goo poem
          </h1>
          <p class={styles.paragraph}>
            Telephone whisper poem,
          </p>
          <p class={styles.paragraph}>
            a placid association chain,
          </p>
          <p class={styles.paragraph}>
            or evergreen micro-narrative.
          </p>
        </section>
        <section class={styles.section}>
          <p class={styles.paragraph}>
            <span>by: </span>
            <a
              href="https://palmdrop.site/nodes/about"
              class={`hoverable ${styles.link}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              palmdrop
            </a>
          </p>
          <p class={styles.paragraph}>
            <span>font: </span>
            <a
              href="https://www.clemencefontaine.fr/page/wonder.html"
              class={`hoverable ${styles.link}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Wonder
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}