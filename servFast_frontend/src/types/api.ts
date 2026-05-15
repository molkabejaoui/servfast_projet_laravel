/**
 * ServiceHub API Type Definitions
 */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  full_name?: string;
  role: 'CLIENT' | 'PROVIDER' | 'ADMIN';
  avatarUrl?: string | null;
  phone?: string | null;
  city?: string | null;
  bio?: string;
  createdAt?: string;
  serviceProvider?: {
    bio?: string;
    experience_years?: number;
    skills?: string[];
    portfolio_url?: string;
    is_verified?: boolean;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  type: 'Solutions' | 'Enterprise';
  services_count?: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  city?: string;
  status?: string;
  category: {
    id: number;
    name: string;
  } | string;
  user?: {
    id: string;
    full_name: string;
    avatar_url?: string;
    serviceProvider?: {
      bio?: string;
      experience_years?: number;
      is_verified?: boolean;
    };
  };
  photos?: Array<{ photo_url: string; is_main: boolean }>;
  average_rating?: number;
  total_ratings?: number;
  image_url?: string;
  tags?: string[];
}

export interface Order {
  id: string;
  serviceId: string;
  clientId: string;
  providerId: string;
  amount: number;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage: Message;
  unreadCount: number;
}

export interface Rating {
  id: string;
  serviceId: string;
  clientId: string;
  score: number;
  comment: string;
  createdAt: string;
  clientName?: string;
}
