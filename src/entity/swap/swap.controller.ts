import { Controller, Get, Inject, Param, Query } from '@midwayjs/core';

import { OPENOCEAN_SUPPORTED_CHAINS } from '../../constant';
import {
  ChainItemInterface,
  Provider,
  QuoteItemInterface,
  SwapItemInterface,
  TokenItemInterface,
} from '../../types/swap.type';

import { SwapService } from './swap.service';

@Controller('/swap')
export class SwapController {
  @Inject()
  swapService: SwapService;

  @Get('/chains')
  getChains(): ChainItemInterface[] {
    return OPENOCEAN_SUPPORTED_CHAINS;
  }

  @Get('/:chainId/tokens')
  async getTokensFromChainId(
    @Param('chainId') chainId: string,
    @Query('tokenName') tokenName?: string
  ): Promise<TokenItemInterface[]> {
    return this.swapService.getTokensFromChainId(chainId, {
      tokenName,
    });
  }

  @Get('/:chainId/quote')
  async getQuote(
    @Param('chainId') chainId: string,
    @Query('inTokenAddress') inTokenAddress: string,
    @Query('outTokenAddress') outTokenAddress: string,
    @Query('amount') amount: string,
    @Query('slippage') slippage?: string
  ): Promise<QuoteItemInterface[][]> {
    return this.swapService.getQuote(
      chainId,
      inTokenAddress,
      outTokenAddress,
      amount,
      slippage
    );
  }

  @Get('/:chainId/swap')
  async getSwap(
    @Param('chainId') chainId: string,
    @Query('inTokenAddress') inTokenAddress: string,
    @Query('outTokenAddress') outTokenAddress: string,
    @Query('inAmount') inAmount: string,
    @Query('slippage') slippage: string,
    @Query('account') account: string,
    @Query('gasPrice') gasPrice: string,
    @Query('provider') provider: Provider
  ): Promise<SwapItemInterface> {
    return this.swapService.getSwap(
      chainId,
      inTokenAddress,
      outTokenAddress,
      inAmount,
      slippage,
      account,
      gasPrice,
      provider
    );
  }
}
