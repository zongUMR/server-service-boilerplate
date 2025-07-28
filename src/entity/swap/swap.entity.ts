import { Schema, model } from 'mongoose';
const TokenSchema = new Schema(
  {
    chainId: { type: String, required: true },
    address: { type: String, required: true },
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    decimals: { type: Number, required: true },
    logo: { type: String, required: false },
    id: { type: String, required: true },
    supportedProviders: { type: Array, required: true },
  },

  {
    collection: 'Token',
    timestamps: true,
  }
);

// create the unique index for chainId and address to construct a unique token
TokenSchema.index({ chainId: 1, address: 1 }, { unique: true });
// create a text index for name and symbol to support search functionality
TokenSchema.index(
  { name: 'text', symbol: 'text' },
  // to boost the name field in search results, the name field is given a higher weight
  { weights: { name: 5, symbol: 1 } }
);

const TokenModel = model('Token', TokenSchema);

export { TokenSchema, TokenModel };
