
const INITIAL_VALUE = "Type here...";


type InputEventWithTarget<E = Event> = E & { target: HTMLInputElement | null };

const makeHandler = <E = Event>(
  callback: <E>(event: InputEventWithTarget<E>) => void
) => (event: Event) => {
  callback(event as InputEventWithTarget);
}

export const setupEditor = (inputElement: HTMLInputElement) => {
  inputElement.value = INITIAL_VALUE;

  const onSelect = makeHandler(event => {
    event.target
  })

  const onKeyPress = makeHandler<KeyboardEvent>(event => {
    
  });

  inputElement.addEventListener('select', onSelect);
  inputElement.addEventListener('keypress', onKeyPress);

  return () => {
    inputElement.removeEventListener('select', onSelect);
    inputElement.removeEventListener('keypress', onKeyPress);
  }
}