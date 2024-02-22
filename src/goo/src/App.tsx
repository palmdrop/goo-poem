import type { Component } from 'solid-js';
import data from '../data.json';
import GooPoem from './components/goo/GooPoem';

const App: Component = () => {
  return (
    <main>
      <GooPoem {...data} />
    </main>
  );
};

export default App;
