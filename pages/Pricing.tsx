
import React from 'react';
import { Link } from 'react-router-dom';

const Pricing: React.FC = () => {
  const tiers = [
    {
      name: "Starter Protocol",
      price: "₦3,000",
      coins: "1,000 TC",
      features: ["Standard Intent Discovery", "Basic Tag Customization", "Community Pulse Access", "Basic Email Handshakes"],
      cta: "Activate Node"
    },
    {
      name: "Growth Engine",
      price: "₦15,000",
      coins: "5,500 TC",
      features: ["Priority Discovery Indexing", "Advanced AI Synthesis+", "Tag Pro Proximity (30d)", "Dedicated Signal Support"],
      popular: true,
      cta: "Scale Intent"
    },
    {
      name: "Institutional Hub",
      price: "₦45,000",
      coins: "18,000 TC",
      features: ["Infinite Intent Signals", "API Bulk Operations", "Custom Metadata Fields", "SLA Guaranteed Sync"],
      cta: "Connect Agency"
    }
  ];

  return (
    <div className="bg-[#09090b] text-white pt-24 sm:pt-48 pb-16 sm:pb-32 min-h-screen relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[5%] left-[10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-[#bef264]/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-12 max-w-7xl relative z-10">
        <div className="text-center mb-12 sm:mb-24">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#bef264] mb-4 block">Handshake Economy</span>
          <h1 className="text-3xl sm:text-7xl md:text-8xl font-black font-heading mb-6 tracking-tighter uppercase italic leading-[0.9]">PROTOCOL <br/><span className="text-zinc-800">PRICING</span></h1>
          <p className="text-sm sm:text-xl text-zinc-500 max-w-2xl mx-auto font-medium leading-relaxed italic">
            Success-based infrastructure. Zero monthly subscriptions. Pay only for the connections you successfully establish.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-32">
          {tiers.map((tier, i) => (
            <div key={i} className={`p-8 sm:p-12 rounded-[2.5rem] bg-zinc-900/40 border-2 transition-all flex flex-col relative ${tier.popular ? 'border-[#bef264] shadow-[0_20px_40px_-10px_rgba(190,242,100,0.1)]' : 'border-white/5'}`}>
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#bef264] text-black text-[9px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-xl shadow-[#bef264]/20 whitespace-nowrap">Efficient Choice</div>
              )}
              <div className="mb-8">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">{tier.name}</h3>
                <div className="text-4xl sm:text-5xl font-black font-heading mb-1 leading-none">{tier.price}</div>
                <div className="text-[#bef264] text-sm sm:text-lg font-black tracking-tight">{tier.coins} Vault Credit</div>
              </div>

              <ul className="space-y-3 mb-10 flex-grow">
                {tier.features.map((f, fi) => (
                  <li key={fi} className="flex items-start gap-3 text-zinc-400 text-[11px] sm:text-sm font-medium leading-tight">
                    <i className="fa-solid fa-check text-[#bef264] text-[9px] mt-1 shrink-0"></i>
                    {f}
                  </li>
                ))}
              </ul>

              <Link to="/top-up" className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] text-center transition-all ${tier.popular ? 'bg-[#bef264] text-black shadow-xl shadow-[#bef264]/10' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}>
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="bg-zinc-950 border border-white/5 rounded-[2.5rem] sm:rounded-[4rem] p-8 sm:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent"></div>
          <h2 className="text-2xl sm:text-5xl font-black font-heading mb-4 tracking-tight uppercase italic leading-tight">The 50 TC <span className="text-indigo-400">Standard</span></h2>
          <p className="text-xs sm:text-lg text-zinc-500 max-w-3xl mx-auto leading-relaxed italic mb-10">
            A successful handshake on the protocol costs a flat 50 Tag Coins (TC). This ensures high-intent engagement and zero-waste for every node.
          </p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-12 opacity-50">
            <div className="text-center">
              <span className="text-xl sm:text-3xl font-black font-heading block">0%</span>
              <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-600">Commissions</span>
            </div>
            <div className="text-center">
              <span className="text-xl sm:text-3xl font-black font-heading block">100%</span>
              <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-600">Privacy First</span>
            </div>
            <div className="text-center">
              <span className="text-xl sm:text-3xl font-black font-heading block text-[#bef264]">FREE</span>
              <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-600">Discovery Scans</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
