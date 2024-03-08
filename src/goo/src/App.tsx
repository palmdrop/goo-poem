import { onCleanup, type Component, createSignal, Show, onMount } from 'solid-js';
import data from '../data.json';
import GooPoem from './components/poem/Poem';
import { flowLoop } from './core/flow';
import { ChangeEventData } from './types/poem';
import { Progress } from './components/progress/Progress';

import styles from './App.module.css';
import { Footer } from './components/footer/Footer';
import { Info } from './components/info/Info';

const { log } = data;

const App: Component = () => {
  const [data, setData] = createSignal<ChangeEventData>();
  const [isPlaying, setIsPlaying] = createSignal(true);
  const [isInfoVisible, setIsInfoVisible] = createSignal(false);

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

  const keyEventListener = (event: KeyboardEvent) => {
    switch(event.key) {
      case 'c':
      case 'x':
      case 'Enter':
      case 'Escape': {
        if(isInfoVisible()) setIsInfoVisible(false);
      } break;
      case ' ': {
        togglePlay();
      }
    }
  }

  onMount(() => {
    window.addEventListener('keypress', keyEventListener);
  });

  onCleanup(() => {
    stop();

    window.removeEventListener('keypress', keyEventListener);
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
          <Footer 
            onToggleInfo={() => setIsInfoVisible(infoVisible => !infoVisible)}
          />
          <Show 
            when={isInfoVisible()}
          >
            <Info onClose={() => setIsInfoVisible(false)} />
          </Show>
        </Show>
      </div>
    </main>
  );
};

export default App;
