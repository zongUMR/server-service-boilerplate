import { Controller, Get, Inject, Param, Query } from '@midwayjs/core';

import { OPENOCEAN_SUPPORTED_CHAINS } from '../../constant';
import { SwapService } from './swap.service';

@Controller('/swap')
export class SwapController {
  @Inject()
  swapService: SwapService;

  @Get('/chains')
  getChains() {
    return OPENOCEAN_SUPPORTED_CHAINS;
  }

  @Get('/:chainId/tokens')
  async getTokensFromChainId(
    @Param('chainId') chainId: string,
    @Query('tokenName') tokenName?: string
  ) {
    return this.swapService.getTokensFromChainId(chainId, {
      tokenName,
    });
  }
}
