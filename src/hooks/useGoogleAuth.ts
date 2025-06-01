// hooks/useGoogleAuth.ts
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [userInfo, setUserInfo] = useState<any>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '738055864575-tsrcamkeg2c1cjqu5js33ejqohvip1gl.apps.googleusercontent.com',
    androidClientId: '738055864575-faii3hls1tclitlb7vnm7psh2koa0o23.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${response.authentication?.accessToken}` },
      })
        .then(res => res.json())
        .then(data => setUserInfo(data))
        .catch(err => console.log(err));
    }
  }, [response]);

  return { userInfo, promptAsync, request };
};
