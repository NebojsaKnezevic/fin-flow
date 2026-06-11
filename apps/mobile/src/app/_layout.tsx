import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


export default function Layout() {
  return (
    <QueryClientProvider client={new QueryClient()}>
    <PaperProvider>
      <Stack/>
    </PaperProvider>
    </QueryClientProvider>
  );
}