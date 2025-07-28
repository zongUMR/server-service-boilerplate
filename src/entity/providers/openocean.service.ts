import { Provide } from '@midwayjs/core';

import {
  GasPriceItem,
  QuoteItemInterface,
  TokenItemInterface,
} from '../../types/swap.type';

import { BaseProvider } from './base.provider';

@Provide()
export class OpenOceanService extends BaseProvider implements BaseProvider {
  baseUrl = 'https://open-api.openocean.finance/v4';

  constructor() {
    super('openOcean');
  }

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

  async getGasPrice(chainId: string): Promise<GasPriceItem> {
    const data = await fetch(`${this.baseUrl}/${chainId}/gasPrice`).then(res =>
      res.json()
    );

    let standardGasPrice = 0;
    let standardWaitTimeEstimate = 0;
    let fastGasPrice = 0;
    let fastWaitTimeEstimate = 0;
    let instanceGasPrice = 0;
    let instanceWaitTimeEstimate = 0;

    // the format of eth is different from other chains
    if (chainId === '1') {
      standardGasPrice = data.data.standard.maxPriorityFeePerGas;
      standardWaitTimeEstimate = data.data.standard.waitTimeEstimate;
      fastGasPrice = data.data.fast.maxPriorityFeePerGas;
      fastWaitTimeEstimate = data.data.fast.waitTimeEstimate;
      instanceGasPrice = data.data.instant.maxPriorityFeePerGas;
      instanceWaitTimeEstimate = data.data.instant.waitTimeEstimate;
    } else {
      standardGasPrice = data.data.standard;
      fastGasPrice = data.data.fast;
      instanceGasPrice = data.data.instant;
    }

    return {
      chainId,
      standard: {
        gasPrice: standardGasPrice,
        waitTimeEstimate: standardWaitTimeEstimate,
      },
      fast: {
        gasPrice: fastGasPrice,
        waitTimeEstimate: fastWaitTimeEstimate,
      },
      instant: {
        gasPrice: instanceGasPrice,
        waitTimeEstimate: instanceWaitTimeEstimate,
      },
    };
  }

  async getQuoteDetailWithGasPrice(
    chainId: string,
    inTokenAddress: string,
    outTokenAddress: string,
    amount: string,
    slippage: string,
    gasPrice: {
      gasPrice: number;
      waitTimeEstimate?: number;
    }
  ): Promise<QuoteItemInterface> {
    const swapData = await fetch(
      `${this.baseUrl}/${chainId}/quote?inTokenAddress=${inTokenAddress}&outTokenAddress=${outTokenAddress}&amountDecimals=${amount}&gasPriceDecimals=${gasPrice.gasPrice}&slippage=${slippage}`,
      {
        method: 'GET',
      }
    ).then(res => res.json());

    const data = swapData.data;

    return {
      provider: this.name,
      chainId,
      inTokenAddress,
      outTokenAddress,
      estimatedGasPrice: data.estimatedGas,
      outAmount: data.outAmount,
      inAmount: amount,
      slippage,
      waitTimeEstimate: gasPrice.waitTimeEstimate,
    };
  }

  async getQuote(
    chainId: string,
    inTokenAddress: string,
    outTokenAddress: string,
    amount: string,
    slippage: string
  ): Promise<QuoteItemInterface[]> {
    const gasPrice = await this.getGasPrice(chainId);

    const data = await Promise.allSettled([
      // standard gas price
      this.getQuoteDetailWithGasPrice(
        chainId,
        inTokenAddress,
        outTokenAddress,
        amount,
        slippage,
        gasPrice.standard
      ),
      // fast gas price
      this.getQuoteDetailWithGasPrice(
        chainId,
        inTokenAddress,
        outTokenAddress,
        amount,
        slippage,
        gasPrice.fast
      ),
      // instant gas price
      this.getQuoteDetailWithGasPrice(
        chainId,
        inTokenAddress,
        outTokenAddress,
        amount,
        slippage,
        gasPrice.instant
      ),
    ]);
    return data.map(item => {
      if (item.status === 'fulfilled') {
        return item.value;
      }
    });
  }
}
