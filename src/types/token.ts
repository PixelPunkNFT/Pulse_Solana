export interface TokenData {
  mintAddress: string;
  name: string;
  symbol: string;
  imageUrl: string;
  supply: number;
  decimals: number;
  isFrozen: boolean;
  hasAuthority: boolean;
}
