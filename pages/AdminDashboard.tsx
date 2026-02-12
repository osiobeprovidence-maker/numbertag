
import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { UserProfile, Transaction, UserType } from '../types';

export default function AdminDashboard() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminCreds, setAdminCreds] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState(false);

  const [view, setView] = useState<'users' | 'ledger'>('users');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState('');
  
  const [fixModal, setFixModal] = useState<{ email: string; name: string } | null>(null);
  const [adjAmount, setAdjAmount] = useState(0);
  const [adjReason, setAdjReason] = useState('');

  useEffect(() => {
    if (isAdminAuthenticated) {
      refresh();
    }
  }, [view, isAdminAuthenticated]);

  const refresh = () => {
    setUsers(dataService.getAllUsers());
    setTransactions(dataService.getAllTransactions());
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminCreds.username === 'number1' && adminCreds.password === 'Admin') {
      setIsAdminAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleFix = () => {
    if (fixModal && adjAmount !== 0) {
      dataService.adjustUserBalance(fixModal.email, adjAmount, adjReason);
      setFixModal(null);
      setAdjAmount(0);
      setAdjReason('');
      refresh();
      alert("Node Calibration Successful.");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTransactions = transactions.filter(t => 
    t.reference?.toLowerCase().includes(search.toLowerCase()) || 
    t.userName.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 blur-[150px] rounded-full"></div>
        </div>

        <div className="max-w-md w-full bg-zinc-900/80 backdrop-blur-3xl rounded-[3rem] p-10 sm:p-14 border border-white/5 relative z-10 shadow-2xl text-center animate-scale-in">
          <div className="w-20 h-20 bg-zinc-950 rounded-2xl flex items-center justify-center mx-auto mb-10 border border-white/5 shadow-inner">
            <i className="fa-solid fa-terminal text-[#bef264] text-3xl"></i>
          </div>
          <h2 className="text-3xl font-black font-heading uppercase mb-2 tracking-tighter italic text-white">Admin <span className="text-zinc-500">Access</span></h2>
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] mb-12">Authorization Required</p>
          
          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="text-left">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Terminal ID</label>
              <input 
                type="text" 
                placeholder="Username" 
                className={`w-full bg-zinc-950 border ${loginError ? 'border-red-500/50' : 'border-white/5'} rounded-2xl p-5 text-sm text-white focus:border-[#bef264]/50 outline-none transition-all`}
                value={adminCreds.username}
                onChange={e => setAdminCreds({...adminCreds, username: e.target.value})}
              />
            </div>
            <div className="text-left">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Security Key</label>
              <input 
                type="password" 
                placeholder="Password" 
                className={`w-full bg-zinc-950 border ${loginError ? 'border-red-500/50' : 'border-white/5'} rounded-2xl p-5 text-sm text-white focus:border-[#bef264]/50 outline-none transition-all`}
                value={adminCreds.password}
                onChange={e => setAdminCreds({...adminCreds, password: e.target.value})}
              />
            </div>
            {loginError && (
              <p className="text-red-500 text-[8px] font-black uppercase tracking-widest animate-pulse">Access Denied: Invalid Credentials</p>
            )}
            <button type="submit" className="w-full py-5 bg-[#bef264] text-black font-black rounded-2xl uppercase tracking-[0.3em] text-[10px] shadow-xl shadow-[#bef264]/10 hover:scale-105 active:scale-95 transition-all">
              Initialize Protocol
            </button>
          </form>
          <p className="mt-12 text-[8px] font-black uppercase tracking-[0.4em] text-zinc-700 italic">Restricted Node // Protocol Secure</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white animate-fade-in relative pb-10">
      
      {/* Mobile Top Bar - Sticky */}
      <div className="md:hidden sticky top-0 z-[110] bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#bef264] rounded-lg flex items-center justify-center text-black font-black text-sm">#</div>
          <span className="text-sm font-black uppercase tracking-widest italic">Admin Terminal</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-zinc-900/50 rounded-xl border border-white/10"
          >
            <span className={`w-5 h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-5 h-0.5 bg-white ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-5 h-0.5 bg-white transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Side Navigation Drawer */}
      <div className={`fixed inset-0 z-[120] md:hidden transition-transform duration-500 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className="relative w-[280px] h-full bg-zinc-950 border-r border-white/10 p-10 flex flex-col gap-12">
          <div className="flex items-center gap-4 mb-4">
            <i className="fa-solid fa-terminal text-[#bef264] text-2xl"></i>
            <h3 className="text-lg font-black uppercase italic">Menu</h3>
          </div>
          <nav className="flex flex-col gap-6">
            <button 
              onClick={() => { setView('users'); setIsMobileMenuOpen(false); }}
              className={`text-left text-xs font-black uppercase tracking-[0.3em] flex items-center gap-4 ${view === 'users' ? 'text-[#bef264]' : 'text-zinc-500'}`}
            >
              <i className="fa-solid fa-users w-6"></i> Node Registry
            </button>
            <button 
              onClick={() => { setView('ledger'); setIsMobileMenuOpen(false); }}
              className={`text-left text-xs font-black uppercase tracking-[0.3em] flex items-center gap-4 ${view === 'ledger' ? 'text-[#bef264]' : 'text-zinc-500'}`}
            >
              <i className="fa-solid fa-book w-6"></i> Global Ledger
            </button>
            <div className="h-px bg-white/5 my-4"></div>
            <button 
              onClick={() => { refresh(); setIsMobileMenuOpen(false); }}
              className="text-left text-xs font-black uppercase tracking-[0.3em] flex items-center gap-4 text-zinc-500 hover:text-white"
            >
              <i className="fa-solid fa-rotate w-6"></i> Refresh Sync
            </button>
            <button 
              onClick={() => setIsAdminAuthenticated(false)}
              className="text-left text-xs font-black uppercase tracking-[0.3em] flex items-center gap-4 text-rose-500"
            >
              <i className="fa-solid fa-power-off w-6"></i> Terminate
            </button>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-12 max-w-7xl pt-10 md:pt-32">
        
        {/* Desk Header (Hidden on Mobile) */}
        <header className="hidden md:block mb-12 bg-zinc-900/20 p-10 rounded-[3rem] border border-[#bef264]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
            <div className="flex gap-4">
              <div className="text-right">
                <span className="text-[10px] font-black uppercase text-zinc-600 block mb-1">Total Nodes</span>
                <span className="text-2xl font-black font-heading">{users.length}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black uppercase text-zinc-600 block mb-1">Global Volume</span>
                <span className="text-2xl font-black font-heading text-[#bef264]">
                  {transactions.reduce((acc, t) => acc + (t.type === 'credit' ? t.amount : 0), 0).toLocaleString()} TC
                </span>
              </div>
              <button 
                onClick={() => setIsAdminAuthenticated(false)}
                className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all border border-white/5"
              >
                <i className="fa-solid fa-power-off"></i>
              </button>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#bef264] mb-3 block">Protocol Command</span>
          <h1 className="text-4xl sm:text-6xl font-black font-heading tracking-tighter uppercase italic leading-none">Admin <span className="text-zinc-800">Terminal</span></h1>
        </header>

        {/* Mobile Stats Dashboard */}
        <div className="md:hidden grid grid-cols-2 gap-4 mb-8">
          <div className="p-6 bg-zinc-900/40 rounded-3xl border border-white/5">
             <span className="text-[8px] font-black uppercase text-zinc-600 block mb-1">Total Nodes</span>
             <span className="text-2xl font-black font-heading">{users.length}</span>
          </div>
          <div className="p-6 bg-zinc-900/40 rounded-3xl border border-white/5">
             <span className="text-[8px] font-black uppercase text-zinc-600 block mb-1">Vol (TC)</span>
             <span className="text-2xl font-black font-heading text-[#bef264]">
                {Math.round(transactions.reduce((acc, t) => acc + (t.type === 'credit' ? t.amount : 0), 0) / 1000)}K
             </span>
          </div>
        </div>

        {/* Search & Actions Bar - Sticky on Mobile */}
        <div className="sticky top-[73px] md:relative md:top-0 z-[100] flex flex-col md:flex-row justify-between items-center gap-4 mb-12 bg-[#09090b] md:bg-transparent pb-4 md:pb-0">
          <div className="hidden md:flex p-1 bg-zinc-900/50 rounded-2xl border border-white/5 w-full md:max-w-sm">
            <button onClick={() => setView('users')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${view === 'users' ? 'bg-[#bef264] text-black' : 'text-zinc-500'}`}>Node Registry</button>
            <button onClick={() => setView('ledger')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${view === 'ledger' ? 'bg-[#bef264] text-black' : 'text-zinc-500'}`}>Global Ledger</button>
          </div>
          <div className="relative w-full md:max-w-md">
            <i className="fa-solid fa-search absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600"></i>
            <input 
              type="text" 
              placeholder={view === 'users' ? "Filter Nodes..." : "Filter Ledger..."} 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-sm text-white focus:border-[#bef264]/50 outline-none transition-all shadow-xl" 
            />
          </div>
        </div>

        {/* Dynamic View Engine */}
        <div className="bg-zinc-950/50 border border-white/5 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
          {view === 'users' ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-zinc-900/50 border-b border-white/5">
                    <tr>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Node Identity</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Protocol</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Vault Balance</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Join Date</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-8 py-6">
                          <div className="font-black uppercase text-sm">{u.name}</div>
                          <div className="text-zinc-600 text-[10px] font-bold tracking-tight">{u.email}</div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase border ${u.type === UserType.BUSINESS ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>
                            {u.type}
                          </span>
                        </td>
                        <td className="px-8 py-6 font-black text-[#bef264]">{u.coins.toLocaleString()} TC</td>
                        <td className="px-8 py-6 text-zinc-600 text-xs">{new Date(u.joinedAt).toLocaleDateString()}</td>
                        <td className="px-8 py-6">
                          <button onClick={() => setFixModal({ email: u.email, name: u.name })} className="text-[10px] font-black uppercase tracking-widest text-[#bef264] hover:underline">Manual Adj</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-white/5">
                 {filteredUsers.length > 0 ? filteredUsers.map(u => (
                   <div key={u.id} className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-black uppercase text-sm">{u.name}</div>
                          <div className="text-zinc-600 text-[9px] font-bold tracking-tight">{u.email}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-lg text-[7px] font-black uppercase border ${u.type === UserType.BUSINESS ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>
                            {u.type}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] uppercase font-black">
                        <div className="text-zinc-500">Vault Balance: <span className="text-[#bef264]">{u.coins.toLocaleString()} TC</span></div>
                        <button onClick={() => setFixModal({ email: u.email, name: u.name })} className="bg-[#bef264] text-black px-4 py-2 rounded-xl">Adjust</button>
                      </div>
                   </div>
                 )) : (
                   <div className="p-20 text-center italic text-zinc-700 uppercase tracking-widest text-[10px] font-black">No Nodes Detected</div>
                 )}
              </div>
            </>
          ) : (
            <>
              {/* Desktop Ledger View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-zinc-900/50 border-b border-white/5">
                    <tr>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Reference</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Node User</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Flow</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Amount</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Narrative</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredTransactions.map(t => (
                      <tr key={t.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-8 py-6 text-xs font-mono text-zinc-400">{t.reference}</td>
                        <td className="px-8 py-6 font-black uppercase text-xs">{t.userName}</td>
                        <td className="px-8 py-6">
                          <i className={`fa-solid ${t.type === 'credit' ? 'fa-arrow-down text-emerald-400' : 'fa-arrow-up text-rose-400'} text-xs`}></i>
                        </td>
                        <td className="px-8 py-6 font-black text-xs">
                          {t.type === 'credit' ? '+' : '-'}{t.amount.toLocaleString()}
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">{t.description}</div>
                          <div className="text-[8px] text-zinc-600 mt-1">{new Date(t.timestamp).toLocaleString()}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View Ledger */}
              <div className="md:hidden divide-y divide-white/5">
                 {filteredTransactions.length > 0 ? filteredTransactions.map(t => (
                   <div key={t.id} className="p-6 space-y-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[8px] font-mono text-zinc-500">REF://{t.reference}</span>
                        <span className={`text-xs font-black ${t.type === 'credit' ? 'text-emerald-400' : 'text-rose-500'}`}>
                           {t.type === 'credit' ? '+' : '-'}{t.amount.toLocaleString()} TC
                        </span>
                      </div>
                      <div className="font-black uppercase text-xs tracking-tight">{t.userName}</div>
                      <p className="text-[10px] text-zinc-600 italic font-medium">"{t.description}"</p>
                      <div className="text-[8px] text-zinc-800 uppercase font-black">{new Date(t.timestamp).toLocaleDateString()} // {new Date(t.timestamp).toLocaleTimeString()}</div>
                   </div>
                 )) : (
                   <div className="p-20 text-center italic text-zinc-700 uppercase tracking-widest text-[10px] font-black">Ledger Empty</div>
                 )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Manual Adjustment Modal - Mobile Optimized */}
      {fixModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-xl" onClick={() => setFixModal(null)}></div>
          <div className="relative bg-zinc-900 w-full max-w-lg rounded-[3rem] p-8 sm:p-14 border border-[#bef264]/30 animate-scale-in overflow-y-auto max-h-[90vh] custom-scrollbar">
             <h3 className="text-2xl sm:text-3xl font-black font-heading uppercase mb-4 leading-none tracking-tight">Node Correction</h3>
             <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-10 italic">Target: {fixModal.name}</p>
             
             <div className="space-y-8 mb-12">
               <div>
                 <label className="text-[9px] font-black uppercase text-zinc-600 mb-3 block tracking-widest">Amount Velocity (+ / -)</label>
                 <input 
                   type="number" 
                   value={adjAmount} 
                   onChange={e => setAdjAmount(Number(e.target.value))} 
                   className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-6 text-2xl font-black text-[#bef264] outline-none shadow-inner" 
                 />
               </div>
               <div>
                 <label className="text-[9px] font-black uppercase text-zinc-600 mb-3 block tracking-widest">Intervention Context</label>
                 <textarea 
                   value={adjReason} 
                   onChange={e => setAdjReason(e.target.value)} 
                   placeholder="Detailed reason for node override..."
                   className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-6 h-32 text-sm text-white focus:border-[#bef264]/50 outline-none resize-none shadow-inner" 
                 />
               </div>
             </div>

             <div className="flex flex-col sm:flex-row gap-4">
               <button onClick={() => setFixModal(null)} className="py-5 bg-zinc-800 rounded-2xl uppercase font-black text-[10px] tracking-widest order-2 sm:order-1 flex-1">Abort</button>
               <button onClick={handleFix} className="py-5 bg-[#bef264] text-black rounded-2xl uppercase font-black text-[10px] tracking-widest shadow-xl shadow-[#bef264]/10 order-1 sm:order-2 flex-[2]">Commit Overwrite</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
