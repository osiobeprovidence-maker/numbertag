
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateNumberTag } from '../services/geminiService';
import { dataService } from '../services/dataService';
import { SocialPlatform, NumberTag } from '../types';

const CreateTag: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingFinish, setLoadingFinish] = useState(false);
  const [isMasked, setIsMasked] = useState(false);
  
  const [formData, setFormData] = useState({
    bio: '',
    goal: '',
    location: localStorage.getItem('nt_user_location') || '',
    platform: 'LinkedIn' as SocialPlatform,
    contactDetail: ''
  });
  const [generatedTag, setGeneratedTag] = useState<any>(null);

  const handleGenerate = async () => {
    if (!formData.bio || !formData.goal) return;
    setLoading(true);
    try {
      const tag = await generateNumberTag(formData.bio, formData.goal);
      setGeneratedTag(tag);
      setStep(2);
    } catch (error) {
      console.error("Failed to generate tag:", error);
      alert("Protocol Error: Synthesis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    setLoadingFinish(true);
    
    setTimeout(() => {
      const newTag: NumberTag = {
        id: `tag-${Date.now()}`,
        title: generatedTag.title,
        intent: generatedTag.intent,
        publicTitle: generatedTag.publicTitleMask,
        publicIntent: generatedTag.publicIntentMask,
        isMasked: isMasked,
        category: generatedTag.category,
        color: generatedTag.suggestedColor || 'emerald-500',
        tags: generatedTag.tags,
        owner: localStorage.getItem('nt_user_name') || 'Current User',
        location: formData.location || 'Unknown Location',
        avatar: isMasked ? `https://picsum.photos/seed/ghost/100/100` : `https://picsum.photos/seed/${Date.now()}/100/100`,
        contactPlatform: formData.platform,
        contactDetail: formData.contactDetail,
        socialLinks: JSON.parse(localStorage.getItem('nt_user_socials') || '[]')
      };

      try {
        dataService.broadcastTag(newTag);
        navigate('/dashboard');
      } catch (error) {
        console.error("Failed to broadcast tag:", error);
        alert("Protocol Error: Unable to broadcast signal to the network.");
        setLoadingFinish(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center py-32 px-8 sm:px-12 relative overflow-hidden text-white">
      <div className="max-w-2xl w-full bg-zinc-900/80 backdrop-blur-2xl rounded-[3rem] shadow-2xl p-8 sm:p-12 md:p-16 border border-white/5 relative z-10">
        <div className="flex items-center space-x-4 mb-12">
           <button 
             onClick={() => step === 1 ? navigate('/dashboard') : setStep(1)} 
             disabled={loading || loadingFinish}
             className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-white hover:bg-[#bef264] hover:text-black transition-colors disabled:opacity-50"
           >
             <i className="fa-solid fa-arrow-left"></i>
           </button>
           <h2 className="text-2xl sm:text-3xl font-black font-heading uppercase tracking-tighter italic">New Signal</h2>
        </div>

        {step === 1 && (
          <div className="animate-fade-in space-y-8">
            <div className="flex items-center justify-between p-6 bg-zinc-950 border border-white/5 rounded-2xl mb-4 group cursor-pointer" onClick={() => setIsMasked(!isMasked)}>
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-1">Protocol Masking</h4>
                  <p className="text-[9px] text-zinc-600 font-medium italic">Hide specific intent behind a professional cover.</p>
               </div>
               <div className={`w-12 h-6 rounded-full p-1 transition-all ${isMasked ? 'bg-[#bef264]' : 'bg-zinc-800'}`}>
                  <div className={`w-4 h-4 rounded-full bg-black transition-all ${isMasked ? 'translate-x-6' : 'translate-x-0'}`}></div>
               </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">Broadcasting From</label>
              <input 
                type="text" 
                value={formData.location} 
                onChange={e => setFormData({...formData, location: e.target.value})} 
                className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-6 mb-6 text-sm focus:border-[#bef264]/40 outline-none transition-all" 
                placeholder="City, State" 
              />
              
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">Professional Intent Bio</label>
              <textarea 
                className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-6 h-32 text-sm focus:border-[#bef264]/40 outline-none transition-all resize-none italic"
                placeholder="What is your current background?"
                value={formData.bio}
                onChange={e => setFormData({...formData, bio: e.target.value})}
              ></textarea>
            </div>
            
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">Target Openness (True Intent)</label>
              <input 
                type="text"
                className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-6 text-sm focus:border-[#bef264]/40 outline-none transition-all"
                placeholder="What are you really looking for?"
                value={formData.goal}
                onChange={e => setFormData({...formData, goal: e.target.value})}
              />
            </div>

            <button 
              onClick={handleGenerate} 
              disabled={!formData.bio || !formData.goal || loading} 
              className="w-full bg-[#bef264] text-black font-black py-6 rounded-2xl uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-[#bef264]/10 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-bolt"></i>
                  <span>Initialize Signal</span>
                </>
              )}
            </button>
          </div>
        )}

        {step === 2 && generatedTag && (
          <div className="animate-fade-in space-y-8">
            {/* Protocol Mask Display */}
            {isMasked ? (
              <div className="p-8 rounded-3xl bg-zinc-950 border border-[#bef264]/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                   <i className="fa-solid fa-mask text-[#bef264] text-xl opacity-40"></i>
                </div>
                <h4 className="text-[9px] font-black uppercase tracking-widest text-[#bef264] mb-4 italic">Protocol Mask Active</h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-[8px] font-black uppercase text-zinc-700 block mb-1">Public Mask Title</span>
                    <p className="text-xl font-black font-heading uppercase text-white">{generatedTag.publicTitleMask}</p>
                  </div>
                  <div>
                    <span className="text-[8px] font-black uppercase text-zinc-700 block mb-1">Public Mask Intent</span>
                    <p className="text-xs text-zinc-500 italic font-medium">"{generatedTag.publicIntentMask}"</p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="p-8 sm:p-10 rounded-[2.5rem] bg-zinc-950 border-2 border-zinc-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 text-[8px] font-black uppercase text-zinc-800 tracking-widest">True Signal Preview</div>
              
              <div className="mb-6">
                <label className="block text-[8px] font-black uppercase tracking-widest text-zinc-600 mb-2">Signal Title</label>
                <input 
                  type="text" 
                  value={generatedTag.title} 
                  onChange={e => setGeneratedTag({...generatedTag, title: e.target.value})}
                  className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-2xl font-black font-heading uppercase italic tracking-tighter text-[#bef264] outline-none"
                />
              </div>

              <div className="mb-6">
                <label className="block text-[8px] font-black uppercase tracking-widest text-zinc-600 mb-2">Intent Statement</label>
                <textarea 
                  value={generatedTag.intent} 
                  onChange={e => setGeneratedTag({...generatedTag, intent: e.target.value})}
                  className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-zinc-400 italic text-sm font-medium leading-relaxed outline-none h-20 resize-none"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                {generatedTag.tags.map((t: any, i: number) => (
                  <span key={i} className="px-3 py-1 bg-white/5 text-zinc-600 rounded-lg text-[9px] font-black uppercase border border-white/5">{t}</span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setStep(1)} disabled={loadingFinish} className="flex-1 bg-zinc-800 text-white font-black py-5 rounded-2xl uppercase text-[10px] tracking-widest">Refine</button>
              <button 
                onClick={handleFinish} 
                disabled={loadingFinish}
                className="flex-[2] bg-[#bef264] text-black font-black py-5 rounded-2xl uppercase tracking-[0.2em] shadow-xl text-[10px] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loadingFinish ? <i className="fa-solid fa-satellite animate-pulse"></i> : <><i className="fa-solid fa-paper-plane"></i> Launch Signal</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTag;
