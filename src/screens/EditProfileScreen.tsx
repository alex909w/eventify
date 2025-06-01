"use client"

import { useState } from "react"
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useAuth } from "../context/AuthContext"
import Input from "../components/Input"
import Button from "../components/Button"
import { useForm } from "../hooks/useForm"

type EditProfileFormData = {
  displayName: string
  email: string
  phone: string
  bio: string
}

const EditProfileScreen = () => {
  const navigation = useNavigation()
  const { user, updateUserProfile } = useAuth()
  const [profileImage, setProfileImage] = useState(user?.photoURL || "")

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } =
    useForm<EditProfileFormData>(
      {
        displayName: user?.displayName || "",
        email: user?.email || "",
        phone: "",
        bio: "",
      },
      {
        displayName: {
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
      },
    )

  const handleSaveProfile = async (formData: EditProfileFormData) => {
    try {
      const result = await updateUserProfile(formData.displayName, profileImage)

      if (result.success) {
        Alert.alert("Éxito", "Perfil actualizado correctamente", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ])
      } else {
        Alert.alert("Error", result.error || "No se pudo actualizar el perfil")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      Alert.alert("Error", "No se pudo actualizar el perfil")
    }
  }

  const handleChangePhoto = () => {
    Alert.alert("Cambiar foto", "Selecciona una opción", [
      { text: "Cámara", onPress: () => console.log("Open camera") },
      { text: "Galería", onPress: () => console.log("Open gallery") },
      { text: "Cancelar", style: "cancel" },
    ])
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#146193" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Perfil</Text>
        </View>

        <View style={styles.photoSection}>
          <TouchableOpacity style={styles.photoContainer} onPress={handleChangePhoto}>
            <Image
              source={{
                uri: profileImage || "/placeholder.svg?height=120&width=120&text=Usuario",
              }}
              style={styles.profilePhoto}
            />
            <View style={styles.photoOverlay}>
              <Ionicons name="camera" size={24} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.photoText}>Toca para cambiar foto</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Nombre completo"
            placeholder="Tu nombre completo"
            value={values.displayName}
            onChangeText={handleChange("displayName")}
            onBlur={handleBlur("displayName")}
            error={errors.displayName}
            touched={touched.displayName}
            editable={!isSubmitting}
            icon="person-outline"
          />

          <Input
            label="Correo electrónico"
            placeholder="tu@email.com"
            value={values.email}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            error={errors.email}
            touched={touched.email}
            editable={false} // Email no editable
            icon="mail-outline"
          />

          <Input
            label="Teléfono"
            placeholder="Tu número de teléfono"
            value={values.phone}
            onChangeText={handleChange("phone")}
            onBlur={handleBlur("phone")}
            error={errors.phone}
            touched={touched.phone}
            editable={!isSubmitting}
            keyboardType="phone-pad"
            icon="call-outline"
          />

          <Input
            label="Biografía"
            placeholder="Cuéntanos un poco sobre ti..."
            value={values.bio}
            onChangeText={handleChange("bio")}
            onBlur={handleBlur("bio")}
            error={errors.bio}
            touched={touched.bio}
            editable={!isSubmitting}
            multiline
            style={styles.bioInput}
            icon="document-text-outline"
          />

          <Button
            title="Guardar Cambios"
            onPress={() => handleSubmit(handleSaveProfile)}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  photoSection: {
    alignItems: "center",
    padding: 30,
  },
  photoContainer: {
    position: "relative",
    marginBottom: 12,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#146193",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  photoText: {
    fontSize: 16,
    color: "#666",
  },
  formContainer: {
    padding: 20,
  },
  bioInput: {
    height: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    marginTop: 20,
  },
})

export default EditProfileScreen
