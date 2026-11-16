import { describe, it, expect, vi, afterEach } from 'vitest';
import { searchCountries, HttpError } from '../src/http';

describe('searchCountries', () => {
  afterEach(() => vi.unstubAllGlobals());

  const signal = () => new AbortController().signal;

  it('возвращает смапленные карточки при 200', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            name: 'Spain',
            flags: { svg: 'svg', png: 'png' },
            capital: ['Madrid'],
            region: 'Europe',
            population: 1,
            languages: [{ name: 'Spanish' }],
            currencies: [{ name: 'Euro', symbol: '€' }],
            borders: ['FRA', 'PRT'],
            area: 505990,
          },
        ],
      })
    );

    expect(await searchCountries('spain', signal())).toEqual([
      {
        name: 'Spain',
        flag: 'svg',
        capital: 'Madrid',
        region: 'Europe',
        population: 1,
        languages: ['Spanish'],
        currencies: ['Euro (€)'],
        borders: ['FRA', 'PRT'],
        area: 505990,
      },
    ]);
  });

  it('возвращает пустой массив при 404', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }));

    expect(await searchCountries('xyz', signal())).toEqual([]);
  });

  it('бросает HttpError при 500', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));

    const promise = searchCountries('x', signal());
    await expect(promise).rejects.toBeInstanceOf(HttpError);
    await expect(promise).rejects.toMatchObject({ status: 500 });
  });
});
