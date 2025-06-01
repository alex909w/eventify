import * as AuthSession from "expo-auth-session"
import * as WebBrowser from "expo-web-browser"
import { Platform } from "react-native"

// Configurar WebBrowser para AuthSession
WebBrowser.maybeCompleteAuthSession()

type GoogleSignInResult = {
  success: boolean
  idToken?: string
  accessToken?: string
  error?: string
}

// Configuración de Google OAuth actualizada
const GOOGLE_OAUTH_CONFIG = {
  // Cliente para Expo/Web
  expoClientId: "1051362662069-j2rcp72r6cc4fsofkv9jlksm210iju4l.apps.googleusercontent.com",
  // Cliente para Android
  androidClientId: "719607635606-dao0g8j15r9bb4q2drevkqbrl3ucc3c8.apps.googleusercontent.com",
  // Cliente para iOS (necesitarías crear uno en Google Console)
  iosClientId: "719607635606-dao0g8j15r9bb4q2drevkqbrl3ucc3c8.apps.googleusercontent.com",
}

export class GoogleSignin {
  static async signIn(): Promise<GoogleSignInResult> {
    try {
      // Determinar el clientId según la plataforma
      let clientId = GOOGLE_OAUTH_CONFIG.expoClientId

      if (Platform.OS === "android") {
        clientId = GOOGLE_OAUTH_CONFIG.androidClientId
      } else if (Platform.OS === "ios") {
        clientId = GOOGLE_OAUTH_CONFIG.iosClientId
      }

      console.log("Iniciando Google Sign-In con clientId:", clientId)

      // Configurar la URI de redirección
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: "eventify",
      })

      console.log("Redirect URI:", redirectUri)

      // Configurar la solicitud OAuth
      const request = new AuthSession.AuthRequest({
        clientId: clientId,
        scopes: ["openid", "profile", "email"],
        responseType: AuthSession.ResponseType.IdToken,
        redirectUri: redirectUri,
      })

      // Endpoint de descubrimiento de Google
      const discovery = {
        authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenEndpoint: "https://oauth2.googleapis.com/token",
        revocationEndpoint: "https://oauth2.googleapis.com/revoke",
        userInfoEndpoint: "https://openidconnect.googleapis.com/v1/userinfo",
      }

      console.log("Iniciando prompt de autenticación...")

      // Realizar la solicitud de autenticación
      const result = await request.promptAsync(discovery)

      console.log("Resultado de autenticación:", result.type)

      if (result.type === "success") {
        console.log("Autenticación exitosa")
        // Extraer el ID token de la respuesta
        const { id_token, access_token } = result.params

        return {
          success: true,
          idToken: id_token,
          accessToken: access_token,
        }
      } else if (result.type === "cancel") {
        console.log("Usuario canceló la autenticación")
        return {
          success: false,
          error: "cancelled",
        }
      } else {
        console.log("Error en autenticación:", result)
        return {
          success: false,
          error: "Authentication failed",
        }
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  static async signOut(): Promise<void> {
    try {
      // Limpiar la sesión web si existe
      await WebBrowser.dismissBrowser()
      console.log("Google sign out completado")
    } catch (error) {
      console.error("Error signing out from Google:", error)
    }
  }
}
