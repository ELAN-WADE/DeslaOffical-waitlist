export type RoleType = 'shopper' | 'creator' | 'distributor' | 'partner' | 'ambassador';

export interface WaitlistFormData {
  fullName: string;
  email: string;
  city: string;
  role: RoleType;
  skinConcern?: string;
  creatorHandle?: string;
  creatorPlatform?: string;
  distributorBusiness?: string;
  distributorVolume?: string;
  partnerOrganization?: string;
  partnerFocus?: string;
}

export interface WaitlistEntry extends WaitlistFormData {
  id: string;
  queueNumber: number;
  timestamp: string;
  referralCode: string;
  status?: 'confirmed' | 'verified' | 'archived';
  emailStatus?: 'pending' | 'processing' | 'sent' | 'failed';
  createdAt?: string;
}

export interface EmailJob {
  id: string;
  waitlistId: string;
  recipientEmail: string;
  recipientName: string;
  role: RoleType;
  subject: string;
  templateType: string;
  payloadJson: string;
  status: 'pending' | 'processing' | 'sent' | 'failed';
  attempts: number;
  maxAttempts: number;
  lastError?: string | null;
  sentAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HeroSlide {
  id: string;
  indexStr: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  aspect: string;
  tag: string;
}

export interface ProductChapter {
  id: string;
  number: string;
  tag: string;
  title: string;
  description: string;
  features: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}
