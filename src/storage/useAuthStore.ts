import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../storage';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  isNewUser: boolean;
  setToken: (token: string | null, isNew?: boolean) => void;
  setRefreshToken: (token: string | null) => void;
  setExpiresAt: (expiresAt: string | null) => void;
  setSession: (accessToken: string, refreshToken: string, expiresAt: string) => void;
  setIsNewUser: (val: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      isNewUser: false,
      setToken: (token, isNew = false) => set({ accessToken: token, isNewUser: isNew }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      setExpiresAt: (expiresAt) => set({ expiresAt }),
      setSession: (accessToken, refreshToken, expiresAt) =>
        set({ accessToken, refreshToken, expiresAt }),
      setIsNewUser: (val) => set({ isNewUser: val }),
      logout: () =>
        set({ accessToken: null, refreshToken: null, expiresAt: null, isNewUser: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
      }),
    },
  ),
);
