import { create } from 'zustand';
import { storage, StorageKey } from '../storage';

interface AuthState {
  accessToken: string | null;
  isNewUser: boolean;
  pendingForgotPinRedirect: boolean;
  setToken: (token: string | null, isNew?: boolean) => void;
  setExpiresAt: (expiresAt: string) => void;
  setIsNewUser: (val: boolean) => void;
  logout: (options?: { redirectToForgotPin?: boolean }) => void;
  clearPendingForgotPinRedirect: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: storage.getString(StorageKey.ACCESS_TOKEN) || null,
  isNewUser: false,
  pendingForgotPinRedirect: false,

  setToken: (token, isNew = false) => {
    if (token) {
      storage.set(StorageKey.ACCESS_TOKEN, token);
    } else {
      storage.remove(StorageKey.ACCESS_TOKEN);
    }
    set({ accessToken: token, isNewUser: isNew });
  },
  setExpiresAt: (expiresAt) => {
    if (expiresAt) {
      storage.set(StorageKey.EXPIRES_AT, expiresAt);
    } else {
      storage.remove(StorageKey.EXPIRES_AT);
    }
  },
  logout: (options) => {
    Object.values(StorageKey).forEach((key) => {
      storage.remove(key);
    });
    console.log('User logged out, all tokens cleared from storage');
    set({ accessToken: null, pendingForgotPinRedirect: !!options?.redirectToForgotPin });
  },
  clearPendingForgotPinRedirect: () => set({ pendingForgotPinRedirect: false }),
  setIsNewUser: (val) => set({ isNewUser: val }),
}));
