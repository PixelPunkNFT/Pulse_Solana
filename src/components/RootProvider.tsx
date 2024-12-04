'use client';

import { FC, ReactNode } from 'react';
import { NetworkProvider } from '../context/NetworkContext';
import { Providers } from './Providers';

interface RootProviderProps {
  children: ReactNode;
}

export const RootProvider: FC<RootProviderProps> = ({ children }) => {
  return (
    <NetworkProvider>
      <Providers>
        {children}
      </Providers>
    </NetworkProvider>
  );
};
