import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { generateNumberTag } from '../services/geminiService';
import { dataService } from '../services/dataService';
import { SocialPlatform, NumberTag } from '../types';

const EditTag: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingFinish, setLoadingFinish] = useState(false);
  const [tagNotFound, setTagNotFound] = useState(false);

  const [formData, setFormData] = useState({
    bio: '',
    goal: '',
    location: '',
    platform: 'LinkedIn' as SocialPlatform,
    contactDetail: ''
  });

  const [generatedTag, setGeneratedTag] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const existingTag = dataService.getTag(id);
      if (existingTag) {
        setFormData({
          bio: localStorage.getItem('nt_user_bio') || '', // Prefer global bio for context
          goal: existingTag.intent,
          location: existingTag.location,
          platform: existingTag.contactPlatform,
          contactDetail: existingTag.contactDetail
        });
        setGeneratedTag({
          title: existingTag.title,
          intent: existingTag.intent,
          category: existingTag.category,
          suggestedColor: existingTag.color,
          tags: existingTag.tags
        });
      } else {
        setTagNotFound(true);
      }
    }
  }, [id]);

  const handleGenerate = async () => {
    if (!formData.bio || !formData.goal) return;
    setLoading(true);
    try {
      const tag = await generateNumberTag(formData.bio, formData.goal);
      setGeneratedTag(tag);
      setStep(2);
    } catch (error) {
      console.error("Failed to re-generate tag:", error);
      alert("Protocol Error: Re-synthesis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    if (!id || !generatedTag) return;
    setLoadingFinish(true);
    
    setTimeout(() => {
      const success = dataService.updateTag(id, {
        title: generatedTag.title,
        intent: generatedTag.intent,
        category: generatedTag.category,
        color: generatedTag.suggestedColor || 'emerald-500',
        tags: generatedTag.tags,
        location: formData.location,
        contactPlatform: formData.platform,
        contactDetail: formData.contactDetail,
      });

      if (success) {
        navigate('/dashboard');
      } else {
        alert("Protocol Error: Unable to sync changes to the network.");
        setLoadingFinish(false);
      }
    }, 1200);
  };

  if (tagNotFound) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-3xl font-black font-heading text-white uppercase mb-4">Signal Lost</h2>
          <p className="text-zinc-500 mb-8 italic">The Number Tag you are trying to calibrate does not exist in the registry.</p>
          <button onClick={() => navigate('/dashboard')} className="px-8 py-4 bg-[#bef264] text-black font-black rounded-xl uppercase tracking-widest text-[10px]">Return to Terminal</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center py-32 px-8 sm:px-12 relative overflow-hidden text-white">
      <div className="max-w-2xl w-full bg-zinc-900/80 backdrop-blur-2xl rounded-[3rem] shadow-2xl p-8 sm:p-12 md:p-16 border border-white/5 relative z-10">
        <div className="flex items-center space-x-4 mb-12">
           <button 
             onClick={() => step === 1 ? navigate('/dashboard') : setStep(1)} 
             disabled={loading || loadingFinish}
             className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-white hover:bg-[#bef264] hover:text-black transition-colors"
           >
             <i className="fa-solid fa-arrow-left"></i>
           </button>
           <h2 className="text-2xl sm:text-3xl font-black font-heading uppercase tracking-tight italic">Adjust Signal</h2>
        </div>

        {step === 1 && (
          <div className="animate-fade-in space-y-10">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">Node Base (Location)</label>
              <input 
                type="text" 
                value={formData.location} 
                onChange={e => setFormData({...formData, location: e.target.value})} 
                className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-6 mb-6 text-sm focus:border-[#bef264]/40 outline-none transition-all" 
                placeholder="City, State" 
              />
              
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">Current Narrative Context</label>
              <textarea 
                className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-6 h-32 text-sm focus:border-[#bef264]/40 outline-none transition-all resize-none italic"
                placeholder="Update your background context for AI synthesis..."
                value={formData.bio}
                onChange={e => setFormData({...formData, bio: e.target.value})}
              ></textarea>
            </div>
            
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">Revised Handshake Goal</label>
              <input 
                type="text"
                className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-6 text-sm focus:border-[#bef264]/40 outline-none transition-all"
                placeholder="Update what you are looking for..."
                value={formData.goal}
                onChange={e => setFormData({...formData, goal: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <select 
                className="bg-zinc-950 border border-white/5 rounded-2xl p-6 text-sm appearance-none outline-none focus:border-[#bef264]/40" 
                value={formData.platform} 
                onChange={e => setFormData({...formData, platform: e.target.value as SocialPlatform})}
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="X">X (Twitter)</option>
              </select>
              <input 
                type="text" 
                className="bg-zinc-950 border border-white/5 rounded-2xl p-6 text-sm outline-none focus:border-[#bef264]/40" 
                placeholder="Handle or ID" 
                value={formData.contactDetail} 
                onChange={e => setFormData({...formData, contactDetail: e.target.value})} 
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
                  <span>Re-Synthesizing...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-bolt"></i>
                  <span>Re-Calibrate Signal</span>
                </>
              )}
            </button>
          </div>
        )}

        {step === 2 && generatedTag && (
          <div className="animate-fade-in">
            <div className="p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] border-2 border-[#bef264] bg-zinc-950 mb-12 relative overflow-hidden shadow-2xl shadow-[#bef264]/5">
              <div className="absolute top-0 right-0 p-6 text-[8px] font-black uppercase text-zinc-800 tracking-widest">Calibration Preview</div>
              
              <div className="mb-6">
                <label className="block text-[8px] font-black uppercase tracking-widest text-zinc-600 mb-2">Signal Title (Adjustable)</label>
                <input 
                  type="text" 
                  value={generatedTag.title} 
                  onChange={e => setGeneratedTag({...generatedTag, title: e.target.value})}
                  className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-2xl sm:text-3xl font-black font-heading uppercase italic tracking-tighter text-[#bef264] outline-none focus:border-[#bef264]/30"
                />
              </div>

              <div className="mb-6">
                <label className="block text-[8px] font-black uppercase tracking-widest text-zinc-600 mb-2">Intent Statement</label>
                <textarea 
                  value={generatedTag.intent} 
                  onChange={e => setGeneratedTag({...generatedTag, intent: e.target.value})}
                  className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-zinc-400 italic text-sm font-medium leading-relaxed outline-none focus:border-[#bef264]/30 h-20 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 mb-10">
                <i className="fa-solid fa-location-dot text-[#bef264]"></i>
                <span className="uppercase tracking-widest">{formData.location || 'Unknown Node'}</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-10 border-t border-white/5">
                {generatedTag.tags.map((t: any, i: number) => (
                  <span key={i} className="px-3 py-1 bg-white/5 text-zinc-600 rounded-lg text-[9px] font-black uppercase border border-white/5">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setStep(1)} 
                disabled={loadingFinish}
                className="flex-1 bg-zinc-800 text-white font-black py-5 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-zinc-700 transition-all"
              >
                Refine Context
              </button>
              <button 
                onClick={handleUpdate} 
                disabled={loadingFinish}
                className="flex-[2] bg-[#bef264] text-black font-black py-5 rounded-2xl uppercase tracking-[0.2em] shadow-xl shadow-[#bef264]/10 text-[10px] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loadingFinish ? (
                  <>
                    <i className="fa-solid fa-satellite animate-pulse"></i>
                    <span>Updating Signal...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-check"></i>
                    <span>Commit Re-Calibration</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditTag;