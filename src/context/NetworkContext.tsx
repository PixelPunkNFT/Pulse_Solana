'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [network, setNetwork] = useState<WalletAdapterNetwork>(WalletAdapterNetwork.Devnet);
  const [endpoint, setEndpoint] = useState(clusterApiUrl(WalletAdapterNetwork.Devnet));
  const [connection, setConnection] = useState(new Connection(clusterApiUrl(WalletAdapterNetwork.Devnet)));

  useEffect(() => {
    // Usa QuickNode RPC per mainnet e l'endpoint pubblico per devnet
    const newEndpoint = network === WalletAdapterNetwork.Mainnet 
      ? QUICKNODE_RPC 
      : clusterApiUrl(network);
    
    setEndpoint(newEndpoint);
    const newConnection = new Connection(newEndpoint, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000, // 60 secondi di timeout
    });
    setConnection(newConnection);

    console.log('Network changed:', {
      network,
      endpoint: newEndpoint
    });
  }, [network]);

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
