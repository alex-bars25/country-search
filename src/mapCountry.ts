import type { CountryRaw, CountryCard } from './types';

export function mapCountryResponse(raw: CountryRaw): CountryCard {
  return {
    name: raw.name,
    flag: raw.flags.svg,
    capital: raw.capital?.[0] ?? '',
    region: raw.region,
    population: raw.population,
    languages: raw.languages?.map((l) => l.name) ?? [],
    currencies: raw.currencies?.map((c) => `${c.name} (${c.symbol})`) ?? [],
    borders: raw.borders ?? [],
    area: raw.area ?? 0,
  };
}
