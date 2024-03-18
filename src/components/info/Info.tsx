import { Component, Show, createEffect, createSignal, onCleanup } from "solid-js";

import styles from './Info.module.css';
import { Arrow } from "../arrow/Arrow";

type TransitionState = 'open' | 'closing' | 'closed' | 'opening';

export const Info: Component<{
  onClose: () => void,
  opened: boolean,
  transitionTime: number
}> = props => {
  const [transitionState, setTransitionState] = createSignal<TransitionState>(props.opened ? 'open' : 'closed');

  let preTransitionTimeout: NodeJS.Timeout;
  let transitionTimeout: NodeJS.Timeout;

  createEffect(() => {
    if(
      (props.opened && ['open', 'opening'].includes(transitionState())) ||
      (!props.opened && ['closed', 'closing'].includes(transitionState()))
    ) {
      return;
    }

    clearTimeout(transitionTimeout);

    // Outer timeout makes sure that the opened prop is set before opening starts, for animation purposes
    preTransitionTimeout = setTimeout(() => {
      if(props.opened) {
        setTransitionState('opening');
        transitionTimeout = setTimeout(() => {
          setTransitionState('open');
        }, props.transitionTime);
      } else {
        setTransitionState('closing');
        transitionTimeout = setTimeout(() => {
          setTransitionState('closed');
        }, props.transitionTime);
      }
    }, 0);
  });

  onCleanup(() => {
    clearTimeout(preTransitionTimeout);
    clearTimeout(transitionTimeout);
  });

  return (
    <Show
      when={props.opened || transitionState() !== 'closed'}
    >
      <div 
        class={`${styles.container} ${styles[transitionState()]}`}
        onClick={props.onClose}
        style={`
          --transition-time: ${props.transitionTime}ms;
        `}
      >
        <div
          class={styles.info}
          onClick={event => event.stopPropagation()}
        >
          <button 
            class={`hoverable-shadow ${styles.closeButton}`}
            onClick={props.onClose}
            onKeyPress={event => event.stopPropagation()}
          >
            <Arrow orientation="left" />
            <Arrow orientation="left" />
            <Arrow orientation="left" />
          </button>
          <section class={styles.section}>
            <h1 class={styles.heading}>
              goo poem !
            </h1>
            <p class={styles.paragraph}>
              Telephone whisper game,
            </p>
            <p class={styles.paragraph}>
              placid association chain,
            </p>
            <p class={styles.paragraph}>
              evergreen web experiment.
            </p>
          </section>
          <section class={styles.section}>
            <p class={styles.paragraph}>
              <span>by: </span>
              <a
                href="https://palmdrop.site/"
                class={`hoverable ${styles.link}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                PALMDROP !
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
                WONDERTYPE !
              </a>
            </p>
          </section>
        </div>
      </div>
    </Show>
  );
}