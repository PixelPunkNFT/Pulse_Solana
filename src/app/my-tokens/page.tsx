'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect, useCallback } from 'react';
import { TokenManager } from '../../components/TokenManager';
import { getUserTokens } from '../../utils/tokenManagement';
import { useConnection } from '@solana/wallet-adapter-react';
import { TokenData } from '../../types/token';
import { } from '../../utils/tokenStorage';
import { useToast } from '../../components/Toast';
import Link from 'next/link';

export default function MyTokensPage() {
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
              <p className="text-gray-400 mb-8">Connect your wallet to view your tokens</p>
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
