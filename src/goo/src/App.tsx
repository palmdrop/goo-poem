import { onCleanup, type Component, createSignal, Show, onMount, createEffect } from 'solid-js';
import data from '../data.json';
import GooPoem from './components/poem/Poem';
import { flowLoop, getDelay } from './core/flow';
import { ChangeEventData } from './types/poem';
import { Progress } from './components/progress/Progress';

import styles from './App.module.css';
import { Footer } from './components/footer/Footer';
import { Info } from './components/info/Info';

const { log: rawLog } = data;

// NOTE: Experimental filter, may cause some animations to behave strangely.
const log = rawLog.filter((_, i) => getDelay(rawLog, i) > 1700);

const App: Component = () => {
  const [data, setData] = createSignal<ChangeEventData>();
  const [isPlaying, setIsPlaying] = createSignal(true);
  const [isInfoOpen, setIsInfoOpen] = createSignal(false);

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
        if(isInfoOpen()) setIsInfoOpen(false);
      } break;
      case ' ': {
        togglePlay();
      }
    }
  }

  onMount(() => {
    window.addEventListener('keypress', keyEventListener);
    const hash = window.location.hash.slice(1);
    const poemNumber = isNaN(Number(hash))
      ? 1
      : Number(hash);

    if(poemNumber > 1) setIndex(poemNumber - 1);
  });

  onCleanup(() => {
    stop();

    window.removeEventListener('keypress', keyEventListener);
  });

  createEffect(() => {
    const poemNumber = (data()?.index ?? 0) + 1;
    document.title = `(${poemNumber}) ${data()?.action?.value.slice(0, 25) ?? 'Goo poem'}... | Goo Poem`;
    window.location.hash = `${poemNumber}`;
  });

  return (
    <div class={styles.root}>
      <Info 
        opened={isInfoOpen()}
        onClose={() => setIsInfoOpen(false)} 
        transitionTime={500}
      />
      <div class={styles.gooPoem}>
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
              onToggleInfo={() => setIsInfoOpen(infoVisible => !infoVisible)}
            />
          </Show>
        </div>
      </div>
    </div>
  );
};

export default App;
