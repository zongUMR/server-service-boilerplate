import { Inject, Provide } from '@midwayjs/core';

import {
  Provider,
  TokenItemInterface,
  TokenItemWithSupportedProviderInterface,
} from '../../types/swap.type';
import { TokenModel } from '../swap/swap.entity';

@Provide()
export class DbService {
  @Inject('TokenSchema')
  tokenModel: typeof TokenModel;

  async getTokenByChainIdAndAddress(
    chainId: string,
    address: string
  ): Promise<TokenItemWithSupportedProviderInterface | null> {
    const token = await this.tokenModel.findOne({
      chainId,
      address,
    });
    if (token) {
      return {
        id: token.id,
        logo: token.logo,
        address: token.address,
        symbol: token.symbol,
        decimals: token.decimals,
        name: token.name,
        supportedProviders: token.supportedProviders,
      };
    }
    return null;
  }
  async getTokensByChainId(
    chainId: string,
    tokenName?: string
  ): Promise<TokenItemInterface[]> {
    const searchQuery = {
      chainId,
    };
    // this will search for name and symbol fields in the database, case-sensitive
    if (tokenName) {
      searchQuery['$text'] = { $search: tokenName };
    }
    const data = await this.tokenModel.find(searchQuery);

    return data.map(token => ({
      id: token.id,
      logo: token.logo,
      address: token.address,
      symbol: token.symbol,
      decimals: token.decimals,
      name: token.name,
    }));
  }

  async updateTokensForChain(
    chainId: string,
    provider: Provider,
    tokens: TokenItemInterface[]
  ): Promise<void> {
    const tokensToUBulkWrite = tokens.map(token => {
      return {
        updateOne: {
          filter: {
            chainId,
            address: token.address,
          },
          update: {
            $addToSet: {
              supportedProviders: provider,
            },
            $set: {
              chainId,
              address: token.address,
              symbol: token.symbol,
              name: token.name,
              decimals: token.decimals,
              logo: token.logo,
              provider,
            },
          },
          upsert: true, // If the document does not exist, create it
        },
      };
    });

    await this.tokenModel.bulkWrite(tokensToUBulkWrite, {});
  }
}
