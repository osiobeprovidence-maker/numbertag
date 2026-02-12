
import React from 'react';
import { Link } from 'react-router-dom';

const HowItWorks: React.FC = () => {
  return (
    <div className="bg-[#09090b] text-white pt-32 sm:pt-48 pb-20 sm:pb-32 min-h-screen">
      <div className="container mx-auto px-6 max-w-5xl">
        <header className="mb-20 sm:mb-24 text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#bef264] mb-6 block">The Architecture</span>
          <h1 className="text-4xl sm:text-7xl font-black font-heading mb-8 uppercase italic tracking-tighter">HOW IT WORKS</h1>
          <p className="text-lg sm:text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed font-medium italic">
            Reversing the traditional networking model. From noisy outreach to permission-based precision.
          </p>
        </header>

        <div className="space-y-24 sm:space-y-40">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="flex-1">
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-[#bef264] font-black text-2xl border border-white/5 mb-8 shadow-xl">01</div>
              <h2 className="text-3xl sm:text-4xl font-black font-heading mb-6 tracking-tight uppercase">Declare Your Intent</h2>
              <p className="text-zinc-500 text-lg leading-relaxed mb-8 font-medium italic">
                Every user on Number Tag joins because they want to connect. Instead of a profile, you create a <strong>Signal</strong>. You tell us what you're open to—mentoring, hiring, investing, or collaborating.
              </p>
              <div className="p-8 bg-zinc-900/50 rounded-3xl border border-[#bef264]/20 italic text-white font-bold text-lg relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                   <i className="fa-solid fa-quote-right text-3xl"></i>
                </div>
                "I am a Senior Developer open to consulting on high-scale Web3 projects."
              </div>
            </div>
            <div className="flex-1 w-full aspect-square bg-zinc-900/30 rounded-[3rem] border border-white/5 flex items-center justify-center relative overflow-hidden group shadow-2xl">
               <div className="absolute inset-0 bg-gradient-to-br from-[#bef264]/10 to-transparent"></div>
               {/* Improved visual: A grid of tags */}
               <div className="grid grid-cols-2 gap-4 p-8 w-full h-full">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="bg-zinc-950 p-6 rounded-2xl border border-white/5 flex flex-col justify-between group-hover:scale-105 transition-transform duration-500">
                       <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#bef264] text-xs">#</div>
                       <div className="h-2 w-12 bg-zinc-800 rounded-full mt-4"></div>
                       <div className="h-2 w-20 bg-zinc-900 rounded-full mt-2"></div>
                    </div>
                  ))}
               </div>
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <i className="fa-solid fa-tower-broadcast text-6xl text-white/5 group-hover:text-[#bef264]/20 transition-all duration-700"></i>
               </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20">
            <div className="flex-1">
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-[#bef264] font-black text-2xl border border-white/5 mb-8 shadow-xl">02</div>
              <h2 className="text-3xl sm:text-4xl font-black font-heading mb-6 tracking-tight uppercase">Activation of the Tag</h2>
              <p className="text-zinc-500 text-lg leading-relaxed font-medium italic">
                Our AI synthesizes your intent into a structured <strong>Number Tag</strong>. This tag is your digital identifier. It represents your "Openness" to the network without exposing your personal data.
              </p>
            </div>
            <div className="flex-1 w-full aspect-square bg-zinc-950 rounded-[4rem] border-2 border-dashed border-zinc-800 flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-[#bef264]/5 animate-pulse"></div>
               <div className="p-10 sm:p-14 bg-zinc-900 border-2 border-[#bef264] rounded-[3rem] text-[#bef264] font-black font-heading tracking-widest text-xl sm:text-3xl shadow-[0_0_50px_rgba(190,242,100,0.2)] animate-scale-in flex flex-col items-center gap-6">
                 <div className="w-16 h-16 bg-[#bef264]/10 rounded-2xl flex items-center justify-center">
                    <i className="fa-solid fa-fingerprint text-3xl"></i>
                 </div>
                 <span>#NT-ALPHA-77</span>
                 <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 bg-[#bef264] rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-[#bef264] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-[#bef264] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                 </div>
               </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="flex-1">
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-[#bef264] font-black text-2xl border border-white/5 mb-8 shadow-xl">03</div>
              <h2 className="text-3xl sm:text-4xl font-black font-heading mb-6 tracking-tight uppercase">Permissioned Connection</h2>
              <p className="text-zinc-500 text-lg leading-relaxed font-medium italic">
                Businesses browse the tag network. When they find a match, they send a request. <strong>This is free for the business.</strong> You receive a high-intent pitch and choose to accept or decline.
              </p>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4 sm:gap-6">
              <div className="aspect-video bg-emerald-500/5 hover:bg-emerald-500/10 rounded-[2rem] border-2 border-emerald-500/20 flex flex-col items-center justify-center text-emerald-400 font-black uppercase tracking-widest transition-all group cursor-pointer shadow-lg">
                <i className="fa-solid fa-check text-2xl mb-3 group-hover:scale-125 transition-transform"></i>
                <span className="text-[10px]">Accept Handshake</span>
              </div>
              <div className="aspect-video bg-rose-500/5 hover:bg-rose-500/10 rounded-[2rem] border-2 border-rose-500/20 flex flex-col items-center justify-center text-rose-400 font-black uppercase tracking-widest transition-all group cursor-pointer shadow-lg">
                <i className="fa-solid fa-xmark text-2xl mb-3 group-hover:scale-125 transition-transform"></i>
                <span className="text-[10px]">Dismiss Signal</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 sm:mt-48 text-center">
          <Link to="/join" className="bg-[#bef264] text-black font-black px-10 sm:px-14 py-5 sm:py-7 rounded-[2rem] text-lg sm:text-xl hover:scale-105 active:scale-95 transition-all inline-block shadow-2xl shadow-[#bef264]/30 uppercase tracking-[0.2em]">
            INITIALIZE NODE
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
