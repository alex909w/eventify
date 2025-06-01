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
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../context/AuthContext"
import Input from "../../components/Input"
import Button from "../../components/Button"
import { useForm } from "../../hooks/useForm"

type LoginFormData = {
  email: string
  password: string
}

const LoginScreen = () => {
  const navigation = useNavigation()
  const { signInWithEmail, signInWithGoogle } = useAuth()
  const [googleLoading, setGoogleLoading] = useState(false)

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm<LoginFormData>(
    {
      email: "",
      password: "",
    },
    {
      email: {
        required: "El correo electrónico es obligatorio",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Ingresa un correo electrónico válido",
        },
      },
      password: {
        required: "La contraseña es obligatoria",
        minLength: {
          value: 6,
          message: "La contraseña debe tener al menos 6 caracteres",
        },
      },
    },
  )

  const handleLogin = async (formData: LoginFormData) => {
    await signInWithEmail(formData.email, formData.password)
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    await signInWithGoogle()
    setGoogleLoading(false)
  }

  const goToRegister = () => {
    navigation.navigate("Register" as never)
  }

  const goToForgotPassword = () => {
    navigation.navigate("ForgotPassword" as never)
  }

  const isAnyLoading = isSubmitting || googleLoading

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require("../../../assets/logo.png")} style={styles.logo} />
          <Text style={styles.logoText}>Eventify</Text>
          <Text style={styles.subtitle}>Descubre eventos increíbles</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Iniciar Sesión</Text>

          <Input
            label="Correo electrónico"
            placeholder="tu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={values.email}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            error={errors.email}
            touched={touched.email}
            editable={!isAnyLoading}
            icon="mail-outline"
          />

          <Input
            label="Contraseña"
            placeholder="Tu contraseña"
            secureTextEntry
            value={values.password}
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            error={errors.password}
            touched={touched.password}
            editable={!isAnyLoading}
            icon="lock-closed-outline"
          />

          <TouchableOpacity style={styles.forgotPassword} onPress={goToForgotPassword} disabled={isAnyLoading}>
            <Text style={[styles.forgotPasswordText, isAnyLoading && styles.disabledText]}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>

          <Button
            title="Iniciar Sesión"
            onPress={() => handleSubmit(handleLogin)}
            loading={isSubmitting}
            disabled={isAnyLoading}
            style={styles.loginButton}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>O</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            title="Continuar con Google"
            onPress={handleGoogleLogin}
            variant="outline"
            loading={googleLoading}
            disabled={isAnyLoading}
            icon={<Ionicons name="logo-google" size={20} color="#DB4437" style={{ marginRight: 8 }} />}
          />

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
            <TouchableOpacity onPress={goToRegister} disabled={isAnyLoading}>
              <Text style={[styles.registerLink, isAnyLoading && styles.disabledText]}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#146193",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#146193",
  },
  loginButton: {
    marginBottom: 20,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#666",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerText: {
    color: "#666",
  },
  registerLink: {
    color: "#146193",
    fontWeight: "bold",
  },
  disabledText: {
    opacity: 0.6,
  },
})

export default LoginScreen
