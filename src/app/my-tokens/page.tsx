'use client';

import Link from 'next/link';
import { useNetwork } from '../../context/NetworkContext';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect, useCallback } from 'react';
import { TokenManager } from '../../components/TokenManager';
import { getUserTokens } from '../../utils/tokenManagement';
import { useConnection } from '@solana/wallet-adapter-react';
import { TokenData } from '../../types/token';
import { } from '../../utils/tokenStorage';
import { useToast } from '../../components/Toast';
import { CustomWalletButton } from '../../components/WalletProvider';

export default function MyTokensPage() {
  const { network } = useNetwork();
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadTokens = useCallback(async () => {
    if (!publicKey || !connection) {
      setTokens([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Loading tokens for wallet:', publicKey.toString());
      
      // Get all token data in a single call
      const userTokens = await getUserTokens(connection, publicKey);
      setTokens(userTokens);
    } catch (error) {
      console.error('Error loading tokens:', error);
      showToast('Failed to load tokens', 'error');
    } finally {
      setLoading(false);
    }
  }, [publicKey, connection, showToast]);

  useEffect(() => {
    if (publicKey && connection) {
      loadTokens();
    }
  }, [loadTokens, publicKey, connection]);

  return (
    <div className="min-h-screen">
      <main className="relative pt-16 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between mb-4">
            <Link
              href="/token-creator"
              className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg text-sm flex items-center space-x-2 border border-gray-700/50 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Creator</span>
            </Link>
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

          <header className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
              My Pulse
            </h1>
            <p className="text-xl text-gray-400">
              Manage your created tokens
            </p>
          </header>

          {!publicKey ? (
            <div className="text-center">
              <p className="text-gray-400 mb-4">Connect your wallet to view your tokens</p>
              <div className="flex justify-center">
                <CustomWalletButton />
              </div>
            </div>
          ) : loading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <p className="text-gray-400 mt-4">Loading your tokens...</p>
            </div>
          ) : tokens.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-400 mb-4">You haven&apos;t created any tokens yet</p>
              <Link
                href="/token-creator"
                className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-all"
              >
                Create Your First Token
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {tokens.map((token) => (
                <TokenManager
                  key={token.mintAddress}
                  token={token}
                  onUpdate={loadTokens}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
