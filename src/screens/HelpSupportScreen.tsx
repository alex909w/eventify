"use client"

import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Linking, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

const HelpSupportScreen = () => {
  const navigation = useNavigation()

  const handleContactSupport = () => {
    Alert.alert("Contactar Soporte", "Selecciona una opción", [
      {
        text: "Email",
        onPress: () => Linking.openURL("mailto:soporte@eventify.com?subject=Ayuda con Eventify"),
      },
      {
        text: "WhatsApp",
        onPress: () => Linking.openURL("whatsapp://send?phone=+1234567890&text=Hola, necesito ayuda con Eventify"),
      },
      { text: "Cancelar", style: "cancel" },
    ])
  }

  const handleOpenFAQ = (question: string) => {
    Alert.alert("FAQ", `Información sobre: ${question}`, [{ text: "OK" }])
  }

  const faqItems = [
    {
      id: "1",
      question: "¿Cómo creo un evento?",
      answer: "Ve a la pestaña 'Crear' y completa el formulario con los detalles de tu evento.",
    },
    {
      id: "2",
      question: "¿Puedo editar un evento después de crearlo?",
      answer: "Sí, puedes editar tus eventos desde la sección 'Mis Eventos'.",
    },
    {
      id: "3",
      question: "¿Cómo me registro en un evento?",
      answer: "Toca el evento que te interese y presiona el botón 'Asistir'.",
    },
    {
      id: "4",
      question: "¿Las notificaciones son gratuitas?",
      answer: "Sí, todas las funciones de Eventify son completamente gratuitas.",
    },
    {
      id: "5",
      question: "¿Cómo cambio mi contraseña?",
      answer: "Ve a Configuración > Cambiar contraseña para actualizar tu contraseña.",
    },
  ]

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#146193" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ayuda y Soporte</Text>
      </View>

      <View style={styles.welcomeSection}>
        <Ionicons name="help-circle" size={64} color="#146193" />
        <Text style={styles.welcomeTitle}>¿En qué podemos ayudarte?</Text>
        <Text style={styles.welcomeText}>
          Encuentra respuestas a las preguntas más frecuentes o contacta directamente con nuestro equipo de soporte.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
        {faqItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.faqItem} onPress={() => handleOpenFAQ(item.question)}>
            <View style={styles.faqContent}>
              <Ionicons name="help-circle-outline" size={20} color="#146193" />
              <Text style={styles.faqQuestion}>{item.question}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contacto</Text>

        <TouchableOpacity style={styles.contactItem} onPress={handleContactSupport}>
          <View style={styles.contactContent}>
            <Ionicons name="mail" size={24} color="#146193" />
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactTitle}>Email de Soporte</Text>
              <Text style={styles.contactDescription}>soporte@eventify.com</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactItem} onPress={handleContactSupport}>
          <View style={styles.contactContent}>
            <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactTitle}>WhatsApp</Text>
              <Text style={styles.contactDescription}>Chat directo con soporte</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactItem}>
          <View style={styles.contactContent}>
            <Ionicons name="time" size={24} color="#146193" />
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactTitle}>Horario de Atención</Text>
              <Text style={styles.contactDescription}>Lunes a Viernes: 9:00 AM - 6:00 PM</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recursos Adicionales</Text>

        <TouchableOpacity style={styles.resourceItem}>
          <View style={styles.resourceContent}>
            <Ionicons name="document-text" size={24} color="#146193" />
            <View style={styles.resourceTextContainer}>
              <Text style={styles.resourceTitle}>Guía de Usuario</Text>
              <Text style={styles.resourceDescription}>Manual completo de la aplicación</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.resourceItem}>
          <View style={styles.resourceContent}>
            <Ionicons name="videocam" size={24} color="#146193" />
            <View style={styles.resourceTextContainer}>
              <Text style={styles.resourceTitle}>Tutoriales en Video</Text>
              <Text style={styles.resourceDescription}>Aprende a usar Eventify paso a paso</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.resourceItem}>
          <View style={styles.resourceContent}>
            <Ionicons name="people" size={24} color="#146193" />
            <View style={styles.resourceTextContainer}>
              <Text style={styles.resourceTitle}>Comunidad</Text>
              <Text style={styles.resourceDescription}>Únete a nuestra comunidad de usuarios</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      <View style={styles.feedbackSection}>
        <Text style={styles.feedbackTitle}>¿Te gusta Eventify?</Text>
        <Text style={styles.feedbackText}>
          Tu opinión es muy importante para nosotros. Ayúdanos a mejorar calificando la aplicación.
        </Text>
        <TouchableOpacity style={styles.feedbackButton}>
          <Ionicons name="star" size={20} color="#FFD700" />
          <Text style={styles.feedbackButtonText}>Calificar App</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  welcomeSection: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "#f8f9fa",
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#333",
  },
  welcomeText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  faqItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  faqContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  faqQuestion: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
    flex: 1,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  contactContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  contactTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  contactDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  resourceContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  resourceTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  resourceDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  feedbackSection: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  feedbackText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
  },
  feedbackButton: {
    flexDirection: "row",
    backgroundColor: "#146193",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  feedbackButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
})

export default HelpSupportScreen
