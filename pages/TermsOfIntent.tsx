
import React from 'react';

const TermsOfIntent: React.FC = () => {
  return (
    <div className="bg-[#09090b] text-white pt-48 pb-32 min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl font-mono text-sm leading-relaxed">
        <h1 className="text-4xl font-black font-heading mb-16 text-[#bef264] uppercase tracking-tighter">Terms of Intent</h1>
        
        <div className="space-y-12 text-zinc-400">
          <section>
            <h2 className="text-white font-bold mb-4 uppercase">[01] Honesty Requirement</h2>
            <p>Intent signals must be truthful. Creating misleading Number Tags to farm attention or misrepresent professional standing is grounds for immediate tag revocation.</p>
          </section>
          
          <section>
            <h2 className="text-white font-bold mb-4 uppercase">[02] Business Conduct</h2>
            <p>Businesses must respect the specific intent of a tag. Sending "Generic Sales" requests to a "Hiring" tag is a violation of the protocol.</p>
          </section>

          <section>
            <h2 className="text-white font-bold mb-4 uppercase">[03] The Handshake</h2>
            <p>An "Accept" click constitutes a mutual agreement to communicate. Number Tag is not responsible for the outcome of connections once they move to external platforms.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfIntent;
