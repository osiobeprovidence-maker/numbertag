
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  onLogout: () => void;
  isAuthenticated: boolean;
}

const Header: React.FC<HeaderProps> = ({ onLogout, isAuthenticated }) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: '/how-it-works', label: 'How it Works' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/philosophy', label: 'Philosophy' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 sm:px-6 py-4`}>
      <div className={`container mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 py-3 rounded-2xl transition-all duration-500 ${scrolled || isMenuOpen ? 'glass-dark shadow-2xl translate-y-2' : 'bg-transparent'}`}>
        <Link to="/" className="flex items-center space-x-3 group relative z-[110]">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#bef264] rounded-lg flex items-center justify-center text-black font-black text-lg sm:text-xl transition-transform group-hover:rotate-12">
            #
          </div>
          <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white font-heading">
            Number<span className="text-[#bef264]">Tag</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${location.pathname === link.path ? 'text-[#bef264]' : 'text-zinc-400 hover:text-[#bef264]'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-white hover:text-[#bef264] transition-colors px-4">
                  Sign In
                </Link>
                <Link to="/join" className="bg-[#bef264] hover:bg-[#d9ff96] text-black font-black px-6 py-2.5 rounded-xl transition-all active:scale-95 text-[10px] uppercase tracking-widest">
                  Get Started
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/dashboard" className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-5 py-2 rounded-xl border border-white/5 transition-all text-[10px] uppercase tracking-widest">
                  Dashboard
                </Link>
                <button 
                  onClick={onLogout}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                >
                  <i className="fa-solid fa-power-off"></i>
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-zinc-900/50 backdrop-blur-lg rounded-xl border border-white/10 relative z-[110]"
            aria-label="Toggle Menu"
          >
            <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      <div className={`md:hidden fixed inset-0 z-[105] bg-zinc-950 transition-all duration-500 ease-in-out ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col items-center justify-center h-full space-y-8 px-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-2xl font-black uppercase tracking-[0.4em] transition-colors ${location.pathname === link.path ? 'text-[#bef264]' : 'text-zinc-500'}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="w-16 h-px bg-white/10"></div>
          <div className="flex flex-col items-center space-y-6 w-full max-w-xs">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-sm font-black uppercase tracking-widest text-zinc-400">Sign In</Link>
                <Link to="/join" className="w-full bg-[#bef264] text-black font-black py-5 rounded-2xl text-center text-xs uppercase tracking-[0.3em]">Get Started</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="w-full bg-zinc-900 text-white font-black py-5 rounded-2xl text-center text-xs uppercase tracking-[0.3em] border border-white/5">Dashboard</Link>
                <button onClick={onLogout} className="w-full bg-red-500/10 text-red-500 font-black py-5 rounded-2xl text-xs uppercase tracking-[0.3em] border border-red-500/20">Terminate Session</button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
