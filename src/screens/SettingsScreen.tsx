"use client"

import { useState } from "react"
import { StyleSheet, View, Text, Switch, ScrollView, Alert, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useAuth } from "../context/AuthContext"

const SettingsScreen = () => {
  const navigation = useNavigation()
  const { signOut } = useAuth()
  const [pushNotifications, setPushNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [locationServices, setLocationServices] = useState(true)

  const handleSignOut = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar Sesión", onPress: signOut, style: "destructive" },
    ])
  }

  const handleDeleteAccount = () => {
    Alert.alert("Eliminar Cuenta", "¿Estás seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        onPress: () => {
          Alert.alert("Cuenta eliminada", "Tu cuenta ha sido eliminada correctamente")
        },
        style: "destructive",
      },
    ])
  }

  const handleClearCache = () => {
    Alert.alert("Limpiar caché", "¿Deseas limpiar la caché de la aplicación?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Limpiar",
        onPress: () => {
          Alert.alert("Éxito", "Caché limpiada correctamente")
        },
      },
    ])
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#146193" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configuración</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificaciones</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="notifications-outline" size={24} color="#146193" />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingText}>Notificaciones push</Text>
              <Text style={styles.settingDescription}>Recibe notificaciones de eventos y actualizaciones</Text>
            </View>
          </View>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ false: "#e0e0e0", true: "#a7c8e7" }}
            thumbColor={pushNotifications ? "#146193" : "#f4f3f4"}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="mail-outline" size={24} color="#146193" />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingText}>Notificaciones por correo</Text>
              <Text style={styles.settingDescription}>Recibe resúmenes semanales y eventos destacados</Text>
            </View>
          </View>
          <Switch
            value={emailNotifications}
            onValueChange={setEmailNotifications}
            trackColor={{ false: "#e0e0e0", true: "#a7c8e7" }}
            thumbColor={emailNotifications ? "#146193" : "#f4f3f4"}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Apariencia</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="moon-outline" size={24} color="#146193" />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingText}>Modo oscuro</Text>
              <Text style={styles.settingDescription}>Cambia la apariencia de la aplicación</Text>
            </View>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: "#e0e0e0", true: "#a7c8e7" }}
            thumbColor={darkMode ? "#146193" : "#f4f3f4"}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacidad y Seguridad</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="location-outline" size={24} color="#146193" />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingText}>Servicios de ubicación</Text>
              <Text style={styles.settingDescription}>Permite encontrar eventos cerca de ti</Text>
            </View>
          </View>
          <Switch
            value={locationServices}
            onValueChange={setLocationServices}
            trackColor={{ false: "#e0e0e0", true: "#a7c8e7" }}
            thumbColor={locationServices ? "#146193" : "#f4f3f4"}
          />
        </View>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="lock-closed-outline" size={24} color="#146193" />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingText}>Cambiar contraseña</Text>
              <Text style={styles.settingDescription}>Actualiza tu contraseña de acceso</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="shield-outline" size={24} color="#146193" />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingText}>Política de privacidad</Text>
              <Text style={styles.settingDescription}>Lee nuestra política de privacidad</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aplicación</Text>
        <TouchableOpacity style={styles.settingItem} onPress={handleClearCache}>
          <View style={styles.settingInfo}>
            <Ionicons name="refresh-outline" size={24} color="#146193" />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingText}>Limpiar caché</Text>
              <Text style={styles.settingDescription}>Libera espacio eliminando archivos temporales</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="information-circle-outline" size={24} color="#146193" />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingText}>Acerca de</Text>
              <Text style={styles.settingDescription}>Versión 1.0.0</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color="#146193" />
          <Text style={styles.signOutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Ionicons name="trash-outline" size={24} color="#fff" />
          <Text style={styles.deleteButtonText}>Eliminar Cuenta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    padding: 16,
    gap: 12,
  },
  signOutButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#146193",
  },
  signOutButtonText: {
    color: "#146193",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  deleteButton: {
    flexDirection: "row",
    backgroundColor: "#F44336",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
})

export default SettingsScreen
