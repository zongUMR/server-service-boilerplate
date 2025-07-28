import { Controller, Get, Inject, Param, Query } from '@midwayjs/core';

import { OPENOCEAN_SUPPORTED_CHAINS } from '../../constant';
import { SwapService } from './swap.service';
import {
  ChainItemInterface,
  QuoteItemInterface,
  TokenItemInterface,
} from '../../types/swap.type';

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
}
