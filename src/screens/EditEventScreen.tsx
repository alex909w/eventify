"use client"

import { useState, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native"
import Input from "../components/Input"
import Button from "../components/Button"
import ImageSelector from "../components/ImageSelector"
import { useForm } from "../hooks/useForm"
import { useAuth } from "../context/AuthContext"
import { fetchEventById, updateEvent, deleteEvent } from "../services/api"
import type { RootStackParamList } from "../navigation/RootNavigator"

type EditEventScreenRouteProp = RouteProp<RootStackParamList, "EditEvent">

type EditEventFormData = {
  title: string
  description: string
  location: string
  date: Date
  image: string
}

const EditEventScreen = () => {
  const navigation = useNavigation()
  const route = useRoute<EditEventScreenRouteProp>()
  const { eventId } = route.params
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setValues } =
    useForm<EditEventFormData>(
      {
        title: "",
        description: "",
        location: "",
        date: new Date(),
        image: "/assets/evento1.jpg",
      },
      {
        title: {
          required: "El título es obligatorio",
          minLength: {
            value: 3,
            message: "El título debe tener al menos 3 caracteres",
          },
        },
        description: {
          required: "La descripción es obligatoria",
          minLength: {
            value: 10,
            message: "La descripción debe tener al menos 10 caracteres",
          },
        },
        location: {
          required: "La ubicación es obligatoria",
          minLength: {
            value: 3,
            message: "La ubicación debe tener al menos 3 caracteres",
          },
        },
        image: {
          required: "Selecciona una imagen para el evento",
        },
      },
    )

  useEffect(() => {
    loadEventData()
  }, [eventId])

  const loadEventData = async () => {
    try {
      setLoading(true)
      const event = await fetchEventById(eventId)

      // Verificar que el usuario es el organizador
      if (event.organizerId !== user?.uid) {
        Alert.alert("Error", "No tienes permisos para editar este evento", [
          { text: "OK", onPress: () => navigation.goBack() },
        ])
        return
      }

      // Convertir la fecha del evento a objeto Date
      const eventDate = new Date(event.date + " " + event.time)

      setValues({
        title: event.title,
        description: event.description,
        location: event.location,
        date: eventDate,
        image: event.image,
      })
    } catch (error) {
      console.error("Error loading event:", error)
      Alert.alert("Error", "No se pudo cargar el evento", [{ text: "OK", onPress: () => navigation.goBack() }])
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateEvent = async (formData: EditEventFormData) => {
    try {
      if (!user) {
        Alert.alert("Error", "Debes estar autenticado para editar un evento")
        return
      }

      await updateEvent(eventId, {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        date: formData.date,
        image: formData.image,
      })

      Alert.alert("¡Éxito!", "Tu evento ha sido actualizado correctamente", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ])
    } catch (error) {
      console.error("Error updating event:", error)
      Alert.alert("Error", "No se pudo actualizar el evento. Inténtalo de nuevo.")
    }
  }

  const handleDeleteEvent = () => {
    Alert.alert(
      "Eliminar Evento",
      "¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: confirmDeleteEvent,
        },
      ],
    )
  }

  const confirmDeleteEvent = async () => {
    try {
      setDeleting(true)
      await deleteEvent(eventId, user?.uid) // Pasar el userId para actualizar contadores

      Alert.alert("Evento Eliminado", "El evento ha sido eliminado correctamente", [
        {
          text: "OK",
          onPress: () => {
            // Navegar de vuelta a Mis Eventos
            navigation.navigate("MyEvents" as never)
          },
        },
      ])
    } catch (error) {
      console.error("Error deleting event:", error)
      Alert.alert("Error", "No se pudo eliminar el evento. Inténtalo de nuevo.")
    } finally {
      setDeleting(false)
    }
  }

  const handleImageSelect = (imageUri: string) => {
    setValues((prev) => ({ ...prev, image: imageUri }))
  }

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false)
    if (selectedDate) {
      setValues((prev) => ({ ...prev, date: selectedDate }))
    }
  }

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false)
    if (selectedTime) {
      const newDate = new Date(values.date)
      newDate.setHours(selectedTime.getHours())
      newDate.setMinutes(selectedTime.getMinutes())
      setValues((prev) => ({ ...prev, date: newDate }))
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando evento...</Text>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#146193" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Evento</Text>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteEvent} disabled={deleting}>
            <Ionicons name="trash-outline" size={24} color="#F44336" />
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <ImageSelector selectedImage={values.image} onImageSelect={handleImageSelect} />
          {errors.image && touched.image && <Text style={styles.errorText}>{errors.image}</Text>}

          <Input
            label="Título del Evento"
            placeholder="Ej: Festival de Música 2024"
            value={values.title}
            onChangeText={handleChange("title")}
            onBlur={handleBlur("title")}
            error={errors.title}
            touched={touched.title}
            editable={!isSubmitting && !deleting}
            icon="musical-notes-outline"
          />

          <Input
            label="Descripción"
            placeholder="Describe tu evento, actividades, qué pueden esperar los asistentes..."
            value={values.description}
            onChangeText={handleChange("description")}
            onBlur={handleBlur("description")}
            error={errors.description}
            touched={touched.description}
            editable={!isSubmitting && !deleting}
            multiline
            style={styles.textArea}
            icon="document-text-outline"
          />

          <Input
            label="Ubicación"
            placeholder="Ej: Parque Central, Calle 123"
            value={values.location}
            onChangeText={handleChange("location")}
            onBlur={handleBlur("location")}
            error={errors.location}
            touched={touched.location}
            editable={!isSubmitting && !deleting}
            icon="location-outline"
          />

          <View style={styles.dateTimeContainer}>
            <View style={styles.dateTimeGroup}>
              <Text style={styles.label}>Fecha</Text>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
                disabled={isSubmitting || deleting}
              >
                <Ionicons name="calendar-outline" size={20} color="#146193" />
                <Text style={styles.dateTimeText}>{formatDate(values.date)}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateTimeGroup}>
              <Text style={styles.label}>Hora</Text>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
                disabled={isSubmitting || deleting}
              >
                <Ionicons name="time-outline" size={20} color="#146193" />
                <Text style={styles.dateTimeText}>{formatTime(values.date)}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={values.date}
              mode="date"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}

          {showTimePicker && (
            <DateTimePicker value={values.date} mode="time" display="default" onChange={onTimeChange} />
          )}

          <View style={styles.buttonContainer}>
            <Button
              title="Guardar Cambios"
              onPress={() => handleSubmit(handleUpdateEvent)}
              loading={isSubmitting}
              disabled={isSubmitting || deleting}
              icon={<Ionicons name="save-outline" size={24} color="#fff" style={{ marginRight: 8 }} />}
              style={styles.saveButton}
            />

            <Button
              title="Eliminar Evento"
              onPress={handleDeleteEvent}
              loading={deleting}
              disabled={isSubmitting || deleting}
              variant="danger"
              icon={<Ionicons name="trash-outline" size={24} color="#fff" style={{ marginRight: 8 }} />}
              style={styles.deleteEventButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  formContainer: {
    padding: 20,
  },
  errorText: {
    color: "#F44336",
    fontSize: 14,
    marginTop: -16,
    marginBottom: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateTimeGroup: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  dateTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dateTimeText: {
    fontSize: 16,
    marginLeft: 8,
    color: "#333",
  },
  buttonContainer: {
    marginTop: 20,
    gap: 16,
  },
  saveButton: {
    backgroundColor: "#146193",
  },
  deleteEventButton: {
    backgroundColor: "#F44336",
  },
})

export default EditEventScreen
