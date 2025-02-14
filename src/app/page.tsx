'use client';

import Link from 'next/link';
import Image from 'next/image';
import Countdown from '../components/Countdown';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="animated-background">
        <div className="gradient-overlay"></div>
        <div className="moving-gradient"></div>
        <div className="glow-effect"></div>
      </div>
      
      <div className="relative">
        <main className="relative pt-28 pb-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-24">
              <div className="flex justify-center items-center mb-8">
                <Image 
                  src="/pulse-logo.svg" 
                  alt="Pulse Logo" 
                  width={90} 
                  height={90} 
                  className="mr-3"
                  priority
                />
                <h1 className="text-8xl font-bold gradient-title tracking-tight">
                  Pulse
                </h1>
              </div>
              <p className="text-2xl text-gray-300 mb-16 font-light tracking-wide leading-relaxed text-center">
              Empower Your Vision, Build on Solana.
              </p>
              <div className="flex flex-col items-center space-y-12">
                <Link 
                  href="/token-creator"
                  className="elegant-button px-10 py-4 text-white rounded-lg text-lg font-medium"
                >
                  Create Your Pulse
                </Link>
                
                <Countdown />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-3xl mx-auto mb-20">
              <div className="elegant-card rounded-xl p-8">
              <p className="text-gray-300 text-center font-light leading-relaxed">
                Step 1</p>
                <h3 className="text-xl font-medium text-white text-center mb-4">Create Token</h3>
                <p className="text-gray-300 text-center font-light leading-relaxed">
                Easily create your own Meme-Token on the Solana network in just a few simple steps
                </p>
              </div>
              <div className="elegant-card rounded-xl p-8">
              <p className="text-gray-300 text-center font-light leading-relaxed">
              Step 2</p>
                <h3 className="text-xl font-medium text-white text-center mb-4">Pulse Panel</h3>
                <p className="text-gray-300 text-center font-light leading-relaxed">
                The Pulse Panel allows you to manage your token with advanced features.
                </p>
              </div>
              <div className="elegant-card rounded-xl p-8">
              <p className="text-gray-300 text-center font-light leading-relaxed">
              Step 3</p>
                <h3 className="text-xl font-medium text-white text-center mb-4">liquidity and Stats</h3>
                <p className="text-gray-300 text-center font-light leading-relaxed">
                You will be able to directly give liquidity on Raydium, and look at the graph of your meme. 
                </p>
              </div>
            </div>

            {/* Social Links Section */}
            <div className="social-links-container mt-16 pt-8">
              <div className="flex justify-center items-center space-x-8">
                <a 
                  href="https://t.me/pulse_solana" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link w-40 h-12 rounded-xl flex items-center justify-center text-gray-300 hover:text-white"
                >
                  <div className="flex items-center justify-center w-full">
                    <svg className="w-5 h-5 mr-2" fill="currentColor">
                      <use xlinkHref="/social-icons.svg#telegram-icon"/>
                    </svg>
                    <span className="text-lg">Telegram</span>
                  </div>
                </a>
                
                <a 
                  href="https://x.com/Pulse__Sol" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link w-40 h-12 rounded-xl flex items-center justify-center text-gray-300 hover:text-white"
                >
                  <div className="flex items-center justify-center w-full">
                    <svg className="w-5 h-5 mr-2" fill="currentColor">
                      <use xlinkHref="/social-icons.svg#twitter-icon"/>
                    </svg>
                    <span className="text-lg">Twitter</span>
                  </div>
                </a>
                
                <a 
                  href="https://github.com/PixelPunkNFT" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link w-40 h-12 rounded-xl flex items-center justify-center text-gray-300 hover:text-white"
                >
                  <div className="flex items-center justify-center w-full">
                    <svg className="w-5 h-5 mr-2" fill="currentColor">
                      <use xlinkHref="/social-icons.svg#dev-icon"/>
                    </svg>
                    <span className="text-lg">GitHub</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
