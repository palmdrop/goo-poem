import { Component } from "solid-js";

export const Filter: Component = () => (
  <svg id="filters" style="position: absolute">
    <defs>
      <filter id="threshold">
        <feColorMatrix in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -50" 
        />
      </filter>
    </defs>
  </svg>
);