
import React from 'react';
import { Link } from 'react-router-dom';

const Philosophy: React.FC = () => {
  return (
    <div className="bg-[#09090b] text-white pt-24 sm:pt-48 pb-20 sm:pb-32 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <header className="mb-12 sm:mb-24">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#bef264] mb-4 sm:mb-6 block">The Manifesto</span>
          <h1 className="text-4xl sm:text-7xl md:text-8xl font-black font-heading mb-6 sm:mb-8 tracking-tighter uppercase italic leading-[0.9]">INTENT OVER <br /> <span className="text-zinc-800">ATTENTION.</span></h1>
        </header>

        <div className="space-y-10 sm:space-y-16 text-left max-w-3xl mx-auto">
          <p className="text-xl sm:text-3xl font-medium leading-relaxed italic text-zinc-300">
            "We believe that the problem with modern networking is not reach. It is relevance."
          </p>
          
          <div className="space-y-6 sm:space-y-8 text-zinc-500 text-sm sm:text-lg leading-relaxed font-medium">
            <p>
              Traditional professional networks are marketplace for attention. They profit when you are interrupted, when you scroll longer, and when you are shown more ads—regardless of their utility to your life.
            </p>
            <p>
              Number Tag reverses this. We believe that <strong>Permission</strong> is the only sustainable foundation for networking. 
            </p>
            <p>
              In our protocol, you are not a profile to be scraped. You are a <strong>Signal</strong> of intent. You only exist to those whose mission aligns with your current openness.
            </p>
          </div>

          <div className="pt-12 sm:pt-20 border-t border-white/10">
            <h3 className="text-xl sm:text-2xl font-black font-heading mb-4 uppercase text-[#bef264]">The Engine of Intent</h3>
            <p className="text-zinc-500 mb-10 text-xs sm:text-base italic font-medium">
              This philosophy is operationalized by a success-based economy that makes spam impossible and relevance mandatory.
            </p>
            <Link to="/pricing" className="group flex items-center space-x-4 text-white font-black text-base sm:text-xl hover:text-[#bef264] transition-colors">
              <span className="uppercase tracking-tighter">EXPLORE PRICING PROTOCOL</span>
              <i className="fa-solid fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Philosophy;
