
import React from 'react';
import { Link } from 'react-router-dom';

const TagCoins: React.FC = () => {
  return (
    <div className="bg-[#09090b] text-white pt-48 pb-32 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <header className="mb-32 text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="w-24 h-24 bg-zinc-900 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-white/5 shadow-2xl relative z-10">
            <i className="fa-solid fa-coins text-amber-500 text-4xl"></i>
          </div>
          <h1 className="text-6xl md:text-9xl font-black font-heading mb-8 tracking-tighter uppercase italic">Tag <span className="text-zinc-800">Coins</span></h1>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed italic font-medium">
            The currency of high-intent connection. Success-based pricing that eliminates waste and empowers users.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            { 
              tier: "Protocol Entry", 
              price: "₦3,000", 
              coins: "1,000 TC", 
              desc: "Perfect for high-growth individuals testing intent matching.", 
              color: "emerald-500" 
            },
            { 
              tier: "Business Scale", 
              price: "₦15,000", 
              coins: "5,500 TC", 
              desc: "Optimized for HR teams and active business development.", 
              color: "amber-500",
              popular: true 
            },
            { 
              tier: "Enterprise Hub", 
              price: "₦45,000", 
              coins: "18,000 TC", 
              desc: "For institutions driving thousands of permissioned signals.", 
              color: "indigo-500" 
            }
          ].map((item, idx) => (
            <div key={idx} className={`p-12 rounded-[3.5rem] bg-zinc-900/40 border-2 transition-all hover:scale-105 flex flex-col relative ${item.popular ? 'border-[#bef264] shadow-[0_0_50px_rgba(190,242,100,0.1)]' : 'border-white/5'}`}>
              {item.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#bef264] text-black text-[10px] font-black px-6 py-1.5 rounded-full uppercase tracking-widest">Most Efficient</span>
              )}
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-8">{item.tier}</h3>
              <div className="mb-10">
                <div className="text-5xl font-black font-heading mb-2 leading-none">{item.price}</div>
                <div className="text-[#bef264] font-black text-lg">{item.coins}</div>
              </div>
              <p className="text-zinc-500 text-sm italic mb-12 flex-grow leading-relaxed">"{item.desc}"</p>
              <Link to="/top-up" className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center transition-all ${item.popular ? 'bg-[#bef264] text-black shadow-xl' : 'bg-zinc-800 text-white'}`}>
                Secure Node
              </Link>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center border-t border-white/5 pt-32">
          <div>
            <h2 className="text-4xl md:text-6xl font-black font-heading mb-10 leading-none tracking-tighter uppercase italic">The Zero-Waste <br /><span className="text-[#bef264]">Economy</span></h2>
            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-emerald-400 shrink-0 border border-white/5">
                  <i className="fa-solid fa-paper-plane"></i>
                </div>
                <div>
                  <h4 className="text-lg font-black uppercase mb-2">Free Broadcasts</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">Dispatched signals cost 0 coins. We believe intent discovery should be unrestricted.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#bef264] shrink-0 border border-white/5">
                  <i className="fa-solid fa-handshake"></i>
                </div>
                <div>
                  <h4 className="text-lg font-black uppercase mb-2">CP-Accept Model</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">Coins are only consumed when a user explicitly grants permission to connect.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-16 bg-zinc-950 rounded-[4rem] border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent"></div>
            <div className="relative z-10 text-center">
              <div className="text-[80px] font-black font-heading text-zinc-900 leading-none mb-10 group-hover:text-amber-500/10 transition-colors">50 TC</div>
              <h4 className="text-xl font-black uppercase mb-6">Standard Handshake</h4>
              <p className="text-zinc-500 text-sm leading-relaxed mb-10 font-medium">
                The uniform cost for a successful connection across the entire protocol. Simple. Fair. High-value.
              </p>
              <div className="flex justify-center gap-4 opacity-30 text-[8px] font-black uppercase tracking-[0.5em]">
                <span>Fixed Rate</span>
                <span>•</span>
                <span>Global Protocol</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagCoins;
