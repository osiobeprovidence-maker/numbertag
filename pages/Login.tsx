import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState<string | null>(null);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('email');
    setTimeout(() => {
      localStorage.setItem('nt_user_email', email);
      onLogin();
      setLoading(null);
      navigate('/dashboard');
    }, 1500);
  };

  const handleSocialLogin = (platform: 'google' | 'apple') => {
    setLoading(platform);
    setTimeout(() => {
      // Simulate OAuth success
      localStorage.setItem('nt_user_email', `${platform}_node@identity.com`);
      onLogin();
      setLoading(null);
      navigate('/dashboard');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center py-24 px-8 sm:px-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#bef264]/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="max-w-md w-full bg-zinc-900/80 backdrop-blur-3xl rounded-[3.5rem] shadow-2xl p-10 sm:p-14 border border-white/5 relative z-10">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-[#bef264] rounded-[1.8rem] flex items-center justify-center text-black font-black text-4xl mx-auto mb-8 shadow-xl shadow-[#bef264]/20">#</div>
          <h2 className="text-3xl font-black font-heading tracking-tight uppercase text-white leading-none">Identity Portal</h2>
          <p className="text-zinc-600 mt-3 text-[10px] font-black uppercase tracking-[0.3em] italic">Access the intent layer</p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-6">
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
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Protocol Pass</label>
              <Link to="/forgot-password" title="Request Access Code" className="text-[9px] font-black uppercase tracking-[0.2em] text-[#bef264] hover:underline">Forgot Access?</Link>
            </div>
            <input 
              type="password" 
              required
              className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-5 focus:outline-none focus:border-[#bef264]/50 text-white font-bold transition-all text-sm placeholder-zinc-800 shadow-inner" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading !== null}
            className="w-full bg-[#bef264] hover:bg-[#d9ff96] text-black font-black py-5 rounded-2xl transition-all shadow-xl shadow-[#bef264]/15 uppercase tracking-[0.3em] text-[10px] active:scale-95"
          >
            {loading === 'email' ? <i className="fa-solid fa-circle-notch animate-spin"></i> : `Initialize Session`}
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest"><span className="bg-zinc-900 px-6 text-zinc-700">HANDSHAKE</span></div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => handleSocialLogin('apple')}
            disabled={loading !== null}
            className="w-full bg-white text-black font-black py-4 rounded-2xl transition-all flex items-center justify-center space-x-4 border border-white/5 text-[10px] uppercase tracking-widest active:scale-95 hover:bg-zinc-100"
          >
            {loading === 'apple' ? <i className="fa-solid fa-circle-notch animate-spin"></i> : (
              <>
                <i className="fa-brands fa-apple text-xl"></i>
                <span>Continue with Apple</span>
              </>
            )}
          </button>
          
          <button 
            onClick={() => handleSocialLogin('google')}
            disabled={loading !== null}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center space-x-4 border border-white/5 text-[10px] uppercase tracking-widest active:scale-95"
          >
             {loading === 'google' ? <i className="fa-solid fa-circle-notch animate-spin"></i> : (
              <>
                <i className="fa-brands fa-google text-[#bef264]"></i>
                <span>Continue with Google</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-12 text-center text-[9px] font-black uppercase tracking-[0.3em]">
          <span className="text-zinc-600">New node required? </span>
          <Link to="/join" className="text-[#bef264] hover:underline">Get started</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;