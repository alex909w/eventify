import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system"
import { Alert } from "react-native"

export type ImagePickerResult = {
  success: boolean
  uri?: string
  error?: string
}

export class ImageService {
  // Solicitar permisos para acceder a la galería y cámara
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync()
      const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      return cameraStatus === "granted" && mediaLibraryStatus === "granted"
    } catch (error) {
      console.error("Error requesting permissions:", error)
      return false
    }
  }

  // Mostrar opciones para seleccionar imagen
  static async showImagePicker(): Promise<ImagePickerResult> {
    try {
      const hasPermissions = await this.requestPermissions()

      if (!hasPermissions) {
        Alert.alert("Permisos requeridos", "Necesitamos acceso a tu cámara y galería para seleccionar imágenes.", [
          { text: "OK" },
        ])
        return { success: false, error: "Permisos denegados" }
      }

      return new Promise((resolve) => {
        Alert.alert("Seleccionar imagen", "Elige una opción para agregar una imagen a tu evento", [
          {
            text: "Cámara",
            onPress: async () => {
              const result = await this.openCamera()
              resolve(result)
            },
          },
          {
            text: "Galería",
            onPress: async () => {
              const result = await this.openGallery()
              resolve(result)
            },
          },
          {
            text: "Cancelar",
            style: "cancel",
            onPress: () => resolve({ success: false, error: "Cancelado por el usuario" }),
          },
        ])
      })
    } catch (error) {
      console.error("Error showing image picker:", error)
      return { success: false, error: "Error al mostrar selector de imagen" }
    }
  }

  // Abrir cámara
  static async openCamera(): Promise<ImagePickerResult> {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9], // Aspecto rectangular para eventos
        quality: 0.8,
      })

      if (result.canceled) {
        return { success: false, error: "Cancelado por el usuario" }
      }

      const imageUri = result.assets[0].uri
      const savedUri = await this.saveImageLocally(imageUri)

      return { success: true, uri: savedUri }
    } catch (error) {
      console.error("Error opening camera:", error)
      return { success: false, error: "Error al abrir la cámara" }
    }
  }

  // Abrir galería
  static async openGallery(): Promise<ImagePickerResult> {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9], // Aspecto rectangular para eventos
        quality: 0.8,
      })

      if (result.canceled) {
        return { success: false, error: "Cancelado por el usuario" }
      }

      const imageUri = result.assets[0].uri
      const savedUri = await this.saveImageLocally(imageUri)

      return { success: true, uri: savedUri }
    } catch (error) {
      console.error("Error opening gallery:", error)
      return { success: false, error: "Error al abrir la galería" }
    }
  }

  // Guardar imagen localmente
  static async saveImageLocally(uri: string): Promise<string> {
    try {
      const filename = `event_${Date.now()}.jpg`
      const directory = `${FileSystem.documentDirectory}event_images/`

      // Crear directorio si no existe
      const dirInfo = await FileSystem.getInfoAsync(directory)
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true })
      }

      const newPath = `${directory}${filename}`
      await FileSystem.copyAsync({
        from: uri,
        to: newPath,
      })

      return newPath
    } catch (error) {
      console.error("Error saving image locally:", error)
      throw new Error("No se pudo guardar la imagen")
    }
  }

  // Obtener imágenes predefinidas para eventos
  static getDefaultEventImages(): Array<{ id: string; name: string; uri: string }> {
    return [
      {
        id: "default_1",
        name: "Evento Elegante",
        uri: "/assets/evento1.jpg",
      },
      {
        id: "default_2",
        name: "Networking",
        uri: "/assets/evento2.png",
      },
      {
        id: "default_3",
        name: "Festival",
        uri: "/assets/evento3.jpg",
      },
      {
        id: "default_4",
        name: "Conferencia",
        uri: "/assets/evento4.jpg",
      },
      {
        id: "default_5",
        name: "Música",
        uri: "/assets/pet-festival.png",
      },
      {
        id: "default_6",
        name: "Deportes",
        uri: "/assets/dog-show-event.png",
      },
      {
        id: "default_7",
        name: "Educación",
        uri: "/assets/dog-training-session.png",
      },
      {
        id: "default_8",
        name: "Comunidad",
        uri: "/assets/community-event.png",
      },
    ]
  }

  // Limpiar imágenes antiguas (opcional, para gestión de espacio)
  static async cleanupOldImages(): Promise<void> {
    try {
      const directory = `${FileSystem.documentDirectory}event_images/`
      const dirInfo = await FileSystem.getInfoAsync(directory)

      if (dirInfo.exists) {
        const files = await FileSystem.readDirectoryAsync(directory)
        const now = Date.now()
        const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000 // 30 días

        for (const file of files) {
          const filePath = `${directory}${file}`
          const fileInfo = await FileSystem.getInfoAsync(filePath)

          if (fileInfo.exists && fileInfo.modificationTime && fileInfo.modificationTime < thirtyDaysAgo) {
            await FileSystem.deleteAsync(filePath)
          }
        }
      }
    } catch (error) {
      console.error("Error cleaning up old images:", error)
    }
  }
}
