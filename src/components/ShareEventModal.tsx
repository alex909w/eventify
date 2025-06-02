"use client"

import { useState } from "react"
import { StyleSheet, View, Text, TouchableOpacity, Modal, Share, Linking, Alert, Clipboard } from "react-native"
import { Ionicons } from "@expo/vector-icons"

type ShareEventModalProps = {
  visible: boolean
  onClose: () => void
  eventTitle: string
  eventDate: string
  eventLocation: string
  eventId: string
}

const ShareEventModal = ({ visible, onClose, eventTitle, eventDate, eventLocation, eventId }: ShareEventModalProps) => {
  const [sharing, setSharing] = useState(false)

  const eventUrl = `https://eventify.app/event/${eventId}` // URL ficticia
  const shareMessage = `¡Mira este evento increíble!\n\n${eventTitle}\n📅 ${eventDate}\n📍 ${eventLocation}\n\n${eventUrl}`

  const handleNativeShare = async () => {
    try {
      setSharing(true)
      await Share.share({
        message: shareMessage,
        title: eventTitle,
        url: eventUrl,
      })
    } catch (error) {
      console.error("Error sharing:", error)
    } finally {
      setSharing(false)
    }
  }

  const handleWhatsAppShare = async () => {
    try {
      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(shareMessage)}`
      const canOpen = await Linking.canOpenURL(whatsappUrl)

      if (canOpen) {
        await Linking.openURL(whatsappUrl)
      } else {
        Alert.alert("WhatsApp no disponible", "WhatsApp no está instalado en tu dispositivo")
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo abrir WhatsApp")
    }
  }

  const handleEmailShare = async () => {
    try {
      const subject = encodeURIComponent(`Te invito a: ${eventTitle}`)
      const body = encodeURIComponent(
        `Hola!\n\nTe quiero invitar a este evento:\n\n${eventTitle}\n\nFecha: ${eventDate}\nUbicación: ${eventLocation}\n\nMás información: ${eventUrl}\n\n¡Espero verte ahí!`,
      )
      const emailUrl = `mailto:?subject=${subject}&body=${body}`

      const canOpen = await Linking.canOpenURL(emailUrl)
      if (canOpen) {
        await Linking.openURL(emailUrl)
      } else {
        Alert.alert("Email no disponible", "No se pudo abrir la aplicación de correo")
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo abrir el correo electrónico")
    }
  }

  const handleFacebookShare = async () => {
    try {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`
      const canOpen = await Linking.canOpenURL(facebookUrl)

      if (canOpen) {
        await Linking.openURL(facebookUrl)
      } else {
        Alert.alert("Facebook no disponible", "No se pudo abrir Facebook")
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo abrir Facebook")
    }
  }

  const handleTwitterShare = async () => {
    try {
      const tweetText = encodeURIComponent(`¡Mira este evento! ${eventTitle} - ${eventDate} en ${eventLocation}`)
      const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(eventUrl)}`
      const canOpen = await Linking.canOpenURL(twitterUrl)

      if (canOpen) {
        await Linking.openURL(twitterUrl)
      } else {
        Alert.alert("Twitter no disponible", "No se pudo abrir Twitter")
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo abrir Twitter")
    }
  }

  const handleCopyLink = async () => {
    try {
      await Clipboard.setString(eventUrl)
      Alert.alert("¡Copiado!", "El enlace del evento ha sido copiado al portapapeles")
    } catch (error) {
      Alert.alert("Error", "No se pudo copiar el enlace")
    }
  }

  const shareOptions = [
    {
      id: "native",
      title: "Compartir",
      icon: "share-outline",
      color: "#146193",
      onPress: handleNativeShare,
    },
    {
      id: "whatsapp",
      title: "WhatsApp",
      icon: "logo-whatsapp",
      color: "#25D366",
      onPress: handleWhatsAppShare,
    },
    {
      id: "email",
      title: "Correo",
      icon: "mail-outline",
      color: "#EA4335",
      onPress: handleEmailShare,
    },
    {
      id: "facebook",
      title: "Facebook",
      icon: "logo-facebook",
      color: "#1877F2",
      onPress: handleFacebookShare,
    },
    {
      id: "twitter",
      title: "Twitter",
      icon: "logo-twitter",
      color: "#1DA1F2",
      onPress: handleTwitterShare,
    },
    {
      id: "copy",
      title: "Copiar enlace",
      icon: "copy-outline",
      color: "#666",
      onPress: handleCopyLink,
    },
  ]

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Compartir Evento</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.eventPreview}>
            <Text style={styles.previewTitle} numberOfLines={2}>
              {eventTitle}
            </Text>
            <Text style={styles.previewDetails}>
              📅 {eventDate} • 📍 {eventLocation}
            </Text>
          </View>

          <View style={styles.shareOptions}>
            {shareOptions.map((option) => (
              <TouchableOpacity key={option.id} style={styles.shareOption} onPress={option.onPress} disabled={sharing}>
                <View style={[styles.shareIconContainer, { backgroundColor: `${option.color}20` }]}>
                  <Ionicons name={option.icon as any} size={24} color={option.color} />
                </View>
                <Text style={styles.shareOptionText}>{option.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
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
  eventPreview: {
    padding: 20,
    backgroundColor: "#f8f9fa",
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 12,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  previewDetails: {
    fontSize: 14,
    color: "#666",
  },
  shareOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20,
    justifyContent: "space-between",
  },
  shareOption: {
    alignItems: "center",
    width: "30%",
    marginBottom: 20,
  },
  shareIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  shareOptionText: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
})

export default ShareEventModal
