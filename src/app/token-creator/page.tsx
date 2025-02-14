'use client';

import { TokenCreator } from '../../components/TokenCreator';

export default function TokenCreatorPage() {
  return (
    <div className="min-h-screen">
      <main className="relative pt-16 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
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
