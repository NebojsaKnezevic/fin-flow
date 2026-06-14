import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useThemeStore } from '../../store/theme.store';
import { useMemo } from 'react';

const fintechLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#047857',          
    secondary: '#10b981',        
    background: '#ffffff',       
    surface: '#ffffff',          
    primaryContainer: '#ecfdf5', 
    onPrimaryContainer: '#047857',
    outline: '#a7f3d0',          
    error: '#dc2626',
  },
};

const fintechDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#10b981',          
    secondary: '#34d399',        
    background: '#0f172a',       
    surface: '#1e293b',          
    primaryContainer: '#064e3b', 
    onPrimaryContainer: '#a7f3d0',
    outline: '#0f766e',          
    error: '#ef4444',
  },
};

const queryClient = new QueryClient();

export default function Layout() {
  const isDarkMode = useThemeStore(s => s.isDarkMode);
    const currentTheme = useMemo(
    () => (isDarkMode ? fintechDarkTheme : fintechLightTheme),
    [isDarkMode]
  );
  return (
    <QueryClientProvider client={queryClient}>
    <PaperProvider theme={currentTheme}>
      <Stack screenOptions={{headerShown: false}}/>
    </PaperProvider>
    </QueryClientProvider>
  );
}