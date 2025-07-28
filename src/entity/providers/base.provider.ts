import {
  GasPriceItem,
  Provider,
  QuoteItemInterface,
  SwapItemInterface,
  TokenItemInterface,
} from '../../types/swap.type';

/**
 * Base provider class defines the interfaces and methods for different token providers.
 * It can be extended by specific providers to implement their own logic.
 */
export abstract class BaseProvider {
  name: Provider;
  constructor(name: Provider) {
    this.name = name;
  }
  // Method to get tokens from a specific chain ID, only to be implemented by subclasses
  abstract getTokensFromChainId(chainId: string): Promise<TokenItemInterface[]>;

  // Method to get swap data, only to be implemented by subclasses
  abstract getQuote(
    chainId: string,
    inTokenAddress: string,
    outTokenAddress: string,
    amount: string,
    slippage: string
  ): Promise<QuoteItemInterface[]>;

  // method to get quote details with gas price, only to be implemented by subclasses
  abstract getQuoteDetailWithGasPrice(
    chainId: string,
    inTokenAddress: string,
    outTokenAddress: string,
    amount: string,
    slippage: string,
    gasPrice: {
      gasPrice: number;
      waitTimeEstimate?: number;
    }
  ): Promise<QuoteItemInterface>;

  // Method to get the gas prices for a specific chain ID, only to be implemented by subclasses
  abstract getGasPrice(chainId: string): Promise<GasPriceItem>;

  // Method to get the quote swap information for building a real swap transaction on chain
  abstract getSwap(
    chainId: string,
    inTokenAddress: string,
    outTokenAddress: string,
    inAmount: string,
    slippage: string,
    account: string,
    gasPrice: string
  ): Promise<SwapItemInterface>;
}
