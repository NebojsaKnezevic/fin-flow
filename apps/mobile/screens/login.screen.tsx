import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import {useRouter} from 'expo-router'
import { useAuthStore } from '../store/auth.store';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../client/client';
import { AxiosError } from 'axios';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPwd] = useState('');
    const [secureText, setSecureText] = useState(true);
    const [error, setError] = useState('');

    const setAuth = useAuthStore((state) => state.setAuth);
    const user = useAuthStore(s => s.user);

    const loginMutation = useMutation({
      mutationFn: async () => {
        const response = await apiClient.post('/auth/login', {email, password});
        return response.data;
      },
      onSuccess: (data)=>{
        setAuth(data.user, data.token)
        setError(JSON.stringify(user))
        //TO DO: add redirect 
        //TO DO: add toast notification
      }, 
      onError: (error: AxiosError) => {
        const msg = JSON.stringify(error.response?.data)
        setError(msg);  
        //TO DO: add toast notification
      }
    });

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>FinFlow</Text>
      <Text style={styles.title}>
        {JSON.stringify(error)}
      </Text>                                                                                                                                                                                                                                

      <TextInput
        label="Email adresa"
        value={email}
        onChangeText={(s)=> {setEmail(s)}}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        label="Lozinka"
        value={password}
        onChangeText={setPwd}
        mode="outlined"
        secureTextEntry={false}
        autoCapitalize="none"
        right={<TextInput.Icon icon={secureText ? "eye" : "eye-off"} onPress={() => setSecureText(!secureText)} />}
        style={styles.input}
      />

      <Button mode="contained" onPress={() =>  loginMutation.mutate()}>
        Prijavi se
      </Button>

      <View style={styles.linkContainer}>
        <Text variant="bodyMedium" style={styles.linkText}>
          Nemaš nalog?
        </Text>
        <Button 
          mode="text" 
          compact 
          onPress={() => router.push('/register')} // <-- Ovo te vodi na app/register.tsx
          labelStyle={styles.linkButtonLabel}
        >
          Registruj se
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { textAlign: 'center', marginBottom: 24, fontWeight: 'bold', color: '#2563eb' },
  input: { marginBottom: 16 },
  button: { marginTop: 8, paddingVertical: 4 },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  linkText: {
    color: '#64748b', // Siva boja za "Nemaš nalog?"
  },
  linkButtonLabel: {
    color: '#2563eb', // Plava boja za "Registruj se"
    fontWeight: 'bold',
  },
});