'use client';

import { FC, useState, useCallback, useRef, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { createToken } from '../utils/tokenCreation';
import { uploadToPinata, uploadMetadataJson } from '../utils/imageUpload';
import { useToast } from './Toast';
import { useNetwork } from '../context/NetworkContext';
import { Transaction } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { CustomWalletButton } from './WalletProvider';
import Image from 'next/image';

export const TokenCreator: FC = () => {
  const { publicKey, signTransaction, wallet } = useWallet();
  const { network, setNetwork, connection } = useNetwork();
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [totalSupply, setTotalSupply] = useState('1000000000'); // Default 1 billion
  const [isCreating, setIsCreating] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  // Sincronizza la rete con il wallet
  useEffect(() => {
    const syncNetwork = async () => {
      if (wallet?.adapter) {
        try {
          // @ts-expect-error - Phantom wallet specific
          const provider = wallet.adapter._provider;
          if (provider) {
            // Ottieni la rete direttamente da Phantom
            const phantomNetwork = await provider.request({ method: 'solana-network' });
            const newNetwork = phantomNetwork === 'mainnet-beta' ? 
              WalletAdapterNetwork.Mainnet : 
              WalletAdapterNetwork.Devnet;
            
            if (network !== newNetwork) {
              console.log('Syncing network with wallet:', newNetwork);
              setNetwork(newNetwork);
            }
          }
        } catch (error) {
          console.error('Error syncing network:', error);
        }
      }
    };

    syncNetwork();
  }, [wallet?.adapter, network, setNetwork]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('🚫 L\'immagine deve essere inferiore a 5MB', 'error');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateInput = useCallback(() => {
    if (!tokenName.trim()) {
      showToast('⚠️ Inserisci il nome del token', 'error');
      return false;
    }
    if (!tokenSymbol.trim()) {
      showToast('⚠️ Inserisci il simbolo del token', 'error');
      return false;
    }
    if (!imageFile) {
      showToast('⚠️ Seleziona un\'immagine per il token', 'error');
      return false;
    }
    if (!totalSupply || isNaN(Number(totalSupply)) || Number(totalSupply) <= 0) {
      showToast('⚠️ Inserisci una total supply valida', 'error');
      return false;
    }
    if (!publicKey) {
      showToast('🔗 Connetti il wallet per creare il token', 'error');
      return false;
    }
    if (!signTransaction) {
      showToast('🔗 Il wallet non supporta la firma delle transazioni', 'error');
      return false;
    }
    if (!connection) {
      showToast(`⚠️ Impossibile connettersi alla rete ${network}`, 'error');
      return false;
    }
    return true;
  }, [tokenName, tokenSymbol, imageFile, totalSupply, publicKey, signTransaction, connection, network, showToast]);

  const handleCreateToken = useCallback(async () => {
    if (!validateInput()) return;
    if (!publicKey || !signTransaction || !imageFile || !connection || !wallet?.adapter) return;

    try {
      setIsCreating(true);

      // Verifica che la rete del wallet corrisponda
      // @ts-expect-error - Phantom wallet specific
      const provider = wallet.adapter._provider;
      if (provider) {
        const phantomNetwork = await provider.request({ method: 'solana-network' });
        const walletNetwork = phantomNetwork === 'mainnet-beta' ? 
          WalletAdapterNetwork.Mainnet : 
          WalletAdapterNetwork.Devnet;

        if (network !== walletNetwork) {
          showToast(
            `⚠️ La rete del wallet (${phantomNetwork}) non corrisponde alla rete selezionata (${network}). Cambia la rete nel wallet.`,
            'error'
          );
          return;
        }
      }

      // Step 1: Upload image to Pinata and get the complete URL
      showToast('🖼️ Caricamento immagine in corso...', 'info');
      const imageUrl = await uploadToPinata(imageFile);
      console.log('Image URL:', imageUrl);

      // Step 2: Create metadata.json with image URL in uri field and upload to Pinata
      showToast('📝 Creazione metadata in corso...', 'info');
      const metadataUrl = await uploadMetadataJson(
        tokenName,
        tokenSymbol.toUpperCase(),
        imageUrl
      );
      console.log('Metadata URL:', metadataUrl);

      // Step 3: Create token using metadata URL
      showToast(`🪙 Creazione token sulla rete ${network} in corso...`, 'info');
      const signTransactionWrapper = async (transaction: Transaction): Promise<Transaction> => {
        const signed = await signTransaction(transaction);
        return signed as Transaction;
      };

      const { mintAddress, signature } = await createToken(
        connection,
        publicKey,
        tokenName,
        tokenSymbol.toUpperCase(),
        metadataUrl,
        signTransactionWrapper,
        Number(totalSupply)
      );

      console.log('Token created:', {
        mintAddress,
        signature,
        imageUrl,
        metadataUrl,
        network
      });

      // Reset form
      setTokenName('');
      setTokenSymbol('');
      setTotalSupply('1000000000');
      setImageFile(null);
      setImagePreview(null);

      // Create explorer URL
      const explorerUrl = `https://explorer.solana.com/address/${mintAddress}?cluster=${network}`;

      // Show success message with link
      showToast(
        <div className="flex flex-col space-y-2">
          <div className="font-bold">🎉 Token creato con successo!</div>
          <div>
            Visualizza su{' '}
            <a 
              href={explorerUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
              onClick={(e) => e.stopPropagation()}
            >
              Solana Explorer
            </a>
          </div>
          <div className="text-xs opacity-75 break-all">
            <span className="font-semibold">Network:</span> {network}
          </div>
          <div className="text-xs opacity-75 break-all">
            <span className="font-semibold">Mint Address:</span> {mintAddress}
          </div>
          <div className="text-xs opacity-75 break-all">
            <span className="font-semibold">Image URL:</span> {imageUrl}
          </div>
          <div className="text-xs opacity-75 break-all">
            <span className="font-semibold">Metadata URL:</span> {metadataUrl}
          </div>
        </div>,
        'success'
      );

      // Open explorer in new tab
      window.open(explorerUrl, '_blank');

    } catch (error) {
      console.error('Error creating token:', error);
      let errorMessage = 'Errore nella creazione del token';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to connect')) {
          errorMessage = `Errore di connessione alla rete ${network}. Riprova più tardi.`;
        } else if (error.message.includes('insufficient balance')) {
          errorMessage = 'Saldo insufficiente per creare il token';
        } else if (error.message.includes('Transaction failed')) {
          errorMessage = 'Transazione fallita. Verifica il saldo e riprova.';
        } else if (error.message.includes('User rejected')) {
          errorMessage = 'Transazione rifiutata dall\'utente';
        } else if (error.message.includes('403')) {
          errorMessage = `Errore di accesso alla rete ${network}. Riprova più tardi.`;
        } else {
          errorMessage = error.message;
        }
      }

      showToast(
        <div className="flex items-center space-x-2">
          <span>❌</span>
          <span>{errorMessage}</span>
        </div>,
        'error'
      );
    } finally {
      setIsCreating(false);
    }
  }, [publicKey, signTransaction, connection, tokenName, tokenSymbol, totalSupply, imageFile, showToast, network, wallet, validateInput]);

  if (!publicKey) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="text-center text-gray-400 mb-4">
          Connetti il wallet per creare un token
        </div>
        <CustomWalletButton />
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-xl p-8 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6">Create Token</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Token Name</label>
          <input
            type="text"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="Enter token name"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Token Symbol</label>
          <input
            type="text"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="Enter token symbol"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Total Supply</label>
          <input
            type="number"
            value={totalSupply}
            onChange={(e) => setTotalSupply(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="Enter total supply"
            min="1"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Token Image</label>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-all"
            >
              Choose Image
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            {imagePreview && (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Token preview"
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-400">Max size: 5MB</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm mb-4">Network: {network}</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleCreateToken}
            disabled={isCreating || !tokenName || !tokenSymbol || !imageFile}
            className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
              isCreating || !tokenName || !tokenSymbol || !imageFile
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            {isCreating ? 'Creating Token...' : 'Create Token'}
          </button>
        </div>
      </div>
    </div>
  );
};
