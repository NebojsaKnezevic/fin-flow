import { create } from "zustand";

interface user {
  id: number;
  email: string;
}

interface AuthState {
  user: user | null;
  token: string | null;
  setAuth: (user: user, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  return {
    user: null,
    token: null,
    setAuth: (user, token) => set({ user, token }),
    clearAuth: () => set({ user: null, token: null }),
  };
});
