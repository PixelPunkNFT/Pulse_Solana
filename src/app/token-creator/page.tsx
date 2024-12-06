'use client';

import { TokenCreator } from '../../components/TokenCreator';
import Link from 'next/link';
import { useNetwork } from '../../context/NetworkContext';
import { CustomWalletButton } from '../../components/WalletProvider';

export default function TokenCreatorPage() {
  const { network } = useNetwork();

  return (
    <div className="min-h-screen">
      <main className="relative pt-16 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between mb-4">
            <div className="flex space-x-4">
              <Link
                href="/"
                className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg text-sm flex items-center space-x-2 border border-gray-700/50 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Home</span>
              </Link>
              <Link
                href="/my-tokens"
                className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg text-sm flex items-center space-x-2 border border-gray-700/50 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span>My Tokens</span>
              </Link>
            </div>
            <Link
              href="/config"
              className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg text-sm flex items-center space-x-2 border border-gray-700/50 transition-all"
            >
              <span>Network: {network}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
          </div>

          <div className="flex justify-center mb-8">
            <CustomWalletButton />
          </div>

          <header className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
              Create Pulse
            </h1>
            <p className="text-xl text-gray-400">
              Create your own token on Solana
            </p>
          </header>

          <TokenCreator />
        </div>
      </main>
    </div>
  );
}
