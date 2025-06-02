"use client"

import { useState, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native"
import { fetchEventAttendees, fetchEventById, type EventAttendee } from "../services/api"
import { useAuth } from "../context/AuthContext"
import EmptyState from "../components/EmptyState"
import type { RootStackParamList } from "../navigation/RootNavigator"

type EventAttendeesScreenRouteProp = RouteProp<RootStackParamList, "EventAttendees">

const EventAttendeesScreen = () => {
  const navigation = useNavigation()
  const route = useRoute<EventAttendeesScreenRouteProp>()
  const { eventId } = route.params
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [attendees, setAttendees] = useState<EventAttendee[]>([])
  const [eventTitle, setEventTitle] = useState("")
  const [isOrganizer, setIsOrganizer] = useState(false)

  useEffect(() => {
    loadData()
  }, [eventId])

  const loadData = async () => {
    try {
      setLoading(true)
      const [eventData, attendeesData] = await Promise.all([fetchEventById(eventId), fetchEventAttendees(eventId)])

      setEventTitle(eventData.title)
      setIsOrganizer(eventData.organizerId === user?.uid)
      setAttendees(attendeesData)
    } catch (error) {
      console.error("Error loading attendees:", error)
      Alert.alert("Error", "No se pudieron cargar los asistentes")
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const handleContactAttendee = (attendee: EventAttendee) => {
    Alert.alert("Contactar", `¿Cómo deseas contactar a ${attendee.name}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Email", onPress: () => console.log("Contact via email:", attendee.email) },
      { text: "Mensaje", onPress: () => console.log("Send message to:", attendee.name) },
    ])
  }

  const renderAttendeeItem = ({ item }: { item: EventAttendee }) => (
    <TouchableOpacity
      style={styles.attendeeItem}
      onPress={() => isOrganizer && handleContactAttendee(item)}
      disabled={!isOrganizer}
    >
      <Image
        source={{
          uri: item.photoURL || "/placeholder.svg?height=50&width=50&text=" + item.name.charAt(0),
        }}
        style={styles.attendeePhoto}
      />
      <View style={styles.attendeeInfo}>
        <Text style={styles.attendeeName}>{item.name}</Text>
        <View style={styles.attendeeDetails}>
          <Ionicons name="time-outline" size={14} color="#666" />
          <Text style={styles.attendeeDate}>Se unió {item.joinedDate}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Ionicons name={getStatusIcon(item.status)} size={12} color="#fff" />
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
      </View>
      {isOrganizer && (
        <TouchableOpacity style={styles.contactButton} onPress={() => handleContactAttendee(item)}>
          <Ionicons name="chatbubble-outline" size={20} color="#146193" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "attending":
        return "#4CAF50"
      case "maybe":
        return "#FF9800"
      case "organizer":
        return "#146193"
      default:
        return "#666"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "attending":
        return "checkmark-circle"
      case "maybe":
        return "help-circle"
      case "organizer":
        return "star"
      default:
        return "person"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "attending":
        return "Confirmado"
      case "maybe":
        return "Tal vez"
      case "organizer":
        return "Organizador"
      default:
        return "Pendiente"
    }
  }

  const attendingCount = attendees.filter((a) => a.status === "attending").length
  const maybeCount = attendees.filter((a) => a.status === "maybe").length
  const organizerCount = attendees.filter((a) => a.status === "organizer").length

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#146193" />
        <Text style={styles.loadingText}>Cargando asistentes...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#146193" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Asistentes</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {eventTitle}
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{attendingCount}</Text>
          <Text style={styles.statLabel}>Confirmados</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{maybeCount}</Text>
          <Text style={styles.statLabel}>Tal vez</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{organizerCount}</Text>
          <Text style={styles.statLabel}>Organizadores</Text>
        </View>
      </View>

      {attendees.length === 0 ? (
        <EmptyState
          icon="people-outline"
          title="No hay asistentes aún"
          message="Comparte tu evento para que más personas se unan"
        />
      ) : (
        <FlatList
          data={attendees}
          renderItem={renderAttendeeItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#146193"]} tintColor="#146193" />
          }
        />
      )}

      {isOrganizer && attendees.length > 0 && (
        <View style={styles.organizerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="mail-outline" size={20} color="#146193" />
            <Text style={styles.actionText}>Enviar mensaje grupal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="download-outline" size={20} color="#146193" />
            <Text style={styles.actionText}>Exportar lista</Text>
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
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#f8f9fa",
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
    backgroundColor: "#e0e0e0",
    marginHorizontal: 20,
  },
  listContainer: {
    padding: 16,
  },
  attendeeItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  attendeePhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  attendeeInfo: {
    flex: 1,
  },
  attendeeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  attendeeDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  attendeeDate: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  statusContainer: {
    alignItems: "flex-start",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  contactButton: {
    padding: 8,
    marginLeft: 8,
  },
  organizerActions: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#f8f9fa",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    marginHorizontal: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#146193",
  },
  actionText: {
    color: "#146193",
    fontWeight: "500",
    marginLeft: 8,
  },
})

export default EventAttendeesScreen
