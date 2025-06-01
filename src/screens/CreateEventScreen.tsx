"use client"

import { useState } from "react"
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
import Input from "../components/Input"
import Button from "../components/Button"
import { useForm } from "../hooks/useForm"
import { createEvent } from "../services/api"

type CreateEventFormData = {
  title: string
  description: string
  location: string
  date: Date
}

const CreateEventScreen = () => {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setValues } =
    useForm<CreateEventFormData>(
      {
        title: "",
        description: "",
        location: "",
        date: new Date(),
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
      },
    )

  const handleCreateEvent = async (formData: CreateEventFormData) => {
    try {
      await createEvent(formData)
      Alert.alert("Éxito", "Evento creado correctamente", [
        {
          text: "OK",
          onPress: () => {
            setValues({
              title: "",
              description: "",
              location: "",
              date: new Date(),
            })
          },
        },
      ])
    } catch (error) {
      Alert.alert("Error", "No se pudo crear el evento")
    }
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

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="calendar-outline" size={32} color="#146193" />
          <Text style={styles.headerTitle}>Crear Nuevo Evento</Text>
          <Text style={styles.headerSubtitle}>Comparte tu evento con la comunidad</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Título del Evento"
            placeholder="Ej: Festival de Música 2024"
            value={values.title}
            onChangeText={handleChange("title")}
            onBlur={handleBlur("title")}
            error={errors.title}
            touched={touched.title}
            editable={!isSubmitting}
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
            editable={!isSubmitting}
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
            editable={!isSubmitting}
            icon="location-outline"
          />

          <View style={styles.dateTimeContainer}>
            <View style={styles.dateTimeGroup}>
              <Text style={styles.label}>Fecha</Text>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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

          <Button
            title="Crear Evento"
            onPress={() => handleSubmit(handleCreateEvent)}
            loading={isSubmitting}
            disabled={isSubmitting}
            icon={<Ionicons name="add-circle-outline" size={24} color="#fff" style={{ marginRight: 8 }} />}
            style={styles.createButton}
          />

          <Text style={styles.disclaimer}>* Campos obligatorios. Tu evento será revisado antes de ser publicado.</Text>
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
  header: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f8f9fa",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 4,
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  formContainer: {
    padding: 20,
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
  createButton: {
    marginTop: 20,
    marginBottom: 16,
  },
  disclaimer: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
})

export default CreateEventScreen
