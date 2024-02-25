import { onCleanup, type Component, createSignal, Show } from 'solid-js';
import data from '../data.json';
import Poem from './components/poem/Poem';
import { flowLoop } from './core/flow';
import { ChangeEventData } from './types/poem';

const { log } = data;

const App: Component = () => {
  const [data, setData] = createSignal<ChangeEventData>();

  const { stop } = flowLoop(log, (action, delay, index) => {
    setData({ action, delay, index });
  });

  onCleanup(() => {
    stop();
  });

  return (
    <main>
      <Show
        when={data()}
        fallback={<>loading...</>}
      >
        <Poem {...data()!} />
      </Show>
    </main>
  );
};

export default App;
