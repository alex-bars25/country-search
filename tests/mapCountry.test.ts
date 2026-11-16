import { describe, it, expect } from 'vitest';
import { mapCountryResponse } from '../src/mapCountry';

describe('mapCountryResponse', () => {
  it('преобразует сырой ответ в карточку', () => {
    const raw = {
      name: 'Spain',
      flags: { svg: 'https://flag/spain.svg', png: 'https://flag/spain.png' },
      capital: ['Madrid'],
      region: 'Europe',
      population: 47351567,
      languages: [{ name: 'Spanish' }],
    };

    expect(mapCountryResponse(raw)).toEqual({
      name: 'Spain',
      flag: 'https://flag/spain.svg',
      capital: 'Madrid',
      region: 'Europe',
      population: 47351567,
      languages: ['Spanish'],
    });
  });
});
