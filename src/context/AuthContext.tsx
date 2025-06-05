"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import { Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { initializeApp } from "firebase/app"
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth"
import { firebaseConfig } from "../config/firebase"
import { GoogleSignin } from "../services/googleAuth"

// Inicializar Firebase
let app
try {
  app = initializeApp(firebaseConfig)
} catch (error: any) {
  if (error.code === "app/duplicate-app") {
    const { getApp } = require("firebase/app")
    app = getApp()
  } else {
    throw error
  }
}

// Inicializar Auth - Firebase v9+ maneja automáticamente la persistencia en React Native
const auth = getAuth(app)

type User = {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  isAnonymous: boolean
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  updateUserProfile: async () => ({ success: false }),
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("🔥 Setting up Firebase Auth listener...")
    console.log("📱 Firebase Auth will automatically handle persistence in React Native")

    // Firebase Auth v9+ automáticamente maneja la persistencia en React Native
    // No necesitamos configurar AsyncStorage manualmente
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      console.log("👤 Auth state changed:", firebaseUser ? "User logged in" : "User logged out")

      if (firebaseUser) {
        const userData: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || "Usuario",
          photoURL: firebaseUser.photoURL,
          isAnonymous: firebaseUser.isAnonymous,
        }
        setUser(userData)

        // Guardar en AsyncStorage como backup adicional para nuestros propios datos
        try {
          await AsyncStorage.setItem("@eventify_user_backup", JSON.stringify(userData))
          console.log("💾 User data saved to AsyncStorage backup")
        } catch (error) {
          console.error("❌ Error saving user to storage:", error)
        }
      } else {
        setUser(null)

        // Limpiar AsyncStorage backup
        try {
          await AsyncStorage.removeItem("@eventify_user_backup")
          console.log("🗑️ User data removed from AsyncStorage backup")
        } catch (error) {
          console.error("❌ Error removing user from storage:", error)
        }
      }
      setLoading(false)
    })

    return () => {
      console.log("🔥 Cleaning up Firebase Auth listener")
      unsubscribe()
    }
  }, [])

  const signInWithEmail = async (email: string, password: string) => {
    try {
      console.log("📧 Signing in with email:", email)
      await signInWithEmailAndPassword(auth, email, password)
      Alert.alert("Éxito", "Bienvenido a Eventify")
    } catch (error: any) {
      console.error("❌ Error signing in:", error)
      let errorMessage = "Credenciales incorrectas"
      if (error.code === "auth/user-not-found") {
        errorMessage = "No existe una cuenta con este correo electrónico"
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Contraseña incorrecta"
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Correo electrónico inválido"
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Demasiados intentos fallidos. Intenta más tarde"
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Credenciales inválidas. Verifica tu email y contraseña"
      }
      Alert.alert("Error", errorMessage)
    }
  }

  const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
    try {
      console.log("📝 Creating account for:", email)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Actualizar el perfil del usuario con el nombre completo
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: displayName,
        })
        console.log("👤 Profile updated with display name:", displayName)
      }

      Alert.alert("Éxito", "¡Bienvenido a Eventify! Tu cuenta ha sido creada")
    } catch (error: any) {
      console.error("❌ Error signing up:", error)
      let errorMessage = "No se pudo crear la cuenta"
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Ya existe una cuenta con este correo electrónico"
      } else if (error.code === "auth/weak-password") {
        errorMessage = "La contraseña es muy débil"
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Correo electrónico inválido"
      }
      Alert.alert("Error", errorMessage)
    }
  }

  const signInWithGoogle = async () => {
    try {
      console.log("🚀 Iniciando proceso de Google Sign-In...")
      const result = await GoogleSignin.signIn()

      if (result.success && result.idToken) {
        console.log("🎯 Token obtenido, creando credencial de Firebase...")
        const credential = GoogleAuthProvider.credential(result.idToken)
        await signInWithCredential(auth, credential)
        Alert.alert("Éxito", "¡Bienvenido a Eventify!")
      } else {
        if (result.error !== "cancelled") {
          console.error("❌ Error en Google Sign-In:", result.error)
          Alert.alert("Error", `No se pudo iniciar sesión con Google: ${result.error}`)
        }
      }
    } catch (error: any) {
      console.error("💥 Error signing in with Google:", error)
      if (error.message?.includes("cancelled")) {
        return
      }
      Alert.alert("Error", "No se pudo iniciar sesión con Google")
    }
  }

  const signOut = async () => {
    try {
      console.log("👋 Signing out...")
      await firebaseSignOut(auth)
      await GoogleSignin.signOut()
      await AsyncStorage.removeItem("@eventify_user_backup")
      setUser(null)
      console.log("✅ Sign out completed")
    } catch (error) {
      console.error("❌ Error signing out:", error)
      Alert.alert("Error", "No se pudo cerrar sesión")
    }
  }

  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        throw new Error("No hay usuario autenticado")
      }

      console.log("👤 Updating user profile:", { displayName, photoURL })

      // Actualizar el perfil en Firebase Auth
      await updateProfile(currentUser, {
        displayName: displayName,
        ...(photoURL && { photoURL }),
      })

      // Actualizar el estado local del usuario
      const updatedUser: User = {
        ...user!,
        displayName: displayName,
        ...(photoURL && { photoURL }),
      }

      setUser(updatedUser)

      // Guardar en AsyncStorage backup
      await AsyncStorage.setItem("@eventify_user_backup", JSON.stringify(updatedUser))

      console.log("✅ Profile updated successfully")
      return { success: true }
    } catch (error: any) {
      console.error("❌ Error updating profile:", error)
      return { success: false, error: error.message }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
