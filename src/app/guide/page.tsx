'use client';

import Link from 'next/link';

export default function GuidePage() {
  return (
    <div className="min-h-screen">
      <main className="relative pt-24 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
              Token Creation Guide
            </h1>
            <p className="text-xl text-gray-400">
              How to create your token on Solana using Pulse
            </p>
          </header>

          <div className="space-y-12">
            {/* Sezione Devnet */}
            <section className="bg-black/30 rounded-xl p-8 backdrop-blur-sm border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-6">
                Creating Tokens on Devnet (Test Environment)
              </h2>
              
              <div className="space-y-6 text-gray-300">
                <p>
                  Devnet is the ideal testing environment to start creating your tokens without risks. 
                  Here you can experiment for free and familiarize yourself with the creation process.
                </p>

                <div className="bg-black/30 rounded-lg p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">Steps to get started:</h3>
                  <ol className="list-decimal list-inside space-y-4">
                    <li>
                      <span className="font-medium text-white">Get free test SOL:</span>
                      <div className="mt-2 ml-6">
                        <a 
                          href="https://faucet.solana.com/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-400 hover:text-primary-300 underline"
                        >
                          Visit Solana Faucet
                        </a>
                        <p className="mt-2">
                          The faucet will allow you to receive free SOL for testing on Devnet.
                        </p>
                      </div>
                    </li>
                    <li>
                      <span className="font-medium text-white">Select Devnet on Pulse:</span>
                      <p className="mt-2 ml-6">
                        Use the network selector in the navbar to switch to Devnet.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium text-white">Create your first token:</span>
                      <p className="mt-2 ml-6">
                        Experiment with different configurations without worrying about costs.
                        Token creation on Devnet is completely free.
                      </p>
                    </li>
                  </ol>
                </div>

                <div className="bg-emerald-900/20 rounded-lg p-6 border border-emerald-500/30">
                  <h3 className="text-xl font-semibold text-white mb-4">Devnet Benefits:</h3>
                  <ul className="list-disc list-inside space-y-3">
                    <li>Safe environment for experimenting</li>
                    <li>Free SOL for testing</li>
                    <li>No financial risk</li>
                    <li>Ideal for learning features</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Sezione Mainnet */}
            <section className="bg-black/30 rounded-xl p-8 backdrop-blur-sm border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-6">
                Creating Tokens on Mainnet (Main Network)
              </h2>
              
              <div className="space-y-6 text-gray-300">
                <p>
                  Once you&apos;re familiar with the process on Devnet, you can move to Mainnet 
                  to create your official token on the Solana blockchain.
                </p>

                <div className="bg-black/30 rounded-lg p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">Creation Process:</h3>
                  <ol className="list-decimal list-inside space-y-4">
                    <li>
                      <span className="font-medium text-white">Prepare your wallet:</span>
                      <p className="mt-2 ml-6">
                        Make sure you have enough SOL in your wallet to cover creation costs 
                        (approximately 0.027 SOL for contract creation).
                      </p>
                    </li>
                    <li>
                      <span className="font-medium text-white">Select Mainnet:</span>
                      <p className="mt-2 ml-6">
                        Switch to Mainnet using the network selector in the navbar.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium text-white">Configure your token:</span>
                      <div className="mt-2 ml-6 space-y-3">
                        <p>Carefully define your token parameters:</p>
                        <ul className="list-disc list-inside ml-4 space-y-2">
                          <li>Token name and symbol</li>
                          <li>Initial supply</li>
                          <li>Decimals</li>
                          <li>Token image</li>
                        </ul>
                      </div>
                    </li>
                    <li>
                      <span className="font-medium text-white">Review and Confirm:</span>
                      <p className="mt-2 ml-6">
                        Carefully check all details before confirming creation. 
                        Changes on Mainnet are permanent.
                      </p>
                    </li>
                  </ol>
                </div>

                <div className="bg-amber-900/20 rounded-lg p-6 border border-amber-500/30">
                  <h3 className="text-xl font-semibold text-white mb-4">Important Considerations:</h3>
                  <ul className="list-disc list-inside space-y-3">
                    <li>Creation costs are real and non-refundable</li>
                    <li>Transactions are permanent and cannot be reversed</li>
                    <li>Always double-check all parameters before confirming</li>
                  
                  </ul>
                </div>
              </div>
            </section>

            {/* Managing Tokens Section */}
            <section className="bg-black/30 rounded-xl p-8 backdrop-blur-sm border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-6">
                Managing Your Tokens
              </h2>
              
              <div className="space-y-6 text-gray-300">
                <p>
                  After creating your token, you can manage it through the My Tokens page. 
                  Here&apos;s what you can do with your tokens:
                </p>

                <div className="bg-black/30 rounded-lg p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">Token Management Features:</h3>
                  <ul className="space-y-6">
                    <li className="flex items-start">
                      <span className="font-medium text-white min-w-[100px] mr-4">Explorer:</span>
                      <p>
                        View your token on Solana Explorer to see all transactions, holders, and other blockchain details.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium text-white min-w-[100px] mr-4">Liquidity:</span>
                      <p>
                        Add liquidity to your token on Raydium to enable trading. This is crucial for creating a market for your token.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium text-white min-w-[100px] mr-4">Stats:</span>
                      <p>
                        View detailed token statistics and charts, including price history, trading volume, and other key metrics.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium text-white min-w-[100px] mr-4">Remove:</span>
                      <p>
                        Disable the ability to mint new tokens. This permanently locks the total supply of your token.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium text-white min-w-[100px] mr-4">Freeze-Unfreeze:</span>
                      <p>
                        Disable the ability to mint new tokens. This permanently locks the total supply of your token.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium text-white min-w-[100px] mr-4">Burn:</span>
                      <p>
                      If you freeze your token it means you have paused it to transfer, if you thaw it it becomes functional again.
                        <span className="text-amber-500 block mt-2">
                          ⚠️ Warning: This action is irreversible and will completely destroy the token.
                        </span>
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-900/20 rounded-lg p-6 border border-blue-500/30">
                  <h3 className="text-xl font-semibold text-white mb-4">Best Practices:</h3>
                  <ul className="list-disc list-inside space-y-3">
                    <li>Regularly monitor your token&apos;s performance using the Stats feature</li>
                    <li>Consider adding liquidity early to enable trading</li>
                    <li>Think carefully before using Remove or Burn functions as they are irreversible</li>
                    <li>Keep track of your token&apos;s blockchain activity through Explorer</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Call to Action */}
            <div className="text-center mt-12">
              <Link 
                href="/token-creator"
                className="inline-block px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-all"
              >
                Start Creating Your Token
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
