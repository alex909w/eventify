// authConfig.ts
import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';

export const authConfig = {
  clientId:
    Platform.OS === 'web'
      ? '738055864575-tsrcamkeg2c1cjqu5js33ejqohvip1gl.apps.googleusercontent.com'
      : Platform.OS === 'android'
      ? ''
      : '',
  redirectUri: AuthSession.getRedirectUrl(), // ✅ FUNCIONA en SDK 53
};
