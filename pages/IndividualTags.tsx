
import React from 'react';

const IndividualTags: React.FC = () => {
  const tagTypes = [
    { title: "The Creative", color: "#c084fc", icon: "fa-palette", desc: "For designers, writers, and artists open to commission or collaboration." },
    { title: "The Growth", color: "#bef264", icon: "fa-arrow-trend-up", desc: "For marketers and sales pros open to performance-based partnerships." },
    { title: "The Builder", color: "#38bdf8", icon: "fa-code", desc: "For engineers and architects open to early-stage technical consulting." },
    { title: "The Visionary", color: "#fbbf24", icon: "fa-eye", desc: "For investors and advisors open to deal flow and mentorship." }
  ];

  return (
    <div className="bg-[#09090b] text-white pt-48 pb-32 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#bef264] mb-6 block">For Professionals</span>
            <h1 className="text-5xl md:text-7xl font-black font-heading mb-8">INDIVIDUAL <br /> <span className="text-zinc-800">TAGS</span></h1>
            <p className="text-xl text-zinc-500 leading-relaxed font-medium">
              Your Number Tag is a living identifier. It changes as your goals evolve. It is your shield against noise and your magnet for opportunity.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-[#bef264]/10 blur-[100px] rounded-full"></div>
            <div className="p-12 bg-zinc-900/40 rounded-[3rem] border border-white/5 relative z-10 backdrop-blur-xl">
               <div className="flex items-center justify-between mb-8">
                 <div className="w-14 h-14 rounded-2xl bg-[#bef264]/10 border border-[#bef264]/20 flex items-center justify-center text-[#bef264] text-2xl">#</div>
                 <div className="flex space-x-2">
                   <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[10px] font-black uppercase text-zinc-500">Active Signal</span>
                 </div>
               </div>
               <h3 className="text-3xl font-black font-heading mb-4 tracking-tight">Design Advisor</h3>
               <p className="text-zinc-400 italic mb-8">"Helping Series A startups build world-class UI."</p>
               <div className="flex gap-2">
                 <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase text-zinc-500">Mentorship</span>
                 <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase text-zinc-500">Consulting</span>
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tagTypes.map((type, i) => (
            <div key={i} className="p-8 rounded-[2rem] bg-zinc-950 border border-white/5 hover:border-[#bef264]/20 transition-all">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-8 text-2xl" style={{ backgroundColor: `${type.color}10`, color: type.color }}>
                <i className={`fa-solid ${type.icon}`}></i>
              </div>
              <h4 className="text-xl font-black font-heading mb-4 uppercase tracking-tight">{type.title}</h4>
              <p className="text-zinc-600 text-sm leading-relaxed">{type.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndividualTags;
