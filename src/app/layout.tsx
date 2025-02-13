import './globals.css';
import { Providers } from '../components/Providers';
import AnimatedBackground from '../components/AnimatedBackground';
import '@solana/wallet-adapter-react-ui/styles.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pulse',
  description: 'Create your own token with bonding curve on Solana',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <AnimatedBackground />
          <div className="relative">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
