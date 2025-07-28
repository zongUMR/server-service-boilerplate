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

export interface TokenItemWithSupportedProviderInterface
  extends TokenItemInterface {
  supportedProviders: Provider[];
}

export type Provider = 'openOcean';

export interface QuoteItemInterface {
  provider: Provider;
  chainId: string;
  inTokenAddress: string;
  outTokenAddress: string;
  estimatedGasPrice: string;
  inAmount: string;
  slippage: string;
  outAmount: string;
  waitTimeEstimate?: number;
}

export interface GasPriceItem {
  chainId: string;
  standard: {
    gasPrice: number;
    waitTimeEstimate?: number;
  };
  fast: {
    gasPrice: number;
    waitTimeEstimate?: number;
  };
  instant: {
    gasPrice: number;
    waitTimeEstimate?: number;
  };
}
