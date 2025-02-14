'use client';

import { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { Connection, clusterApiUrl } from '@solana/web3.js';

interface NetworkContextType {
  network: WalletAdapterNetwork;
  setNetwork: (network: WalletAdapterNetwork) => void;
  endpoint: string;
  connection: Connection;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

const QUICKNODE_RPC = "https://delicate-side-moon.solana-mainnet.quiknode.pro/c7831bf3202f0a2fe03e4fcc55f7e9c84e2bd8ec";

const getEndpoint = (network: WalletAdapterNetwork) => 
  network === WalletAdapterNetwork.Mainnet ? QUICKNODE_RPC : clusterApiUrl(network);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [network, setNetwork] = useState<WalletAdapterNetwork>(WalletAdapterNetwork.Devnet);
  const router = useRouter();

  useEffect(() => {
    // Redirect only when network changes, not on initial mount
    const handleNetworkChange = () => {
      router.push('/token-creator');
    };

    // Skip initial mount
    if (network !== WalletAdapterNetwork.Devnet) {
      handleNetworkChange();
    }
  }, [network, router]);

  const endpoint = useMemo(() => getEndpoint(network), [network]);
  
  const connection = useMemo(() => 
    new Connection(endpoint, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000
    }), 
    [endpoint]
  );

  return (
    <NetworkContext.Provider value={{ network, setNetwork, endpoint, connection }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
}
