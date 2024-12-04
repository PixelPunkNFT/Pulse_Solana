'use client';

import { ClientWalletProvider } from './WalletProvider';
import { NetworkProvider } from '../context/NetworkContext';
import { ToastProvider } from './Toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NetworkProvider>
      <ClientWalletProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </ClientWalletProvider>
    </NetworkProvider>
  );
}
