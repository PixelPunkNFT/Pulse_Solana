'use client';

import { FC, useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TokenData } from '../types/token';
import { burnToken, removeMintAuthority, toggleFreezeAccount } from '../utils/tokenManagement';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { useToast } from './Toast';
import Link from 'next/link';
import Image from 'next/image';

interface TokenManagerProps {
  token: TokenData;
  onUpdate: () => void;
}

export const TokenManager: FC<TokenManagerProps> = ({ token, onUpdate }) => {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
  const explorerUrl = `https://explorer.solana.com/address/${token.mintAddress}?cluster=${network}`;
  const raydiumLiquidityUrl = `https://raydium.io/liquidity/add/?inputCurrency=SOL&outputCurrency=${token.mintAddress}`;

  const handleBurnToken = useCallback(async () => {
    if (!publicKey || !signTransaction) return;
    if (!confirm('Sei sicuro di voler bruciare questo token? Questa azione non può essere annullata.')) return;

    setIsLoading(true);
    try {
      await burnToken(connection, token.mintAddress, publicKey, signTransaction);
      showToast('🔥 Token bruciato con successo', 'success');
      onUpdate();
    } catch (error) {
      console.error('Error burning token:', error);
      showToast(
        <div className="flex items-center space-x-2">
          <span>❌</span>
          <span>{error instanceof Error ? error.message : 'Errore nel bruciare il token'}</span>
        </div>,
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  }, [connection, token.mintAddress, publicKey, signTransaction, showToast, onUpdate]);

  const handleRemoveMintAuthority = useCallback(async () => {
    if (!publicKey || !signTransaction) return;
    if (!confirm('Sei sicuro di voler rimuovere l\'autorità di minting? Questa azione non può essere annullata.')) return;

    setIsLoading(true);
    try {
      await removeMintAuthority(connection, token.mintAddress, publicKey, signTransaction);
      showToast('🔒 Autorità di minting rimossa con successo', 'success');
      onUpdate();
    } catch (error) {
      console.error('Error removing mint authority:', error);
      showToast(
        <div className="flex items-center space-x-2">
          <span>❌</span>
          <span>{error instanceof Error ? error.message : 'Errore nella rimozione dell\'autorità di minting'}</span>
        </div>,
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  }, [connection, token.mintAddress, publicKey, signTransaction, showToast, onUpdate]);

  const handleToggleFreeze = useCallback(async () => {
    if (!publicKey || !signTransaction) return;
    setIsLoading(true);
    try {
      const associatedTokenAccount = await getAssociatedTokenAddress(
        new PublicKey(token.mintAddress),
        publicKey
      );

      await toggleFreezeAccount(
        connection,
        token.mintAddress,
        associatedTokenAccount.toString(),
        publicKey,
        signTransaction,
        !token.isFrozen
      );
      showToast(
        token.isFrozen 
          ? '🌞 Token scongelato con successo'
          : '❄️ Token congelato con successo',
        'success'
      );
      onUpdate();
    } catch (error) {
      console.error('Error toggling freeze:', error);
      showToast(
        <div className="flex items-center space-x-2">
          <span>❌</span>
          <span>{error instanceof Error ? error.message : 'Errore nel modificare lo stato di congelamento'}</span>
        </div>,
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  }, [connection, token.mintAddress, token.isFrozen, publicKey, signTransaction, showToast, onUpdate]);

  const formatSupply = (supply: number, decimals: number) => {
    const actualSupply = supply / Math.pow(10, decimals);
    return actualSupply.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    });
  };

  return (
    <div className="relative group">
      <div className="bg-gray-800/20 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 group-hover:border-primary-500/30 transition-all duration-500 transform hover:scale-105 group-hover:z-10 group-hover:shadow-2xl group-hover:shadow-primary-500/10 hover:bg-gray-800/30">
        <div className="flex items-center space-x-4 mb-6">
          {token.imageUrl && (
            <div className="relative w-16 h-16">
              <Image
                src={token.imageUrl}
                alt={token.name}
                fill
                className="rounded-xl object-cover ring-2 ring-primary-500/10 group-hover:ring-primary-500/30 transition-all duration-500"
              />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-1 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">{token.name}</h3>
            <p className="text-sm text-gray-400 font-mono">{token.symbol}</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-xs text-gray-400 mb-1">Total Supply</p>
            <p className="text-sm text-gray-300 font-mono">
              {formatSupply(token.supply, token.decimals)} {token.symbol}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Mint Address</p>
            <p className="text-sm text-gray-300 font-mono truncate">
              {token.mintAddress}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Status</p>
            <div className="flex gap-2">
              <span className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm transition-all duration-300 ${
                token.hasAuthority 
                ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30' 
                : 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/30'
              }`}>
                {token.hasAuthority ? 'Mintable' : 'Not Mintable'}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm transition-all duration-300 ${
                token.isFrozen 
                ? 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/30' 
                : 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30'
              }`}>
                {token.isFrozen ? 'Frozen' : 'Active'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/button relative px-2.5 py-2 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 rounded-lg text-xs flex items-center justify-between space-x-1 transition-all duration-300 backdrop-blur-sm ring-1 ring-violet-500/30 hover:ring-violet-500/50 transform hover:translate-x-1"
          >
            <span className="font-medium">Explorer</span>
            <div className="relative w-4 h-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group-hover/button:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </a>

          <a
            href={raydiumLiquidityUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/button relative px-2.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs flex items-center justify-between space-x-1 transition-all duration-300 backdrop-blur-sm ring-1 ring-emerald-500/30 hover:ring-emerald-500/50 transform hover:translate-x-1"
          >
            <span className="font-medium">Liquidity</span>
            <div className="relative w-4 h-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group-hover/button:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </a>

          <Link
            href={`/token-stats/${token.mintAddress}`}
            className="group/button relative px-2.5 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-xs flex items-center justify-between space-x-1 transition-all duration-300 backdrop-blur-sm ring-1 ring-blue-500/30 hover:ring-blue-500/50 transform hover:translate-x-1"
          >
            <span className="font-medium">Stats</span>
            <div className="relative w-4 h-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group-hover/button:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </Link>

          <button
            onClick={handleToggleFreeze}
            disabled={isLoading || !token.hasAuthority}
            className={`group/button relative px-2.5 py-2 rounded-lg text-xs flex items-center justify-between space-x-1 transition-all duration-300 backdrop-blur-sm transform hover:translate-x-1 ${
              isLoading
                ? 'bg-gray-500/10 text-gray-400 ring-1 ring-gray-500/30 cursor-not-allowed'
                : token.isFrozen
                ? 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/30 hover:ring-cyan-500/50'
                : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/30 hover:ring-cyan-500/50'
            }`}
          >
            <span className="font-medium">{isLoading ? '...' : token.isFrozen ? 'Unfreeze' : 'Freeze'}</span>
            <div className="relative w-4 h-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group-hover/button:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </button>

          {token.hasAuthority && (
            <button
              onClick={handleRemoveMintAuthority}
              disabled={isLoading}
              className={`group/button relative px-2.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg text-xs flex items-center justify-between space-x-1 transition-all duration-300 backdrop-blur-sm ring-1 ring-amber-500/30 hover:ring-amber-500/50 transform hover:translate-x-1 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span className="font-medium">{isLoading ? '...' : 'Remove'}</span>
              <div className="relative w-4 h-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group-hover/button:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </button>
          )}

          <button
            onClick={handleBurnToken}
            disabled={isLoading}
            className={`group/button relative px-2.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs flex items-center justify-between space-x-1 transition-all duration-300 backdrop-blur-sm ring-1 ring-rose-500/30 hover:ring-rose-500/50 transform hover:translate-x-1 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className="font-medium">{isLoading ? '...' : 'Burn'}</span>
            <div className="relative w-4 h-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group-hover/button:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
