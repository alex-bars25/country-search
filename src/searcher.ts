import { debounce } from './debounce';
import { HttpError } from './http';
import type { CountryCard } from './types';

export type SearchState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'results'; countries: CountryCard[] }
  | { kind: 'empty' }
  | { kind: 'error'; message: string; canRetry: boolean };

export interface SearcherOptions {
  search: (query: string, signal: AbortSignal) => Promise<CountryCard[]>;
  onChange: (state: SearchState) => void;
  delay?: number;
  timeout?: number;
}

export interface Searcher {
  update(query: string): void;
  retry(): void;
}

export function createSearcher({
  search,
  onChange,
  delay = 300,
  timeout = 8000,
}: SearcherOptions): Searcher {
  let controller: AbortController | null = null;
  let lastQuery = '';

  const run = async (query: string): Promise<void> => {
    if (controller) controller.abort();
    const own = new AbortController();
    controller = own;
    const signal = AbortSignal.any([own.signal, AbortSignal.timeout(timeout)]);

    onChange({ kind: 'loading' });
    try {
      const countries = await search(query, signal);
      if (controller !== own) return;
      onChange(countries.length === 0 ? { kind: 'empty' } : { kind: 'results', countries });
    } catch (err) {
      if (controller !== own) return;
      if (err instanceof DOMException) {
        if (err.name === 'AbortError') return;
        if (err.name === 'TimeoutError') {
          onChange({ kind: 'error', message: 'Превышено время ожидания', canRetry: true });
          return;
        }
      }
      if (err instanceof HttpError) {
        onChange({ kind: 'error', message: `Ошибка сервера: ${err.status}`, canRetry: true });
        return;
      }
      onChange({ kind: 'error', message: 'Не удалось загрузить данные', canRetry: true });
    } finally {
      if (controller === own) controller = null;
    }
  };

  const schedule = debounce((q: string) => void run(q), delay);

  return {
    update(query) {
      schedule.cancel();
      if (controller) {
        controller.abort();
        controller = null;
      }
      const q = query.trim();
      if (!q) {
        lastQuery = '';
        onChange({ kind: 'idle' });
        return;
      }
      lastQuery = q;
      schedule(q);
    },
    retry() {
      if (lastQuery) void run(lastQuery);
    },
  };
}
