import { describe, it, expect } from 'vitest';
import { mapCountryResponse } from '../src/mapCountry';

describe('mapCountryResponse', () => {
  it('преобразует сырой ответ в карточку', () => {
    const raw = {
      name: 'Spain',
      flags: { svg: 'svg', png: 'png' },
      capital: ['Madrid'],
      region: 'Europe',
      population: 1,
      languages: [{ name: 'Spanish' }],
      currencies: [{ name: 'Euro', symbol: '€' }],
      borders: ['FRA', 'PRT'],
      area: 505990,
    };

    expect(mapCountryResponse(raw)).toEqual({
      name: 'Spain',
      flag: 'svg',
      capital: 'Madrid',
      region: 'Europe',
      population: 1,
      languages: ['Spanish'],
      currencies: ['Euro (€)'],
      borders: ['FRA', 'PRT'],
      area: 505990,
    });
  });
});
