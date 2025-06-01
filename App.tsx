"use client"

import "react-native-gesture-handler" // IMPORTANTE: Esta importación debe ser la primera
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { AuthProvider } from "./src/context/AuthContext"
import RootNavigator from "./src/navigation/RootNavigator"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"

export default function App() {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simular inicialización de la app
    const prepareApp = async () => {
      try {
        // Esperar un poco para asegurarse de que todo esté listo
        await new Promise((resolve) => setTimeout(resolve, 500))
        setIsReady(true)
      } catch (e) {
        console.error("Error initializing app:", e)
        setError("Error al iniciar la aplicación. Por favor, reinicia.")
      }
    }

    prepareApp()
  }, [])

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
})
