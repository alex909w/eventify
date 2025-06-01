import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import { initializeApp, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import dotenv from "dotenv"

dotenv.config()

// Inicializar Firebase Admin con las credenciales reales
const firebaseAdmin = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
  projectId: "aplicacion-web-eventify",
})

const auth = getAuth(firebaseAdmin)
const db = getFirestore(firebaseAdmin)

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "exp://localhost:19000", // Para Expo
      "exp://127.0.0.1:19000",
    ],
    credentials: true,
  }),
)
app.use(bodyParser.json())

// Middleware para verificar token
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" })
  }

  const token = authHeader.split("Bearer ")[1]

  try {
    const decodedToken = await auth.verifyIdToken(token)
    req.user = decodedToken
    next()
  } catch (error) {
    console.error("Error verifying token:", error)
    return res.status(403).json({ error: "Invalid token" })
  }
}

// Ruta de prueba
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Eventify API is running",
    firebase: {
      projectId: process.env.FIREBASE_PROJECT_ID,
      timestamp: new Date().toISOString(),
    },
  })
})

// Rutas de eventos
app.get("/api/events", async (req, res) => {
  try {
    const eventsSnapshot = await db.collection("events").orderBy("createdAt", "desc").get()
    const events = []

    eventsSnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    res.json(events)
  } catch (error) {
    console.error("Error fetching events:", error)
    res.status(500).json({ error: "Failed to fetch events" })
  }
})

app.get("/api/events/:id", async (req, res) => {
  try {
    const eventDoc = await db.collection("events").doc(req.params.id).get()

    if (!eventDoc.exists) {
      return res.status(404).json({ error: "Event not found" })
    }

    res.json({
      id: eventDoc.id,
      ...eventDoc.data(),
    })
  } catch (error) {
    console.error("Error fetching event:", error)
    res.status(500).json({ error: "Failed to fetch event" })
  }
})

app.post("/api/events", verifyToken, async (req, res) => {
  try {
    const { title, description, date, location, category = "upcoming" } = req.body

    if (!title || !description || !date || !location) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const eventData = {
      title,
      description,
      date,
      location,
      category,
      organizer: req.user.uid,
      organizerName: req.user.name || req.user.email || "Usuario",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attendees: 1,
      attendeesList: [req.user.uid],
      status: "active",
    }

    const eventRef = await db.collection("events").add(eventData)

    res.status(201).json({
      id: eventRef.id,
      ...eventData,
    })
  } catch (error) {
    console.error("Error creating event:", error)
    res.status(500).json({ error: "Failed to create event" })
  }
})

app.post("/api/events/:id/attend", verifyToken, async (req, res) => {
  try {
    const eventRef = db.collection("events").doc(req.params.id)
    const eventDoc = await eventRef.get()

    if (!eventDoc.exists) {
      return res.status(404).json({ error: "Event not found" })
    }

    const eventData = eventDoc.data()
    const attendeesList = eventData.attendeesList || []

    // Verificar si el usuario ya está asistiendo
    if (attendeesList.includes(req.user.uid)) {
      // Eliminar asistencia
      await eventRef.update({
        attendees: Math.max(0, eventData.attendees - 1),
        attendeesList: attendeesList.filter((uid) => uid !== req.user.uid),
        updatedAt: new Date().toISOString(),
      })

      return res.json({ attending: false, attendees: Math.max(0, eventData.attendees - 1) })
    } else {
      // Agregar asistencia
      await eventRef.update({
        attendees: eventData.attendees + 1,
        attendeesList: [...attendeesList, req.user.uid],
        updatedAt: new Date().toISOString(),
      })

      return res.json({ attending: true, attendees: eventData.attendees + 1 })
    }
  } catch (error) {
    console.error("Error updating attendance:", error)
    res.status(500).json({ error: "Failed to update attendance" })
  }
})

// Rutas de notificaciones
app.get("/api/notifications", verifyToken, async (req, res) => {
  try {
    const notificationsSnapshot = await db
      .collection("notifications")
      .where("userId", "==", req.user.uid)
      .orderBy("createdAt", "desc")
      .limit(20)
      .get()

    const notifications = []

    notificationsSnapshot.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    res.json(notifications)
  } catch (error) {
    console.error("Error fetching notifications:", error)
    res.status(500).json({ error: "Failed to fetch notifications" })
  }
})

app.put("/api/notifications/:id/read", verifyToken, async (req, res) => {
  try {
    const notificationRef = db.collection("notifications").doc(req.params.id)
    const notificationDoc = await notificationRef.get()

    if (!notificationDoc.exists) {
      return res.status(404).json({ error: "Notification not found" })
    }

    const notificationData = notificationDoc.data()

    // Verificar que la notificación pertenezca al usuario
    if (notificationData.userId !== req.user.uid) {
      return res.status(403).json({ error: "Unauthorized" })
    }

    await notificationRef.update({
      read: true,
      updatedAt: new Date().toISOString(),
    })

    res.json({ success: true })
  } catch (error) {
    console.error("Error marking notification as read:", error)
    res.status(500).json({ error: "Failed to mark notification as read" })
  }
})

// Rutas de usuario
app.get("/api/user/profile", verifyToken, async (req, res) => {
  try {
    const userDoc = await db.collection("users").doc(req.user.uid).get()

    if (!userDoc.exists) {
      // Crear perfil básico si no existe
      const basicProfile = {
        uid: req.user.uid,
        email: req.user.email,
        displayName: req.user.name || req.user.email?.split("@")[0] || "Usuario",
        photoURL: req.user.picture || null,
        createdAt: new Date().toISOString(),
        eventsCreated: 0,
        eventsAttended: 0,
      }

      await db.collection("users").doc(req.user.uid).set(basicProfile)
      return res.json(basicProfile)
    }

    res.json({
      uid: req.user.uid,
      ...userDoc.data(),
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    res.status(500).json({ error: "Failed to fetch user profile" })
  }
})

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error("Global error handler:", error)
  res.status(500).json({ error: "Internal server error" })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Eventify Server running on port ${PORT}`)
  console.log(`📱 Firebase Project: ${process.env.FIREBASE_PROJECT_ID}`)
  console.log(`🔥 Environment: ${process.env.NODE_ENV || "development"}`)
})
