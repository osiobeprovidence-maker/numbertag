
import React from 'react';
import { Link } from 'react-router-dom';

const BusinessAPI: React.FC = () => {
  return (
    <div className="bg-[#09090b] text-white pt-24 sm:pt-48 pb-20 sm:pb-32 min-h-screen">
      <div className="container mx-auto px-6 max-w-5xl">
        <header className="mb-16 sm:mb-24">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#bef264] mb-6 block">Protocol Integration</span>
          <h1 className="text-4xl sm:text-7xl font-black font-heading mb-8 uppercase italic leading-none">BUSINESS <br /> <span className="text-[#bef264]">API LAYER</span></h1>
          <p className="text-base sm:text-xl text-zinc-500 max-w-2xl leading-relaxed font-medium italic">
            Programmatic access to the global intent network. Integrate Number Tag signals into your internal CRM, recruitment engines, or institutional platforms.
          </p>
        </header>

        <div className="space-y-12 sm:space-y-20">
          <div className="bg-zinc-950 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
             <div className="p-4 sm:p-6 bg-zinc-900/50 border-b border-white/5 flex items-center justify-between">
                <div className="flex space-x-2">
                   <div className="w-3 h-3 rounded-full bg-red-500/40"></div>
                   <div className="w-3 h-3 rounded-full bg-amber-500/40"></div>
                   <div className="w-3 h-3 rounded-full bg-emerald-500/40"></div>
                </div>
                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-700">POST /v1/signals/query</span>
             </div>
             <div className="p-6 sm:p-10 font-mono text-[10px] sm:text-sm overflow-x-auto scrollbar-hide">
                <pre className="text-zinc-500">
{`{
  "target_intent": "high_scale_web3_consulting",
  "geo_fence": {
    "latitude": 6.5244,
    "longitude": 3.3792,
    "radius": "25km"
  },
  "results": [
    {
      "node_id": "#NT-GHOST-X99",
      "intent": "Open to Node.js leadership roles",
      "engagement_fee": 50,
      "token": "TC"
    }
  ]
}`}
                </pre>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            <div className="p-8 sm:p-10 bg-zinc-900/20 rounded-[3rem] border border-white/5">
              <h3 className="text-xl sm:text-2xl font-black font-heading mb-6 tracking-tight uppercase">Intent Routing</h3>
              <p className="text-zinc-500 leading-relaxed font-medium italic text-sm sm:text-base">
                Automate your outreach by matching directly with declared user intent. Zero interruption. 100% relevance. All access is permission-gated.
              </p>
            </div>
            <div className="p-8 sm:p-10 bg-zinc-900/20 rounded-[3rem] border border-white/5">
              <h3 className="text-xl sm:text-2xl font-black font-heading mb-6 tracking-tight uppercase">Bulk Handshakes</h3>
              <p className="text-zinc-500 leading-relaxed font-medium italic text-sm sm:text-base">
                Initialize thousands of alignment signals per day. Your Vault TC is only debited when the user explicitly clicks "Accept Handshake".
              </p>
            </div>
          </div>

          {/* Pricing Disclaimer Section */}
          <section className="mt-12 sm:mt-24 p-8 sm:p-20 bg-zinc-900/40 rounded-[3rem] sm:rounded-[4.5rem] border border-[#bef264]/20 text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-5">
               <i className="fa-solid fa-code-branch text-9xl text-white"></i>
             </div>
             <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-[#bef264] mb-8 block">Protocol Licensing</span>
             <h2 className="text-3xl sm:text-6xl font-black font-heading uppercase tracking-tighter mb-8 leading-none">Infrastructure <br/><span className="text-zinc-800">Calibration</span></h2>
             
             <div className="max-w-md mx-auto bg-zinc-950 p-8 sm:p-10 rounded-[2.5rem] border border-white/5 mb-10 shadow-2xl">
                <div className="text-3xl sm:text-5xl font-black font-heading text-white mb-2">25,000 <span className="text-[#bef264]">TC</span></div>
                <div className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-6 italic">Annual API Integration License</div>
                <p className="text-xs sm:text-sm text-zinc-500 italic mb-8 font-medium">Full read/write permissions to the Intent Registry. Includes unlimited discovery scans.</p>
                <Link to="/top-up" className="block w-full bg-[#bef264] text-black font-black py-5 rounded-2xl uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all">Secure License Key</Link>
             </div>
             
             <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest italic leading-relaxed">
               Handshake execution fees (50 TC per accepted connection) still apply on a per-success basis.
             </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BusinessAPI;
