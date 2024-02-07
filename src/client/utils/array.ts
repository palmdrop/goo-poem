export const chunkWith = <T>(array: T[], condition: (current: T, next: T) => boolean) => {
  if(array.length === 0) return [];
  if(array.length === 1) return [[...array]];

  const chunks: T[][] = [];

  let startIndex = 0;
  for(let i = 0; i < array.length; i++) {
    const current = array[i];
    const next = array[i + 1];

    if(!next || !condition(current, next)) {
      chunks.push(array.slice(startIndex, i + 1))
      startIndex = i + 1;
    }
  };

  return chunks;
}