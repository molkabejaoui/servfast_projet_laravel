import api from './axiosConfig';
import type { User } from '../types/api';

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  email: string;
  password: string;
  password_confirmation: string;
  full_name: string;
  role: string;
};

const normalizeUser = (user: any): User => {
  const full_name = user.full_name ?? user.fullName ?? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  const [firstName, ...rest] = full_name.split(' ');
  const lastName = rest.join(' ');
  const role = String(user.role ?? 'client').toUpperCase();

  return {
    id: String(user.id),
    email: user.email ?? '',
    fullName: full_name,
    full_name,
    firstName: firstName ?? '',
    lastName: lastName ?? '',
    role: role === 'PROVIDER' ? 'PROVIDER' : role === 'ADMIN' ? 'ADMIN' : 'CLIENT',
    avatarUrl: user.avatar_url ?? user.avatar ?? null,
    phone: user.phone ?? null,
    city: user.city ?? null,
  };
};

const storeUser = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const authApi = {
  login: async (credentials: LoginPayload) => {
    const response = await api.post('/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      const user = normalizeUser(response.data.user);
      storeUser(user);
    }
    return response.data;
  },

  register: async (userData: RegisterPayload) => {
    const response = await api.post('/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      const user = normalizeUser(response.data.user);
      storeUser(user);
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('user');
    if (!user || user === 'undefined' || user === 'null') return null;
    try {
      const parsed = JSON.parse(user);
      return normalizeUser(parsed);
    } catch {
      return null;
    }
  },

  isAuthenticated: () => !!localStorage.getItem('token'),
};