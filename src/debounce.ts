export interface Debounced<Args extends unknown[]> {
  (...args: Args): void;
  cancel(): void;
}

export interface Debounced<Args extends unknown[]> {
  (...args: Args): void;
  cancel(): void;
}

export function debounce<T extends unknown[]>(
  _fn: (...args: T) => void,
  _delay: number
): Debounced<T> {
  throw new Error('debounce: not implemented');
}
