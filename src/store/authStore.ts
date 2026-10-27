import { create } from 'zustand';
import { DietaryLabel, UserProfile } from '../types';

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password?: string) => Promise<boolean>;
  signUp: (email: string, password?: string, fullName?: string, dietary?: DietaryLabel[]) => Promise<boolean>;
  signOut: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  toggleAdminRole: () => void;
}

const STORAGE_KEY = 'hfh_auth_user';

const getInitialUser = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  // Default demo logged-in user with standard access
  return {
    id: 'user-demo-1',
    email: 'alex.wellness@example.com',
    fullName: 'Alex Rivera',
    role: 'user',
    dietaryPreferences: ['high-protein', 'gluten-free'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
    createdAt: '2026-01-15',
  };
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getInitialUser(),
  loading: false,

  signIn: async (email: string, _password?: string) => {
    set({ loading: true });
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 400));
    const isAdmin = email.toLowerCase().includes('admin');
    const newUser: UserProfile = {
      id: 'user-' + Date.now(),
      email,
      fullName: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      role: isAdmin ? 'admin' : 'user',
      dietaryPreferences: ['high-protein'],
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
      createdAt: new Date().toISOString().split('T')[0],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    set({ user: newUser, loading: false });
    return true;
  },

  signUp: async (email: string, _password?: string, fullName?: string, dietary?: DietaryLabel[]) => {
    set({ loading: true });
    await new Promise((r) => setTimeout(r, 400));
    const newUser: UserProfile = {
      id: 'user-' + Date.now(),
      email,
      fullName: fullName || email.split('@')[0],
      role: 'user',
      dietaryPreferences: dietary || [],
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
      createdAt: new Date().toISOString().split('T')[0],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    set({ user: newUser, loading: false });
    return true;
  },

  signOut: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null });
  },

  updateProfile: (data: Partial<UserProfile>) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ user: updated });
  },

  toggleAdminRole: () => {
    const current = get().user;
    if (!current) return;
    const nextRole = current.role === 'admin' ? 'user' : 'admin';
    const updated: UserProfile = { ...current, role: nextRole };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ user: updated });
  },
}));
