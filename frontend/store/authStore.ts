import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { clearToken } from '@/lib/auth';

interface User {
  id: string;
  phone: string;
  email?: string;
  name?: string;
  role: string;
  address?: string;
  bio?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setAuth: (user) => set({ user, isAuthenticated: true }),
      logout: () => {
        clearToken();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'anoku-auth',
    }
  )
);
