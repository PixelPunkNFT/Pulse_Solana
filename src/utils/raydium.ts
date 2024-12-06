import { Connection } from '@solana/web3.js';

interface RaydiumPool {
  baseMint: string;
  quoteMint: string;
}

export async function checkRaydiumLiquidity(
  connection: Connection,
  mintAddress: string
): Promise<boolean> {
  try {
    // Endpoint API di Raydium per i pool di liquidità
    const response = await fetch('https://api.raydium.io/v2/main/pairs');
    const data = await response.json();

    // Verifica se esiste un pool di liquidità per il token
    const hasLiquidity = data.some((pool: RaydiumPool) => 
      pool.baseMint === mintAddress || pool.quoteMint === mintAddress
    );

    return hasLiquidity;
  } catch (error) {
    console.error('Error checking Raydium liquidity:', error);
    return false;
  }
}
