"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"

type CalendarEvent = {
  id: string
  title: string
  date: string
  time: string
  location: string
  color: string
}

const CalendarScreen = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    // Simular carga de eventos
    setTimeout(() => {
      setEvents(mockCalendarEvents)
      setLoading(false)
    }, 1000)
  }, [])

  const renderEventItem = ({ item }: { item: CalendarEvent }) => (
    <TouchableOpacity style={styles.eventItem}>
      <View style={[styles.eventColorBar, { backgroundColor: item.color }]} />
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <View style={styles.eventDetails}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.eventDetailText}>{item.time}</Text>
        </View>
        <View style={styles.eventDetails}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.eventDetailText}>{item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#146193" />
        <Text style={styles.loadingText}>Cargando calendario...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Calendario</Text>
        <Text style={styles.headerDate}>{formatDate(selectedDate)}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{events.length}</Text>
          <Text style={styles.statLabel}>Eventos este mes</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Próximos eventos</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Próximos Eventos</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>Ver todos</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.eventsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const mockCalendarEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Festival de Mascotas 2024",
    date: "2024-06-15",
    time: "10:00 AM",
    location: "Parque Central",
    color: "#4CAF50",
  },
  {
    id: "2",
    title: "Conferencia de Tecnología",
    date: "2024-06-18",
    time: "2:00 PM",
    location: "Centro de Convenciones",
    color: "#2196F3",
  },
  {
    id: "3",
    title: "Taller de Fotografía",
    date: "2024-06-20",
    time: "4:00 PM",
    location: "Estudio Creativo",
    color: "#FF9800",
  },
  {
    id: "4",
    title: "Cena de Gala",
    date: "2024-06-25",
    time: "7:00 PM",
    location: "Hotel Elegante",
    color: "#9C27B0",
  },
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  header: {
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 16,
    color: "#666",
    textTransform: "capitalize",
  },
  statsContainer: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
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
    marginHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  viewAllText: {
    fontSize: 16,
    color: "#146193",
    fontWeight: "500",
  },
  eventsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  eventItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  eventColorBar: {
    width: 4,
  },
  eventContent: {
    flex: 1,
    padding: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  eventDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  eventDetailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },
})

export default CalendarScreen
