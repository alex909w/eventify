// Configuración global de la aplicación

// Determinar si estamos en modo desarrollo
export const __DEV__ = process.env.NODE_ENV !== "production"

// Configuración de API
export const API_CONFIG = {
  baseUrl: "https://api.eventify.com",
  timeout: 10000, // 10 segundos
}

// Configuración de imágenes
export const IMAGE_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  quality: 0.8,
  aspectRatio: 16 / 9,
}

// Configuración de caché
export const CACHE_CONFIG = {
  eventsTTL: 60 * 60 * 1000, // 1 hora
  imagesTTL: 24 * 60 * 60 * 1000, // 24 horas
}

// Configuración de notificaciones
export const NOTIFICATION_CONFIG = {
  reminderTime: 24 * 60 * 60 * 1000, // 24 horas antes del evento
}

// Versión de la aplicación
export const APP_VERSION = "1.0.0"

// Configuración de depuración
export const DEBUG_CONFIG = {
  logLevel: __DEV__ ? "debug" : "error",
  showDebugPanel: __DEV__,
}
