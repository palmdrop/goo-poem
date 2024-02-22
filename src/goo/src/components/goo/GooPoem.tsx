import { createSignal, type Component } from 'solid-js';
import { GooPoem } from '../../types/goo-poem';
import { flowLoop } from '../../core/flow';

const Poem: Component<GooPoem> = ({ log })=> {
  const [line, setLine] = createSignal('');

  flowLoop(log, action => {
    setLine(action.value);
  });

  return (
    <main>
      <p>
        { line() } 
      </p>
    </main>
  );
};

export default Poem;
