export interface CurrencyRaw {
  name: string;
  symbol: string;
}

export interface CountryRaw {
  name: string;
  flags: { svg: string; png: string };
  capital?: string[];
  region: string;
  population: number;
  languages?: { name: string }[];
  currencies?: CurrencyRaw[];
  borders?: string[];
  area?: number;
}

export interface CountryCard {
  name: string;
  flag: string;
  capital: string;
  region: string;
  population: number;
  languages: string[];
  currencies: string[];
  borders: string[];
  area: number;
}
