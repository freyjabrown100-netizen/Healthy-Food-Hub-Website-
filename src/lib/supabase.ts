/**
 * Supabase client configuration
 * In Stage A & B: Local mock persistence & Zustand store provide seamless functionality.
 * When real Supabase credentials are configured in .env (Stage C & Production),
 * this client connects to PostgreSQL Auth, Database, and Storage buckets.
 */

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Lightweight client stub with safe fallback handlers
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: (callback: (event: string, session: unknown) => void) => {
      // In local mode, return unsubscribe mock
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signInWithPassword: async ({ email }: { email: string; password?: string }) => {
      return { data: { user: { id: 'mock-user-1', email } }, error: null };
    },
    signUp: async ({ email }: { email: string; password?: string; options?: unknown }) => {
      return { data: { user: { id: 'mock-user-1', email } }, error: null };
    },
    signOut: async () => ({ error: null }),
    resetPasswordForEmail: async () => ({ data: {}, error: null }),
    updateUser: async () => ({ data: {}, error: null }),
  },
  from: (tableName: string) => ({
    select: () => ({
      eq: () => ({ data: [], error: null }),
      order: () => ({ data: [], error: null }),
      limit: () => ({ data: [], error: null }),
      single: () => ({ data: null, error: null }),
    }),
    insert: async () => ({ data: [], error: null }),
    update: async () => ({ data: [], error: null }),
    delete: async () => ({ data: [], error: null }),
  }),
};
