import { createSignal, type Component, createEffect } from 'solid-js';
import { ChangeEvent, ChangeEventData } from '../../types/poem';

import styles from './Poem.module.css';
import { MAX_ANIMATION_TIME } from '../../constants';
import { Filter } from '../filters/MorphFilter';

const getChangeRangeFromEvent = (event: ChangeEvent) => {
  let from: number; 
  let to: number;
  let previousFrom: number; 
  let previousTo: number;
  switch(event?.type) {
    case 'add': {
      from = event.from!;
      to = event.from! + event.addition?.length!;
      previousFrom = from;
      previousTo = to;
    } break;
    case 'replace': {
      from = event.currentFrom!;
      to = event.currentTo!;
      previousFrom = event.previousFrom!;
      previousTo = event.previousTo!;
    } break;
    case 'remove': {
      from = event.from!;
      to = (from + event.removed?.length!);
      previousFrom = from;
      previousTo = to;
    } break;
    default: {
      from = 0; 
      to = event.value.length; 
      previousFrom = from;
      previousTo = to;
    }
  }

  return {
    from,
    to,
    previousFrom,
    previousTo
  }
}

const Poem: Component<ChangeEventData> = (props)=> {
  const [line, setLine] = createSignal<string>('');
  const [before, setBefore] = createSignal<string>('');
  const [after, setAfter] = createSignal<string>('');
  const [change, setChange] = createSignal<string>('');

  const [changeOverlap, setChangeOverlap] = createSignal<string>('');

  const [animate, setAnimate] = createSignal(false);
  const [animationTime, setAnimationDelay] = createSignal(0);


  createEffect(() => {
    const { action, delay, index } = props;
    const newLine = action.value;
    const animationTime = Math.min(delay, MAX_ANIMATION_TIME) * 0.9;

    setAnimate(true);
    setAnimationDelay(animationTime);

    setTimeout(() => {
      setAnimate(false);
    }, animationTime);

    if(index === 0) {
      setLine(newLine);
      setBefore(newLine);

      setChange("");
      setAfter("");
      setChangeOverlap("");

      return;
    }

    const {
      from,
      to,
      previousFrom,
      previousTo
    } = getChangeRangeFromEvent(action);

    const change = newLine.slice(from, to);

    const startsWithSpace = change.at(0) === " ";
    const endsWithSpace = change.at(-1) === " ";

    const before = newLine.slice(0, from + (startsWithSpace ? 1 : 0));
    const after = newLine.slice(to - (endsWithSpace ? 1 : 0));

    const overlap = line().slice(previousFrom, previousTo);

    setBefore(before);
    setChange(change.trim());
    setAfter(after);
    setChangeOverlap(overlap);
  });

  return (
    <div class={styles.container}>
      <Filter />
      <p 
        class={styles.paragraph}
        style={`--animation-time: ${animationTime()}ms;`}
      >
        <span 
          class={styles.line}
        >
          <span class={`${styles.current}`}>
            { before() }
          </span>
          <span 
            style={`--width: ${change().length}ch;`}
            class={`${styles.current} ${styles.change} ${animate() ? styles.fadeIn : ''}`}
          >
            { change() }
          </span>
          <span class={`${styles.current}`}>
            { after() }
          </span>
        </span>
        <span 
          class={styles.line}
        >
          { /* Rendering a duplicate of before is only needed to perfectly align the overlapping element */ }
          <span class={`${styles.previous}`}>
            { before() }
          </span>
          <span 
            style={`--width: ${change().length}ch;`}
            class={`${styles.previous} ${styles.change} ${animate() ? styles.fadeOut : ''}`}
          >
            { changeOverlap() }
          </span>
        </span>
      </p>
    </div>
  );
};

export default Poem;
