"use client"

import { useState } from "react"
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { ImageService } from "../services/imageService"

type ImageSelectorProps = {
  selectedImage?: string
  onImageSelect: (imageUri: string) => void
  style?: any
}

const ImageSelector = ({ selectedImage, onImageSelect, style }: ImageSelectorProps) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const defaultImages = ImageService.getDefaultEventImages()

  const handleCustomImage = async () => {
    try {
      setLoading(true)
      const result = await ImageService.showImagePicker()

      if (result.success && result.uri) {
        onImageSelect(result.uri)
        setModalVisible(false)
      } else if (result.error && result.error !== "Cancelado por el usuario") {
        Alert.alert("Error", result.error)
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo seleccionar la imagen")
    } finally {
      setLoading(false)
    }
  }

  const handleDefaultImage = (imageUri: string) => {
    onImageSelect(imageUri)
    setModalVisible(false)
  }

  const getImageSource = (uri: string) => {
    if (uri.startsWith("/assets/")) {
      // Mapear imágenes de assets
      switch (uri) {
        case "/assets/evento1.jpg":
          return require("../../assets/evento1.jpg")
        case "/assets/evento2.png":
          return require("../../assets/evento2.png")
        case "/assets/evento3.jpg":
          return require("../../assets/evento3.jpg")
        case "/assets/evento4.jpg":
          return require("../../assets/evento4.jpg")
        case "/assets/pet-festival.png":
          return require("../../assets/evento5.jpg")
        default:
          return { uri }
      }
    }
    return { uri }
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Imagen del evento</Text>

      <TouchableOpacity style={styles.imageContainer} onPress={() => setModalVisible(true)}>
        {selectedImage ? (
          <Image source={getImageSource(selectedImage)} style={styles.selectedImage} />
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons name="image-outline" size={48} color="#ccc" />
            <Text style={styles.placeholderText}>Toca para seleccionar imagen</Text>
          </View>
        )}

        <View style={styles.editOverlay}>
          <Ionicons name="camera" size={20} color="#fff" />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar imagen</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Opción para imagen personalizada */}
              <TouchableOpacity style={styles.customImageOption} onPress={handleCustomImage} disabled={loading}>
                <View style={styles.customImageContainer}>
                  {loading ? (
                    <ActivityIndicator size="large" color="#146193" />
                  ) : (
                    <>
                      <Ionicons name="camera" size={32} color="#146193" />
                      <Text style={styles.customImageText}>Tomar foto o elegir de galería</Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>

              {/* Separador */}
              <View style={styles.separator}>
                <View style={styles.separatorLine} />
                <Text style={styles.separatorText}>O elige una imagen predefinida</Text>
                <View style={styles.separatorLine} />
              </View>

              {/* Imágenes predefinidas */}
              <View style={styles.defaultImagesGrid}>
                {defaultImages.map((image) => (
                  <TouchableOpacity
                    key={image.id}
                    style={[styles.defaultImageItem, selectedImage === image.uri && styles.selectedImageItem]}
                    onPress={() => handleDefaultImage(image.uri)}
                  >
                    <Image source={getImageSource(image.uri)} style={styles.defaultImage} />
                    <Text style={styles.defaultImageName}>{image.name}</Text>
                    {selectedImage === image.uri && (
                      <View style={styles.selectedBadge}>
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  imageContainer: {
    position: "relative",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 16,
    color: "#666",
  },
  editOverlay: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "#146193",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  customImageOption: {
    marginBottom: 20,
  },
  customImageContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#146193",
    borderStyle: "dashed",
  },
  customImageText: {
    marginTop: 12,
    fontSize: 16,
    color: "#146193",
    fontWeight: "500",
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  separatorText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#666",
  },
  defaultImagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  defaultImageItem: {
    width: "48%",
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    position: "relative",
  },
  selectedImageItem: {
    borderWidth: 2,
    borderColor: "#146193",
  },
  defaultImage: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  defaultImageName: {
    padding: 8,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  selectedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#146193",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default ImageSelector
