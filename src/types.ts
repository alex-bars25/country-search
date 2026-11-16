export interface CountryRaw {
  name: string;
  flags: { svg: string; png: string };
  capital: string[];
  region: string;
  population: number;
  languages?: { name: string }[];
}

export interface CountryCard {
  name: string;
  flag: string;
  capital: string;
  region: string;
  population: number;
  languages: string[];
}
