"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Share } from "react-native"
import { useRoute, type RouteProp } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import type { RootStackParamList } from "../navigation/RootNavigator"

type EventDetailScreenRouteProp = RouteProp<RootStackParamList, "EventDetail">

type EventDetail = {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  organizer: string
  image: any
  attendees: number
}

const EventDetailScreen = () => {
  const route = useRoute<EventDetailScreenRouteProp>()
  const { eventId } = route.params

  const [event, setEvent] = useState<EventDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [attending, setAttending] = useState(false)

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      // Buscar el evento según el ID
      const foundEvent = mockEvents.find((e) => e.id === eventId) || mockEvents[0]
      setEvent(foundEvent)
      setLoading(false)
    }, 1000)
  }, [eventId])

  const handleShare = async () => {
    if (!event) return

    try {
      await Share.share({
        message: `¡Mira este evento: ${event.title} el ${event.date} en ${event.location}!`,
        title: event.title,
      })
    } catch (error) {
      console.error("Error sharing event:", error)
    }
  }

  const toggleAttending = () => {
    setAttending(!attending)
    // Aquí iría la lógica para registrar la asistencia en el backend
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#146193" />
      </View>
    )
  }

  // Mostrar datos de ejemplo si no hay evento
  const eventData = event || mockEvents[0]

  return (
    <ScrollView style={styles.container}>
      <Image source={eventData.image} style={styles.eventImage} />

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{eventData.title}</Text>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color="#666" />
          <Text style={styles.infoText}>
            {eventData.date} - {eventData.time}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={20} color="#666" />
          <Text style={styles.infoText}>{eventData.location}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={20} color="#666" />
          <Text style={styles.infoText}>Organizado por: {eventData.organizer}</Text>
        </View>

        <View style={styles.attendeesContainer}>
          <Text style={styles.attendeesText}>
            <Ionicons name="people-outline" size={18} color="#666" /> {eventData.attendees} personas asistirán
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, attending ? styles.attendingButton : {}]}
            onPress={toggleAttending}
          >
            <Ionicons
              name={attending ? "checkmark-circle" : "calendar-outline"}
              size={20}
              color={attending ? "#fff" : "#146193"}
            />
            <Text style={[styles.actionButtonText, attending ? styles.attendingButtonText : {}]}>
              {attending ? "Asistiré" : "Asistir"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={20} color="#146193" />
            <Text style={styles.shareButtonText}>Compartir</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>{eventData.description}</Text>
        </View>
      </View>
    </ScrollView>
  )
}

// Datos de ejemplo con imágenes estáticas
const mockEvents: EventDetail[] = [
  {
    id: "1",
    title: "Cena de Gala Empresarial",
    description:
      "Únete a nosotros para una elegante cena de gala con los líderes empresariales más destacados de la región. Disfruta de una noche de networking, excelente comida y entretenimiento en vivo. Una oportunidad única para establecer contactos valiosos en un ambiente sofisticado.",
    date: "15 de Junio, 2024",
    time: "8:00 PM - 11:00 PM",
    location: "Hotel Elegante",
    organizer: "Cámara de Comercio",
    image: require("../../assets/evento1.jpg"),
    attendees: 128,
  },
  {
    id: "2",
    title: "Networking Profesional",
    description:
      "Evento exclusivo de networking para profesionales de todos los sectores. Amplía tu red de contactos, comparte experiencias y descubre nuevas oportunidades de negocio en un ambiente distendido y profesional.",
    date: "22 de Junio, 2024",
    time: "6:00 PM - 9:00 PM",
    location: "Centro de Negocios",
    organizer: "Business Network International",
    image: require("../../assets/evento2.png"),
    attendees: 85,
  },
  {
    id: "3",
    title: "Festival de Mascotas 2024",
    description:
      "El evento más esperado para los amantes de las mascotas. Concursos, adopciones, productos especializados, servicios veterinarios y mucha diversión para toda la familia y sus compañeros peludos.",
    date: "25 de Junio, 2024",
    time: "10:00 AM - 6:00 PM",
    location: "Parque Central",
    organizer: "Asociación Protectora de Animales",
    image: require("../../assets/evento3.jpg"),
    attendees: 210,
  },
  {
    id: "4",
    title: "Conferencia de Tecnología",
    description:
      "La conferencia tecnológica más importante del año. Ponentes internacionales, talleres prácticos, demostraciones de productos y las últimas tendencias en inteligencia artificial, blockchain, desarrollo web y más.",
    date: "30 de Junio, 2024",
    time: "9:00 AM - 5:00 PM",
    location: "Centro de Convenciones",
    organizer: "Tech Innovators",
    image: require("../../assets/evento4.jpg"),
    attendees: 175,
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
  attendeesContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  attendeesText: {
    fontSize: 16,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#146193",
    flex: 1,
    marginRight: 12,
  },
  actionButtonText: {
    color: "#146193",
    fontWeight: "bold",
    marginLeft: 8,
  },
  attendingButton: {
    backgroundColor: "#146193",
    borderColor: "#146193",
  },
  attendingButtonText: {
    color: "#fff",
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
})

export default EventDetailScreen
