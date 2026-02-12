import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocialPlatform, SocialLink } from '../types';
import { generateNumberTag } from '../services/geminiService';
import { dataService } from '../services/dataService';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
    goal: '',
    location: '',
    socialLinks: [] as SocialLink[]
  });
  
  const [generatedTag, setGeneratedTag] = useState<any>(null);

  const handleNext = () => setStep(s => s + 1);

  const handleSocialSignup = (platform: 'apple' | 'google') => {
    setSocialLoading(platform);
    setTimeout(() => {
      setFormData({
        ...formData,
        email: `${platform}_user@nt-protocol.com`,
        name: `${platform.charAt(0).toUpperCase() + platform.slice(1)} User`,
        username: `${platform}_node_${Math.floor(Math.random() * 999)}`
      });
      setSocialLoading(null);
      setStep(3); // Jump straight to Identity Core calibration
    }, 1800);
  };

  const sendVerificationCode = () => {
    if (!formData.email) return;
    setVerifying(true);
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      setVerifying(false);
      handleNext();
      console.log(`[PROTOCOL DEBUG] Verification Code for ${formData.email}: ${code}`);
      alert(`[DEMO MODE] A verification code has been sent to ${formData.email}.\n\nYour code is: ${code}`);
    }, 1500);
  };

  const handleVerify = () => {
    if (verificationCode === generatedCode) {
      handleNext();
    } else {
      alert("Security Fault: Invalid verification key.");
      setVerificationCode('');
    }
  };

  const handleSynthesis = async () => {
    if (!formData.bio || !formData.goal) return;
    setLoading(true);
    const tag = await generateNumberTag(formData.bio, formData.goal);
    setGeneratedTag(tag);
    setLoading(false);
    handleNext();
  };

  const finalizeNode = () => {
    dataService.registerUser({
      email: formData.email,
      name: formData.name,
      username: formData.username,
      bio: formData.bio,
      location: formData.location,
      socials: formData.socialLinks
    });

    if (generatedTag) {
      dataService.broadcastTag({
        title: generatedTag.title,
        intent: generatedTag.intent,
        category: generatedTag.category,
        color: generatedTag.suggestedColor || 'emerald-500',
        tags: generatedTag.tags,
        owner: formData.name,
        location: formData.location,
        avatar: `https://picsum.photos/seed/${formData.username}/100/100`,
        contactPlatform: 'LinkedIn' as SocialPlatform,
        contactDetail: formData.email,
        socialLinks: formData.socialLinks,
        isMasked: false
      });
    }

    onComplete();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center py-24 px-8 sm:px-12 relative overflow-hidden text-white">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-[#bef264]/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="max-w-xl w-full bg-zinc-900/80 backdrop-blur-3xl rounded-[3.5rem] p-10 sm:p-14 border border-white/5 relative z-10 shadow-2xl">
        <div className="flex gap-2 mb-16">
          {[1,2,3,4,5,6].map(s => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${step >= s ? 'bg-[#bef264]' : 'bg-zinc-800'}`}></div>
          ))}
        </div>

        {step === 1 && (
          <div className="animate-fade-in text-center">
            <h2 className="text-4xl font-black font-heading uppercase mb-4 tracking-tight leading-none">Protocol Entry</h2>
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] mb-12 italic">Establish your identity node</p>
            
            <div className="space-y-4">
              <button 
                onClick={() => handleSocialSignup('apple')}
                disabled={socialLoading !== null}
                className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase text-[10px] tracking-widest flex items-center justify-center space-x-3 transition-all active:scale-[0.98] shadow-xl hover:bg-zinc-100"
              >
                {socialLoading === 'apple' ? <i className="fa-solid fa-circle-notch animate-spin"></i> : (
                  <>
                    <i className="fa-brands fa-apple text-xl"></i>
                    <span>Initialize with Apple ID</span>
                  </>
                )}
              </button>

              <button 
                onClick={() => handleSocialSignup('google')}
                disabled={socialLoading !== null}
                className="w-full bg-zinc-800 text-white font-black py-5 rounded-2xl uppercase text-[10px] tracking-widest flex items-center justify-center space-x-3 transition-all active:scale-[0.98] border border-white/5"
              >
                {socialLoading === 'google' ? <i className="fa-solid fa-circle-notch animate-spin"></i> : (
                  <>
                    <i className="fa-brands fa-google text-[#bef264]"></i>
                    <span>Initialize with Google</span>
                  </>
                )}
              </button>

              <div className="py-4 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/5"></div>
                <span className="text-[8px] font-black text-zinc-600 uppercase">Or use terminal email</span>
                <div className="h-px flex-1 bg-white/5"></div>
              </div>

              <input 
                type="email" 
                placeholder="identity@nt-protocol.com" 
                className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-6 text-center text-lg focus:border-[#bef264]/50 transition-all outline-none font-bold placeholder-zinc-800 shadow-inner" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />
              <button 
                onClick={sendVerificationCode} 
                disabled={!formData.email || verifying || socialLoading !== null} 
                className="w-full bg-[#bef264] text-black font-black py-6 rounded-2xl uppercase text-[10px] tracking-[0.3em] flex items-center justify-center space-x-3 transition-all active:scale-[0.98] shadow-xl shadow-[#bef264]/10"
              >
                {verifying ? <i className="fa-solid fa-spinner animate-spin"></i> : <span>Verify Email Channel</span>}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in text-center">
            <h2 className="text-3xl font-black font-heading uppercase mb-6 leading-none">Verify Key</h2>
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] mb-12 italic">Transmitted to {formData.email}</p>
            <input 
              type="text" 
              maxLength={6}
              placeholder="000000"
              className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-6 text-center text-4xl font-black tracking-[0.6em] focus:border-[#bef264]/50 outline-none transition-all shadow-inner text-[#bef264]"
              value={verificationCode}
              onChange={e => setVerificationCode(e.target.value.replace(/\D/g,''))}
            />
            <button 
              onClick={handleVerify} 
              disabled={verificationCode.length !== 6}
              className="w-full mt-10 bg-[#bef264] text-black font-black py-6 rounded-2xl uppercase text-[10px] tracking-widest shadow-xl shadow-[#bef264]/10 transition-all active:scale-[0.98]"
            >
              Authorize Node
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-black font-heading uppercase mb-10 leading-none">Identity Core</h2>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest mb-3 block">Full Name / Entity Name</label>
                <input type="text" placeholder="e.g. Soft King" className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-5 text-sm font-bold shadow-inner" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest mb-3 block">Terminal Handle</label>
                <input type="text" placeholder="johndoe_intent" className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-5 text-sm font-bold shadow-inner" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest mb-3 block">Base Location</label>
                <input type="text" placeholder="Lagos, Nigeria" className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-5 text-sm font-bold shadow-inner" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
              <button onClick={handleNext} disabled={!formData.name || !formData.username} className="w-full bg-[#bef264] text-black font-black py-6 rounded-2xl uppercase text-[10px] tracking-widest mt-4 shadow-xl shadow-[#bef264]/10">Calibrate Identity</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-black font-heading uppercase mb-10 leading-none">Mission Protocol</h2>
            <div className="space-y-8">
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest mb-3 block">Professional Narrative</label>
                <textarea className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-6 h-36 text-sm font-medium leading-relaxed shadow-inner italic" placeholder="Summarize your expertise and vision..." value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest mb-3 block">Primary Openness (Intent)</label>
                <input type="text" className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-6 text-sm font-bold shadow-inner" placeholder="e.g. Looking for technical co-founders..." value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})} />
              </div>
              <button onClick={handleSynthesis} className="w-full bg-[#bef264] text-black font-black py-6 rounded-2xl uppercase text-[10px] tracking-widest shadow-xl shadow-[#bef264]/10">
                {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : "Synthesize Initial Tag"}
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="animate-fade-in text-center">
            <h2 className="text-3xl font-black font-heading uppercase mb-10 leading-none">Signal Preview</h2>
            <div className="p-10 bg-zinc-950 rounded-[3rem] border-2 border-[#bef264] mb-12 text-left animate-scale-in shadow-2xl shadow-[#bef264]/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 text-[8px] font-black uppercase text-zinc-800 tracking-widest">PROTOCOL V4.0</div>
              <h3 className="text-2xl font-black font-heading mb-4 uppercase leading-none">{generatedTag?.title}</h3>
              <p className="text-zinc-500 italic text-sm mb-10 leading-relaxed font-medium">"{generatedTag?.intent}"</p>
              <div className="flex flex-wrap gap-2">
                {generatedTag?.tags?.map((t: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-white/5 rounded-lg text-[8px] font-black uppercase text-zinc-600 border border-white/5">{t}</span>
                ))}
              </div>
            </div>
            <button onClick={handleNext} className="w-full bg-white text-black font-black py-6 rounded-2xl uppercase text-[10px] tracking-widest shadow-xl transition-all hover:bg-zinc-200">Commit to Network</button>
          </div>
        )}

        {step === 6 && (
          <div className="animate-fade-in text-center">
            <div className="w-24 h-24 bg-[#bef264]/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-[#bef264]/20 shadow-2xl shadow-[#bef264]/10">
              <i className="fa-solid fa-satellite-dish text-[#bef264] text-4xl animate-pulse"></i>
            </div>
            <h2 className="text-4xl font-black font-heading uppercase mb-4 leading-none tracking-tight">Node Activated</h2>
            <p className="text-zinc-600 text-sm mb-12 italic font-medium">Your identity is now established in the intent layer.</p>
            <button onClick={finalizeNode} className="w-full bg-[#bef264] text-black font-black py-7 rounded-2xl uppercase tracking-[0.4em] text-[10px] shadow-2xl shadow-[#bef264]/15 active:scale-[0.98] transition-all">Launch Dashboard</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;