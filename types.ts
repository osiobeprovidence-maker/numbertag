
export type SocialPlatform = 'WhatsApp' | 'Telegram' | 'Instagram' | 'LinkedIn' | 'X' | 'Portfolio';

export enum UserType {
  INDIVIDUAL = 'individual',
  BUSINESS = 'business'
}

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

export interface Transaction {
  id: string;
  userName: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  timestamp: number;
  reference?: string;
}

export interface NumberTag {
  id: string;
  title: string; // This becomes the "True Title"
  intent: string; // This becomes the "True Intent"
  publicTitle?: string; // The "Masked" version
  publicIntent?: string; // The "Masked" version
  isMasked: boolean;
  category: string;
  color: string;
  tags: string[];
  owner: string;
  location: string;
  avatar?: string;
  contactPlatform: SocialPlatform;
  contactDetail: string;
  socialLinks: SocialLink[];
}

export interface ConnectionRequest {
  id: string;
  senderName: string;
  senderLogo?: string;
  reason: string;
  opportunity: string;
  status: 'pending' | 'accepted' | 'declined';
  tagId: string;
  timestamp: number;
  acceptedAt?: number;
}

export interface TagExchange {
  id: string;
  tagId: string;
  distance: string; 
  matchScore: number;
  timestamp: number;
  status: 'waiting' | 'accepted' | 'ignored';
  tagPreview: Partial<NumberTag>;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  username: string;
  bio: string;
  location: string;
  coins: number;
  socials: SocialLink[];
  joinedAt: number;
  type: UserType;
  isPro?: boolean;
  proExpiresAt?: number;
  avatar?: string;
}
