import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { dataService } from '../services/dataService';

interface ForgotPasswordProps {
  onLogin: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate database check for existing account
    const users = dataService.getAllUsers();
    const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

    if (!userExists) {
      alert("Security Fault: No node found associated with this terminal identity.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      setLoading(false);
      setStep(2);
      console.log(`[PROTOCOL DEBUG] Reset Code for ${email}: ${code}`);
      alert(`[DEMO MODE] An access code has been sent to ${email}.\n\nYour code is: ${code}`);
    }, 1500);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode === generatedCode) {
      setLoading(true);
      setTimeout(() => {
        localStorage.setItem('nt_user_email', email);
        onLogin();
        setLoading(false);
        navigate('/dashboard');
      }, 1000);
    } else {
      alert("Security Fault: Invalid access code.");
      setVerificationCode('');
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center py-24 px-8 sm:px-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#bef264]/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="max-w-md w-full bg-zinc-900/80 backdrop-blur-3xl rounded-[3.5rem] shadow-2xl p-10 sm:p-14 border border-white/5 relative z-10">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-zinc-950 rounded-[1.8rem] flex items-center justify-center text-[#bef264] font-black text-4xl mx-auto mb-8 shadow-xl border border-white/5">
             <i className="fa-solid fa-key"></i>
          </div>
          <h2 className="text-3xl font-black font-heading tracking-tight uppercase text-white leading-none">Access Recovery</h2>
          <p className="text-zinc-600 mt-3 text-[10px] font-black uppercase tracking-[0.3em] italic">Re-initialize node identity</p>
        </div>

        {step === 1 && (
          <form onSubmit={handleRequestCode} className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Terminal Email</label>
              <input 
                type="email" 
                required
                className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-5 focus:outline-none focus:border-[#bef264]/50 text-white font-bold transition-all text-sm placeholder-zinc-800 shadow-inner" 
                placeholder="identity@nt-protocol.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={loading || !email}
              className="w-full bg-[#bef264] hover:bg-[#d9ff96] text-black font-black py-5 rounded-2xl transition-all shadow-xl shadow-[#bef264]/15 uppercase tracking-[0.3em] text-[10px] active:scale-95"
            >
              {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : `Request Access Code`}
            </button>

            <div className="mt-8 text-center text-[9px] font-black uppercase tracking-[0.3em]">
              <Link to="/login" className="text-zinc-600 hover:text-[#bef264]">Return to Portal</Link>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerify} className="space-y-6 animate-fade-in text-center">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8 italic">Verification code sent to <br/><span className="text-white">{email}</span></p>
            
            <input 
              type="text" 
              maxLength={6}
              placeholder="000000"
              className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-6 text-center text-4xl font-black tracking-[0.6em] focus:border-[#bef264]/50 outline-none transition-all shadow-inner text-[#bef264]"
              value={verificationCode}
              onChange={e => setVerificationCode(e.target.value.replace(/\D/g,''))}
            />

            <button 
              type="submit"
              disabled={loading || verificationCode.length !== 6}
              className="w-full bg-[#bef264] hover:bg-[#d9ff96] text-black font-black py-5 rounded-2xl transition-all shadow-xl shadow-[#bef264]/15 uppercase tracking-[0.3em] text-[10px] active:scale-95"
            >
              {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : `Authorize Session`}
            </button>

            <button 
              type="button"
              onClick={() => setStep(1)}
              className="mt-6 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-[#bef264]"
            >
              Change Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;