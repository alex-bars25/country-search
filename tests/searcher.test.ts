import { describe, it, expect, vi } from 'vitest';
import { createSearcher, type SearchState } from '../src/searcher';
import { HttpError } from '../src/http';
import type { CountryCard } from '../src/types';

const card: CountryCard = {
  name: 'Spain',
  flag: 'svg',
  capital: 'Madrid',
  region: 'Europe',
  population: 1,
  languages: ['Spanish'],
};

function setup(search: (q: string, s: AbortSignal) => Promise<CountryCard[]>) {
  const states: SearchState[] = [];
  const searcher = createSearcher({
    search,
    onChange: (s) => states.push(s),
    delay: 5,
    timeout: 5000,
  });
  return { searcher, states };
}

const wait = (ms = 30) => new Promise((r) => setTimeout(r, ms));

describe('createSearcher', () => {
  it('пустой ввод даёт idle', () => {
    const { searcher, states } = setup(vi.fn());
    searcher.update('');
    expect(states).toEqual([{ kind: 'idle' }]);
  });

  it('успешный поиск: loading → results', async () => {
    const search = vi.fn().mockResolvedValue([card]);
    const { searcher, states } = setup(search);
    searcher.update('spain');
    await wait();
    expect(states).toEqual([{ kind: 'loading' }, { kind: 'results', countries: [card] }]);
  });

  it('пустой ответ → empty', async () => {
    const { searcher, states } = setup(vi.fn().mockResolvedValue([]));
    searcher.update('xyz');
    await wait();
    expect(states.at(-1)).toEqual({ kind: 'empty' });
  });

  it('HttpError → error с canRetry', async () => {
    const { searcher, states } = setup(vi.fn().mockRejectedValue(new HttpError(500, 'HTTP 500')));
    searcher.update('x');
    await wait();
    expect(states.at(-1)).toMatchObject({ kind: 'error', canRetry: true });
  });

  it('AbortError не попадает в onChange', async () => {
    const { searcher, states } = setup(
      vi.fn().mockRejectedValue(new DOMException('aborted', 'AbortError'))
    );
    searcher.update('x');
    await wait();
    expect(states).toEqual([{ kind: 'loading' }]);
  });

  it('новый update отменяет предыдущий запрос', async () => {
    const signals: AbortSignal[] = [];
    const search = vi.fn((_q: string, signal: AbortSignal) => {
      signals.push(signal);
      return new Promise<CountryCard[]>((_, reject) => {
        signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
      });
    });
    const { searcher } = setup(search);
    searcher.update('sp');
    await wait();
    searcher.update('spain');
    await wait(5);
    expect(signals[0]!.aborted).toBe(true);
  });
});
