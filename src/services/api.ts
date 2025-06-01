import AsyncStorage from "@react-native-async-storage/async-storage"
import { initializeApp } from "firebase/app"
import { firebaseConfig } from "../config/firebase"

// Inicializar Firebase si no está inicializado
try {
  initializeApp(firebaseConfig)
} catch (error: any) {
  // Ignorar el error "Firebase App named '[DEFAULT]' already exists"
  if (!/already exists/.test(error.message)) {
    console.error("Error initializing Firebase:", error)
  }
}

// Tipos
export type Event = {
  id: string
  title: string
  date: string
  location: string
  image: string
  category: string
}

export type EventDetail = {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  organizer: string
  image: string
  attendees: number
}

export type Notification = {
  id: string
  title: string
  message: string
  date: string
  read: boolean
  type: "event" | "message" | "reminder" | "system"
}

export type UserEvent = {
  id: string
  title: string
  date: string
  location: string
  image: string
  isOrganizer: boolean
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
  },
  {
    id: "2",
    title: "Networking Profesional",
    date: "22 Jun 2025",
    location: "Centro de Convenciones",
    image: "/assets/evento2.png",
    category: "featured",
  },
  {
    id: "3",
    title: "Festival de mascotas",
    date: "25 Jun 2024",
    location: "Club Canino",
    image: "/assets/evento3.jpg",
    category: "upcoming",
  },
  {
    id: "4",
    title: "Conferencia tecnológica",
    date: "30 Jun 2024",
    location: "Plaza Principal",
    image: "/assets/evento4.jpg",
    category: "upcoming",
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
    image: "/assets/evento1.jpg",
    attendees: 150,
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
    image: "/assets/evento2.png",
    attendees: 200,
  },
  "3": {
    id: "3",
    title: "Festival de mascotas",
    description:
      "Un festival lleno de diversión para toda la familia y sus mascotas. Disfruta de concursos, exhibiciones, adopciones responsables, productos para mascotas y muchas actividades divertidas. Ven con tu compañero peludo y vive una experiencia inolvidable.",
    date: "25 de Junio, 2025",
    time: "10:00 AM - 6:00 PM",
    location: "Club Canino",
    organizer: "Asociación de Amantes de las Mascotas",
    image: "/assets/evento3.jpg",
    attendees: 300,
  },
  "4": {
    id: "4",
    title: "Conferencia tecnológica",
    description:
      "Conferencia sobre las últimas tendencias en tecnología. Escucha a expertos de la industria hablar sobre inteligencia artificial, blockchain, desarrollo web y las innovaciones que están transformando el mundo digital. Ideal para desarrolladores y entusiastas de la tecnología.",
    date: "30 de Junio, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "Plaza Principal",
    organizer: "Tech Community",
    image: "/assets/evento4.jpg",
    attendees: 250,
  },
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Nuevo evento cerca de ti",
    message: "Cena de gala empresarial se realizará a 5km de tu ubicación",
    date: "Hace 2 horas",
    read: false,
    type: "event",
  },
  {
    id: "2",
    title: "Recordatorio de evento",
    message: "Networking Profesional comienza mañana a las 6:00 PM",
    date: "Hace 5 horas",
    read: true,
    type: "reminder",
  },
  {
    id: "3",
    title: "Mensaje de organizador",
    message: "Gracias por registrarte en nuestro evento. ¡Te esperamos!",
    date: "Ayer",
    read: true,
    type: "message",
  },
]

// Funciones de API simuladas
export const fetchEvents = async (): Promise<Event[]> => {
  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    // Intentar obtener eventos del almacenamiento local
    const storedEvents = await AsyncStorage.getItem("@events")
    if (storedEvents) {
      return JSON.parse(storedEvents)
    }
  } catch (error) {
    console.error("Error fetching events from storage:", error)
  }

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
      return JSON.parse(storedEvent)
    }
  } catch (error) {
    console.error(`Error fetching event ${id} from storage:`, error)
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
      image: "/placeholder.svg?height=300&width=400&text=Evento+no+encontrado&bg=cccccc&color=666666",
      attendees: 0,
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
    console.error("Error fetching notifications from storage:", error)
  }

  // Si no hay notificaciones almacenadas, devolver datos de ejemplo
  return mockNotifications
}

export const fetchUserEvents = async (userId: string, type: "organizing" | "attending"): Promise<UserEvent[]> => {
  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Datos de ejemplo para eventos del usuario con las imágenes específicas
  const userEvents: UserEvent[] = [
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

  // Filtrar según el tipo solicitado
  return userEvents.filter((event) => (type === "organizing" ? event.isOrganizer : !event.isOrganizer))
}

export const createEvent = async (eventData: any): Promise<void> => {
  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 1500))

  try {
    // Obtener eventos existentes
    const storedEvents = await AsyncStorage.getItem("@events")
    let events = storedEvents ? JSON.parse(storedEvents) : mockEvents

    // Crear nuevo evento con imagen por defecto
    const newEvent = {
      id: Date.now().toString(),
      title: eventData.title,
      date: new Date(eventData.date).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }),
      location: eventData.location,
      image: "/assets/evento1.jpg", // Imagen por defecto para nuevos eventos
      category: "upcoming",
    }

    // Añadir a la lista
    events = [newEvent, ...events]

    // Guardar en almacenamiento local
    await AsyncStorage.setItem("@events", JSON.stringify(events))

    // También guardar detalles del evento
    const eventDetail: EventDetail = {
      id: newEvent.id,
      title: eventData.title,
      description: eventData.description,
      date: new Date(eventData.date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }),
      time: new Date(eventData.date).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
      location: eventData.location,
      organizer: "Tú",
      image: "/assets/evento1.jpg", // Imagen por defecto para nuevos eventos
      attendees: 1,
    }

    await AsyncStorage.setItem(`@event_${newEvent.id}`, JSON.stringify(eventDetail))
  } catch (error) {
    console.error("Error creating event:", error)
    throw new Error("No se pudo crear el evento")
  }
}
