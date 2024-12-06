export const MAX_VIRTUAL_RESERVES = 30; // 30 SOL max virtual reserves

export interface BondingCurveConfig {
  virtualReserves: number;
  initialPrice: number;
  slope: number;
}

export class BondingCurve {
  private virtualReserves: number;
  private initialPrice: number;
  private slope: number;

  constructor(config: BondingCurveConfig) {
    this.virtualReserves = Math.min(config.virtualReserves, MAX_VIRTUAL_RESERVES);
    this.initialPrice = config.initialPrice;
    this.slope = config.slope;
  }

  // Calculate price based on current supply
  calculatePrice(currentSupply: number): number {
    return this.initialPrice + (this.slope * currentSupply);
  }

  // Calculate amount of tokens to mint for given SOL amount
  calculateTokenAmount(solAmount: number, currentSupply: number): number {
    const currentPrice = this.calculatePrice(currentSupply);
    return solAmount / currentPrice;
  }

  // Calculate SOL needed for desired token amount
  calculateSolNeeded(tokenAmount: number, currentSupply: number): number {
    const startPrice = this.calculatePrice(currentSupply);
    const endPrice = this.calculatePrice(currentSupply + tokenAmount);
    const averagePrice = (startPrice + endPrice) / 2;
    return tokenAmount * averagePrice;
  }

  // Get virtual reserves
  getVirtualReserves(): number {
    return this.virtualReserves;
  }

  // Convert lamports to SOL
  static lamportsToSol(lamports: number): number {
    return lamports / 1e9;
  }

  // Convert SOL to lamports
  static solToLamports(sol: number): number {
    return sol * 1e9;
  }
}

export const createDefaultBondingCurve = (): BondingCurve => {
  return new BondingCurve({
    virtualReserves: MAX_VIRTUAL_RESERVES,
    initialPrice: 0.001, // Initial price in SOL
    slope: 0.0001, // Price increase per token
  });
};
