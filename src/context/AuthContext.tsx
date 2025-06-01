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
    const loadUser = async () => {
      try {
        const userJSON = await AsyncStorage.getItem("@eventify_user")
        if (userJSON) {
          const userData = JSON.parse(userJSON)
          setUser(userData)
        }
      } catch (error) {
        console.error("Error loading user from storage:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userData: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || "Usuario",
          photoURL: firebaseUser.photoURL,
          isAnonymous: firebaseUser.isAnonymous,
        }
        setUser(userData)
        try {
          await AsyncStorage.setItem("@eventify_user", JSON.stringify(userData))
        } catch (error) {
          console.error("Error saving user to storage:", error)
        }
      } else {
        setUser(null)
        try {
          await AsyncStorage.removeItem("@eventify_user")
        } catch (error) {
          console.error("Error removing user from storage:", error)
        }
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      Alert.alert("Éxito", "Bienvenido a Eventify")
    } catch (error: any) {
      console.error("Error signing in:", error)
      let errorMessage = "Credenciales incorrectas"
      if (error.code === "auth/user-not-found") {
        errorMessage = "No existe una cuenta con este correo electrónico"
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Contraseña incorrecta"
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Correo electrónico inválido"
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Demasiados intentos fallidos. Intenta más tarde"
      }
      Alert.alert("Error", errorMessage)
    }
  }

  const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Actualizar el perfil del usuario con el nombre completo
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: displayName,
        })
      }

      Alert.alert("Éxito", "¡Bienvenido a Eventify! Tu cuenta ha sido creada")
    } catch (error: any) {
      console.error("Error signing up:", error)
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
      await firebaseSignOut(auth)
      await GoogleSignin.signOut()
      await AsyncStorage.removeItem("@eventify_user")
      setUser(null)
    } catch (error) {
      console.error("Error signing out:", error)
      Alert.alert("Error", "No se pudo cerrar sesión")
    }
  }

  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        throw new Error("No hay usuario autenticado")
      }

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

      // Guardar en AsyncStorage
      await AsyncStorage.setItem("@eventify_user", JSON.stringify(updatedUser))

      return { success: true }
    } catch (error: any) {
      console.error("Error updating profile:", error)
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
