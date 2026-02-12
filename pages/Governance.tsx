
import React from 'react';

const Governance: React.FC = () => {
  return (
    <div className="bg-[#09090b] text-white pt-48 pb-32 min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl font-mono text-sm leading-relaxed">
        <h1 className="text-4xl font-black font-heading mb-16 text-[#bef264] uppercase tracking-tighter">Governance</h1>
        
        <div className="space-y-12 text-zinc-400">
          <section>
            <h2 className="text-white font-bold mb-4 uppercase">[01] Intent Curation</h2>
            <p>The platform is governed by a merit-based intent system. High acceptance rates for businesses unlock deeper API access. High-quality signals for individuals increase visibility.</p>
          </section>
          
          <section>
            <h2 className="text-white font-bold mb-4 uppercase">[02] Dispute Resolution</h2>
            <p>If a business feels a tag was fraudulent, or a user feels a business is spamming, disputes are reviewed by the Intent Council—a blend of AI analysis and human oversight.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Governance;
