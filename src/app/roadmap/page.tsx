'use client';

export default function RoadmapPage() {
  return (
    <div className="min-h-screen">
      <main className="relative pt-24 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
              Pulse Roadmap
            </h1>
            <p className="text-xl text-gray-400">
              Our vision for the future of Pulse ecosystem
            </p>
          </header>

          <div className="space-y-12">
            {/* Development Fees Section */}
            <section className="bg-black/30 rounded-xl p-8 backdrop-blur-sm border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-6">
                Development Fees
              </h2>
              
              <div className="space-y-6 text-gray-300">
                <div className="bg-black/30 rounded-lg p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">Market-Leading Low Fees</h3>
                  <p className="mb-4">
                    Both on Devnet and Mainnet, there is a development fee of approximately $3 - 
                    the lowest fee in the market for token creation.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-emerald-900/20 rounded-lg p-6 border border-emerald-500/30">
                      <h4 className="font-semibold text-white mb-3">Mainnet Fees</h4>
                      <p>
                        All funds collected on Mainnet will be reinvested into the Pulse ecosystem development, 
                        enabling us to continue expanding and improving our platform.
                      </p>
                    </div>
                    
                    <div className="bg-blue-900/20 rounded-lg p-6 border border-blue-500/30">
                      <h4 className="font-semibold text-white mb-3">Devnet Fees</h4>
                      <p>
                        Funds collected on Devnet will be redistributed through an application that 
                        allocates resources to developers and those needing to test applications.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Future Development Section */}
            <section className="bg-black/30 rounded-xl p-8 backdrop-blur-sm border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-6">
                Future Development
              </h2>
              
              <div className="space-y-6 text-gray-300">
                <div className="bg-black/30 rounded-lg p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">Upcoming Features</h3>
                  
                  <ul className="space-y-6">
                    <li className="flex items-start">
                      <div className="bg-primary-500/20 rounded-full p-2 mr-4 mt-1">
                        <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Pulse Bonding Curve Extension</h4>
                        <p className="mt-2">
                          We will extend the Pulse bonding curve functionality to provide more 
                          advanced trading and liquidity features.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <div className="bg-primary-500/20 rounded-full p-2 mr-4 mt-1">
                        <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Telegram Bot Integration</h4>
                        <p className="mt-2">
                          Development of a Telegram bot to facilitate purchases within the bonding curve, 
                          making trading more accessible and convenient.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Community Input Section */}
                <div className="bg-purple-900/20 rounded-lg p-6 border border-purple-500/30">
                  <h3 className="text-xl font-semibold text-white mb-4">Community-Driven Development</h3>
                  <p>
                    We welcome ideas and suggestions from our community. Your input is valuable in shaping 
                    the future of the Pulse ecosystem. All community suggestions will be carefully 
                    considered for implementation.
                  </p>
                  <div className="mt-4 flex items-center space-x-4">
                    <a 
                      href="https://t.me/pulse_solana" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 3.767-1.362 5.337-.168.662-.337 1.32-.5 1.951-.265 1.019-.506 1.948-.728 2.802-.129.497-.243.936-.352 1.319-.215.76-.386 1.368-.495 1.755-.157.556-.356.656-.574.668-.487.025-1.214-.344-1.89-.675-.903-.443-1.737-.852-2.457-1.205-.835-.41-2.443-1.394-2.443-1.394s-.736-.454-.784-.72c-.048-.267.263-.503.263-.503l5.247-4.876c.191-.177.383-.355.574-.532.383-.355.726-.673 1.013-.94.764-.71.829-.822.829-.822s.075-.114-.051-.167c-.127-.053-.279.038-.279.038l-7.344 4.659s-.327.21-.933.162c-.606-.048-1.31-.235-1.31-.235s-.994-.611-.994-1.034c0-.205.301-.414.301-.414l11.965-4.938s.981-.431 1.516-.431c.221 0 .476.042.659.159.181.117.23.274.256.388.025.114.051 1.395-.051 1.395z"/>
                      </svg>
                      Join our Telegram
                    </a>
                    <a 
                      href="https://x.com/Pulse__Sol" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      Follow on Twitter
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
