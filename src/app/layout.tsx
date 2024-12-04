'use client';

import './globals.css';
import { Providers } from '../components/Providers';
import { ToastProvider } from '../components/Toast';
import AnimatedBackground from '../components/AnimatedBackground';
import '@solana/wallet-adapter-react-ui/styles.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Pulse</title>
        <meta name="description" content="Create your own token with bonding curve on Solana" />
        <link 
          rel="icon" 
          type="image/svg+xml" 
          href="/favicon.svg" 
        />
        <link 
          rel="shortcut icon" 
          type="image/svg+xml" 
          href="/favicon.svg" 
        />
      </head>
      <body>
        <Providers>
          <ToastProvider>
            <AnimatedBackground />
            <div className="relative">
              {children}
            </div>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
