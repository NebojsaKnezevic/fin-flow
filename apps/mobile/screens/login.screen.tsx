import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import {useRouter} from 'expo-router'

export default function LoginScreen() {
    const router = useRouter();

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>FinFlow</Text>

      <TextInput
        label="Email adresa"
        // value={email}
        // onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        label="Lozinka"
        // value={password}
        // onChangeText={setPassword}
        mode="outlined"
        // secureTextEntry={secureText}
        autoCapitalize="none"
        // right={<TextInput.Icon icon={secureText ? "eye" : "eye-off"} onPress={() => setSecureText(!secureText)} />}
        style={styles.input}
      />

      <Button mode="contained" onPress={() => console.log('Login')} style={styles.button}>
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