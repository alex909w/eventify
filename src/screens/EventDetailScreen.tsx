"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { useRoute, type RouteProp } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import type { RootStackParamList } from "../navigation/RootNavigator"
import { useAuth } from "../context/AuthContext"
import { useNavigation, type NavigationProp } from "@react-navigation/native"
import {
  fetchEventById,
  updateRSVP,
  getRSVPStatus,
  fetchEventRating,
  likeComment,
  reportComment,
  type EventDetail,
  type RSVPStatus,
  type EventRating,
} from "../services/api"
import CommentsList from "../components/CommentsList"
import ShareEventModal from "../components/ShareEventModal"

type EventDetailScreenRouteProp = RouteProp<RootStackParamList, "EventDetail">
type EventDetailScreenNavigationProp = NavigationProp<RootStackParamList>

const EventDetailScreen = () => {
  const route = useRoute<EventDetailScreenRouteProp>()
  const navigation = useNavigation<EventDetailScreenNavigationProp>()
  const { eventId } = route.params
  const { user } = useAuth()

  const [event, setEvent] = useState<EventDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus>("pending")
  const [rsvpLoading, setRsvpLoading] = useState(false)
  const [eventRating, setEventRating] = useState<EventRating | null>(null)
  const [shareModalVisible, setShareModalVisible] = useState(false)

  useEffect(() => {
    loadEventDetail()
  }, [eventId])

  const loadEventDetail = async () => {
    try {
      setLoading(true)
      const [eventData, currentRsvpStatus, ratingData] = await Promise.all([
        fetchEventById(eventId),
        getRSVPStatus(eventId, user?.uid),
        fetchEventRating(eventId),
      ])
      setEvent(eventData)
      setRsvpStatus(currentRsvpStatus)
      setEventRating(ratingData)
    } catch (error) {
      console.error("Error loading event detail:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = () => {
    setShareModalVisible(true)
  }

  const handleRSVP = (status: RSVPStatus) => {
    if (!user) {
      Alert.alert("Error", "Debes iniciar sesión para confirmar tu asistencia")
      return
    }

    // No permitir RSVP si es el organizador
    if (event?.organizerId === user.uid) {
      Alert.alert("Información", "Como organizador del evento, no necesitas confirmar asistencia")
      return
    }

    Alert.alert("Confirmar asistencia", `¿Confirmas que ${getStatusText(status)} a este evento?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Confirmar", onPress: () => updateRSVPStatus(status) },
    ])
  }

  const updateRSVPStatus = async (status: RSVPStatus) => {
    if (!user) return

    try {
      setRsvpLoading(true)
      await updateRSVP(eventId, status, user.uid)
      setRsvpStatus(status)

      // Actualizar el evento para reflejar el cambio en asistentes
      await loadEventDetail()

      Alert.alert("¡Confirmado!", `Tu respuesta ha sido registrada: ${getStatusText(status)}`)
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar tu confirmación de asistencia")
    } finally {
      setRsvpLoading(false)
    }
  }

  const handleAddComment = () => {
    if (!user) {
      Alert.alert("Error", "Debes iniciar sesión para comentar")
      return
    }

    if (!event) return

    navigation.navigate("AddComment", {
      eventId: event.id,
      eventTitle: event.title,
    })
  }

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      Alert.alert("Error", "Debes iniciar sesión para dar like")
      return
    }

    try {
      await likeComment(eventId, commentId, user.uid)
      // Recargar calificaciones para mostrar el cambio
      const updatedRating = await fetchEventRating(eventId)
      setEventRating(updatedRating)
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el like")
    }
  }

  const handleReportComment = async (commentId: string) => {
    try {
      await reportComment(eventId, commentId)
      Alert.alert("Reporte enviado", "Gracias por tu reporte. Lo revisaremos pronto.")
    } catch (error) {
      Alert.alert("Error", "No se pudo enviar el reporte")
    }
  }

  const getStatusText = (status: RSVPStatus) => {
    switch (status) {
      case "attending":
        return "asistirás"
      case "not_attending":
        return "no asistirás"
      case "maybe":
        return "tal vez asistas"
      default:
        return "no has respondido"
    }
  }

  const getStatusColor = (status: RSVPStatus) => {
    switch (status) {
      case "attending":
        return "#4CAF50"
      case "not_attending":
        return "#F44336"
      case "maybe":
        return "#FF9800"
      default:
        return "#146193"
    }
  }

  const getStatusIcon = (status: RSVPStatus) => {
    switch (status) {
      case "attending":
        return "checkmark-circle"
      case "not_attending":
        return "close-circle"
      case "maybe":
        return "help-circle"
      default:
        return "calendar-outline"
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#146193" />
      </View>
    )
  }

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
        <Text style={styles.errorText}>No se pudo cargar el evento</Text>
      </View>
    )
  }

  const isOrganizer = event.organizerId === user?.uid

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: event.image }} style={styles.eventImage} />

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{event.title}</Text>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color="#666" />
          <Text style={styles.infoText}>
            {event.date} - {event.time}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={20} color="#666" />
          <Text style={styles.infoText}>{event.location}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={20} color="#666" />
          <Text style={styles.infoText}>
            Organizado por: {event.organizer}
            {isOrganizer && <Text style={styles.organizerBadge}> (Tú)</Text>}
          </Text>
        </View>

        <View style={styles.attendeesContainer}>
          <Text style={styles.attendeesText}>
            <Ionicons name="people-outline" size={18} color="#666" /> {event.attendees} personas asistirán
          </Text>
        </View>

        {/* Mostrar RSVP solo si no es el organizador */}
        {!isOrganizer && (
          <>
            {/* Estado actual de RSVP */}
            <View style={styles.rsvpStatusContainer}>
              <View style={[styles.rsvpStatusBadge, { backgroundColor: getStatusColor(rsvpStatus) }]}>
                <Ionicons name={getStatusIcon(rsvpStatus) as any} size={16} color="#fff" />
                <Text style={styles.rsvpStatusText}>
                  {rsvpStatus === "pending" ? "Sin respuesta" : getStatusText(rsvpStatus)}
                </Text>
              </View>
            </View>

            {/* Botones de RSVP */}
            <View style={styles.rsvpContainer}>
              <Text style={styles.rsvpTitle}>¿Asistirás a este evento?</Text>
              <View style={styles.rsvpButtons}>
                <TouchableOpacity
                  style={[styles.rsvpButton, { backgroundColor: rsvpStatus === "attending" ? "#4CAF50" : "#f0f0f0" }]}
                  onPress={() => handleRSVP("attending")}
                  disabled={rsvpLoading}
                >
                  <Ionicons name="checkmark-circle" size={20} color={rsvpStatus === "attending" ? "#fff" : "#4CAF50"} />
                  <Text style={[styles.rsvpButtonText, { color: rsvpStatus === "attending" ? "#fff" : "#4CAF50" }]}>
                    Sí, asistiré
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.rsvpButton, { backgroundColor: rsvpStatus === "maybe" ? "#FF9800" : "#f0f0f0" }]}
                  onPress={() => handleRSVP("maybe")}
                  disabled={rsvpLoading}
                >
                  <Ionicons name="help-circle" size={20} color={rsvpStatus === "maybe" ? "#fff" : "#FF9800"} />
                  <Text style={[styles.rsvpButtonText, { color: rsvpStatus === "maybe" ? "#fff" : "#FF9800" }]}>
                    Tal vez
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.rsvpButton,
                    { backgroundColor: rsvpStatus === "not_attending" ? "#F44336" : "#f0f0f0" },
                  ]}
                  onPress={() => handleRSVP("not_attending")}
                  disabled={rsvpLoading}
                >
                  <Ionicons name="close-circle" size={20} color={rsvpStatus === "not_attending" ? "#fff" : "#F44336"} />
                  <Text style={[styles.rsvpButtonText, { color: rsvpStatus === "not_attending" ? "#fff" : "#F44336" }]}>
                    No asistiré
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {/* Mensaje para organizadores */}
        {isOrganizer && (
          <View style={styles.organizerContainer}>
            <View style={styles.organizerBadgeContainer}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.organizerText}>Eres el organizador de este evento</Text>
            </View>
          </View>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={20} color="#146193" />
            <Text style={styles.shareButtonText}>Compartir</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        {/* Sección de comentarios y calificaciones */}
        {eventRating && (
          <View style={styles.commentsSection}>
            <CommentsList
              eventId={eventId}
              comments={eventRating.comments}
              averageRating={eventRating.averageRating}
              totalRatings={eventRating.totalRatings}
              onAddComment={handleAddComment}
              onLikeComment={handleLikeComment}
              onReportComment={handleReportComment}
            />
          </View>
        )}
      </View>

      {/* Modal de compartir */}
      <ShareEventModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        eventTitle={event.title}
        eventDate={event.date}
        eventLocation={event.location}
        eventId={event.id}
      />
    </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginTop: 16,
    textAlign: "center",
  },
  eventImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
  organizerBadge: {
    color: "#146193",
    fontWeight: "bold",
  },
  attendeesContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  attendeesText: {
    fontSize: 16,
    color: "#666",
  },
  rsvpStatusContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  rsvpStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rsvpStatusText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 6,
    textTransform: "capitalize",
  },
  rsvpContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
  },
  rsvpTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  rsvpButtons: {
    gap: 12,
  },
  rsvpButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  rsvpButtonText: {
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },
  organizerContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#fff8e1",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  organizerBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  organizerText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#F57C00",
  },
  actionButtons: {
    flexDirection: "row",
    marginBottom: 24,
    justifyContent: "center",
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#146193",
    flex: 1,
  },
  shareButtonText: {
    color: "#146193",
    fontWeight: "bold",
    marginLeft: 8,
  },
  descriptionContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  commentsSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 16,
  },
})

export default EventDetailScreen
