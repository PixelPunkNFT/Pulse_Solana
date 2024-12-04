'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { useNetwork } from '../../context/NetworkContext';
import Link from 'next/link';
import { useToast } from '../../components/Toast';

export default function ConfigPage() {
  const { network, setNetwork } = useNetwork();
  const { showToast } = useToast();

  const handleNetworkChange = (newNetwork: WalletAdapterNetwork) => {
    if (newNetwork === network) return;
    
    showToast(
      <div className="flex flex-col space-y-2">
        <div className="font-bold">🔄 Cambio rete in corso...</div>
        <div className="text-sm">
          Passaggio a {newNetwork}. La pagina verrà ricaricata.
        </div>
      </div>,
      'info'
    );

    // Breve delay per permettere al toast di essere mostrato
    setTimeout(() => {
      setNetwork(newNetwork);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-xl p-8 border border-gray-700">
            <h1 className="text-2xl font-bold text-white mb-6">Configurazione Rete</h1>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-4">Seleziona Rete</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleNetworkChange(WalletAdapterNetwork.Mainnet)}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      network === WalletAdapterNetwork.Mainnet
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/20'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {network === WalletAdapterNetwork.Mainnet && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      <span>Mainnet</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleNetworkChange(WalletAdapterNetwork.Devnet)}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      network === WalletAdapterNetwork.Devnet
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/20'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {network === WalletAdapterNetwork.Devnet && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      <span>Devnet</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-gray-400 text-sm mb-4">
                  Rete Attuale: <span className="text-primary-400 font-medium">{network}</span>
                </p>
                <div className="bg-gray-700/30 rounded-lg p-4 text-sm text-gray-300">
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Quando cambi rete:
                  </p>
                  <ul className="ml-7 mt-2 list-disc space-y-1 text-gray-400">
                    <li>La pagina verrà ricaricata automaticamente</li>
                    <li>Dovrai riconnettere il wallet</li>
                    <li>I token verranno creati sulla nuova rete selezionata</li>
                  </ul>
                </div>
              </div>

              <Link
                href="/"
                className="block w-full px-6 py-3 text-center bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-primary-500/20"
              >
                Torna al Token Creator
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
