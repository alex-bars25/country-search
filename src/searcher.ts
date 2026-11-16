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

export function createSearcher(_opts: SearcherOptions): Searcher {
  throw new Error('createSearcher: not implemented');
}
