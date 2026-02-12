
import React from 'react';

const Security: React.FC = () => {
  return (
    <div className="bg-[#09090b] text-white pt-48 pb-32 min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl font-mono text-sm leading-relaxed">
        <h1 className="text-4xl font-black font-heading mb-16 text-[#bef264] uppercase tracking-tighter">Security Infrastructure</h1>
        
        <div className="space-y-12 text-zinc-400">
          <section>
            <h2 className="text-white font-bold mb-4 uppercase">[01] Intent Isolation</h2>
            <p>Our database architecture isolates personal identity from public intent markers. Even in the event of a breach, public tags cannot be programmatically linked to user identities without authorized decryption keys.</p>
          </section>
          
          <section>
            <h2 className="text-white font-bold mb-4 uppercase">[02] Coin Ledger</h2>
            <p>Tag Coin transactions are handled through an encrypted ledger, ensuring that business financial data is never exposed to the networking layer.</p>
          </section>

          <section>
            <div className="p-8 bg-zinc-950 border border-white/5 rounded-2xl">
               <span className="text-xs text-[#bef264] block mb-2 font-bold">SHA-256 SYSTEM CHECK:</span>
               <span className="text-[10px] break-all opacity-50">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Security;
