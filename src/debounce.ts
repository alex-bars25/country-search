export interface Debounced<Args extends unknown[]> {
  (...args: Args): void;
  cancel(): void;
}

export function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number
): Debounced<T> {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: T): void => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, delay);
  };

  debounced.cancel = (): void => {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  return debounced;
}
