import { TokenItemInterface } from '../../types/swap.type';

/**
 * Base provider class defines the interfaces and methods for different token providers.
 * It can be extended by specific providers to implement their own logic.
 */
export abstract class BaseProvider {
  // Method to get tokens from a specific chain ID, only to be implemented by subclasses
  abstract getTokensFromChainId(chainId: string): Promise<TokenItemInterface[]>;
}
