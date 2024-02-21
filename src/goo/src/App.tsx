import type { Component } from 'solid-js';
import data from '../data.json';

const App: Component = () => {
  return (
    <main>
      { data.value } 
    </main>
  );
};

export default App;
