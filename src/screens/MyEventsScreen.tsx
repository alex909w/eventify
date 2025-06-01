"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import EventCard from "../components/EventCard"
import EmptyState from "../components/EmptyState"

type Event = {
  id: string
  title: string
  date: string
  location: string
  image: string
  isOrganizer: boolean
}

const MyEventsScreen = () => {
  const navigation = useNavigation()
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<Event[]>([])
  const [activeTab, setActiveTab] = useState<"organizing" | "attending">("organizing")

  useEffect(() => {
    loadEvents()
  }, [activeTab])

  const loadEvents = async () => {
    setLoading(true)
    // Simular carga de datos
    setTimeout(() => {
      // Datos de ejemplo con las imágenes específicas
      const mockEvents: Event[] = [
        {
          id: "1",
          title: "Cena de gala empresarial",
          date: "15 Jun 2025",
          location: "Parque Central",
          image: "/assets/evento1.jpg",
          isOrganizer: true,
        },
        {
          id: "2",
          title: "Networking Profesional",
          date: "22 Jun 2025",
          location: "Centro de Convenciones",
          image: "/assets/evento2.png",
          isOrganizer: false,
        },
        {
          id: "3",
          title: "Festival de mascotas",
          date: "25 Jun 2025",
          location: "Club Canino",
          image: "/assets/evento3.jpg",
          isOrganizer: true,
        },
        {
          id: "4",
          title: "Conferencia tecnológica",
          date: "30 Jun 2025",
          location: "Plaza Principal",
          image: "/assets/evento4.jpg",
          isOrganizer: false,
        },
      ]

      const filteredEvents = mockEvents.filter((event) =>
        activeTab === "organizing" ? event.isOrganizer : !event.isOrganizer,
      )
      setEvents(filteredEvents)
      setLoading(false)
    }, 1000)
  }

  const renderEventItem = ({ item }: { item: Event }) => (
    <View style={styles.eventItemContainer}>
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
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="create-outline" size={20} color="#146193" />
            <Text style={styles.actionText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
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
        <EmptyState
          icon="calendar-outline"
          title="No estás organizando eventos"
          message="Crea tu primer evento haciendo clic en el botón 'Crear' en la pestaña principal"
        />
      )
    } else {
      return (
        <EmptyState
          icon="heart-outline"
          title="No estás asistiendo a eventos"
          message="Explora eventos disponibles y únete a los que te interesen"
        />
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
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "organizing" && styles.activeTab]}
          onPress={() => setActiveTab("organizing")}
        >
          <Text style={[styles.tabText, activeTab === "organizing" && styles.activeTabText]}>Organizando</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "attending" && styles.activeTab]}
          onPress={() => setActiveTab("attending")}
        >
          <Text style={[styles.tabText, activeTab === "attending" && styles.activeTabText]}>Asistiendo</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#146193" />
          <Text style={styles.loadingText}>Cargando eventos...</Text>
        </View>
      ) : events.length > 0 ? (
        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  listContainer: {
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
})

export default MyEventsScreen
