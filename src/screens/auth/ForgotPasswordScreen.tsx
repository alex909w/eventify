"use client"
import { useState } from "react"
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import Input from "../../components/Input"
import Button from "../../components/Button"
import { useForm } from "../../hooks/useForm"

type FormValues = {
  email: string
}

const ForgotPasswordScreen = () => {
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm<FormValues>(
    { email: "" },
    {
      email: {
        required: "El correo electrónico es obligatorio",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Correo electrónico inválido",
        },
      },
    },
  )

  const handleResetPassword = async () => {
    setLoading(true)
    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth, values.email)
      setEmailSent(true)
    } catch (error: any) {
      let errorMessage = "No se pudo enviar el correo de recuperación"
      if (error.code === "auth/user-not-found") {
        errorMessage = "No existe una cuenta con este correo electrónico"
      }
      Alert.alert("Error", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#146193" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image source={{ uri: "/eventpet-logo.png" }} style={styles.logo} />
          <Text style={styles.logoText}>EventPet</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Recuperar Contraseña</Text>

          {emailSent ? (
            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
              <Text style={styles.successTitle}>¡Correo enviado!</Text>
              <Text style={styles.successText}>
                Hemos enviado un correo electrónico con instrucciones para restablecer tu contraseña.
              </Text>
              <Button
                title="Volver al inicio de sesión"
                onPress={() => navigation.navigate("Login" as never)}
                style={styles.backToLoginButton}
              />
            </View>
          ) : (
            <>
              <Text style={styles.instructions}>
                Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
              </Text>

              <Input
                label="Correo electrónico"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                error={errors.email}
                touched={touched.email}
                placeholder="Ingresa tu correo electrónico"
                keyboardType="email-address"
                autoCapitalize="none"
                icon="mail-outline"
              />

              <Button
                title="Enviar instrucciones"
                onPress={() => handleSubmit(handleResetPassword)}
                loading={loading}
                style={styles.resetButton}
              />

              <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate("Login" as never)}>
                <Ionicons name="arrow-back" size={18} color="#146193" />
                <Text style={styles.loginLinkText}>Volver al inicio de sesión</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    color: "#146193",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  instructions: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  resetButton: {
    marginTop: 16,
  },
  loginLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  loginLinkText: {
    color: "#146193",
    fontSize: 16,
    marginLeft: 8,
  },
  successContainer: {
    alignItems: "center",
    padding: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#333",
  },
  successText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  backToLoginButton: {
    width: "100%",
  },
})

export default ForgotPasswordScreen
