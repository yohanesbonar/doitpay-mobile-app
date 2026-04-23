import { create } from 'zustand';
import { storage, StorageKey } from '../storage';

interface AuthState {
  accessToken: string | null;
  isNewUser: boolean;
  setToken: (token: string | null, isNew?: boolean) => void;
  setIsNewUser: (val: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: storage.getString(StorageKey.ACCESS_TOKEN) || null,
  isNewUser: false,

  setToken: (token, isNew = false) => {
    if (token) {
      storage.set(StorageKey.ACCESS_TOKEN, token);
    } else {
      storage.remove(StorageKey.ACCESS_TOKEN);
    }
    set({ accessToken: token, isNewUser: isNew });
  },

  logout: () => {
    storage.remove(StorageKey.ACCESS_TOKEN);
    storage.remove(StorageKey.VERIFICATION_TOKEN);
    set({ accessToken: null });
  },
  setIsNewUser: (val) => set({ isNewUser: val }),
}));
