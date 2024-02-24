import { createSignal, type Component, onCleanup, createMemo, Index } from 'solid-js';
import { ChangeEvent, GooPoem } from '../../types/goo-poem';
import { flowLoop } from '../../core/flow';

import styles from './GooPoem.module.css';
import { MAX_ANIMATION_TIME } from '../../constants';
import { Filter } from './Filter';

const Poem: Component<GooPoem> = ({ log })=> {
  const [previousLine, setPreviousLine] = createSignal<string | undefined>(undefined);
  const [line, setLine] = createSignal<string>('');

  const [animate, setAnimate] = createSignal(false);
  const [animationTime, setAnimationDelay] = createSignal(0);
  const [action, setAction] = createSignal<ChangeEvent | undefined>(undefined);

  const { stop } = flowLoop(log, (action, delay) => {
    const animationTime = Math.min(delay, MAX_ANIMATION_TIME) * 0.9;
    setAnimate(true);
    setAnimationDelay(animationTime);
    setAction(action);

    setTimeout(() => {
      setAnimate(false);
    }, animationTime);

    setPreviousLine(line());
    setLine(action.value);
  });

  onCleanup(() => {
    stop();
  });

  const renderLine = (lineToRender: string | undefined, which: 'current' | 'previous') => {
    if(!lineToRender) return <></>

    const animation = which === 'current' ? styles.fadeIn : styles.fadeOut;
    const style = `${which === 'current' ? styles.current : styles.previous }`;

    const event = action();

    let from: number;
    let to: number;

    // NOTE: SOLUTION: split in 3 pieces! before, change, and after. Each element is static, but content changes (use <Index>) 
    // NOTE: Let "change"  width grow/shrink depending on content. The rest will follow

    switch(event?.type) {
      case 'add': {
        from = event.from!;
        to = event.from! + event.addition?.length!;
      } break;
      case 'replace': {
        if(which === 'current') {
          from = event.currentFrom!;
          to = event.currentTo!;
        } else {
          from = event.previousFrom!;
          to = event.previousTo!;
        }
      } break;
      case 'remove': {
        from = event.from!;
        to = lineToRender.length;
      } break;
      default: {
        from = 0; 
        to = line.length; 
      }
    }

    const leading = Math.max(from - 1, 0);
    const trailing = Math.min(to, line().length);

    return <Index each={lineToRender.split("")}>{
      (character, i) => {
        const shouldAnimate = animate() && i >= from && i < to;
        return (
          <span
            class={`${styles.character} ${style} ${shouldAnimate ? animation : ''}`}
            style={
              `background-color: ${leading === i ? 'red' : trailing === i ? 'blue' : 'unset'}`
            }
          >
            { character() }
          </span>
        )
      }
    }</Index>
  }

  return (
    <main class={styles.container}>
      <Filter />
      <p 
        class={styles.paragraph}
        style={`--animation-time: ${animationTime()}ms;`}
      >
        <span 
          class={styles.line}
        >
          { renderLine(previousLine(), 'previous') } 
        </span>
        <span 
          class={styles.line}
        >
          { renderLine(line(), 'current') } 
        </span>
      </p>
    </main>
  );
};

export default Poem;
