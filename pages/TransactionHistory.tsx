
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Transaction, UserProfile } from '../types';

const TransactionHistory: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(dataService.getCurrentUser());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setTransactions(dataService.getTransactions(user.name));
  }, [user, navigate]);

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.reference?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSpent = transactions
    .filter(t => t.type === 'debit')
    .reduce((acc, t) => acc + t.amount, 0);
  
  const totalRefilled = transactions
    .filter(t => t.type === 'credit')
    .reduce((acc, t) => acc + t.amount, 0);

  const formatDate = (ts: number) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(ts));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#09090b] pt-28 md:pt-44 pb-24 text-white">
      <div className="container mx-auto px-4 sm:px-12 max-w-7xl">
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="text-center md:text-left">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-[#bef264] mb-4 transition-colors">
              <i className="fa-solid fa-arrow-left"></i>
              Back to Terminal
            </Link>
            <h1 className="text-3xl sm:text-6xl font-black font-heading tracking-tighter uppercase italic leading-none">Vault <span className="text-zinc-800">Ledger</span></h1>
          </div>
          <div className="flex items-center gap-4 bg-zinc-900/40 p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 backdrop-blur-xl shadow-2xl">
             <div className="text-right">
               <span className="text-[7px] md:text-[8px] font-black uppercase text-zinc-600 block mb-1">Available TC</span>
               <span className="text-lg md:text-2xl font-black font-heading text-amber-500">{user.coins.toLocaleString()}</span>
             </div>
             <div className="w-px h-8 md:h-10 bg-white/10 mx-1 md:mx-2"></div>
             <Link to="/top-up" className="bg-[#bef264] text-black font-black px-4 md:px-6 py-2 md:py-3 rounded-xl text-[9px] md:text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Refill</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-16">
          <div className="p-8 md:p-12 bg-zinc-900/20 rounded-[3rem] md:rounded-[4rem] border border-emerald-500/10 flex items-center gap-6 md:gap-10 group">
            <div className="w-14 h-14 md:w-20 md:h-20 bg-emerald-500/10 rounded-[1.8rem] flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shrink-0 border border-emerald-500/20 shadow-xl">
              <i className="fa-solid fa-arrow-trend-up text-xl md:text-3xl"></i>
            </div>
            <div>
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-zinc-600 block mb-2">Total Refills</span>
              <span className="text-xl md:text-4xl font-black font-heading text-white">{totalRefilled.toLocaleString()} <span className="text-[10px] text-zinc-700">TC</span></span>
            </div>
          </div>
          <div className="p-8 md:p-12 bg-zinc-900/20 rounded-[3rem] md:rounded-[4rem] border-rose-500/10 flex items-center gap-6 md:gap-10 group">
            <div className="w-14 h-14 md:w-20 md:h-20 bg-rose-500/10 rounded-[1.8rem] flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform shrink-0 border border-rose-500/20 shadow-xl">
              <i className="fa-solid fa-arrow-trend-down text-xl md:text-3xl"></i>
            </div>
            <div>
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-zinc-600 block mb-2">Total Deductions</span>
              <span className="text-xl md:text-4xl font-black font-heading text-white">{totalSpent.toLocaleString()} <span className="text-[10px] text-zinc-700">TC</span></span>
            </div>
          </div>
        </div>

        <div className="mb-10 relative group">
          <i className="fa-solid fa-magnifying-glass absolute left-8 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-[#bef264] transition-colors"></i>
          <input 
            type="text" 
            placeholder="Search Protocol ID or Handshake Narrative..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/50 border border-white/5 rounded-[2rem] md:rounded-[2.5rem] py-6 md:py-8 pl-20 pr-8 focus:border-[#bef264]/50 outline-none transition-all text-white font-bold text-sm tracking-tight placeholder-zinc-800 shadow-inner"
          />
        </div>

        <div className="bg-zinc-900/30 rounded-[3rem] md:rounded-[5rem] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-3xl">
          {filteredTransactions.length > 0 ? (
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-zinc-950/80 border-b border-white/5">
                  <tr>
                    <th className="px-8 md:px-14 py-8 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Protocol Time</th>
                    <th className="px-8 md:px-14 py-8 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Vault Reference</th>
                    <th className="px-8 md:px-14 py-8 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Narrative</th>
                    <th className="px-8 md:px-14 py-8 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 text-right">Resource Flow</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 md:px-14 py-10 whitespace-nowrap">
                        <span className="text-[10px] md:text-xs text-zinc-500 font-black block">{formatDate(tx.timestamp)}</span>
                      </td>
                      <td className="px-8 md:px-14 py-10 whitespace-nowrap">
                        <span className="text-[10px] md:text-xs font-mono font-black text-zinc-600 uppercase tracking-tighter group-hover:text-zinc-400 transition-colors">REF://{tx.reference}</span>
                      </td>
                      <td className="px-8 md:px-14 py-10">
                        <span className="text-sm md:text-base font-black uppercase tracking-tight text-white leading-tight block group-hover:text-[#bef264] transition-colors">{tx.description}</span>
                        <span className="text-[8px] font-black uppercase text-zinc-800 tracking-[0.3em] mt-1.5 block">IMMUTABLE PROTOCOL ENTRY</span>
                      </td>
                      <td className="px-8 md:px-14 py-10 text-right whitespace-nowrap">
                        <div className={`text-xl md:text-3xl font-black font-heading ${tx.type === 'credit' ? 'text-emerald-400' : 'text-zinc-500'}`}>
                          {tx.type === 'credit' ? '+' : '-'}{tx.amount.toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-32 md:p-48 text-center">
              <div className="w-20 h-20 md:w-32 md:h-32 bg-zinc-950 rounded-[3rem] border border-white/5 flex items-center justify-center mx-auto mb-10 shadow-inner group">
                <i className="fa-solid fa-receipt text-zinc-900 text-3xl md:text-5xl group-hover:text-zinc-800 transition-colors"></i>
              </div>
              <p className="text-zinc-800 font-black uppercase text-xs tracking-[0.5em] italic leading-relaxed max-w-sm mx-auto">
                No matching ledger entries found in the vault archives.
              </p>
            </div>
          )}
        </div>

        <div className="mt-16 p-12 bg-zinc-950 rounded-[4rem] border border-white/5 text-center shadow-inner">
           <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.6em] text-zinc-800 italic leading-relaxed">
             Vault activity is an immutable record of protocol interactions. <br className="hidden sm:block" />
             For detailed verification, use the Number Tag Audit Terminal.
           </p>
        </div>

      </div>
    </div>
  );
};

export default TransactionHistory;
