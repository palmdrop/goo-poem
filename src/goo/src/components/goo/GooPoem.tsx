import { createSignal, type Component, createMemo } from 'solid-js';
import { GooPoem } from '../../types/goo-poem';
import { flowLoop } from '../../core/flow';

const gooPoem: Component<GooPoem> = ({ log, value })=> {
  const [line, setLine] = createSignal('');

  flowLoop(log, action => {
    setLine(action.value);
  });
  /*
  const [index, setIndex] = createSignal(0);

  const line = createMemo(() => {
    return log[index()].value;
  });

  setInterval(() => {
    setIndex((index() + 1) % log.length);
  }, 500)
  */

  return (
    <main>
      { line() } 
    </main>
  );
};

export default gooPoem;
