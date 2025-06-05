"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useFocusEffect, type NavigationProp } from "@react-navigation/native"
import type { RootStackParamList } from "../navigation/RootNavigator"
import { useCallback } from "react"
import EventCard from "../components/EventCard"
import EmptyState from "../components/EmptyState"
import { useAuth } from "../context/AuthContext"
import { fetchUserEvents, debugStorage } from "../services/api"
import { __DEV__ } from "../config"

type MyEventsScreenNavigationProp = NavigationProp<RootStackParamList>

type Event = {
  id: string
  title: string
  date: string
  location: string
  image: string
  isOrganizer: boolean
}

const MyEventsScreen = () => {
  const navigation = useNavigation<MyEventsScreenNavigationProp>()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [activeTab, setActiveTab] = useState<"organizing" | "attending">("organizing")

  // Recargar eventos cuando la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      console.log("📱 MyEventsScreen focused, reloading events") // Debug log
      loadEvents()
    }, [activeTab, user]),
  )

  useEffect(() => {
    loadEvents()
  }, [activeTab, user])

  const loadEvents = async () => {
    setLoading(true)
    try {
      console.log("🔄 Loading events for user:", user?.uid) // Debug log
      console.log("🏷️ Active tab:", activeTab) // Debug log

      if (!user?.uid) {
        console.log("⚠️ No user UID available") // Debug log
        setEvents([])
        return
      }

      // Debug storage first in development
      if (__DEV__) {
        await debugStorage()
      }

      // Obtener eventos del usuario actual
      const userEvents = await fetchUserEvents(user.uid, activeTab)
      console.log(`✅ Found ${userEvents.length} events for tab ${activeTab}`) // Debug log
      console.log("📋 Events data:", userEvents) // Debug log

      setEvents(userEvents)
    } catch (error) {
      console.error("💥 Error loading events:", error)
      setEvents([])

      // Mostrar error al usuario en desarrollo
      if (__DEV__) {
        Alert.alert("Error de desarrollo", `Error cargando eventos: ${error}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadEvents()
    setRefreshing(false)
  }

  const handleEditEvent = (eventId: string) => {
    navigation.navigate("EditEvent", { eventId })
  }

  const handleViewAttendees = (eventId: string) => {
    navigation.navigate("EventAttendees", { eventId })
  }

  const renderEventItem = (item: Event, index: number) => (
    <View key={item.id} style={styles.eventItemContainer}>
      <EventCard
        id={item.id}
        title={item.title}
        date={item.date}
        location={item.location}
        image={item.image}
        horizontal
      />
      {item.isOrganizer && (
        <View style={styles.organizerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleEditEvent(item.id)}>
            <Ionicons name="create-outline" size={20} color="#146193" />
            <Text style={styles.actionText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleViewAttendees(item.id)}>
            <Ionicons name="people-outline" size={20} color="#146193" />
            <Text style={styles.actionText}>Asistentes</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )

  const renderEmptyState = () => {
    if (activeTab === "organizing") {
      return (
        <View style={styles.emptyStateContainer}>
          <EmptyState
            icon="calendar-outline"
            title="No estás organizando eventos"
            message="Crea tu primer evento haciendo clic en el botón 'Crear' en la pestaña principal"
          />
          <TouchableOpacity style={styles.createEventButton} onPress={() => navigation.navigate("Main" as never)}>
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={styles.createEventButtonText}>Crear Mi Primer Evento</Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View style={styles.emptyStateContainer}>
          <EmptyState
            icon="heart-outline"
            title="No estás asistiendo a eventos"
            message="Explora eventos disponibles y únete a los que te interesen"
          />
          <TouchableOpacity style={styles.exploreEventsButton} onPress={() => navigation.navigate("Main" as never)}>
            <Ionicons name="search" size={24} color="#146193" />
            <Text style={styles.exploreEventsButtonText}>Explorar Eventos</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#146193" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Eventos</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color="#146193" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "organizing" && styles.activeTab]}
          onPress={() => setActiveTab("organizing")}
        >
          <Text style={[styles.tabText, activeTab === "organizing" && styles.activeTabText]}>
            Organizando
            {events.length > 0 && activeTab === "organizing" && <Text style={styles.tabBadge}> ({events.length})</Text>}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "attending" && styles.activeTab]}
          onPress={() => setActiveTab("attending")}
        >
          <Text style={[styles.tabText, activeTab === "attending" && styles.activeTabText]}>
            Asistiendo
            {events.length > 0 && activeTab === "attending" && <Text style={styles.tabBadge}> ({events.length})</Text>}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#146193" />
          <Text style={styles.loadingText}>Cargando eventos...</Text>
        </View>
      ) : events.length > 0 ? (
        <View style={styles.eventsContainer}>{events.map((item, index) => renderEventItem(item, index))}</View>
      ) : (
        renderEmptyState()
      )}

      {/* Debug info - solo en desarrollo */}
      {__DEV__ && (
        <View style={styles.debugContainer}>
          <TouchableOpacity
            style={styles.debugToggle}
            onPress={() =>
              Alert.alert("Debug Info", `User ID: ${user?.uid}\nEvents: ${events.length}\nTab: ${activeTab}`)
            }
          >
            <Text style={styles.debugText}>DEBUG</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
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
    justifyContent: "space-between",
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
    flex: 1,
  },
  refreshButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#146193",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#146193",
    fontWeight: "bold",
  },
  tabBadge: {
    fontSize: 14,
    color: "#146193",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  eventsContainer: {
    flex: 1,
    padding: 16,
  },
  eventItemContainer: {
    marginBottom: 16,
  },
  organizerActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    marginTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionText: {
    marginLeft: 6,
    color: "#146193",
    fontWeight: "500",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  createEventButton: {
    flexDirection: "row",
    backgroundColor: "#146193",
    borderRadius: 25,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 25,
  },
  createEventButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },
  exploreEventsButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderColor: "#146193",
    borderWidth: 2,
    borderRadius: 25,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 25,
  },
  exploreEventsButtonText: {
    color: "#146193",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },
  debugContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  debugToggle: {
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 10,
    borderRadius: 5,
  },
  debugText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
})

export default MyEventsScreen
