import { Provide } from '@midwayjs/core';

import { TokenItemInterface } from '../../types/swap.type';

import { BaseProvider } from './base.provider';

@Provide()
export class OpenOceanService implements BaseProvider {
  baseUrl = 'https://open-api.openocean.finance/v4';

  constructor() {}

  async getTokensFromChainId(chainId: string): Promise<TokenItemInterface[]> {
    const data = await fetch(`${this.baseUrl}/${chainId}/tokenList`).then(res =>
      res.json()
    );

    return (data.data as any).map(
      token =>
        ({
          id: token.id,
          logo: token.logo,
          address: token.address,
          symbol: token.symbol,
          decimals: token.decimals,
          name: token.name,
        } as TokenItemInterface)
    );
  }
}
