import { Inject, Provide } from '@midwayjs/core';
import { intersection } from 'lodash';

import { DbService } from '../common/db.service';
import {
  Provider,
  QuoteItemInterface,
  SwapItemInterface,
  TokenItemInterface,
} from '../../types/swap.type';
import { OpenOceanService } from '../providers/openocean.service';
import { BaseProvider } from '../providers/base.provider';

@Provide()
export class SwapService {
  @Inject()
  dbService: DbService;

  @Inject()
  openOceanService: OpenOceanService;
  /**
   * Get tokens from a specific chain ID
   * @param chainId The ID of the chain to get tokens from
   * @param options Options for the request
   * @param options.tokenName Optional token name to filter the results
   */
  async getTokensFromChainId(
    chainId: string,
    options: {
      tokenName: string | null;
    } = {
      tokenName: null,
    }
  ): Promise<TokenItemInterface[]> {
    const tokensFromDb = await this.dbService.getTokensByChainId(
      chainId,
      options.tokenName
    );

    return tokensFromDb;
  }

  /**
   * Get suitable provider for the chain ID and token pair
   */
  async getProviders(
    chainId: string,
    inTokenAddress: string,
    outTokenAddress: string
  ): Promise<Array<BaseProvider>> {
    // first, check the database for the inToken on the chain
    const inTokenResult = await this.dbService.getTokenByChainIdAndAddress(
      chainId,
      inTokenAddress
    );
    if (!inTokenResult) {
      throw new Error(
        `inToken ${inTokenAddress} not found on chain ${chainId}`
      );
    }
    const outTokenResult = await this.dbService.getTokenByChainIdAndAddress(
      chainId,
      outTokenAddress
    );
    if (!outTokenResult) {
      throw new Error(
        `outToken ${outTokenAddress} not found on chain ${chainId}`
      );
    }

    // if both tokens are found, return the supported providers for both tokens
    const supportedProviders: Provider[] = intersection(
      inTokenResult.supportedProviders,
      outTokenResult.supportedProviders
    );

    // find the provider instances that support the token pair on the chain
    const supportedProviderInstances: BaseProvider[] = [
      this.openOceanService,
      // TODO: add more providers here if we have them
    ].filter(instance => supportedProviders.includes(instance.name));
    return supportedProviderInstances;
  }

  /**
   * Get swap quote details for a specific chain and token pair
   * @param chainId The ID of the chain
   * @param inTokenAddress The address of the input token
   * @param outTokenAddress The address of the output token
   * @param amount The amount of the input token
   * @param slippage Optional slippage percentage for the swap
   * @return An array of quote items from different providers
   */
  async getQuote(
    chainId: string,
    inTokenAddress: string,
    outTokenAddress: string,
    amount: string,
    slippage?: string
  ): Promise<QuoteItemInterface[][]> {
    // get the supported providers for the token pair on the chain
    const supportedProviders = await this.getProviders(
      chainId,
      inTokenAddress,
      outTokenAddress
    );

    const data = await Promise.all(
      supportedProviders.map(provider =>
        provider.getQuote(
          chainId,
          inTokenAddress,
          outTokenAddress,
          amount,
          slippage
        )
      )
    );
    return data;
  }
  /**
   * Get the swap transaction details for a specific chain and token pair
   * @param chainId The ID of the chain
   * @param inTokenAddress The address of the input token
   * @param outTokenAddress The address of the output token
   * @param inAmount The amount of the input token
   * @param slippage The slippage percentage for the swap
   * @param account The account address to perform the swap
   * @param gasPrice The gas price to use for the swap
   * @param provider The provider to use for the swap
   * @return The swap item interface containing the swap details
   * @throws Error if the provider is not supported
   */
  async getSwap(
    chainId: string,
    inTokenAddress: string,
    outTokenAddress: string,
    inAmount: string,
    slippage: string,
    account: string,
    gasPrice: string,
    provider: Provider
  ): Promise<SwapItemInterface> {
    switch (provider) {
      case 'openOcean':
        return this.openOceanService.getSwap(
          chainId,
          inTokenAddress,
          outTokenAddress,
          inAmount,
          slippage,
          account,
          gasPrice
        );
      default:
        throw new Error(`Provider ${provider} not supported`);
    }
  }
}
