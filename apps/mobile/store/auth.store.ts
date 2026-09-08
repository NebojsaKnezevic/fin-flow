import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { UserWithId } from "@repo/models";

// interface user {
//   id: number;
//   email: string;
// }

interface AuthState {
  user: UserWithId | null;
  token: string | null;
  setAuth: (user: UserWithId, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  return {
    user: null,
    token: null,
    setAuth: async (user, token) => {
      await SecureStore.setItemAsync("user_token", token);
      set({ user, token });
    },
    clearAuth: () => set({ user: null, token: null }),
  };
});
