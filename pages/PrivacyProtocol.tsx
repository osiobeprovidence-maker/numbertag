
import React from 'react';

const PrivacyProtocol: React.FC = () => {
  return (
    <div className="bg-[#09090b] text-white pt-48 pb-32 min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl font-mono text-sm leading-relaxed">
        <h1 className="text-4xl font-black font-heading mb-16 text-[#bef264] uppercase tracking-tighter">Privacy Protocol v1.0</h1>
        
        <div className="space-y-12 text-zinc-400">
          <section>
            <h2 className="text-white font-bold mb-4 uppercase">[01] The Shield</h2>
            <p>Your identity is hidden behind a Number Tag until you choose to reveal it. Businesses see intent, not names, emails, or biometric data.</p>
          </section>
          
          <section>
            <h2 className="text-white font-bold mb-4 uppercase">[02] Zero Tracking</h2>
            <p>Number Tag does not utilize third-party tracking pixels, advertising cookies, or behavioral analysis for sale to external brokers. Our interest is in your declared intent, not your shadow data.</p>
          </section>

          <section>
            <h2 className="text-white font-bold mb-4 uppercase">[03] Data Ownership</h2>
            <p>You own your intent. You can terminate your Number Tag at any moment, at which point all active signals are purged from the business search registry within 60 seconds.</p>
          </section>

          <section className="pt-12 border-t border-white/5 text-[10px] text-zinc-600">
            TERMINAL ENCRYPTED SECURE CONNECTION ACTIVE // BYPASSING TRADITIONAL DATA HARVESTING MODELS
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyProtocol;
