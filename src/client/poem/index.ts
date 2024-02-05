
export const setupPoem = (
  poemElement: HTMLParagraphElement,
  inputElement: HTMLInputElement,
) => {
  const updatePoem = (value: string) => {
    poemElement.innerText = value;
  }

  const onInputChange = (event: Event) => {
    const value = (event.target as { value?: string }).value;
    if(!value) return

    updatePoem(value);
  }

  inputElement.addEventListener('change', onInputChange);
  updatePoem(inputElement.value);

  return () => {
    inputElement.removeEventListener('change', onInputChange);
  }
}