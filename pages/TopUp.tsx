
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';

declare const PaystackPop: any;

const TopUp: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [user, setUser] = useState(dataService.getCurrentUser());

  useEffect(() => {
    const u = dataService.getCurrentUser();
    setUser(u);
    if (!u) {
      navigate('/login');
    }
  }, [navigate]);

  const packages = [
    { 
      name: 'Starter Node', 
      coins: 1000, 
      price: 3000, 
      displayPrice: '₦3,000', 
      desc: 'Perfect for professionals testing the intent discovery layer.',
      features: ['Standard Discovery Indexing', 'Community Support Access', 'Basic Handshake Priority']
    },
    { 
      name: 'Growth Scale', 
      coins: 5500, 
      price: 15000, 
      displayPrice: '₦15,000', 
      desc: 'Optimized for active businesses and recruitment teams.', 
      badge: 'PROTOCOL CHOICE',
      features: ['Priority Pulse Indexing', 'Advanced AI Synthesis+', 'Dedicated Handshake Support', '10% Bonus TC included']
    },
    { 
      name: 'Institutional', 
      coins: 18000, 
      price: 45000, 
      displayPrice: '₦45,000', 
      desc: 'Full-scale institutional access to the global intent network.',
      features: ['Infinite Intent Signals', 'API Bulk Operations', 'Custom Metadata Fields', '20% Bonus TC included']
    }
  ];

  const handlePaystackPayment = (pkg: typeof packages[0]) => {
    if (!user) {
      alert("Authentication Error: Node identity required for vault refill.");
      return;
    }
    
    setLoading(pkg.name);

    // Test Key provided in index.html environment
    const publicKey = 'pk_test_0129e836f7d6536591566e37d2a7d2dcdf65f1d0';

    try {
      const handler = PaystackPop.setup({
        key: publicKey,
        email: user.email,
        amount: pkg.price * 100, // Amount in kobo
        currency: 'NGN',
        ref: 'NT-VX-' + Math.floor((Math.random() * 1000000000) + 1),
        callback: (response: any) => {
          // Commit to ledger and sync database state
          dataService.addTransaction(
            user.name,
            pkg.coins,
            'credit',
            `Vault Calibration: ${pkg.name}`,
            response.reference
          );
          
          setLoading(null);
          alert(`Vault Synchronized: ${pkg.coins.toLocaleString()} TC added to node ${user.username}.`);
          navigate('/dashboard');
        },
        onClose: () => {
          setLoading(null);
        },
      });

      handler.openIframe();
    } catch (err) {
      console.error("Paystack Terminal Error:", err);
      setLoading(null);
      alert("Terminal Fault: Unable to establish secure payment tunnel.");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white pt-48 pb-32 relative overflow-hidden flex flex-col items-center">
      {/* Visual Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[5%] left-[15%] w-[500px] h-[500px] bg-amber-500/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[5%] right-[15%] w-[600px] h-[600px] bg-[#bef264]/5 blur-[150px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <header className="text-center mb-24">
          <div className="inline-flex items-center space-x-2 bg-zinc-900/50 backdrop-blur-md px-4 py-1.5 rounded-full mb-8 border border-white/10">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Secure Vault Refill</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-heading mb-8 tracking-tighter uppercase italic leading-none">The <span className="text-[#bef264]">Vault</span></h1>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-medium leading-relaxed italic">
            Calibrate your node's connection power. Choose a resource pack to fuel your intent handshakes across the protocol.
          </p>
          
          {user && (
            <div className="mt-12 inline-flex items-center gap-6 bg-zinc-900/30 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl shadow-2xl">
              <div className="text-left">
                <span className="text-[8px] font-black uppercase text-zinc-500 block mb-1 tracking-widest">Active Balance</span>
                <span className="text-3xl font-black font-heading text-[#bef264]">{user.coins.toLocaleString()} TC</span>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div className="text-left">
                <span className="text-[8px] font-black uppercase text-zinc-500 block mb-1 tracking-widest">Node ID</span>
                <span className="text-sm font-black uppercase tracking-tighter italic">{user.username}</span>
              </div>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, idx) => (
            <div 
              key={idx} 
              className={`relative p-12 rounded-[3.5rem] bg-zinc-900/40 border-2 transition-all hover:scale-[1.02] flex flex-col ${pkg.badge ? 'border-[#bef264] shadow-[0_30px_60px_-15px_rgba(190,242,100,0.15)]' : 'border-white/5'}`}
            >
              {pkg.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#bef264] text-black text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-xl shadow-[#bef264]/20">
                  {pkg.badge}
                </div>
              )}
              
              <div className="mb-10">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-6">{pkg.name}</h3>
                <div className="text-5xl font-black font-heading mb-2 leading-none">{pkg.displayPrice}</div>
                <div className="text-[#bef264] text-lg font-black tracking-tight">{pkg.coins.toLocaleString()} TC</div>
              </div>

              <p className="text-zinc-500 text-sm italic mb-10 leading-relaxed font-medium flex-grow">"{pkg.desc}"</p>

              <ul className="space-y-4 mb-12">
                {pkg.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-zinc-400 font-bold uppercase tracking-tight leading-tight">
                    <i className="fa-solid fa-bolt text-[#bef264] mt-0.5"></i>
                    {feat}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handlePaystackPayment(pkg)}
                disabled={!!loading}
                className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all flex items-center justify-center space-x-3 ${pkg.badge ? 'bg-[#bef264] text-black shadow-xl' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
              >
                {loading === pkg.name ? (
                  <i className="fa-solid fa-spinner animate-spin text-lg"></i>
                ) : (
                  <>
                    <i className="fa-solid fa-lock text-[10px]"></i>
                    <span>Secure Refill</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.5em] italic">
            All transactions are processed through end-to-end encrypted protocol tunnels. <br />
            Powered by Paystack Secure Gateway.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TopUp;
