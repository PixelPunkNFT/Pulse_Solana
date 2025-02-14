'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useNetwork } from '../context/NetworkContext';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export const Navbar = () => {
  const { network, setNetwork } = useNetwork();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNetworkChange = (newNetwork: WalletAdapterNetwork) => {
    setNetwork(newNetwork);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 md:h-16">
          {/* Logo and Name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/pulse-logo.svg"
                alt="Pulse Logo"
                width={24}
                height={24}
                className="mr-2 md:w-[30px] md:h-[30px]"
              />
              <span className="text-white text-lg md:text-xl font-semibold">Pulse</span>
            </Link>
          </div>

          {/* Hamburger Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white p-1.5 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-lg"
            >
              <svg
                className="h-5 w-5 md:h-6 md:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Central Menu - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/token-creator" className="text-gray-300 hover:text-white transition-colors">
              Create Token
            </Link>
            <Link href="/my-tokens" className="text-gray-300 hover:text-white transition-colors">
              My Tokens
            </Link>
            <Link href="/guide" className="text-gray-300 hover:text-white transition-colors">
              Guide
            </Link>
            <Link href="/roadmap" className="text-gray-300 hover:text-white transition-colors">
              Roadmap
            </Link>
          </div>

          {/* Network Selector and Wallet - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <select
              value={network}
              onChange={(e) => handleNetworkChange(e.target.value as WalletAdapterNetwork)}
              className="bg-black/50 text-white border border-white/20 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option value={WalletAdapterNetwork.Devnet}>Devnet</option>
              <option value={WalletAdapterNetwork.Mainnet}>Mainnet</option>
            </select>
            <WalletMultiButtonDynamic />
          </div>
        </div>

        {/* Menu Mobile */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen 
              ? 'max-h-96 opacity-100' 
              : 'max-h-0 opacity-0 overflow-hidden'
          } pb-3 px-4`}
        >
          <div className="flex flex-col space-y-3">
            <Link 
              href="/token-creator" 
              className="text-gray-300 hover:text-white transition-colors py-1.5"
              onClick={() => setIsMenuOpen(false)}
            >
              Create Token
            </Link>
            <Link 
              href="/my-tokens" 
              className="text-gray-300 hover:text-white transition-colors py-1.5"
              onClick={() => setIsMenuOpen(false)}
            >
              My Tokens
            </Link>
            <Link 
              href="/guide" 
              className="text-gray-300 hover:text-white transition-colors py-1.5"
              onClick={() => setIsMenuOpen(false)}
            >
              Guide
            </Link>
            <Link 
              href="/roadmap" 
              className="text-gray-300 hover:text-white transition-colors py-1.5"
              onClick={() => setIsMenuOpen(false)}
            >
              Roadmap
            </Link>
          </div>
          
          {/* Network Selector and Wallet - Mobile */}
          <div className="pt-3 flex flex-col space-y-3">
            <select
              value={network}
              onChange={(e) => handleNetworkChange(e.target.value as WalletAdapterNetwork)}
              className="bg-black/50 text-white border border-white/20 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 w-full"
            >
              <option value={WalletAdapterNetwork.Devnet}>Devnet</option>
              <option value={WalletAdapterNetwork.Mainnet}>Mainnet</option>
            </select>
            <div className="w-full [&>button]:w-full [&>button]:justify-center [&>button]:py-1.5">
              <WalletMultiButtonDynamic />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
