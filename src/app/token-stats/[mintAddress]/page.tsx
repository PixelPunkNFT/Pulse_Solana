'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function TokenStatsPage() {
  const params = useParams();
  const { mintAddress } = params;
  const [hasLiquidity, setHasLiquidity] = useState(false);

  // TODO: Implementare la logica per verificare la liquidità su Raydium
  useEffect(() => {
    // Qui andrà la logica per controllare la liquidità
  }, [mintAddress]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-radial from-primary-500/10 via-transparent to-transparent pointer-events-none" />
        
        <main className="relative pt-16 pb-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <Link
                href="/my-tokens"
                className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg text-sm flex items-center space-x-2 border border-gray-700/50 transition-all w-fit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Torna ai Token</span>
              </Link>
            </div>

            <header className="text-center mb-16">
              <h1 className="text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
                Statistiche Token
              </h1>
              <p className="text-xl text-gray-400">
                {mintAddress as string}
              </p>
            </header>

            <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              {!hasLiquidity ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">
                    Le statistiche saranno disponibili dopo che sarà aggiunta liquidità su Raydium
                  </p>
                  <a
                    href={`https://raydium.io/liquidity/add/?inputCurrency=SOL&outputCurrency=${mintAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg font-semibold transition-all"
                  >
                    Aggiungi Liquidità su Raydium
                  </a>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center">
                  {/* Qui andrà il grafico quando ci sarà liquidità */}
                  <p className="text-gray-400">Grafico in arrivo...</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
