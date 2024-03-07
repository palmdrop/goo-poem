import { onCleanup, type Component, createSignal, Show } from 'solid-js';
import data from '../data.json';
import GooPoem from './components/poem/Poem';
import { flowLoop } from './core/flow';
import { ChangeEventData } from './types/poem';
import { Progress } from './components/progress/Progress';

import styles from './App.module.css';
import { Footer } from './components/footer/Footer';

const { log } = data;

const App: Component = () => {
  const [data, setData] = createSignal<ChangeEventData>();
  const [isPlaying, setIsPlaying] = createSignal(true);

  const { stop, play, once, setIndex } = flowLoop(log, (action, delay, index) => {
    setData({ action, delay, index });
  });

  const moveToTimestep = (index: number) => {
    setIndex(index);
    if(index === data()?.index && !isPlaying()) {
      togglePlay();
      return;
    } 
    
    if (isPlaying()) {
      setIsPlaying(false);
      stop();
    } else {
      once();
    }
  }

  const togglePlay = () => {
    setIsPlaying(previous => {
      const isPlaying = !previous;

      if(isPlaying) {
        play();
      } else {
        stop();
      }

      return isPlaying;
    });
  }

  onCleanup(() => {
    stop();
  });

  return (
    <main class={styles.main}>
      <div class={styles.container}>
        <Show
          when={data()}
          fallback={<>loading...</>}
        >
          <GooPoem {...data()!} />
          <Progress 
            delay={data()!.delay}
            index={data()!.index} 
            log={log} 
            onTimestepClick={moveToTimestep}
            onTogglePlayClick={togglePlay}
            playing={isPlaying()}
          />
          <Footer />
        </Show>
      </div>
    </main>
  );
};

export default App;
