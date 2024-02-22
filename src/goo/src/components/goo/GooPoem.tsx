import { createSignal, type Component } from 'solid-js';
import { GooPoem } from '../../types/goo-poem';
import { flowLoop } from '../../core/flow';

const gooPoem: Component<GooPoem> = ({ log })=> {
  const [line, setLine] = createSignal('');

  flowLoop(log, action => {
    setLine(action.value);
  });

  return (
    <main>
      { line() } 
    </main>
  );
};

export default gooPoem;
