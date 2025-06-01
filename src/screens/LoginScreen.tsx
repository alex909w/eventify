// app/login.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { authConfig } from '../config/authConfig';

console.log('REDIRECT URI:', AuthSession.getRedirectUrl());

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: authConfig.clientId,
    redirectUri: authConfig.redirectUri,
  });

  useEffect(() => {
    const checkUser = async () => {
      const stored = await AsyncStorage.getItem('user');
      if (stored) {
        setUserInfo(JSON.parse(stored));
        router.replace('/CalendarScreen');
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const fetchUser = async () => {
        const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: { Authorization: `Bearer ${response.authentication?.accessToken}` },
        });
        const user = await res.json();
        await AsyncStorage.setItem('user', JSON.stringify(user));
        setUserInfo(user);
        router.replace('/CalendarScreen');
      };
      fetchUser();
    }
  }, [response]);

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=1350&q=80' }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Inicia sesión con Google</Text>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => promptAsync()}
          disabled={!request}
        >
          <Image
            source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
            style={styles.googleIcon}
          />


          <Text style={styles.buttonText}>Continuar con Google</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#333',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 2,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
});
