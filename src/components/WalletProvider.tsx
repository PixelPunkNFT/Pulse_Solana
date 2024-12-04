'use client';

import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { 
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
  CloverWalletAdapter,
  SolongWalletAdapter,
  AlphaWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { FC, useMemo } from 'react';
import { useNetwork } from '../context/NetworkContext';
import dynamic from 'next/dynamic';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const CustomWalletButton = () => {
  const { publicKey } = useWallet();
  
  return (
    <WalletMultiButtonDynamic className="wallet-adapter-button-trigger">
      {publicKey ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}` : 'Connect Wallet'}
    </WalletMultiButtonDynamic>
  );
};

interface ClientWalletProviderProps {
  children: React.ReactNode;
}

export const ClientWalletProvider: FC<ClientWalletProviderProps> = ({ children }) => {
  const { connection } = useNetwork();

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new CloverWalletAdapter(),
      new SolongWalletAdapter(),
      new AlphaWalletAdapter()
    ],
    []
  );

  if (!connection) {
    return null;
  }

  return (
    <ConnectionProvider endpoint={connection.rpcEndpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <style jsx global>{`
            .wallet-adapter-button {
              background-color: rgb(124 58 237) !important;
              border-radius: 0.5rem !important;
              height: 3rem !important;
              padding-left: 1.5rem !important;
              padding-right: 1.5rem !important;
              font-weight: 600 !important;
              transition: all 0.2s !important;
              border: none !important;
              color: white !important;
              font-size: 1rem !important;
              cursor: pointer !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
            }
            .wallet-adapter-button:hover {
              background-color: rgb(109 40 217) !important;
            }
            .wallet-adapter-button:not([disabled]):hover {
              background-color: rgb(109 40 217) !important;
            }
            .wallet-adapter-button-trigger {
              background-color: rgb(124 58 237) !important;
            }
            .wallet-adapter-button:after {
              content: none !important;
            }
            .wallet-adapter-modal-wrapper {
              background-color: rgb(17 24 39) !important;
            }
            .wallet-adapter-modal-button-close {
              background-color: rgb(31 41 55) !important;
            }
            .wallet-adapter-modal-title {
              color: white !important;
            }
            .wallet-adapter-modal-list {
              margin: 0 0 4px !important;
            }
            .wallet-adapter-modal-list li:not(:first-of-type) {
              margin-top: 4px !important;
            }
            .wallet-adapter-modal-list-more {
              color: rgb(156 163 175) !important;
              margin: 16px 0 0 !important;
            }
            .wallet-adapter-dropdown {
              display: flex;
              justify-content: center;
            }
            .wallet-adapter-dropdown-list {
              background: rgb(17 24 39) !important;
            }
            .wallet-adapter-dropdown-list-item {
              color: white !important;
            }
          `}</style>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export { CustomWalletButton };
