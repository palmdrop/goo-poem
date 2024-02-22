import { createSignal, type Component, createMemo, onCleanup } from 'solid-js';
import { GooPoem } from '../../types/goo-poem';
import { flowLoop } from '../../core/flow';

import styles from './GooPoem.module.css';
import { MAX_ANIMATION_TIME } from '../../constants';

const Poem: Component<GooPoem> = ({ log })=> {
  const [previousLine, setPreviousLine] = createSignal<string | undefined>(undefined);
  const [line, setLine] = createSignal<string>('');

  const [animate, setAnimate] = createSignal(false);
  const [animationTime, setAnimationDelay] = createSignal(0);

  const { stop } = flowLoop(log, (action, delay) => {
    const animationTime = Math.min(delay, MAX_ANIMATION_TIME) * 0.9;
    setAnimate(true);
    setAnimationDelay(animationTime);
    setTimeout(() => {
      setAnimate(false);
    }, animationTime);

    setPreviousLine(line());
    setLine(action.value);
  });

  onCleanup(() => {
    stop();
  });

  return (
    <main class={styles.container}>
      <svg id="filters" style="position: absolute">
        <defs>
          <filter id="threshold">
            <feColorMatrix in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -50" 
            />
          </filter>
        </defs>
      </svg>

      <p 
        class={styles.paragraph}
        style={`
          --animation-time: ${animationTime()}ms;
        `}
      >
        <span 
          class={`
            ${styles.line} 
            ${styles.previous} 
            ${animate() ? styles.fadeOut : ''}
          `}
        >
          { previousLine() } 
        </span>
        <span class={`
          ${styles.line} 
          ${styles.current} 
          ${animate() ? styles.fadeIn : ''}
        `}>
          { line() } 
        </span>
      </p>
    </main>
  );
};

export default Poem;
