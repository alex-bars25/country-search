import type { CountryCard } from './types';

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export async function searchCountries(
  _query: string,
  _signal: AbortSignal
): Promise<CountryCard[]> {
  throw new Error('not implemented');
}
