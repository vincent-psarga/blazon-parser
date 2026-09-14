/** A count with its noun, so a single one is not announced as several. */
export function tally(count: number, noun: string, plural = `${noun}s`): string {
  return `${count} ${count === 1 ? noun : plural}`;
}
