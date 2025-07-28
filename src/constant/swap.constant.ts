import { ChainItemInterface } from '../types/swap.type';

// full list here: https://apis.openocean.finance/developer/apis/supported-chains#swap-api-supported-chains
// TOOD: add more chains as needed from above link
export const OPENOCEAN_SUPPORTED_CHAINS: Array<ChainItemInterface> = [
  {
    name: 'Ethereum',
    code: 'eth',
    id: '1',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  },
  {
    name: 'BNB Chain',
    code: 'bsc',
    id: '56',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  },
  {
    name: 'Base',
    code: 'base',
    id: '8453',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  },
];
