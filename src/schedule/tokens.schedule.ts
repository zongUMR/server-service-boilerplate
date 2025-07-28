/**
 * This Schedule is used to manage token-related tasks. Fetch tokens from different providers by chainId and store them in the database.
 */

import { IProcessor, Processor } from '@midwayjs/bullmq';
import { FORMAT, Inject } from '@midwayjs/core';

import { OPENOCEAN_SUPPORTED_CHAINS } from '../constant';
import { DbService } from '../entity/common/db.service';
import { OpenOceanService } from '../entity/providers/openocean.service';
import { Provider } from '../types/swap.type';

@Processor('Tokens', {
  repeat: {
    pattern: FORMAT.CRONTAB.EVERY_DAY, // execute every day
  },
})
export class TokensProcessor implements IProcessor {
  @Inject()
  openOceanService: OpenOceanService;

  @Inject()
  dbService: DbService;

  async execute(): Promise<any> {
    const chainIds = OPENOCEAN_SUPPORTED_CHAINS.map(chain => chain.id);
    const providers: Provider[] = ['openOcean']; // Add more providers as needed

    console.log(
      `Fetching tokens for chains: ${chainIds.join(
        ', '
      )} from providers: ${providers.join(', ')}`
    );
    for (const chainId of chainIds) {
      for (const provider of providers) {
        switch (provider) {
          case 'openOcean': {
            const tokens = await this.openOceanService.getTokensFromChainId(
              chainId
            );
            await this.dbService.updateTokensForChain(
              chainId,
              provider,
              tokens
            );
            break;
          }
          // Add more providers as needed
          default:
            throw new Error(`Provider ${provider} is not supported`);
        }
      }
    }

    console.log(
      `Successfully fetched and stored tokens for chains: ${chainIds.join(
        ', '
      )} from providers: ${providers.join(', ')}`
    );
    return null;
  }
}
