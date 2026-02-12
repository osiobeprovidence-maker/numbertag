import { NumberTag, ConnectionRequest, SocialLink, Transaction, UserProfile, SocialPlatform, UserType, TagExchange } from '../types';

class DataService {
  private STORAGE_KEY = 'nt_protocol_v4_unified';

  private getDB() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) {
      const defaultUser: UserProfile = {
        id: 'usr-default-1',
        email: 'softking@gmail.com',
        name: 'Soft King',
        username: 'softking_node',
        bio: 'Senior Protocol Architect specializing in intent-based networking.',
        location: 'Lagos, Nigeria',
        coins: 5000,
        socials: [
          { platform: 'LinkedIn', url: 'linkedin.com/in/softking' },
          { platform: 'X', url: 'x.com/softking' }
        ],
        joinedAt: Date.now() - 86400000 * 30,
        type: UserType.INDIVIDUAL,
        isPro: false,
        avatar: 'https://picsum.photos/seed/softking/100/100'
      };

      const initialTags: NumberTag[] = [
        {
          id: 'tag-seed-1',
          title: 'Senior Developer',
          intent: 'Open to consulting with up to three strategic projects.',
          isMasked: false, // Added missing isMasked property
          category: 'Collaboration',
          color: 'emerald-500',
          tags: ['React', 'Architecture', 'Web3'],
          owner: 'Soft King',
          location: 'Lagos, Nigeria',
          avatar: 'https://picsum.photos/seed/softking/100/100',
          contactPlatform: 'LinkedIn',
          contactDetail: 'softking@gmail.com',
          socialLinks: defaultUser.socials
        }
      ];

      const initial = { 
        users: [defaultUser], 
        tags: initialTags, 
        requests: [], 
        transactions: [],
        exchanges: []
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  }

  private saveDB(db: any) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(db));
  }

  getCurrentUser(): UserProfile | null {
    const email = localStorage.getItem('nt_user_email');
    if (!email) return null;
    const db = this.getDB();
    return db.users.find((u: UserProfile) => u.email === email) || null;
  }

  subscribePro() {
    const user = this.getCurrentUser();
    if (!user || user.coins < 3000) return false;
    
    const db = this.getDB();
    const uIdx = db.users.findIndex((u: UserProfile) => u.email === user.email);
    db.users[uIdx].coins -= 3000;
    db.users[uIdx].isPro = true;
    db.users[uIdx].proExpiresAt = Date.now() + (86400000 * 30);
    
    this.addTransaction(user.name, 3000, 'debit', 'Tag Pro Subscription (30 Days)');
    this.saveDB(db);
    return true;
  }

  addTransaction(userName: string, amount: number, type: 'credit' | 'debit', description: string, reference?: string) {
    const db = this.getDB();
    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      userName,
      amount,
      type,
      description,
      timestamp: Date.now(),
      reference: reference || `REF-${Math.floor(Math.random() * 900000) + 100000}`
    };
    db.transactions = db.transactions || [];
    db.transactions.unshift(tx);
    const uIdx = db.users.findIndex((u: UserProfile) => u.name === userName);
    if (uIdx !== -1) {
      db.users[uIdx].coins = type === 'credit' ? db.users[uIdx].coins + amount : db.users[uIdx].coins - amount;
    }
    this.saveDB(db);
    return tx;
  }

  getNearbyExchanges(): TagExchange[] {
    const user = this.getCurrentUser();
    if (!user || !user.isPro) return [];
    
    const db = this.getDB();
    const myTag = db.tags.find((t: NumberTag) => t.owner === user.name);
    
    return db.tags
      .filter((t: NumberTag) => t.owner !== user.name && t.category === myTag?.category)
      .map((t: NumberTag) => ({
        id: `exch-${t.id}`,
        tagId: t.id,
        distance: `${(Math.random() * 2).toFixed(1)}km`,
        matchScore: 85 + Math.floor(Math.random() * 15),
        timestamp: Date.now(),
        status: 'waiting',
        tagPreview: {
          title: t.title,
          intent: t.intent,
          category: t.category,
          color: t.color
        }
      }));
  }

  getAllUsers() { return this.getDB().users; }
  getAllTransactions() { return this.getDB().transactions; }
  getTransactions(name: string) { return (this.getDB().transactions || []).filter((t: any) => t.userName === name); }
  
  getTag(id: string): NumberTag | undefined {
    return this.getDB().tags.find((t: NumberTag) => t.id === id);
  }

  updateTag(id: string, updates: Partial<NumberTag>) {
    const db = this.getDB();
    const idx = db.tags.findIndex((t: NumberTag) => t.id === id);
    if (idx !== -1) {
      db.tags[idx] = { ...db.tags[idx], ...updates };
      this.saveDB(db);
      return true;
    }
    return false;
  }

  broadcastTag(tag: any) { const db = this.getDB(); const newTag = { ...tag, id: `tag-${Date.now()}` }; db.tags.push(newTag); this.saveDB(db); return newTag; }
  getMyTags(name: string) { return this.getDB().tags.filter((t: any) => t.owner === name); }
  getDiscoveryTags() { return this.getDB().tags; }
  getInboundRequests(name: string) {
    const db = this.getDB();
    const myTags = db.tags.filter((t: any) => t.owner === name).map((t: any) => t.id);
    return (db.requests || []).filter((r: any) => myTags.includes(r.tagId));
  }
  getOutboundRequests(name: string) { return (this.getDB().requests || []).filter((r: any) => r.senderName === name); }
  updateRequestStatus(id: string, status: string) {
    const db = this.getDB();
    const idx = db.requests.findIndex((r: any) => r.id === id);
    if (idx !== -1) {
      db.requests[idx].status = status;
      if (status === 'accepted') {
        db.requests[idx].acceptedAt = Date.now();
        this.addTransaction(db.requests[idx].senderName, 50, 'debit', `Handshake: ${id}`);
      }
      this.saveDB(db);
    }
  }
  getTagOwnerDetails(id: string) {
    const db = this.getDB();
    const tag = db.tags.find((t: any) => t.id === id);
    return db.users.find((u: any) => u.name === tag?.owner);
  }
  sendRequest(req: any) { const db = this.getDB(); const newReq = { ...req, id: `req-${Date.now()}`, status: 'pending', timestamp: Date.now() }; db.requests.push(newReq); this.saveDB(db); }
  updateUserProfile(email: string, updates: any) {
    const db = this.getDB();
    const idx = db.users.findIndex((u: any) => u.email === email);
    if (idx !== -1) { db.users[idx] = { ...db.users[idx], ...updates }; this.saveDB(db); }
  }

  updateUserAvatar(email: string, avatar: string) {
    const db = this.getDB();
    const idx = db.users.findIndex((u: UserProfile) => u.email === email);
    if (idx !== -1) {
      db.users[idx].avatar = avatar;
      this.saveDB(db);
      return true;
    }
    return false;
  }

  registerUser(userData: any) {
    const db = this.getDB();
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email: userData.email,
      name: userData.name,
      username: userData.username,
      bio: userData.bio || '',
      location: userData.location || '',
      coins: 2500,
      socials: userData.socials || [],
      joinedAt: Date.now(),
      type: UserType.INDIVIDUAL,
      isPro: false,
      avatar: userData.avatar || `https://picsum.photos/seed/${userData.username}/100/100`
    };
    db.users.push(newUser);
    this.saveDB(db);
    localStorage.setItem('nt_user_email', newUser.email);
    return newUser;
  }

  adjustUserBalance(email: string, amount: number, reason: string) {
    const db = this.getDB();
    const user = db.users.find((u: UserProfile) => u.email === email);
    if (user) {
      this.addTransaction(
        user.name,
        Math.abs(amount),
        amount >= 0 ? 'credit' : 'debit',
        `Admin Intervention: ${reason}`
      );
    }
  }
}

export const dataService = new DataService();