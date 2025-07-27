import { Controller, Get } from '@midwayjs/core';

import { OPENOCEAN_SUPPORTED_CHAINS } from '../../constant';

@Controller('/v1/swap')
export class SwapController {
  @Get('/chains')
  getChains() {
    return OPENOCEAN_SUPPORTED_CHAINS;
  }
}
