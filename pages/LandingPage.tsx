
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-[#09090b] text-white selection:bg-[#bef264] selection:text-black">
      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-56 pb-24 sm:pb-40 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] pointer-events-none">
          <div className="absolute top-[-10%] left-[10%] w-[400px] sm:w-[700px] h-[400px] sm:h-[700px] bg-[#bef264]/10 blur-[150px] rounded-full"></div>
          <div className="absolute top-[20%] right-[10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-indigo-600/10 blur-[150px] rounded-full"></div>
        </div>

        <div className="container mx-auto px-6 sm:px-12 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-zinc-900/50 backdrop-blur-md px-5 py-2 rounded-full mb-10 border border-white/10 shadow-2xl">
              <span className="w-2 h-2 bg-[#bef264] rounded-full animate-pulse shadow-[0_0_10px_#bef264]"></span>
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">The Protocol for Pure Intent</span>
            </div>
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-black mb-10 sm:mb-14 leading-[0.9] tracking-tighter font-heading uppercase italic">
              PEER-TO-PEER <br />
              BY <span className="text-[#bef264] not-italic">INTENT.</span>
            </h1>
            <p className="text-lg sm:text-2xl text-zinc-500 mb-12 sm:mb-16 max-w-3xl mx-auto leading-relaxed font-medium italic">
              Stop fighting for attention. Start aligning on goals. Number Tag is the permissioned layer for a world where your mission is your only identifier.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/join" className="w-full sm:w-auto bg-[#bef264] hover:bg-[#d9ff96] text-black font-black text-lg px-12 py-6 rounded-[2rem] transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(190,242,100,0.2)] uppercase tracking-widest">
                Initialize Node
              </Link>
              <Link to="/how-it-works" className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-white font-black text-lg px-12 py-6 rounded-[2rem] border border-white/5 transition-all uppercase tracking-widest">
                The Protocol
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Callout */}
      <section className="py-24 sm:py-48 text-center container mx-auto px-6 sm:px-12 bg-zinc-950/50">
        <div className="max-w-5xl mx-auto py-20 sm:py-32 border-y border-white/5 relative">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-zinc-900 rounded-[2rem] flex items-center justify-center border border-white/5 shadow-2xl">
            <i className="fa-solid fa-quote-left text-[#bef264] text-3xl"></i>
          </div>
          <p className="text-3xl md:text-5xl lg:text-6xl font-black font-heading leading-[1.1] uppercase tracking-tighter italic text-white/90">
            "Number Tag is a unified system where everyone controls access, everyone respects intent, and connection only happens when it’s mutual."
          </p>
          <div className="mt-16 flex items-center justify-center gap-4 text-zinc-600 font-black uppercase tracking-[0.6em] text-[10px]">
            <div className="w-12 h-px bg-white/5"></div>
            <span>Protocol Philosophy v4.0</span>
            <div className="w-12 h-px bg-white/5"></div>
          </div>
        </div>
      </section>

      {/* Unified Capabilities */}
      <section className="py-32 sm:py-48 relative">
        <div className="container mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <h2 className="text-4xl sm:text-7xl font-black font-heading tracking-tighter leading-none uppercase italic">ONE NODE, <br/><span className="text-[#bef264]">INFINITE REACH.</span></h2>
              <div className="space-y-10">
                {[
                  { icon: "fa-tower-broadcast", title: "Broadcast Your Need", desc: "Create a Number Tag to signal exactly what you're open to. Whether you're hiring, seeking an mentor, or looking for capital." },
                  { icon: "fa-satellite-dish", title: "Discover Signals", desc: "Scan the global pulse of intents. Find peers whose goals perfectly align with your own mission." },
                  { icon: "fa-handshake", title: "Permissioned Handshake", desc: "No cold emails. No spam. You only connect when both nodes agree on the utility of the handshake." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 md:gap-8 group">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-zinc-900/50 border border-white/10 flex items-center justify-center text-[#bef264] shrink-0 group-hover:bg-[#bef264] group-hover:text-black transition-all duration-500 shadow-xl">
                      <i className={`fa-solid ${item.icon} text-2xl`}></i>
                    </div>
                    <div>
                      <h4 className="text-xl sm:text-2xl font-black mb-2 uppercase tracking-tight">{item.title}</h4>
                      <p className="text-zinc-500 text-lg leading-relaxed font-medium italic">"{item.desc}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-zinc-900/40 p-12 md:p-20 rounded-[4rem] border border-white/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10">
                 <div className="w-20 h-20 bg-zinc-950 rounded-[2rem] flex items-center justify-center border border-white/10 shadow-inner group-hover:rotate-12 transition-transform duration-700">
                    <i className="fa-solid fa-bolt text-[#bef264] text-3xl"></i>
                 </div>
               </div>
               <div className="text-6xl md:text-8xl font-black font-heading text-zinc-800 leading-none mb-12 tracking-tighter">5,000 <br/><span className="text-white">TC</span></div>
               <h3 className="text-3xl font-black font-heading mb-6 uppercase tracking-tight">VAULT PROTOCOL</h3>
               <p className="text-zinc-500 text-lg leading-relaxed mb-12 italic font-medium">
                 New nodes are initialized with 2,500 Tag Coins. Successful handshakes consume a flat 50 TC from the initiator—fueling an economy where relevance is the only way to grow.
               </p>
               <Link to="/join" className="block w-full text-center bg-[#bef264] text-black font-black py-6 rounded-[2rem] hover:bg-white transition-all text-xl uppercase tracking-widest shadow-2xl shadow-[#bef264]/10">
                 Establish Your Node
               </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
