export interface ChainItemInterface {
  name: string;
  code: string;
  id: string;
  address: string;
}

export interface TokenItemInterface {
  id: number;
  logo: string;
  address: string;
  symbol: string;
  decimals: number;
  name: string;
}

export type Provider = 'openOcean';
