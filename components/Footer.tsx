
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 text-white py-16 md:py-24 border-t border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16 pb-12 md:pb-16 mb-12 md:mb-16 border-b border-white/5">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-8 group">
              <div className="w-8 h-8 bg-[#bef264] rounded-lg flex items-center justify-center text-black font-black text-lg transition-transform group-hover:rotate-12">
                #
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white font-heading">
                Number<span className="text-[#bef264]">Tag</span>
              </span>
            </Link>
            <p className="text-zinc-500 leading-relaxed font-medium text-sm">
              The permission-based networking layer for high-intent professionals. 
              Built for a world where attention is respected.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-[#bef264] mb-6 md:mb-8">Platform</h4>
            <ul className="space-y-4 text-zinc-400 font-medium text-[10px] uppercase tracking-widest">
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/individual-tags" className="hover:text-white transition-colors">Individual Tags</Link></li>
              <li><Link to="/business-api" className="hover:text-white transition-colors">Business API</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-[#bef264] mb-6 md:mb-8">Legal</h4>
            <ul className="space-y-4 text-zinc-400 font-medium text-[10px] uppercase tracking-widest">
              <li><Link to="/privacy-protocol" className="hover:text-white transition-colors">Privacy Protocol</Link></li>
              <li><Link to="/terms-of-intent" className="hover:text-white transition-colors">Terms of Intent</Link></li>
              <li><Link to="/security" className="hover:text-white transition-colors">Security</Link></li>
              <li><Link to="/governance" className="hover:text-white transition-colors">Governance</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-[#bef264] mb-6 md:mb-8">Pulse</h4>
            <div className="flex space-x-4 mb-8">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center hover:bg-[#bef264] hover:text-black transition-all border border-white/5">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center hover:bg-[#bef264] hover:text-black transition-all border border-white/5">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
              <Link to="/philosophy" className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center hover:bg-[#bef264] hover:text-black transition-all border border-white/5" title="Philosophy">
                <i className="fa-solid fa-brain text-xs"></i>
              </Link>
            </div>
            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">© 2024 Number Tag Protocol.</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] gap-6 md:gap-0">
          <div className="italic text-center md:text-left">"Intent-driven connection architecture"</div>
          <div className="flex space-x-8">
            <Link to="/admin-portal" className="hover:text-[#bef264] transition-colors">Protocol Admin</Link>
            <span className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-[#bef264] rounded-full animate-pulse"></span>
              <span>Systems Online</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
