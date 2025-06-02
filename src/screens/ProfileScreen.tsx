"use client"
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useAuth } from "../context/AuthContext"
import { useState, useEffect } from "react"
import { fetchUserEvents } from "../services/api"
import AsyncStorage from "@react-native-async-storage/async-storage"

const ProfileScreen = () => {
  const navigation = useNavigation()
  const { user, signOut } = useAuth()
  const [userDisplayName, setUserDisplayName] = useState(user?.displayName || user?.email?.split("@")[0] || "Usuario")
  const [eventsCreated, setEventsCreated] = useState(0)
  const [eventsAttending, setEventsAttending] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUserDisplayName(user?.displayName || user?.email?.split("@")[0] || "Usuario")
    loadUserStats()
  }, [user])

  // Modificar la función loadUserStats para usar la nueva función de contadores
  const loadUserStats = async () => {
    try {
      setLoading(true)
      console.log("Loading stats for user:", user?.uid) // Debug log

      if (!user?.uid) {
        setEventsCreated(0)
        setEventsAttending(0)
        return
      }

      // Intentar obtener perfil del usuario con contadores
      const userProfileStr = await AsyncStorage.getItem(`@user_profile_${user.uid}`)
      if (userProfileStr) {
        const userProfile = JSON.parse(userProfileStr)
        setEventsCreated(userProfile.eventsCreated || 0)
        setEventsAttending(userProfile.eventsAttended || 0)
        console.log("User profile loaded from storage:", userProfile)
      } else {
        // Si no existe el perfil, calcular contadores directamente
        const organizingEvents = await fetchUserEvents(user.uid, "organizing")
        console.log("Organizing events count:", organizingEvents.length) // Debug log

        const attendingEvents = await fetchUserEvents(user.uid, "attending")
        console.log("Attending events count:", attendingEvents.length) // Debug log

        setEventsCreated(organizingEvents.length)
        setEventsAttending(attendingEvents.length)

        // Crear perfil de usuario con los contadores
        const userProfile = {
          uid: user.uid,
          eventsCreated: organizingEvents.length,
          eventsAttended: attendingEvents.length,
          lastUpdated: new Date().toISOString(),
        }

        await AsyncStorage.setItem(`@user_profile_${user.uid}`, JSON.stringify(userProfile))
      }
    } catch (error) {
      console.error("Error loading user stats:", error)
      // En caso de error, mantener valores por defecto
      setEventsCreated(0)
      setEventsAttending(0)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar Sesión", onPress: signOut, style: "destructive" },
    ])
  }

  const navigateToScreen = (screenName: string) => {
    navigation.navigate(screenName as never)
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri: user?.photoURL || "/placeholder.svg?height=100&width=100&text=Usuario",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{userDisplayName}</Text>
        <Text style={styles.profileEmail}>{user?.email || ""}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{loading ? "..." : eventsCreated}</Text>
          <Text style={styles.statLabel}>Eventos Creados</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{loading ? "..." : eventsAttending}</Text>
          <Text style={styles.statLabel}>Asistencias</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigateToScreen("EditProfile")}>
          <Ionicons name="person-outline" size={24} color="#146193" />
          <Text style={styles.menuText}>Editar perfil</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigateToScreen("MyEvents")}>
          <Ionicons name="calendar-outline" size={24} color="#146193" />
          <Text style={styles.menuText}>Mis eventos</Text>
          {eventsCreated > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{eventsCreated}</Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigateToScreen("EventHistory")}>
          <Ionicons name="time-outline" size={24} color="#146193" />
          <Text style={styles.menuText}>Historial de eventos</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigateToScreen("Statistics")}>
          <Ionicons name="stats-chart-outline" size={24} color="#146193" />
          <Text style={styles.menuText}>Estadísticas</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigateToScreen("Settings")}>
          <Ionicons name="settings-outline" size={24} color="#146193" />
          <Text style={styles.menuText}>Configuración</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigateToScreen("HelpSupport")}>
          <Ionicons name="help-circle-outline" size={24} color="#146193" />
          <Text style={styles.menuText}>Ayuda y soporte</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color="#F44336" />
          <Text style={[styles.menuText, styles.logoutText]}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Eventify v1.0.0</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileHeader: {
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#146193",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#f0f0f0",
  },
  menuContainer: {
    padding: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuText: {
    fontSize: 16,
    marginLeft: 16,
    flex: 1,
  },
  badge: {
    backgroundColor: "#146193",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
    minWidth: 20,
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  logoutItem: {
    borderBottomWidth: 0,
    marginTop: 16,
  },
  logoutText: {
    color: "#F44336",
  },
  versionContainer: {
    padding: 16,
    alignItems: "center",
  },
  versionText: {
    fontSize: 14,
    color: "#999",
  },
})

export default ProfileScreen
