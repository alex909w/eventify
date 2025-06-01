"use client"
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
import { useAuth } from "../../context/AuthContext"
import Input from "../../components/Input"
import Button from "../../components/Button"
import { useForm } from "../../hooks/useForm"

type RegisterFormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const RegisterScreen = () => {
  const navigation = useNavigation()
  const { signUpWithEmail } = useAuth()

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm<RegisterFormData>(
    {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    {
      name: {
        required: "El nombre es obligatorio",
        minLength: {
          value: 2,
          message: "El nombre debe tener al menos 2 caracteres",
        },
      },
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
      confirmPassword: {
        required: "Confirma tu contraseña",
        validate: (value, formValues) => {
          if (value !== formValues.password) {
            return "Las contraseñas no coinciden"
          }
          return true
        },
      },
    },
  )

  const handleRegister = async (formData: RegisterFormData) => {
    await signUpWithEmail(formData.email, formData.password, formData.name)
  }

  const goToLogin = () => {
    navigation.goBack()
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={{ uri: "/placeholder.svg?height=120&width=120&text=Eventify" }} style={styles.logo} />
          <Text style={styles.logoText}>Eventify</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Crear Cuenta</Text>

          <Input
            label="Nombre completo"
            placeholder="Tu nombre completo"
            autoCapitalize="words"
            value={values.name}
            onChangeText={handleChange("name")}
            onBlur={handleBlur("name")}
            error={errors.name}
            touched={touched.name}
            editable={!isSubmitting}
            icon="person-outline"
          />

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
            editable={!isSubmitting}
            icon="mail-outline"
          />

          <Input
            label="Contraseña"
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            value={values.password}
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            error={errors.password}
            touched={touched.password}
            editable={!isSubmitting}
            icon="lock-closed-outline"
          />

          <Input
            label="Confirmar contraseña"
            placeholder="Repite tu contraseña"
            secureTextEntry
            value={values.confirmPassword}
            onChangeText={handleChange("confirmPassword")}
            onBlur={handleBlur("confirmPassword")}
            error={errors.confirmPassword}
            touched={touched.confirmPassword}
            editable={!isSubmitting}
            icon="lock-closed-outline"
          />

          <Button
            title="Registrarse"
            onPress={() => handleSubmit(handleRegister)}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.registerButton}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={goToLogin} disabled={isSubmitting}>
              <Text style={[styles.loginLink, isSubmitting && styles.disabledText]}>Iniciar sesión</Text>
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
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#146193",
    marginTop: 10,
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
  registerButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: {
    color: "#666",
  },
  loginLink: {
    color: "#146193",
    fontWeight: "bold",
  },
  disabledText: {
    opacity: 0.6,
  },
})

export default RegisterScreen
