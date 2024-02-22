import { createSignal, type Component } from 'solid-js';
import { GooPoem } from '../../types/goo-poem';
import { flowLoop } from '../../core/flow';

import styles from './GooPoem.module.css';

const Poem: Component<GooPoem> = ({ log })=> {
  const [line, setLine] = createSignal('');

  flowLoop(log, action => {
    setLine(action.value);
  });

  return (
    <main>
      <p class={styles.paragraph}>
        { line() } 
      </p>
    </main>
  );
};

export default Poem;
