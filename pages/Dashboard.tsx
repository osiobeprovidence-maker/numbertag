
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { globalSignalScout } from '../services/geminiService';
import { ConnectionRequest, NumberTag, SocialPlatform, SocialLink, UserProfile, TagExchange } from '../types';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'signals' | 'discovery' | 'exchange' | 'inbox' | 'outbox' | 'connections' | 'profile'>('signals');
  const [user, setUser] = useState<UserProfile | null>(dataService.getCurrentUser());
  const [inboundRequests, setInboundRequests] = useState<ConnectionRequest[]>([]);
  const [outboundRequests, setOutboundRequests] = useState<ConnectionRequest[]>([]);
  const [myTags, setMyTags] = useState<NumberTag[]>([]);
  const [discoveryTags, setDiscoveryTags] = useState<NumberTag[]>([]);
  const [exchanges, setExchanges] = useState<TagExchange[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isScouting, setIsScouting] = useState(false);
  const [globalResults, setGlobalResults] = useState<{text: string, links: {uri: string, title: string}[]} | null>(null);

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    location: user?.location || '',
    bio: user?.bio || '',
    socialLinks: user?.socials || [] as SocialLink[]
  });

  const [viewingTagDetails, setViewingTagDetails] = useState<NumberTag | null>(null);
  const [selectedDiscoveryTag, setSelectedDiscoveryTag] = useState<NumberTag | null>(null);
  const [pitch, setPitch] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    refreshData();
  }, [activeTab]);

  const refreshData = () => {
    const u = dataService.getCurrentUser();
    if (u) {
      setUser(u);
      setMyTags(dataService.getMyTags(u.name));
      setInboundRequests(dataService.getInboundRequests(u.name));
      setOutboundRequests(dataService.getOutboundRequests(u.name));
      setDiscoveryTags(dataService.getDiscoveryTags().filter(t => t.owner !== u.name));
      if (u.isPro) {
        setExchanges(dataService.getNearbyExchanges());
      }
      setProfileForm({
        name: u.name,
        username: u.username,
        location: u.location,
        bio: u.bio,
        socialLinks: [...(u.socials || [])]
      });
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddSocial = () => {
    setProfileForm(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: 'LinkedIn', url: '' }]
    }));
  };

  const handleSocialChangePlatform = (index: number, platform: SocialPlatform) => {
    const updated = [...profileForm.socialLinks];
    updated[index] = { ...updated[index], platform };
    setProfileForm(prev => ({ ...prev, socialLinks: updated }));
  };

  const handleSocialChange = (index: number, field: string, value: string) => {
    const updated = [...profileForm.socialLinks];
    updated[index] = { ...updated[index], [field]: value } as SocialLink;
    setProfileForm(prev => ({ ...prev, socialLinks: updated }));
  };

  const handleRemoveSocial = (index: number) => {
    setProfileForm(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        dataService.updateUserAvatar(user.email, base64String);
        refreshData();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = () => {
    if (user) {
      dataService.updateUserProfile(user.email, {
        name: profileForm.name,
        username: profileForm.username,
        location: profileForm.location,
        bio: profileForm.bio,
        socials: profileForm.socialLinks
      });
      setEditingProfile(false);
      refreshData();
      alert("Node Calibration Successful.");
    }
  };

  const handleGlobalSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsScouting(true);
    setGlobalResults(null);
    try {
      const results = await globalSignalScout(searchQuery);
      setGlobalResults(results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsScouting(false);
    }
  };

  const handleSubscribePro = () => {
    if (!user) return;
    if (user.coins < 3000) {
      alert("Insufficient Vault TC. 3,000 TC required for Pro Activation.");
      return;
    }
    setIsSubscribing(true);
    setTimeout(() => {
      const success = dataService.subscribePro();
      if (success) {
        alert("Tag Pro Activated: Passive Discovery Radar is now ONLINE.");
        refreshData();
      }
      setIsSubscribing(false);
    }, 1500);
  };

  const formatSocialUrl = (platform: SocialPlatform, value: string) => {
    if (!value) return '#';
    const clean = value.replace('@', '').trim();
    if (value.startsWith('http')) return value;
    switch (platform) {
      case 'WhatsApp': return `https://wa.me/${clean}`;
      case 'Telegram': return `https://t.me/${clean}`;
      case 'LinkedIn': return `https://linkedin.com/in/${clean}`;
      case 'Instagram': return `https://instagram.com/${clean}`;
      case 'X': return `https://x.com/${clean}`;
      default: return value;
    }
  };

  const getSocialIcon = (platform: SocialPlatform) => {
    switch(platform) {
      case 'WhatsApp': return 'fa-brands fa-whatsapp';
      case 'Telegram': return 'fa-brands fa-telegram';
      case 'LinkedIn': return 'fa-brands fa-linkedin-in';
      case 'Instagram': return 'fa-brands fa-instagram';
      case 'X': return 'fa-brands fa-x-twitter';
      case 'Portfolio': return 'fa-solid fa-globe';
      default: return 'fa-solid fa-link';
    }
  };

  const filteredDiscovery = discoveryTags.filter(tag => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    const matchesPublic = 
      (tag.publicTitle || tag.title).toLowerCase().includes(query) ||
      (tag.publicIntent || tag.intent).toLowerCase().includes(query);

    const matchesPrivate = 
      tag.isMasked && (
        tag.title.toLowerCase().includes(query) || 
        tag.intent.toLowerCase().includes(query)
      );

    const matchesTags = tag.tags.some(t => t.toLowerCase().includes(query));

    return matchesPublic || matchesPrivate || matchesTags;
  });

  const handleInboundAction = (id: string, status: 'accepted' | 'declined') => {
    dataService.updateRequestStatus(id, status);
    refreshData();
  };

  const handleSendSignal = async () => {
    if (!user || user.coins < 50 || !selectedDiscoveryTag) {
      alert("Insufficient Resources for handshake. 50 TC required.");
      return;
    }
    dataService.sendRequest({
      senderName: user.name,
      senderLogo: user.avatar || `https://picsum.photos/seed/${user.name}/100/100`,
      reason: pitch,
      opportunity: "Strategic Alignment",
      tagId: selectedDiscoveryTag.id
    });
    setSelectedDiscoveryTag(null);
    setPitch('');
    refreshData();
    alert("Signal transmitted successfully.");
  };

  const getContactButtons = (otherPartyName: string, preferredPlatform?: SocialPlatform, preferredDetail?: string) => {
    const otherUser = dataService.getAllUsers().find(u => u.name === otherPartyName);
    if (!otherUser) return null;

    const platformsToShow: SocialPlatform[] = ['WhatsApp', 'Telegram', 'LinkedIn'];
    const displayedSocials = (otherUser.socials || []).filter(s => platformsToShow.includes(s.platform));
    
    if (preferredPlatform && preferredDetail && !displayedSocials.find(s => s.platform === preferredPlatform)) {
      displayedSocials.unshift({ platform: preferredPlatform, url: preferredDetail });
    }

    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {displayedSocials.map((s, idx) => {
          const isPreferred = s.platform === preferredPlatform;
          return (
            <a 
              key={idx}
              href={formatSocialUrl(s.platform, s.url)}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all active:scale-95 animate-scale-in stagger-${idx % 5 + 1} ${
                isPreferred 
                  ? 'bg-[#bef264] text-black border-[#bef264] shadow-lg shadow-[#bef264]/20 scale-105' 
                  : 'bg-zinc-800 text-white hover:bg-[#bef264] hover:text-black border-white/5'
              }`}
            >
              <i className={getSocialIcon(s.platform)}></i>
              <span>{s.platform}</span>
              {isPreferred && <i className="fa-solid fa-star ml-1 text-[8px]"></i>}
            </a>
          );
        })}
      </div>
    );
  };

  const getAcceptedConnections = () => {
    return [...inboundRequests, ...outboundRequests]
      .filter(r => r.status === 'accepted')
      .sort((a, b) => (b.acceptedAt || 0) - (a.acceptedAt || 0));
  };

  if (!user) return null;

  const tabs = [
    { id: 'signals', label: 'Signals', icon: 'fa-tower-broadcast' },
    { id: 'discovery', label: 'Board', icon: 'fa-chalkboard' },
    { id: 'exchange', label: 'Pulse', icon: 'fa-satellite-dish' },
    { id: 'inbox', label: 'Inbox', icon: 'fa-inbox', count: inboundRequests.filter(r => r.status === 'pending').length },
    { id: 'connections', label: 'Connections', icon: 'fa-user-check' },
    { id: 'profile', label: 'Identity', icon: 'fa-fingerprint' }
  ];

  const mobileNavItems = [
    { id: 'signals', label: 'Signals', icon: 'fa-house' },
    { id: 'discovery', label: 'Board', icon: 'fa-search' },
    { id: 'exchange', label: 'Pulse', icon: 'fa-radar' },
    { id: 'inbox', label: 'Inbox', icon: 'fa-comment-dots', count: inboundRequests.filter(r => r.status === 'pending').length },
    { id: 'connections', label: 'Vault', icon: 'fa-user-group' }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] pt-24 md:pt-36 pb-32 md:pb-24 text-white">
      <div className="container mx-auto px-4 sm:px-12 max-w-7xl">
        
        {/* Command Center Header */}
        <header className="mb-8 md:mb-12 bg-zinc-900/40 p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/5 backdrop-blur-3xl relative overflow-hidden group animate-fade-in">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#bef264] to-transparent opacity-40"></div>
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6 md:gap-8">
            <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
              <div 
                onClick={handleAvatarClick}
                className="w-12 h-12 md:w-20 md:h-20 bg-zinc-950 rounded-[1.2rem] md:rounded-[1.5rem] border-2 border-white/5 flex items-center justify-center shadow-2xl relative overflow-hidden shrink-0 cursor-pointer group/avatar"
              >
                 <img src={user.avatar || `https://picsum.photos/seed/${user.username}/100/100`} alt="P" className="w-full h-full object-cover opacity-80 group-hover/avatar:opacity-40 transition-opacity" />
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                    <i className="fa-solid fa-camera text-white text-base"></i>
                 </div>
                 {user.isPro && (
                   <div className="absolute top-1 right-1 w-4 h-4 md:w-5 md:h-5 bg-[#bef264] rounded-full flex items-center justify-center text-black text-[6px] md:text-[7px] font-black border-2 border-zinc-950 shadow-lg">PRO</div>
                 )}
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="hidden md:block text-[8px] font-black uppercase tracking-[0.4em] text-[#bef264] mb-1.5 animate-slide-left stagger-1">Active Node</span>
                <h1 className="text-lg md:text-3xl font-black font-heading tracking-tighter uppercase italic leading-none truncate block animate-slide-left stagger-2">
                  {user.name}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-1 md:mt-2 animate-slide-left stagger-3">
                  <span className="px-2 py-0.5 bg-zinc-950 rounded-lg border border-white/5 text-[6px] md:text-[7px] font-black uppercase text-zinc-500">@{user.username}</span>
                  <span className="px-2 py-0.5 bg-zinc-950 rounded-lg border border-white/5 text-[6px] md:text-[7px] font-black uppercase text-emerald-400">
                    <i className="fa-solid fa-location-dot mr-1"></i>{user.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-row md:flex-col sm:flex-row items-center gap-3 md:gap-4 shrink-0 lg:w-[420px] justify-end animate-slide-up stagger-3">
              <div className="text-right bg-zinc-950/50 p-3 md:p-5 rounded-xl md:rounded-[1.8rem] border border-white/5 flex-1 md:flex-none md:min-w-[160px]">
                <span className="text-[6px] md:text-[7px] font-black uppercase text-zinc-600 block mb-0.5 md:mb-1 tracking-widest">Vault Balance</span>
                <div className="flex items-center justify-end space-x-1.5 md:space-x-2 text-base md:text-2xl font-black text-amber-500 font-heading">
                  <i className="fa-solid fa-coins text-[8px] md:text-[10px]"></i>
                  <span>{user.coins.toLocaleString()}</span>
                </div>
              </div>
              <Link to="/top-up" className="bg-[#bef264] text-black font-black px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-xl shadow-[#bef264]/10 hover:scale-105 transition-all uppercase tracking-widest text-[8px] text-center">Refill</Link>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="hidden md:flex gap-2 p-1.5 bg-zinc-900/50 rounded-[2.5rem] mb-10 border border-white/5 overflow-x-auto scrollbar-hide animate-slide-up stagger-4">
          {tabs.map((tab, idx) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[120px] md:min-w-0 py-4 px-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 animate-scale-in stagger-${idx + 1} ${activeTab === tab.id ? 'bg-[#bef264] text-black shadow-lg shadow-[#bef264]/10' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              <span className="whitespace-nowrap">{tab.label}</span>
              {tab.count ? <span className="w-4 h-4 bg-black text-[#bef264] rounded-full flex items-center justify-center text-[7px] font-black">{tab.count}</span> : null}
            </button>
          ))}
        </div>

        {/* Mobile-Native Bottom Navigation Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[500] px-4 pb-6 pt-2 bg-gradient-to-t from-[#09090b] via-[#09090b]/95 to-transparent pointer-events-none">
          <div className="max-w-md mx-auto h-20 bg-zinc-950/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] flex items-center justify-around px-2 shadow-2xl pointer-events-auto overflow-hidden relative">
            {mobileNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`relative h-full flex-1 flex flex-col items-center justify-center gap-1 transition-all active:scale-90 ${activeTab === item.id ? 'text-[#bef264]' : 'text-zinc-500'}`}
              >
                {activeTab === item.id && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-[#bef264] rounded-b-full shadow-[0_4px_10px_rgba(190,242,100,0.4)]"></div>
                )}
                <div className="relative">
                  <i className={`fa-solid ${item.icon} text-lg`}></i>
                  {item.count ? (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#bef264] text-black text-[8px] font-black rounded-full flex items-center justify-center border border-zinc-950">
                      {item.count}
                    </span>
                  ) : null}
                </div>
                <span className="text-[7px] font-black uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
            <button
               onClick={() => setActiveTab('profile')}
               className={`h-full flex-1 flex flex-col items-center justify-center gap-1 transition-all active:scale-90 ${activeTab === 'profile' ? 'text-[#bef264]' : 'text-zinc-500'}`}
            >
               {activeTab === 'profile' && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-[#bef264] rounded-b-full shadow-[0_4px_10px_rgba(190,242,100,0.4)]"></div>
                )}
               <div className="w-6 h-6 rounded-full border border-white/10 overflow-hidden">
                  <img src={user.avatar || `https://picsum.photos/seed/${user.username}/100/100`} className={`w-full h-full object-cover ${activeTab === 'profile' ? '' : 'grayscale'}`} alt="P" />
               </div>
               <span className="text-[7px] font-black uppercase tracking-widest">Me</span>
            </button>
          </div>
        </div>

        {/* View Content Area */}
        <div className="animate-fade-in stagger-5 opacity-0" style={{ animationFillMode: 'forwards' }}>
          
          {activeTab === 'signals' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myTags.map((tag, idx) => (
                <div key={tag.id} className={`p-8 rounded-[2.5rem] bg-zinc-900/40 border-2 ${tag.isMasked ? 'border-[#bef264]/20' : 'border-white/5'} hover:border-[#bef264]/30 transition-all group flex flex-col relative overflow-hidden animate-scale-in stagger-${idx % 5 + 1}`}>
                  <div className="absolute top-0 right-0 p-6 flex flex-col items-end gap-2">
                    <span className="text-[8px] font-black uppercase text-zinc-800 tracking-widest">#{tag.id.slice(-6)}</span>
                    {tag.isMasked && <i className="fa-solid fa-mask text-[#bef264]/60 text-[10px]"></i>}
                  </div>
                  <div className="flex justify-between items-center mb-8">
                    <div className="w-10 h-10 bg-zinc-950 rounded-xl flex items-center justify-center text-[#bef264] font-black border border-white/5 shadow-inner">#</div>
                    <span className="px-2.5 py-1 bg-zinc-950 text-[#bef264] text-[7px] font-black uppercase rounded-lg border border-white/5">{tag.category}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black font-heading mb-3 uppercase leading-tight group-hover:text-[#bef264] transition-colors">{tag.title}</h3>
                  <p className="text-zinc-500 text-sm italic mb-8 flex-grow leading-relaxed font-medium">"{tag.intent}"</p>
                  <Link 
                    to={`/edit-tag/${tag.id}`}
                    className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all border border-white/5 text-center block"
                  >
                    Adjust Signal
                  </Link>
                </div>
              ))}
              <Link to="/create-tag" className="p-8 rounded-[2.5rem] border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center text-center group hover:border-[#bef264]/30 transition-all min-h-[300px] animate-scale-in stagger-5">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-plus text-xl text-zinc-700 group-hover:text-[#bef264]"></i>
                </div>
                <span className="font-black uppercase tracking-widest text-[9px] text-zinc-600">Broadcast Intent Signal</span>
              </Link>
            </div>
          )}

          {activeTab === 'discovery' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 animate-slide-up stagger-1">
                <div className="min-w-0 hidden md:block">
                  <h2 className="text-2xl md:text-3xl font-black font-heading uppercase italic tracking-tighter text-white">Signals Terminal</h2>
                  <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">Cross-referencing Global Intents</p>
                </div>
                <div className="relative group w-full max-w-lg flex gap-2">
                  <div className="relative flex-1">
                    <i className="fa-solid fa-search absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#bef264] transition-colors"></i>
                    <input 
                      type="text" 
                      placeholder="Search true intents (discreet nodes matched)..." 
                      value={searchQuery} 
                      onChange={e => setSearchQuery(e.target.value)} 
                      className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-14 pr-6 focus:border-[#bef264]/30 transition-all text-white font-bold text-xs outline-none shadow-inner" 
                    />
                  </div>
                  <button 
                    onClick={handleGlobalSearch}
                    disabled={isScouting || !searchQuery.trim()}
                    className="bg-[#bef264] text-black font-black px-6 rounded-2xl text-[9px] uppercase tracking-widest shadow-lg shadow-[#bef264]/10 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isScouting ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-globe"></i>}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDiscovery.map((tag, idx) => {
                   const isDirectSearchMatch = searchQuery.trim() !== '' && (
                     tag.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     tag.intent.toLowerCase().includes(searchQuery.toLowerCase())
                   );

                   return (
                    <div key={tag.id} className={`p-8 bg-zinc-900/40 rounded-[2.5rem] border ${isDirectSearchMatch ? 'border-[#bef264] shadow-[0_0_30px_rgba(190,242,100,0.1)]' : 'border-white/5'} flex flex-col hover:border-[#bef264]/30 transition-all group relative overflow-hidden animate-scale-in stagger-${idx % 5 + 1}`}>
                      <div className="flex items-start justify-between mb-6">
                         <div className="w-14 h-14 rounded-xl border-2 border-zinc-800 p-1 bg-zinc-950 overflow-hidden shadow-2xl shrink-0 cursor-pointer relative" onClick={() => setViewingTagDetails(tag)}>
                            <img src={tag.avatar || `https://picsum.photos/seed/${tag.owner}/100/100`} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" alt="P" />
                         </div>
                         <div className="flex flex-col items-end gap-1.5">
                           <span className="px-2.5 py-1 bg-zinc-950 text-[#bef264] text-[7px] font-black uppercase rounded-lg border border-white/5">{tag.category}</span>
                           {isDirectSearchMatch && <span className="bg-[#bef264] text-black text-[6px] font-black px-1.5 py-0.5 rounded animate-pulse">INTENT MATCH</span>}
                         </div>
                      </div>
                      
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">{tag.isMasked ? 'Ghost Node' : tag.owner}</h4>
                      
                      <h3 className="text-xl font-black font-heading uppercase mb-3 leading-none group-hover:text-[#bef264] transition-colors cursor-pointer" onClick={() => setViewingTagDetails(tag)}>
                        {tag.isMasked ? (tag.publicTitle || tag.title) : tag.title}
                      </h3>
                      
                      <p className="text-zinc-500 text-sm italic mb-8 flex-grow leading-relaxed font-medium">
                        "{tag.isMasked ? (tag.publicIntent || tag.intent) : tag.intent}"
                      </p>
                      
                      <button 
                        onClick={() => setSelectedDiscoveryTag(tag)} 
                        className="w-full bg-white text-black font-black py-4 rounded-xl uppercase text-[9px] tracking-[0.2em] hover:bg-[#bef264] transition-all active:scale-95 shadow-lg"
                      >
                        Initiate Handshake
                      </button>
                    </div>
                   );
                })}
              </div>
            </div>
          )}

          {activeTab === 'exchange' && (
            <div className="space-y-12 animate-fade-in stagger-2">
               {!user.isPro ? (
                 <div className="max-w-2xl mx-auto p-10 md:p-16 bg-zinc-900/30 rounded-[3rem] md:rounded-[4rem] border border-[#bef264]/20 text-center relative overflow-hidden animate-scale-in">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#bef264] mb-6 block">Passive Protocol</span>
                    <h2 className="text-3xl md:text-5xl font-black font-heading uppercase tracking-tighter mb-6 leading-none">Automated <br/><span className="text-zinc-800">Exchange</span></h2>
                    <p className="text-zinc-500 italic text-base mb-10 leading-relaxed font-medium">
                      Calibrate your node for proximity-based passive discovery. Scan local intent layers automatically while you move.
                    </p>
                    <button 
                      onClick={handleSubscribePro}
                      disabled={isSubscribing}
                      className="block w-full bg-[#bef264] text-black font-black py-5 rounded-2xl uppercase tracking-[0.3em] text-[10px] hover:scale-[1.02] active:scale-95 shadow-xl shadow-[#bef264]/20 transition-all"
                    >
                      {isSubscribing ? <i className="fa-solid fa-spinner animate-spin"></i> : "Activate Pro Mesh (3,000 TC)"}
                    </button>
                 </div>
               ) : (
                 <div className="space-y-10">
                   <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-zinc-900/20 p-8 rounded-[2.5rem] border border-white/5 animate-slide-up">
                      <div className="text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-black font-heading uppercase italic tracking-tighter">Proximity Mesh</h2>
                        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Radar active in local proximity</p>
                      </div>
                      <div className="relative w-24 h-24 flex items-center justify-center">
                         <div className="absolute inset-0 border-2 border-[#bef264]/10 rounded-full"></div>
                         <div className="absolute inset-0 border-2 border-[#bef264]/30 rounded-full animate-ping"></div>
                         <i className="fa-solid fa-satellite-dish text-[#bef264] text-2xl"></i>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {exchanges.map((exch, idx) => (
                       <div key={exch.id} className={`p-8 bg-zinc-900/40 rounded-[2.5rem] border border-white/5 hover:border-[#bef264]/20 transition-all relative overflow-hidden group animate-scale-in stagger-${idx % 5 + 1}`}>
                          <div className="absolute top-0 right-0 p-6">
                             <span className="text-[8px] font-black uppercase tracking-widest text-[#bef264]">{exch.matchScore}% MATCH</span>
                          </div>
                          <div className="flex items-center gap-4 mb-6">
                             <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-white/10 flex items-center justify-center text-zinc-700">
                                <i className="fa-solid fa-mask"></i>
                             </div>
                             <div>
                               <h4 className="text-[9px] font-black uppercase text-zinc-600 mb-0.5">Ghost Node</h4>
                               <span className="px-2 py-0.5 bg-zinc-950 rounded text-[7px] font-black uppercase text-zinc-700">{exch.distance}</span>
                             </div>
                          </div>
                          <h3 className="text-xl font-black font-heading uppercase mb-2 leading-none">{exch.tagPreview.title}</h3>
                          <p className="text-zinc-500 italic text-xs mb-8 font-medium line-clamp-2">"{exch.tagPreview.intent}"</p>
                          <button className="w-full bg-white text-black font-black py-3.5 rounded-xl uppercase text-[9px] tracking-[0.2em] hover:bg-[#bef264] transition-all">Handshake</button>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
            </div>
          )}

          {activeTab === 'inbox' && (
            <div className="space-y-4">
              {inboundRequests.length > 0 ? inboundRequests.map((req, idx) => {
                const tag = myTags.find(t => t.id === req.tagId);
                return (
                  <div key={req.id} className={`p-6 md:p-8 rounded-[2rem] bg-zinc-900/40 border transition-all animate-slide-up stagger-${idx % 5 + 1} ${req.status === 'accepted' ? 'border-emerald-500/20' : 'border-white/5'}`}>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left min-w-0">
                         <div className="w-16 h-16 bg-zinc-950 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
                           <img src={req.senderLogo} className="w-full h-full object-cover opacity-70" alt="S" />
                         </div>
                         <div className="min-w-0">
                           <h4 className="text-xl font-black font-heading uppercase leading-none">{req.senderName}</h4>
                           <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest mb-3 italic">Signal: {tag?.isMasked ? (tag.publicTitle || tag.title) : tag?.title}</p>
                           <p className="text-zinc-400 italic text-sm leading-relaxed font-medium">"{req.reason}"</p>
                           {req.status === 'accepted' && (
                             <div className="mt-2">
                               {getContactButtons(req.senderName)}
                             </div>
                           )}
                         </div>
                      </div>
                      <div className="flex gap-3 w-full md:w-auto">
                        {req.status === 'pending' ? (
                          <>
                            <button onClick={() => handleInboundAction(req.id, 'accepted')} className="flex-1 px-8 py-3.5 bg-[#bef264] text-black font-black rounded-xl text-[9px] uppercase tracking-widest transition-all">Accept</button>
                            <button onClick={() => handleInboundAction(req.id, 'declined')} className="flex-1 px-8 py-3.5 bg-zinc-800 text-white font-black rounded-xl text-[9px] uppercase tracking-widest transition-all">Skip</button>
                          </>
                        ) : (
                          <span className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase border ${req.status === 'accepted' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>{req.status}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="p-20 text-center bg-zinc-900/20 rounded-[2.5rem] border-2 border-dashed border-zinc-900 animate-scale-in">
                  <p className="text-zinc-800 font-black uppercase text-[9px] tracking-[0.5em] italic">Inbox Empty.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'connections' && (
            <div className="space-y-6">
               <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 animate-slide-up stagger-1">
                  <div>
                    <h2 className="text-xl md:text-2xl font-black font-heading uppercase tracking-tight">Handshake History</h2>
                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Historical Log of Verified Connections</p>
                  </div>
               </div>
               {getAcceptedConnections().length > 0 ? (
                 <div className="grid grid-cols-1 gap-4">
                    {getAcceptedConnections().map((conn, idx) => {
                      const tag = discoveryTags.find(t => t.id === conn.tagId) || myTags.find(t => t.id === conn.tagId);
                      const otherNodeName = conn.senderName === user.name ? (tag?.owner || 'Other Node') : conn.senderName;
                      const otherNodeLogo = conn.senderName === user.name ? (tag?.avatar || `https://picsum.photos/seed/${otherNodeName}/100/100`) : conn.senderLogo;
                      return (
                        <div key={conn.id} className={`p-6 md:p-8 bg-zinc-900/40 rounded-[2.5rem] border border-emerald-500/10 relative group overflow-hidden animate-slide-up stagger-${idx % 5 + 1}`}>
                           <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
                              <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-950 rounded-2xl border border-white/5 overflow-hidden shadow-2xl shrink-0">
                                 <img src={otherNodeLogo} className="w-full h-full object-cover" alt="Node" />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <h3 className="text-xl md:text-2xl font-black font-heading uppercase mb-2">{otherNodeName}</h3>
                                 <div className="flex flex-wrap items-center gap-3">
                                    <div className="px-3 py-1.5 bg-zinc-950 rounded-lg border border-white/5">
                                       <span className="text-[7px] font-black uppercase text-zinc-500 block mb-0.5">Signal</span>
                                       <span className="text-[10px] font-black uppercase text-white">{tag?.isMasked ? tag.title : tag?.title}</span>
                                    </div>
                                    <div className="px-3 py-1.5 bg-zinc-950 rounded-lg border border-white/5">
                                       <span className="text-[7px] font-black uppercase text-zinc-500 block mb-0.5">Date</span>
                                       <span className="text-[10px] font-black uppercase text-zinc-400">{conn.acceptedAt ? new Date(conn.acceptedAt).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-white/5 md:pl-8">
                                 {getContactButtons(otherNodeName, tag?.contactPlatform, tag?.contactDetail)}
                              </div>
                           </div>
                        </div>
                      );
                    })}
                 </div>
               ) : (
                 <div className="p-32 text-center bg-zinc-900/20 rounded-[3rem] border-2 border-dashed border-zinc-900 animate-scale-in">
                    <p className="text-zinc-800 font-black uppercase text-[10px] tracking-[0.5em] italic">Ledger Empty.</p>
                 </div>
               )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8 animate-slide-left stagger-2">
                <section className="bg-zinc-900/20 p-8 rounded-[2.5rem] border border-white/5">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[#bef264] mb-8">Node Narrative</h3>
                  <p className="text-lg md:text-xl text-zinc-300 leading-relaxed font-medium italic">"{user.bio || 'Calibration required.'}"</p>
                </section>
                <section className="bg-zinc-900/20 p-8 rounded-[2.5rem] border border-white/5">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-[#bef264] mb-8">Identity Protocols</h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {user.socials?.length > 0 ? user.socials?.map((s, i) => (
                       <a key={i} href={formatSocialUrl(s.platform, s.url)} target="_blank" rel="noreferrer" className={`flex items-center justify-between p-5 bg-zinc-950 border border-white/5 rounded-2xl group transition-all hover:border-[#bef264]/40 animate-scale-in stagger-${i % 5 + 1}`}>
                         <div className="flex items-center gap-3">
                           <i className={`${getSocialIcon(s.platform)} text-[#bef264] text-lg`}></i>
                           <span className="text-[9px] font-black uppercase text-zinc-500 group-hover:text-white transition-colors">{s.platform}</span>
                         </div>
                         <i className="fa-solid fa-arrow-up-right-from-square text-[8px] text-zinc-800 group-hover:text-[#bef264] transition-colors"></i>
                       </a>
                     )) : (
                       <p className="text-zinc-600 text-[10px] uppercase font-black italic p-4">No social protocols calibrated.</p>
                     )}
                   </div>
                </section>
              </div>
              <div className="bg-zinc-900/40 p-10 rounded-[2.5rem] border border-white/5 text-center flex flex-col items-center animate-slide-up stagger-3">
                 <div className="w-20 h-20 bg-zinc-950 rounded-[2rem] border-2 border-white/5 flex items-center justify-center mb-6 overflow-hidden">
                   <img src={user.avatar || `https://picsum.photos/seed/${user.username}/100/100`} alt="Avatar" className="w-full h-full object-cover" />
                 </div>
                 <button onClick={() => setEditingProfile(true)} className="w-full bg-white text-black font-black py-4 rounded-xl text-[9px] uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl">Calibrate Node</button>
                 <Link to="/transaction-history" className="mt-8 text-[8px] font-black uppercase tracking-widest text-zinc-700 hover:text-white transition-colors">Audit Vault Ledger</Link>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Tag Details Modal */}
      {viewingTagDetails && (
        <div className="fixed inset-0 z-[800] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-xl animate-fade-in" onClick={() => setViewingTagDetails(null)}></div>
          <div className="relative bg-zinc-900 w-full max-w-2xl rounded-[3rem] p-8 md:p-12 border border-white/10 animate-scale-in">
             <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-zinc-950 rounded-xl border border-white/5 overflow-hidden">
                      <img src={viewingTagDetails.avatar || `https://picsum.photos/seed/${viewingTagDetails.owner}/100/100`} className="w-full h-full object-cover" alt="Avatar" />
                   </div>
                   <h3 className="text-2xl font-black font-heading uppercase tracking-tighter italic text-white">{viewingTagDetails.isMasked ? 'Ghost Node' : viewingTagDetails.owner}</h3>
                </div>
                <button onClick={() => setViewingTagDetails(null)} className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500 hover:text-white transition-colors"><i className="fa-solid fa-xmark"></i></button>
             </div>
             <div className="space-y-8">
                <div className="p-8 bg-zinc-950 rounded-[2rem] border border-[#bef264]/20 animate-slide-up">
                   <span className="px-2.5 py-1 bg-zinc-900 text-[#bef264] text-[7px] font-black uppercase rounded-lg border border-white/5 mb-4 inline-block">{viewingTagDetails.category}</span>
                   <h4 className="text-3xl font-black font-heading uppercase tracking-tighter mb-4">{viewingTagDetails.isMasked ? (viewingTagDetails.publicTitle || viewingTagDetails.title) : viewingTagDetails.title}</h4>
                   <p className="text-zinc-400 italic text-lg leading-relaxed font-medium">"{viewingTagDetails.isMasked ? (viewingTagDetails.publicIntent || viewingTagDetails.intent) : viewingTagDetails.intent}"</p>
                </div>
                {viewingTagDetails.isMasked && (
                   <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest italic text-center animate-pulse">Protocol Note: This is a masked node. True intent revealed only upon match or handshake.</p>
                )}
                <div className="flex gap-4 pt-4 animate-slide-up stagger-1">
                   <button onClick={() => setViewingTagDetails(null)} className="flex-1 py-4 bg-zinc-800 rounded-xl font-black text-[10px] uppercase tracking-widest text-white hover:bg-zinc-700 transition-colors">Back</button>
                   <button 
                     onClick={() => { setSelectedDiscoveryTag(viewingTagDetails); setViewingTagDetails(null); }} 
                     className="flex-[2] py-4 bg-[#bef264] text-black rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#bef264]/20 hover:scale-[1.02] active:scale-95 transition-all"
                   >
                     Initiate Handshake (50 TC)
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Handshake Pitch Modal */}
      {selectedDiscoveryTag && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-xl animate-fade-in" onClick={() => setSelectedDiscoveryTag(null)}></div>
          <div className="relative bg-zinc-900 w-full max-w-xl rounded-[3rem] p-8 md:p-12 border border-white/10 animate-scale-in">
             <h3 className="text-xl font-black font-heading uppercase mb-8">Initialize Handshake</h3>
             <textarea 
               className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-6 h-40 text-sm text-white italic mb-8 outline-none focus:border-[#bef264]/30 shadow-inner resize-none placeholder-zinc-800 animate-slide-up" 
               placeholder="Craft your alignment pitch... (Costs 50 TC)" 
               value={pitch} 
               onChange={e => setPitch(e.target.value)} 
             />
             <div className="flex gap-4 animate-slide-up stagger-1">
               <button onClick={() => setSelectedDiscoveryTag(null)} className="flex-1 py-4 bg-zinc-800 rounded-xl uppercase font-black text-[9px] tracking-widest text-white">Abort</button>
               <button 
                 onClick={handleSendSignal} 
                 disabled={!pitch.trim()}
                 className="flex-[2] py-4 bg-[#bef264] text-black rounded-xl uppercase font-black text-[9px] tracking-widest shadow-xl shadow-[#bef264]/10 transition-all active:scale-95 disabled:opacity-50"
               >
                 Transmit Signal
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
