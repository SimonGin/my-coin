export function getRandomIndices(count: number, max: number): number[] {
  const indices = new Set<number>();
  while (indices.size < count) {
    const rand = Math.floor(Math.random() * max);
    indices.add(rand);
  }
  return Array.from(indices);
}

export function getRandomOptions(
  correctWord: string,
  allWords: string[]
): string[] {
  const distractors = allWords.filter((w) => w !== correctWord);
  const shuffled = distractors.sort(() => 0.5 - Math.random()).slice(0, 2);
  const options = [...shuffled, correctWord];
  return options.sort(() => 0.5 - Math.random());
}
