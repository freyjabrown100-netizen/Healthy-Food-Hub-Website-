import { create } from 'zustand';
import { DietaryLabel, UserProfile } from '../types';

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password?: string) => Promise<boolean>;
  signUp: (email: string, password?: string, fullName?: string, dietary?: DietaryLabel[]) => Promise<boolean>;
  signOut: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const STORAGE_KEY = 'hfh_auth_user';

const getInitialUser = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserProfile;
    // Never trust a role persisted by the browser.
    return { ...parsed, role: 'user' };
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getInitialUser(),
  loading: false,

  signIn: async (email: string, _password?: string) => {
    set({ loading: true });
    try {
      // Demo-only authentication: do not grant elevated privileges based on email.
      await new Promise((resolve) => setTimeout(resolve, 400));
      const newUser: UserProfile = {
        id: 'demo-user-' + Date.now(),
        email,
        fullName: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        role: 'user',
        dietaryPreferences: [],
        createdAt: new Date().toISOString().split('T')[0],
      };
      if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      set({ user: newUser, loading: false });
      return true;
    } catch {
      set({ loading: false });
      return false;
    }
  },

  signUp: async (email: string, _password?: string, fullName?: string, dietary?: DietaryLabel[]) => {
    set({ loading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const newUser: UserProfile = {
        id: 'demo-user-' + Date.now(),
        email,
        fullName: fullName || email.split('@')[0],
        role: 'user',
        dietaryPreferences: dietary || [],
        createdAt: new Date().toISOString().split('T')[0],
      };
      if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      set({ user: newUser, loading: false });
      return true;
    } catch {
      set({ loading: false });
      return false;
    }
  },

  signOut: () => {
    if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
    set({ user: null });
  },

  updateProfile: (data: Partial<UserProfile>) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...data, role: current.role };
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ user: updated });
  },
}));
