import AsyncStorage from "@react-native-async-storage/async-storage"
import { initializeApp } from "firebase/app"
import { firebaseConfig } from "../config/firebase"
import type { Comment } from "../components/Commentitem"

// Inicializar Firebase si no está inicializado
try {
  initializeApp(firebaseConfig)
} catch (error: any) {
  // Ignorar el error "Firebase App named '[DEFAULT]' already exists"
  if (!/already exists/.test(error.message)) {
    console.error("Error initializing Firebase:", error)
  }
}

// Tipos existentes
export type Event = {
  id: string
  title: string
  date: string
  location: string
  image: string
  category: string
  organizer?: string
  organizerId?: string
}

export type EventDetail = {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  organizer: string
  organizerId?: string
  image: string
  attendees: number
  isAttending?: boolean
}

export type Notification = {
  id: string
  title: string
  message: string
  date: string
  read: boolean
  type: "event" | "message" | "reminder" | "system" | "rsvp"
  eventId?: string
}

export type UserEvent = {
  id: string
  title: string
  date: string
  location: string
  image: string
  isOrganizer: boolean
}

export type RSVPStatus = "attending" | "not_attending" | "maybe" | "pending"

export type RSVPResponse = {
  eventId: string
  userId: string
  status: RSVPStatus
  timestamp: string
}

export type EventAttendee = {
  id: string
  name: string
  email: string
  photoURL?: string
  status: "attending" | "maybe" | "organizer"
  joinedDate: string
}

export type EventRating = {
  eventId: string
  averageRating: number
  totalRatings: number
  comments: Comment[]
}

// Nuevos tipos para historial y estadísticas
export type EventHistoryItem = {
  id: string
  title: string
  date: string
  location: string
  image: string
  status: "completed" | "cancelled" | "postponed"
  totalAttendees: number
  averageRating?: number
  totalComments: number
  attendedDate?: string
  userRating?: number
}

export type UserStatistics = {
  // Estadísticas generales
  totalEventsOrganized: number
  totalEventsAttended: number
  totalComments: number
  averageRatingGiven: number

  // Estadísticas como organizador
  totalAttendeesReceived: number
  averageRatingReceived: number
  totalCommentsReceived: number
  successfulEvents: number

  // Actividad mensual
  monthlyActivity: Array<{
    month: string
    events: number
  }>

  // Categorías favoritas
  favoriteCategories: Array<{
    name: string
    count: number
    percentage: number
  }>

  // Logros
  achievements: Array<{
    id: string
    title: string
    description: string
    icon: string
    unlocked: boolean
    unlockedDate?: string
  }>
}

// Datos de ejemplo con las imágenes específicas
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Cena de gala empresarial",
    date: "15 Jun 2025",
    location: "Parque Central",
    image: "/assets/evento1.jpg",
    category: "featured",
    organizer: "Cámara de Comercio",
    organizerId: "mock_user_1",
  },
  {
    id: "2",
    title: "Networking Profesional",
    date: "22 Jun 2025",
    location: "Centro de Convenciones",
    image: "/assets/evento2.png",
    category: "featured",
    organizer: "Asociación de Profesionales",
    organizerId: "mock_user_2",
  },
  {
    id: "3",
    title: "Festival de mascotas",
    date: "25 Jun 2024",
    location: "Club Canino",
    image: "/assets/evento3.jpg",
    category: "upcoming",
    organizer: "Asociación de Amantes de las Mascotas",
    organizerId: "mock_user_3",
  },
  {
    id: "4",
    title: "Conferencia tecnológica",
    date: "30 Jun 2024",
    location: "Plaza Principal",
    image: "/assets/evento4.jpg",
    category: "upcoming",
    organizer: "Tech Community",
    organizerId: "mock_user_4",
  },
]

const mockEventDetails: Record<string, EventDetail> = {
  "1": {
    id: "1",
    title: "Cena de gala empresarial",
    description:
      "Únete a nosotros para una elegante cena de gala empresarial. Una noche especial para networking, reconocimientos y celebración de logros empresariales. Disfruta de una cena exquisita, entretenimiento de primera clase y la oportunidad de conectar con líderes de la industria.",
    date: "15 de Junio, 2025",
    time: "7:00 PM - 11:00 PM",
    location: "Parque Central",
    organizer: "Cámara de Comercio",
    organizerId: "mock_user_1",
    image: "/assets/evento1.jpg",
    attendees: 150,
    isAttending: false,
  },
  "2": {
    id: "2",
    title: "Networking Profesional",
    description:
      "Evento de networking profesional diseñado para conectar a profesionales de diferentes industrias. Participa en conversaciones enriquecedoras, intercambia tarjetas de presentación y construye relaciones valiosas que impulsen tu carrera profesional.",
    date: "22 de Junio, 2025",
    time: "6:00 PM - 9:00 PM",
    location: "Centro de Convenciones",
    organizer: "Asociación de Profesionales",
    organizerId: "mock_user_2",
    image: "/assets/evento2.png",
    attendees: 200,
    isAttending: false,
  },
  "3": {
    id: "3",
    title: "Festival de mascotas",
    description:
      "Un festival lleno de diversión para toda la familia y sus mascotas. Disfruta de concursos, exhibiciones, adopciones responsables, productos para mascotas y muchas actividades divertidas. Ven con tu compañero peludo y vive una experiencia inolvidable.",
    date: "25 de Junio, 2024",
    time: "10:00 AM - 6:00 PM",
    location: "Club Canino",
    organizer: "Asociación de Amantes de las Mascotas",
    organizerId: "mock_user_3",
    image: "/assets/evento3.jpg",
    attendees: 300,
    isAttending: true,
  },
  "4": {
    id: "4",
    title: "Conferencia tecnológica",
    description:
      "Conferencia sobre las últimas tendencias en tecnología. Escucha a expertos de la industria hablar sobre inteligencia artificial, blockchain, desarrollo web y las innovaciones que están transformando el mundo digital. Ideal para desarrolladores y entusiastas de la tecnología.",
    date: "30 de Junio, 2024",
    time: "9:00 AM - 5:00 PM",
    location: "Plaza Principal",
    organizer: "Tech Community",
    organizerId: "mock_user_4",
    image: "/assets/evento4.jpg",
    attendees: 250,
    isAttending: false,
  },
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Confirmación de asistencia",
    message: "Has confirmado tu asistencia al Festival de mascotas",
    date: "Hace 1 hora",
    read: false,
    type: "rsvp",
    eventId: "3",
  },
  {
    id: "2",
    title: "Recordatorio de evento",
    message: "Festival de mascotas comienza mañana a las 10:00 AM",
    date: "Hace 2 horas",
    read: false,
    type: "reminder",
    eventId: "3",
  },
  {
    id: "3",
    title: "Cambio en evento",
    message: "La ubicación del Networking Profesional ha cambiado",
    date: "Hace 5 horas",
    read: true,
    type: "event",
    eventId: "2",
  },
  {
    id: "4",
    title: "Nuevo evento cerca de ti",
    message: "Cena de gala empresarial se realizará a 5km de tu ubicación",
    date: "Ayer",
    read: true,
    type: "event",
    eventId: "1",
  },
]

const mockAttendees: Record<string, EventAttendee[]> = {
  "1": [
    {
      id: "organizer_1",
      name: "Cámara de Comercio",
      email: "info@camaradecomercio.com",
      photoURL: "/placeholder.svg?height=50&width=50&text=CC",
      status: "organizer",
      joinedDate: "Organizador",
    },
    {
      id: "attendee_1",
      name: "María González",
      email: "maria@email.com",
      photoURL: "/placeholder.svg?height=50&width=50&text=MG",
      status: "attending",
      joinedDate: "hace 2 días",
    },
    {
      id: "attendee_2",
      name: "Carlos Rodríguez",
      email: "carlos@email.com",
      photoURL: "/placeholder.svg?height=50&width=50&text=CR",
      status: "attending",
      joinedDate: "hace 1 día",
    },
    {
      id: "attendee_3",
      name: "Ana López",
      email: "ana@email.com",
      photoURL: "/placeholder.svg?height=50&width=50&text=AL",
      status: "maybe",
      joinedDate: "hace 3 horas",
    },
  ],
  "2": [
    {
      id: "organizer_2",
      name: "Asociación de Profesionales",
      email: "info@profesionales.com",
      photoURL: "/placeholder.svg?height=50&width=50&text=AP",
      status: "organizer",
      joinedDate: "Organizador",
    },
  ],
  "3": [
    {
      id: "organizer_3",
      name: "Asociación de Amantes de las Mascotas",
      email: "info@mascotas.com",
      photoURL: "/placeholder.svg?height=50&width=50&text=AM",
      status: "organizer",
      joinedDate: "Organizador",
    },
  ],
  "4": [
    {
      id: "organizer_4",
      name: "Tech Community",
      email: "info@techcommunity.com",
      photoURL: "/placeholder.svg?height=50&width=50&text=TC",
      status: "organizer",
      joinedDate: "Organizador",
    },
  ],
}

// Datos mock para comentarios y calificaciones
const mockEventRatings: Record<string, EventRating> = {
  "1": {
    eventId: "1",
    averageRating: 4.5,
    totalRatings: 12,
    comments: [
      {
        id: "comment_1_1",
        userId: "user_1",
        userName: "María González",
        userPhoto: "/placeholder.svg?height=40&width=40&text=MG",
        rating: 5,
        comment:
          "¡Excelente evento! La organización fue impecable y la comida deliciosa. Definitivamente asistiré el próximo año.",
        date: "hace 2 días",
        likes: 8,
        isLiked: false,
      },
      {
        id: "comment_1_2",
        userId: "user_2",
        userName: "Carlos Rodríguez",
        userPhoto: "/placeholder.svg?height=40&width=40&text=CR",
        rating: 4,
        comment:
          "Muy buen evento para networking. Conocí a muchos profesionales interesantes. El único punto a mejorar sería el sonido.",
        date: "hace 1 día",
        likes: 5,
        isLiked: true,
      },
    ],
  },
  "2": {
    eventId: "2",
    averageRating: 4.2,
    totalRatings: 8,
    comments: [
      {
        id: "comment_2_1",
        userId: "user_3",
        userName: "Ana López",
        userPhoto: "/placeholder.svg?height=40&width=40&text=AL",
        rating: 4,
        comment: "Buen evento de networking, aunque esperaba más variedad en los sectores representados.",
        date: "hace 3 horas",
        likes: 3,
        isLiked: false,
      },
    ],
  },
  "3": {
    eventId: "3",
    averageRating: 4.8,
    totalRatings: 25,
    comments: [
      {
        id: "comment_3_1",
        userId: "user_4",
        userName: "Pedro Martínez",
        userPhoto: "/placeholder.svg?height=40&width=40&text=PM",
        rating: 5,
        comment:
          "¡Increíble festival! Mi perro se divirtió muchísimo y yo también. Muy bien organizado y con muchas actividades.",
        date: "hace 1 semana",
        likes: 15,
        isLiked: true,
      },
      {
        id: "comment_3_2",
        userId: "user_5",
        userName: "Laura Sánchez",
        userPhoto: "/placeholder.svg?height=40&width=40&text=LS",
        rating: 5,
        comment:
          "Perfecto para ir en familia. Los niños y las mascotas disfrutaron por igual. ¡Volveremos el próximo año!",
        date: "hace 5 días",
        likes: 12,
        isLiked: false,
      },
    ],
  },
  "4": {
    eventId: "4",
    averageRating: 4.6,
    totalRatings: 18,
    comments: [
      {
        id: "comment_4_1",
        userId: "user_6",
        userName: "Diego Torres",
        userPhoto: "/placeholder.svg?height=40&width=40&text=DT",
        rating: 5,
        comment: "Excelentes ponencias sobre IA y blockchain. Los speakers fueron de primer nivel y aprendí muchísimo.",
        date: "hace 2 semanas",
        likes: 20,
        isLiked: true,
      },
    ],
  },
}

// Datos mock para historial de eventos
const mockEventHistory: Record<string, EventHistoryItem[]> = {
  organized: [
    {
      id: "hist_1",
      title: "Workshop de React Native",
      date: "15 May 2024",
      location: "Centro de Innovación",
      image: "/assets/evento1.jpg",
      status: "completed",
      totalAttendees: 45,
      averageRating: 4.7,
      totalComments: 12,
    },
    {
      id: "hist_2",
      title: "Meetup de Startups",
      date: "28 Apr 2024",
      location: "Coworking Space",
      image: "/assets/evento2.png",
      status: "completed",
      totalAttendees: 32,
      averageRating: 4.3,
      totalComments: 8,
    },
    {
      id: "hist_3",
      title: "Conferencia de IA",
      date: "10 Mar 2024",
      location: "Universidad Tech",
      image: "/assets/evento4.jpg",
      status: "cancelled",
      totalAttendees: 0,
      averageRating: 0,
      totalComments: 0,
    },
  ],
  attended: [
    {
      id: "hist_4",
      title: "Festival de Música Indie",
      date: "20 May 2024",
      location: "Parque de la Música",
      image: "/assets/evento3.jpg",
      status: "completed",
      totalAttendees: 500,
      averageRating: 4.9,
      totalComments: 45,
      attendedDate: "20 May 2024",
      userRating: 5,
    },
    {
      id: "hist_5",
      title: "Taller de Fotografía",
      date: "05 Apr 2024",
      location: "Estudio Creativo",
      image: "/assets/evento1.jpg",
      status: "completed",
      totalAttendees: 20,
      averageRating: 4.5,
      totalComments: 6,
      attendedDate: "05 Apr 2024",
      userRating: 4,
    },
  ],
}

// Datos mock para estadísticas
const mockUserStatistics: UserStatistics = {
  totalEventsOrganized: 8,
  totalEventsAttended: 15,
  totalComments: 23,
  averageRatingGiven: 4.3,
  totalAttendeesReceived: 156,
  averageRatingReceived: 4.5,
  totalCommentsReceived: 34,
  successfulEvents: 6,
  monthlyActivity: [
    { month: "Ene", events: 2 },
    { month: "Feb", events: 1 },
    { month: "Mar", events: 3 },
    { month: "Abr", events: 4 },
    { month: "May", events: 5 },
    { month: "Jun", events: 3 },
  ],
  favoriteCategories: [
    { name: "Tecnología", count: 8, percentage: 35 },
    { name: "Networking", count: 5, percentage: 22 },
    { name: "Educación", count: 4, percentage: 17 },
    { name: "Entretenimiento", count: 3, percentage: 13 },
    { name: "Deportes", count: 3, percentage: 13 },
  ],
  achievements: [
    {
      id: "first_event",
      title: "Primer Evento",
      description: "Organiza tu primer evento",
      icon: "trophy",
      unlocked: true,
      unlockedDate: "15 Ene 2024",
    },
    {
      id: "social_butterfly",
      title: "Mariposa Social",
      description: "Asiste a 10 eventos",
      icon: "people",
      unlocked: true,
      unlockedDate: "22 Mar 2024",
    },
    {
      id: "event_master",
      title: "Maestro de Eventos",
      description: "Organiza 5 eventos exitosos",
      icon: "star",
      unlocked: true,
      unlockedDate: "10 May 2024",
    },
    {
      id: "super_organizer",
      title: "Super Organizador",
      description: "Organiza 10 eventos",
      icon: "medal",
      unlocked: false,
    },
    {
      id: "community_leader",
      title: "Líder Comunitario",
      description: "Recibe 100 asistentes en total",
      icon: "crown",
      unlocked: true,
      unlockedDate: "28 May 2024",
    },
    {
      id: "reviewer",
      title: "Crítico Experto",
      description: "Escribe 25 comentarios",
      icon: "chatbubble",
      unlocked: false,
    },
  ],
}

// Funciones de API existentes (mantenidas)
export const fetchEvents = async (): Promise<Event[]> => {
  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    // Intentar obtener eventos del almacenamiento local
    const storedEvents = await AsyncStorage.getItem("@events")
    if (storedEvents) {
      const events = JSON.parse(storedEvents)
      console.log("📦 Events loaded from storage:", events.length) // Debug log
      // Combinar con eventos mock si no hay eventos almacenados
      return events.length > 0 ? events : mockEvents
    }
  } catch (error) {
    console.error("❌ Error fetching events from storage:", error)
  }

  console.log("📱 Using mock events:", mockEvents.length) // Debug log
  // Si no hay eventos almacenados, devolver datos de ejemplo
  return mockEvents
}

export const fetchEventById = async (id: string): Promise<EventDetail> => {
  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 800))

  try {
    // Intentar obtener evento del almacenamiento local
    const storedEvent = await AsyncStorage.getItem(`@event_${id}`)
    if (storedEvent) {
      const eventDetail = JSON.parse(storedEvent)
      // Verificar RSVP del usuario
      const rsvpStatus = await getRSVPStatus(id)
      return {
        ...eventDetail,
        isAttending: rsvpStatus === "attending",
      }
    }

    // Verificar RSVP del usuario para eventos mock
    const rsvpStatus = await getRSVPStatus(id)
    const eventDetail = mockEventDetails[id]

    if (eventDetail) {
      return {
        ...eventDetail,
        isAttending: rsvpStatus === "attending",
      }
    }
  } catch (error) {
    console.error(`❌ Error fetching event ${id} from storage:`, error)
  }

  // Si no hay evento almacenado, devolver datos de ejemplo
  return (
    mockEventDetails[id] || {
      id,
      title: "Evento no encontrado",
      description: "Lo sentimos, no pudimos encontrar los detalles de este evento.",
      date: "N/A",
      time: "N/A",
      location: "N/A",
      organizer: "N/A",
      organizerId: "unknown",
      image: "/placeholder.svg?height=300&width=400&text=Evento+no+encontrado&bg=cccccc&color=666666",
      attendees: 0,
      isAttending: false,
    }
  )
}

export const fetchNotifications = async (): Promise<Notification[]> => {
  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 700))

  try {
    // Intentar obtener notificaciones del almacenamiento local
    const storedNotifications = await AsyncStorage.getItem("@notifications")
    if (storedNotifications) {
      return JSON.parse(storedNotifications)
    }
  } catch (error) {
    console.error("❌ Error fetching notifications from storage:", error)
  }

  // Si no hay notificaciones almacenadas, devolver datos de ejemplo
  return mockNotifications
}

export const fetchUserEvents = async (userId: string, type: "organizing" | "attending"): Promise<UserEvent[]> => {
  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 800))

  try {
    console.log(`🔍 Fetching ${type} events for user:`, userId) // Debug log

    if (!userId) {
      console.log("⚠️ No userId provided") // Debug log
      return []
    }

    // Obtener todos los eventos primero
    const allEvents = await fetchEvents()
    console.log("📋 All events fetched:", allEvents.length) // Debug log

    if (type === "organizing") {
      // Filtrar eventos creados por el usuario
      const organizingEvents = allEvents
        .filter((event) => {
          const isOrganizer = event.organizerId === userId
          console.log(`🎪 Event ${event.id} (${event.title}):`) // Debug log
          console.log(`   - organizerId: ${event.organizerId}`) // Debug log
          console.log(`   - userId: ${userId}`) // Debug log
          console.log(`   - isOrganizer: ${isOrganizer}`) // Debug log
          return isOrganizer
        })
        .map((event) => ({
          id: event.id,
          title: event.title,
          date: event.date,
          location: event.location,
          image: event.image,
          isOrganizer: true,
        }))

      console.log(`✅ Organizing events found: ${organizingEvents.length}`) // Debug log
      console.log("📝 Events data:", organizingEvents) // Debug log
      return organizingEvents
    } else {
      // Para eventos a los que asiste, verificar RSVP
      const attendingEvents: UserEvent[] = []

      for (const event of allEvents) {
        const rsvpStatus = await getRSVPStatus(event.id, userId)
        console.log(`🎟️ RSVP for event ${event.id}: ${rsvpStatus}`) // Debug log

        if (rsvpStatus === "attending" && event.organizerId !== userId) {
          attendingEvents.push({
            id: event.id,
            title: event.title,
            date: event.date,
            location: event.location,
            image: event.image,
            isOrganizer: false,
          })
        }
      }

      console.log(`👥 Attending events found: ${attendingEvents.length}`) // Debug log
      return attendingEvents
    }
  } catch (error) {
    console.error("💥 Error fetching user events:", error)
    return []
  }
}

export const fetchEventAttendees = async (eventId: string): Promise<EventAttendee[]> => {
  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 500))

  try {
    // Intentar obtener asistentes del almacenamiento local
    const storedAttendees = await AsyncStorage.getItem(`@attendees_${eventId}`)
    if (storedAttendees) {
      return JSON.parse(storedAttendees)
    }

    // Si no hay asistentes almacenados, devolver datos de ejemplo
    return mockAttendees[eventId] || []
  } catch (error) {
    console.error("❌ Error fetching attendees:", error)
    return []
  }
}

// Nuevas funciones para historial y estadísticas
export const fetchEventHistory = async (
  userId: string,
  type: "organized" | "attended",
): Promise<EventHistoryItem[]> => {
  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    console.log(`📚 Fetching ${type} event history for user:`, userId)

    // Intentar obtener historial del almacenamiento local
    const storedHistory = await AsyncStorage.getItem(`@event_history_${userId}_${type}`)
    if (storedHistory) {
      const history = JSON.parse(storedHistory)
      console.log(`✅ Found ${history.length} ${type} events in history`)
      return history
    }

    // Si no hay historial almacenado, devolver datos de ejemplo
    const mockHistory = mockEventHistory[type] || []
    console.log(`📱 Using mock history: ${mockHistory.length} events`)

    // Guardar datos mock en storage para futuras consultas
    await AsyncStorage.setItem(`@event_history_${userId}_${type}`, JSON.stringify(mockHistory))

    return mockHistory
  } catch (error) {
    console.error("❌ Error fetching event history:", error)
    return []
  }
}

export const fetchUserStatistics = async (userId: string): Promise<UserStatistics> => {
  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 1200))

  try {
    console.log("📊 Fetching user statistics for:", userId)

    // Intentar obtener estadísticas del almacenamiento local
    const storedStats = await AsyncStorage.getItem(`@user_statistics_${userId}`)
    if (storedStats) {
      const stats = JSON.parse(storedStats)
      console.log("✅ Found user statistics in storage")
      return stats
    }

    // Calcular estadísticas reales basadas en datos del usuario
    const realStats = await calculateUserStatistics(userId)

    // Guardar estadísticas calculadas
    await AsyncStorage.setItem(`@user_statistics_${userId}`, JSON.stringify(realStats))

    console.log("📈 Calculated and saved user statistics")
    return realStats
  } catch (error) {
    console.error("❌ Error fetching user statistics:", error)
    // En caso de error, devolver estadísticas mock
    return mockUserStatistics
  }
}

const calculateUserStatistics = async (userId: string): Promise<UserStatistics> => {
  try {
    // Obtener eventos organizados y asistidos
    const organizedEvents = await fetchUserEvents(userId, "organizing")
    const attendedEvents = await fetchUserEvents(userId, "attending")

    // Obtener historial de eventos
    const organizedHistory = await fetchEventHistory(userId, "organized")
    const attendedHistory = await fetchEventHistory(userId, "attended")

    // Calcular estadísticas básicas
    const totalEventsOrganized = organizedEvents.length + organizedHistory.length
    const totalEventsAttended = attendedEvents.length + attendedHistory.length

    // Calcular comentarios y calificaciones (simulado)
    let totalComments = 0
    let totalRatingGiven = 0
    let ratingCount = 0

    // Simular cálculo de comentarios del usuario
    for (const event of [...organizedEvents, ...attendedEvents]) {
      const rating = await fetchEventRating(event.id)
      const userComments = rating.comments.filter((comment) => comment.userId === userId)
      totalComments += userComments.length

      userComments.forEach((comment) => {
        totalRatingGiven += comment.rating
        ratingCount++
      })
    }

    const averageRatingGiven = ratingCount > 0 ? totalRatingGiven / ratingCount : 0

    // Calcular estadísticas como organizador
    let totalAttendeesReceived = 0
    let totalRatingReceived = 0
    let totalCommentsReceived = 0
    let successfulEvents = 0
    let organizerRatingCount = 0

    for (const event of organizedHistory) {
      totalAttendeesReceived += event.totalAttendees
      totalCommentsReceived += event.totalComments

      if (event.averageRating) {
        totalRatingReceived += event.averageRating
        organizerRatingCount++

        if (event.averageRating > 4.0) {
          successfulEvents++
        }
      }
    }

    const averageRatingReceived = organizerRatingCount > 0 ? totalRatingReceived / organizerRatingCount : 0

    // Generar actividad mensual (últimos 6 meses)
    const monthlyActivity = [
      { month: "Ene", events: Math.floor(Math.random() * 5) + 1 },
      { month: "Feb", events: Math.floor(Math.random() * 5) + 1 },
      { month: "Mar", events: Math.floor(Math.random() * 5) + 1 },
      { month: "Abr", events: Math.floor(Math.random() * 5) + 1 },
      { month: "May", events: Math.floor(Math.random() * 5) + 1 },
      { month: "Jun", events: Math.floor(Math.random() * 5) + 1 },
    ]

    // Categorías favoritas (simulado)
    const favoriteCategories = [
      { name: "Tecnología", count: Math.floor(totalEventsOrganized * 0.4), percentage: 40 },
      { name: "Networking", count: Math.floor(totalEventsOrganized * 0.3), percentage: 30 },
      { name: "Educación", count: Math.floor(totalEventsOrganized * 0.2), percentage: 20 },
      { name: "Entretenimiento", count: Math.floor(totalEventsOrganized * 0.1), percentage: 10 },
    ]

    // Calcular logros desbloqueados
    const achievements = mockUserStatistics.achievements.map((achievement) => {
      let unlocked = false
      let unlockedDate = undefined

      switch (achievement.id) {
        case "first_event":
          unlocked = totalEventsOrganized > 0
          unlockedDate = unlocked ? "15 Ene 2024" : undefined
          break
        case "social_butterfly":
          unlocked = totalEventsAttended >= 10
          unlockedDate = unlocked ? "22 Mar 2024" : undefined
          break
        case "event_master":
          unlocked = successfulEvents >= 5
          unlockedDate = unlocked ? "10 May 2024" : undefined
          break
        case "super_organizer":
          unlocked = totalEventsOrganized >= 10
          unlockedDate = unlocked ? "15 Jun 2024" : undefined
          break
        case "community_leader":
          unlocked = totalAttendeesReceived >= 100
          unlockedDate = unlocked ? "28 May 2024" : undefined
          break
        case "reviewer":
          unlocked = totalComments >= 25
          unlockedDate = unlocked ? "05 Jun 2024" : undefined
          break
      }

      return {
        ...achievement,
        unlocked,
        unlockedDate,
      }
    })

    return {
      totalEventsOrganized,
      totalEventsAttended,
      totalComments,
      averageRatingGiven,
      totalAttendeesReceived,
      averageRatingReceived,
      totalCommentsReceived,
      successfulEvents,
      monthlyActivity,
      favoriteCategories,
      achievements,
    }
  } catch (error) {
    console.error("❌ Error calculating user statistics:", error)
    // En caso de error, devolver estadísticas mock con algunos datos reales
    return {
      ...mockUserStatistics,
      totalEventsOrganized: 0,
      totalEventsAttended: 0,
      totalComments: 0,
      averageRatingGiven: 0,
    }
  }
}

// Función para actualizar historial cuando un evento termina
export const addEventToHistory = async (
  eventId: string,
  userId: string,
  type: "organized" | "attended",
  eventData: Partial<EventHistoryItem>,
): Promise<void> => {
  try {
    console.log(`📚 Adding event ${eventId} to ${type} history for user ${userId}`)

    // Obtener historial actual
    const currentHistory = await fetchEventHistory(userId, type)

    // Crear nuevo item de historial
    const historyItem: EventHistoryItem = {
      id: eventId,
      title: eventData.title || "Evento",
      date: eventData.date || new Date().toLocaleDateString(),
      location: eventData.location || "Ubicación",
      image: eventData.image || "/assets/evento1.jpg",
      status: eventData.status || "completed",
      totalAttendees: eventData.totalAttendees || 0,
      averageRating: eventData.averageRating,
      totalComments: eventData.totalComments || 0,
      attendedDate: type === "attended" ? eventData.attendedDate : undefined,
      userRating: type === "attended" ? eventData.userRating : undefined,
    }

    // Agregar al historial (al inicio)
    const updatedHistory = [historyItem, ...currentHistory]

    // Guardar historial actualizado
    await AsyncStorage.setItem(`@event_history_${userId}_${type}`, JSON.stringify(updatedHistory))

    // Actualizar estadísticas del usuario
    await updateUserStatisticsCache(userId)

    console.log("✅ Event added to history successfully")
  } catch (error) {
    console.error("❌ Error adding event to history:", error)
  }
}

// Función para actualizar caché de estadísticas
const updateUserStatisticsCache = async (userId: string): Promise<void> => {
  try {
    // Recalcular estadísticas
    const updatedStats = await calculateUserStatistics(userId)

    // Guardar en caché
    await AsyncStorage.setItem(`@user_statistics_${userId}`, JSON.stringify(updatedStats))

    console.log("📊 User statistics cache updated")
  } catch (error) {
    console.error("❌ Error updating statistics cache:", error)
  }
}

// Funciones existentes para comentarios y calificaciones
export const fetchEventRating = async (eventId: string): Promise<EventRating> => {
  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 500))

  try {
    // Intentar obtener calificaciones del almacenamiento local
    const storedRating = await AsyncStorage.getItem(`@rating_${eventId}`)
    if (storedRating) {
      return JSON.parse(storedRating)
    }

    // Si no hay calificaciones almacenadas, devolver datos de ejemplo o estructura vacía
    return (
      mockEventRatings[eventId] || {
        eventId,
        averageRating: 0,
        totalRatings: 0,
        comments: [],
      }
    )
  } catch (error) {
    console.error("❌ Error fetching event rating:", error)
    return {
      eventId,
      averageRating: 0,
      totalRatings: 0,
      comments: [],
    }
  }
}

export const addEventComment = async (
  eventId: string,
  commentData: {
    userId: string
    userName: string
    userPhoto?: string
    rating: number
    comment: string
  },
): Promise<void> => {
  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    // Obtener calificaciones existentes
    const currentRating = await fetchEventRating(eventId)

    // Crear nuevo comentario
    const newComment: Comment = {
      id: Date.now().toString(),
      userId: commentData.userId,
      userName: commentData.userName,
      userPhoto: commentData.userPhoto || undefined,
      rating: commentData.rating,
      comment: commentData.comment,
      date: "Ahora",
      likes: 0,
      isLiked: false,
    }

    // Calcular nueva calificación promedio
    const totalRatings = currentRating.totalRatings + 1
    const newAverageRating =
      (currentRating.averageRating * currentRating.totalRatings + commentData.rating) / totalRatings

    // Actualizar estructura de calificaciones
    const updatedRating: EventRating = {
      eventId,
      averageRating: newAverageRating,
      totalRatings,
      comments: [newComment, ...currentRating.comments],
    }

    // Guardar en almacenamiento local
    await AsyncStorage.setItem(`@rating_${eventId}`, JSON.stringify(updatedRating))

    // Crear notificación de comentario agregado
    await createCommentNotification(eventId, commentData.userName)

    // Actualizar estadísticas del usuario
    await updateUserStatisticsCache(commentData.userId)

    console.log("✅ Comment added successfully") // Debug log
  } catch (error) {
    console.error("💥 Error adding comment:", error)
    throw new Error("No se pudo agregar el comentario")
  }
}

export const likeComment = async (eventId: string, commentId: string, userId: string): Promise<void> => {
  try {
    // Obtener calificaciones actuales
    const currentRating = await fetchEventRating(eventId)

    // Actualizar el comentario específico
    const updatedComments = currentRating.comments.map((comment) => {
      if (comment.id === commentId) {
        const isCurrentlyLiked = comment.isLiked
        return {
          ...comment,
          likes: isCurrentlyLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !isCurrentlyLiked,
        }
      }
      return comment
    })

    // Actualizar estructura de calificaciones
    const updatedRating: EventRating = {
      ...currentRating,
      comments: updatedComments,
    }

    // Guardar en almacenamiento local
    await AsyncStorage.setItem(`@rating_${eventId}`, JSON.stringify(updatedRating))

    console.log("✅ Comment like updated successfully") // Debug log
  } catch (error) {
    console.error("💥 Error updating comment like:", error)
    throw new Error("No se pudo actualizar el like del comentario")
  }
}

export const reportComment = async (eventId: string, commentId: string): Promise<void> => {
  try {
    // En una aplicación real, esto enviaría el reporte a un sistema de moderación
    console.log(`📝 Comment ${commentId} reported for event ${eventId}`)

    // Crear notificación de reporte
    const notification: Notification = {
      id: Date.now().toString(),
      title: "Comentario reportado",
      message: "Hemos recibido tu reporte. Lo revisaremos pronto.",
      date: "Ahora",
      read: false,
      type: "system",
    }

    // Obtener notificaciones existentes
    const storedNotifications = await AsyncStorage.getItem("@notifications")
    let notifications = storedNotifications ? JSON.parse(storedNotifications) : [...mockNotifications]

    // Añadir nueva notificación al inicio
    notifications = [notification, ...notifications]

    // Guardar notificaciones actualizadas
    await AsyncStorage.setItem("@notifications", JSON.stringify(notifications))

    console.log("✅ Comment reported successfully") // Debug log
  } catch (error) {
    console.error("💥 Error reporting comment:", error)
    throw new Error("No se pudo reportar el comentario")
  }
}

const createCommentNotification = async (eventId: string, userName: string): Promise<void> => {
  try {
    const event = await fetchEventById(eventId)

    const notification: Notification = {
      id: Date.now().toString(),
      title: "Comentario agregado",
      message: `${userName} ha comentado en ${event.title}`,
      date: "Ahora",
      read: false,
      type: "event",
      eventId,
    }

    // Obtener notificaciones existentes
    const storedNotifications = await AsyncStorage.getItem("@notifications")
    let notifications = storedNotifications ? JSON.parse(storedNotifications) : [...mockNotifications]

    // Añadir nueva notificación al inicio
    notifications = [notification, ...notifications]

    // Guardar notificaciones actualizadas
    await AsyncStorage.setItem("@notifications", JSON.stringify(notifications))
  } catch (error) {
    console.error("❌ Error creating comment notification:", error)
  }
}

// Modificar la función createEvent para actualizar los contadores del usuario
export const createEvent = async (eventData: any, userId: string, userName: string): Promise<void> => {
  console.log("🚀 Starting createEvent function") // Debug log
  console.log("📝 Event data received:", eventData) // Debug log
  console.log("👤 User ID:", userId) // Debug log
  console.log("🏷️ User name:", userName) // Debug log

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 1500))

  try {
    // Validar que tenemos los datos necesarios
    if (!userId) {
      throw new Error("userId is required")
    }

    if (!eventData.title || !eventData.description || !eventData.location) {
      throw new Error("Missing required event data")
    }

    // Obtener eventos existentes
    const storedEvents = await AsyncStorage.getItem("@events")
    let events = storedEvents ? JSON.parse(storedEvents) : []

    console.log("📦 Existing events in storage:", events.length) // Debug log

    // Si no hay eventos en storage, empezar con array vacío
    if (!Array.isArray(events)) {
      events = []
    }

    // Crear nuevo evento con la imagen seleccionada
    const newEventId = Date.now().toString()
    const eventDate = new Date(eventData.date)

    const newEvent: Event = {
      id: newEventId,
      title: eventData.title,
      date: eventDate.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }),
      location: eventData.location,
      image: eventData.image || "/assets/evento1.jpg", // Usar imagen seleccionada o por defecto
      category: "upcoming",
      organizer: userName || "Usuario",
      organizerId: userId, // IMPORTANTE: Asegurar que se guarde el organizerId
    }

    console.log("🎪 New event created:", newEvent) // Debug log

    // Añadir a la lista al inicio
    events.unshift(newEvent)

    // Guardar en almacenamiento local
    await AsyncStorage.setItem("@events", JSON.stringify(events))
    console.log("💾 Events saved to storage. Total events:", events.length) // Debug log

    // También guardar detalles del evento
    const eventDetail: EventDetail = {
      id: newEventId,
      title: eventData.title,
      description: eventData.description,
      date: eventDate.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }),
      time: eventDate.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
      location: eventData.location,
      organizer: userName || "Usuario",
      organizerId: userId, // IMPORTANTE: Asegurar que se guarde el organizerId
      image: eventData.image || "/assets/evento1.jpg", // Usar imagen seleccionada o por defecto
      attendees: 1, // El organizador cuenta como asistente
      isAttending: false, // El organizador no necesita confirmar asistencia
    }

    await AsyncStorage.setItem(`@event_${newEventId}`, JSON.stringify(eventDetail))
    console.log("📋 Event detail saved with ID:", newEventId) // Debug log

    // Crear lista de asistentes inicial (solo el organizador)
    const initialAttendees: EventAttendee[] = [
      {
        id: userId,
        name: userName || "Usuario",
        email: "organizador@email.com", // En una app real, esto vendría del perfil del usuario
        status: "organizer",
        joinedDate: "Organizador",
      },
    ]

    await AsyncStorage.setItem(`@attendees_${newEventId}`, JSON.stringify(initialAttendees))

    // Crear estructura inicial de calificaciones para el evento
    const initialRating: EventRating = {
      eventId: newEventId,
      averageRating: 0,
      totalRatings: 0,
      comments: [],
    }

    await AsyncStorage.setItem(`@rating_${newEventId}`, JSON.stringify(initialRating))

    // Actualizar contadores de eventos del usuario
    await updateUserEventCounters(userId)

    // Verificar que se guardó correctamente
    const verifyEvents = await AsyncStorage.getItem("@events")
    const verifyParsed = verifyEvents ? JSON.parse(verifyEvents) : []
    console.log("✅ Verification - Events in storage after save:", verifyParsed.length) // Debug log

    // Buscar el evento recién creado
    const foundEvent = verifyParsed.find((e: Event) => e.id === newEventId)
    console.log("🔍 Found created event:", foundEvent ? "YES" : "NO") // Debug log
    if (foundEvent) {
      console.log("🎯 Event details:", foundEvent) // Debug log
    }

    // Crear notificación de evento creado
    await createEventCreatedNotification(newEventId, eventData.title)

    console.log("🎉 Event creation completed successfully") // Debug log
  } catch (error) {
    console.error("💥 Error creating event:", error)
    throw new Error("No se pudo crear el evento: " + (error instanceof Error ? error.message : "Error desconocido"))
  }
}

export const updateEvent = async (eventId: string, eventData: any): Promise<void> => {
  console.log("🔄 Updating event:", eventId) // Debug log
  console.log("📝 New data:", eventData) // Debug log

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    // Actualizar en la lista de eventos
    const storedEvents = await AsyncStorage.getItem("@events")
    if (storedEvents) {
      const events = JSON.parse(storedEvents)
      const eventIndex = events.findIndex((e: Event) => e.id === eventId)

      if (eventIndex !== -1) {
        const eventDate = new Date(eventData.date)
        events[eventIndex] = {
          ...events[eventIndex],
          title: eventData.title,
          location: eventData.location,
          image: eventData.image,
          date: eventDate.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }),
        }

        await AsyncStorage.setItem("@events", JSON.stringify(events))
      }
    }

    // Actualizar detalles del evento
    const storedEventDetail = await AsyncStorage.getItem(`@event_${eventId}`)
    if (storedEventDetail) {
      const eventDetail = JSON.parse(storedEventDetail)
      const eventDate = new Date(eventData.date)

      const updatedEventDetail = {
        ...eventDetail,
        title: eventData.title,
        description: eventData.description,
        location: eventData.location,
        image: eventData.image,
        date: eventDate.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }),
        time: eventDate.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
      }

      await AsyncStorage.setItem(`@event_${eventId}`, JSON.stringify(updatedEventDetail))
    }

    console.log("✅ Event updated successfully") // Debug log
  } catch (error) {
    console.error("💥 Error updating event:", error)
    throw new Error("No se pudo actualizar el evento")
  }
}

// Modificar la función deleteEvent para asegurar que se elimine de todas las listas y actualice los contadores
export const deleteEvent = async (eventId: string, userId?: string): Promise<void> => {
  console.log("🗑️ Deleting event:", eventId) // Debug log

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    // Eliminar de la lista de eventos
    const storedEvents = await AsyncStorage.getItem("@events")
    if (storedEvents) {
      let events = JSON.parse(storedEvents)
      events = events.filter((e: Event) => e.id !== eventId)
      await AsyncStorage.setItem("@events", JSON.stringify(events))
    }

    // Eliminar detalles del evento
    await AsyncStorage.removeItem(`@event_${eventId}`)

    // Eliminar asistentes del evento
    await AsyncStorage.removeItem(`@attendees_${eventId}`)

    // Eliminar calificaciones y comentarios del evento
    await AsyncStorage.removeItem(`@rating_${eventId}`)

    // Eliminar RSVPs relacionados
    const keys = await AsyncStorage.getAllKeys()
    const rsvpKeys = keys.filter((key) => key.startsWith(`@rsvp_${eventId}_`))
    if (rsvpKeys.length > 0) {
      await AsyncStorage.multiRemove(rsvpKeys)
    }

    // Actualizar contadores de eventos del usuario
    if (userId) {
      await updateUserEventCounters(userId)
    }

    // Crear notificación de evento eliminado
    if (userId) {
      await createEventDeletedNotification(eventId)
    }

    console.log("✅ Event deleted successfully") // Debug log
  } catch (error) {
    console.error("💥 Error deleting event:", error)
    throw new Error("No se pudo eliminar el evento")
  }
}

// Añadir función para actualizar contadores de eventos del usuario
export const updateUserEventCounters = async (userId: string): Promise<void> => {
  try {
    // Obtener eventos organizados por el usuario
    const organizingEvents = await fetchUserEvents(userId, "organizing")

    // Obtener eventos a los que asiste el usuario
    const attendingEvents = await fetchUserEvents(userId, "attending")

    // Obtener perfil del usuario
    const userProfileStr = await AsyncStorage.getItem(`@user_profile_${userId}`)
    const userProfile = userProfileStr
      ? JSON.parse(userProfileStr)
      : {
          uid: userId,
          eventsCreated: 0,
          eventsAttended: 0,
          lastUpdated: new Date().toISOString(),
        }

    // Actualizar contadores
    userProfile.eventsCreated = organizingEvents.length
    userProfile.eventsAttended = attendingEvents.length
    userProfile.lastUpdated = new Date().toISOString()

    // Guardar perfil actualizado
    await AsyncStorage.setItem(`@user_profile_${userId}`, JSON.stringify(userProfile))

    // También actualizar caché de estadísticas
    await updateUserStatisticsCache(userId)

    console.log("✅ User event counters updated:", userProfile) // Debug log
  } catch (error) {
    console.error("💥 Error updating user event counters:", error)
  }
}

// Añadir función para crear notificación de evento eliminado
export const createEventDeletedNotification = async (eventId: string): Promise<void> => {
  try {
    const notification: Notification = {
      id: Date.now().toString(),
      title: "Evento eliminado",
      message: "Tu evento ha sido eliminado correctamente",
      date: "Ahora",
      read: false,
      type: "event",
    }

    // Obtener notificaciones existentes
    const storedNotifications = await AsyncStorage.getItem("@notifications")
    let notifications = storedNotifications ? JSON.parse(storedNotifications) : []

    // Añadir nueva notificación al inicio
    notifications = [notification, ...notifications]

    // Guardar notificaciones actualizadas
    await AsyncStorage.setItem("@notifications", JSON.stringify(notifications))
  } catch (error) {
    console.error("❌ Error creating event deleted notification:", error)
  }
}

// Nuevas funciones para RSVP
export const updateRSVP = async (eventId: string, status: RSVPStatus, userId: string): Promise<void> => {
  try {
    // Simular retraso de red
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Guardar estado RSVP
    const rsvpData: RSVPResponse = {
      eventId,
      userId,
      status,
      timestamp: new Date().toISOString(),
    }

    await AsyncStorage.setItem(`@rsvp_${eventId}_${userId}`, JSON.stringify(rsvpData))

    // Actualizar contador de asistentes en el evento
    const eventDetail = await fetchEventById(eventId)
    if (eventDetail) {
      const currentRsvp = await getRSVPStatus(eventId, userId)
      let attendeesChange = 0

      if (status === "attending" && currentRsvp !== "attending") {
        attendeesChange = 1
      } else if (status !== "attending" && currentRsvp === "attending") {
        attendeesChange = -1
      }

      const updatedEvent = {
        ...eventDetail,
        attendees: Math.max(1, eventDetail.attendees + attendeesChange), // Mínimo 1 (el organizador)
        isAttending: status === "attending",
      }
      await AsyncStorage.setItem(`@event_${eventId}`, JSON.stringify(updatedEvent))
    }

    // Crear notificación de confirmación
    await createRSVPNotification(eventId, status)

    // Actualizar estadísticas del usuario
    await updateUserStatisticsCache(userId)
  } catch (error) {
    console.error("❌ Error updating RSVP:", error)
    throw new Error("No se pudo actualizar la confirmación de asistencia")
  }
}

export const getRSVPStatus = async (eventId: string, userId?: string): Promise<RSVPStatus> => {
  try {
    const currentUserId = userId || "current_user" // En una app real, esto vendría del contexto de auth
    const rsvpData = await AsyncStorage.getItem(`@rsvp_${eventId}_${currentUserId}`)
    if (rsvpData) {
      const parsed: RSVPResponse = JSON.parse(rsvpData)
      return parsed.status
    }
    return "pending"
  } catch (error) {
    console.error("❌ Error getting RSVP status:", error)
    return "pending"
  }
}

export const createRSVPNotification = async (eventId: string, status: RSVPStatus): Promise<void> => {
  try {
    const event = await fetchEventById(eventId)
    let message = ""

    switch (status) {
      case "attending":
        message = `Has confirmado tu asistencia a ${event.title}`
        break
      case "not_attending":
        message = `Has cancelado tu asistencia a ${event.title}`
        break
      case "maybe":
        message = `Has marcado como "tal vez" tu asistencia a ${event.title}`
        break
    }

    const notification: Notification = {
      id: Date.now().toString(),
      title: "Confirmación de asistencia",
      message,
      date: "Ahora",
      read: false,
      type: "rsvp",
      eventId,
    }

    // Obtener notificaciones existentes
    const storedNotifications = await AsyncStorage.getItem("@notifications")
    let notifications = storedNotifications ? JSON.parse(storedNotifications) : [...mockNotifications]

    // Añadir nueva notificación al inicio
    notifications = [notification, ...notifications]

    // Guardar notificaciones actualizadas
    await AsyncStorage.setItem("@notifications", JSON.stringify(notifications))
  } catch (error) {
    console.error("❌ Error creating RSVP notification:", error)
  }
}

export const createEventCreatedNotification = async (eventId: string, eventTitle: string): Promise<void> => {
  try {
    const notification: Notification = {
      id: Date.now().toString(),
      title: "Evento creado exitosamente",
      message: `Tu evento "${eventTitle}" ha sido creado y publicado`,
      date: "Ahora",
      read: false,
      type: "event",
      eventId,
    }

    // Obtener notificaciones existentes
    const storedNotifications = await AsyncStorage.getItem("@notifications")
    let notifications = storedNotifications ? JSON.parse(storedNotifications) : [...mockNotifications]

    // Añadir nueva notificación al inicio
    notifications = [notification, ...notifications]

    // Guardar notificaciones actualizadas
    await AsyncStorage.setItem("@notifications", JSON.stringify(notifications))
  } catch (error) {
    console.error("❌ Error creating event created notification:", error)
  }
}

export const createEventReminder = async (eventId: string): Promise<void> => {
  try {
    const event = await fetchEventById(eventId)

    const notification: Notification = {
      id: Date.now().toString(),
      title: "Recordatorio de evento",
      message: `${event.title} comienza pronto. ¡No olvides asistir!`,
      date: "Ahora",
      read: false,
      type: "reminder",
      eventId,
    }

    // Obtener notificaciones existentes
    const storedNotifications = await AsyncStorage.getItem("@notifications")
    let notifications = storedNotifications ? JSON.parse(storedNotifications) : [...mockNotifications]

    // Añadir nueva notificación al inicio
    notifications = [notification, ...notifications]

    // Guardar notificaciones actualizadas
    await AsyncStorage.setItem("@notifications", JSON.stringify(notifications))
  } catch (error) {
    console.error("❌ Error creating event reminder:", error)
  }
}

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    const storedNotifications = await AsyncStorage.getItem("@notifications")
    if (storedNotifications) {
      let notifications: Notification[] = JSON.parse(storedNotifications)

      notifications = notifications.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification,
      )

      await AsyncStorage.setItem("@notifications", JSON.stringify(notifications))
    }
  } catch (error) {
    console.error("❌ Error marking notification as read:", error)
  }
}

// Función para limpiar datos (útil para desarrollo)
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(["@events", "@notifications"])

    // También limpiar eventos y RSVPs individuales
    const keys = await AsyncStorage.getAllKeys()
    const eventKeys = keys.filter(
      (key) =>
        key.startsWith("@event_") ||
        key.startsWith("@rsvp_") ||
        key.startsWith("@attendees_") ||
        key.startsWith("@rating_") ||
        key.startsWith("@event_history_") ||
        key.startsWith("@user_statistics_"),
    )
    if (eventKeys.length > 0) {
      await AsyncStorage.multiRemove(eventKeys)
    }

    console.log("🧹 All data cleared from storage") // Debug log
  } catch (error) {
    console.error("❌ Error clearing data:", error)
  }
}

// Función de debug para verificar storage
export const debugStorage = async (): Promise<void> => {
  try {
    const events = await AsyncStorage.getItem("@events")
    const eventsData = events ? JSON.parse(events) : []

    console.log("🔍 DEBUG STORAGE:")
    console.log("📦 Events in storage:", eventsData.length)
    console.log("📋 Events data:", eventsData)

    // Verificar eventos individuales
    for (const event of eventsData) {
      const eventDetail = await AsyncStorage.getItem(`@event_${event.id}`)
      console.log(`📄 Event ${event.id} detail exists:`, !!eventDetail)
    }
  } catch (error) {
    console.error("❌ Error debugging storage:", error)
  }
}
