
type Key = keyof HTMLElementEventMap;
type Listener<K extends Key> = (event: HTMLElementEventMap[K], options?: boolean | AddEventListenerOptions) => void;

export type Listeners = {
  [K in keyof HTMLElementEventMap]?: Listener<K> | Listener<K>[]
};

export const assignListeners = (element: HTMLElement, listeners: Listeners) => {
  const forEachListener = (callback: (key: Key, listener: Listener<Key>) => void) => {
    Object.keys(listeners).forEach(key => {
      const listener = listeners[key as Key];
      if(Array.isArray(listener)) {
        listener.forEach(listener => callback(key as Key, listener as Listener<Key>));
      } else {
        callback(key as Key, listener as Listener<Key>);
      }
    });
  }

  forEachListener((key, listener) => element.addEventListener(key, listener));

  return () => {
    forEachListener((key, listener) => element.removeEventListener(key, listener));
  }
}