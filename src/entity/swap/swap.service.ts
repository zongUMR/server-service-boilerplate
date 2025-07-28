import { Inject, Provide } from '@midwayjs/core';

import { DbService } from '../common/db.service';
import { TokenItemInterface } from '../../types/swap.type';
import { OpenOceanService } from '../providers/openocean.service';

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
}
