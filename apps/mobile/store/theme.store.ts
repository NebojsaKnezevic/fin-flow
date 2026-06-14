import { create } from "zustand";

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  return {
    isDarkMode: true,
    toggleTheme: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
  };
});
