import type { CountryRaw, CountryCard } from './types';
import { mapCountryResponse } from './mapCountry';

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export async function searchCountries(query: string, signal: AbortSignal): Promise<CountryCard[]> {
  const res = await fetch(`https://countries.dev/name/${encodeURIComponent(query)}`, { signal });

  if (!res.ok) {
    if (res.status === 404) return [];
    throw new HttpError(res.status, `HTTP ${res.status}`);
  }

  const data = (await res.json()) as CountryRaw[];
  return data.map(mapCountryResponse);
}
