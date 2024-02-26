import { onCleanup, type Component, createSignal, Show } from 'solid-js';
import data from '../data.json';
import GooPoem from './components/poem/Poem';
import { flowLoop } from './core/flow';
import { ChangeEventData } from './types/poem';
import { Progress } from './components/progress/Progress';

import styles from './App.module.css';

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
    <main class={styles.main}>
      <Show
        when={data()}
        fallback={<>loading...</>}
      >
        <GooPoem {...data()!} />
        <Progress 
          delay={data()!.delay}
          index={data()!.index} 
          log={log} 
        />
      </Show>
    </main>
  );
};

export default App;
