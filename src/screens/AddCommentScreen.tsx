"use client"

import { useState } from "react"
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native"
import Input from "../components/Input"
import Button from "../components/Button"
import RatingStars from "../components/RatingStars"
import { useForm } from "../hooks/useForm"
import { useAuth } from "../context/AuthContext"
import { addEventComment } from "../services/api"
import type { RootStackParamList } from "../navigation/RootNavigator"

type AddCommentScreenRouteProp = RouteProp<RootStackParamList, "AddComment">

type CommentFormData = {
  comment: string
  rating: number
}

const AddCommentScreen = () => {
  const navigation = useNavigation()
  const route = useRoute<AddCommentScreenRouteProp>()
  const { eventId, eventTitle } = route.params
  const { user } = useAuth()
  const [rating, setRating] = useState(0)

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm<CommentFormData>(
    {
      comment: "",
      rating: 0,
    },
    {
      comment: {
        required: "El comentario es obligatorio",
        minLength: {
          value: 10,
          message: "El comentario debe tener al menos 10 caracteres",
        },
        maxLength: {
          value: 500,
          message: "El comentario no puede exceder 500 caracteres",
        },
      },
      rating: {
        validate: (value) => {
          if (value === 0) {
            return "Debes seleccionar una calificación"
          }
          return true
        },
      },
    },
  )

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
  }

  const handleSubmitComment = async (formData: CommentFormData) => {
    try {
      if (!user) {
        Alert.alert("Error", "Debes estar autenticado para comentar")
        return
      }

      if (rating === 0) {
        Alert.alert("Error", "Debes seleccionar una calificación")
        return
      }

      await addEventComment(eventId, {
        userId: user.uid,
        userName: user.displayName || user.email?.split("@")[0] || "Usuario",
        userPhoto: user.photoURL || undefined,
        rating: rating,
        comment: formData.comment,
      })

      Alert.alert("¡Éxito!", "Tu comentario y calificación han sido publicados", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ])
    } catch (error) {
      console.error("Error adding comment:", error)
      Alert.alert("Error", "No se pudo publicar tu comentario. Inténtalo de nuevo.")
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#146193" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agregar Comentario</Text>
        </View>

        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle} numberOfLines={2}>
            {eventTitle}
          </Text>
          <Text style={styles.eventSubtitle}>Comparte tu experiencia sobre este evento</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.ratingSection}>
            <Text style={styles.label}>Calificación *</Text>
            <View style={styles.ratingContainer}>
              <RatingStars rating={rating} size={32} onRatingChange={handleRatingChange} />
              <Text style={styles.ratingText}>
                {rating === 0 ? "Toca las estrellas para calificar" : `${rating} de 5 estrellas`}
              </Text>
            </View>
            {rating === 0 && touched.rating && <Text style={styles.errorText}>Debes seleccionar una calificación</Text>}
          </View>

          <Input
            label="Comentario *"
            placeholder="Comparte tu experiencia, qué te gustó, qué mejorarías..."
            value={values.comment}
            onChangeText={handleChange("comment")}
            onBlur={handleBlur("comment")}
            error={errors.comment}
            touched={touched.comment}
            editable={!isSubmitting}
            multiline
            style={styles.commentInput}
            icon="chatbubble-outline"
          />

          <View style={styles.characterCount}>
            <Text style={styles.characterCountText}>{values.comment.length}/500 caracteres</Text>
          </View>

          <Button
            title="Publicar Comentario"
            onPress={() => handleSubmit(handleSubmitComment)}
            loading={isSubmitting}
            disabled={isSubmitting || rating === 0}
            icon={<Ionicons name="send-outline" size={24} color="#fff" style={{ marginRight: 8 }} />}
            style={styles.submitButton}
          />

          <Text style={styles.disclaimer}>
            * Tu comentario será visible para todos los usuarios. Mantén un lenguaje respetuoso.
          </Text>
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
  eventInfo: {
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  eventSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  formContainer: {
    padding: 20,
  },
  ratingSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
    color: "#333",
  },
  ratingContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  errorText: {
    color: "#F44336",
    fontSize: 14,
    marginTop: 8,
  },
  commentInput: {
    height: 120,
    textAlignVertical: "top",
  },
  characterCount: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  characterCountText: {
    fontSize: 12,
    color: "#666",
  },
  submitButton: {
    marginBottom: 16,
  },
  disclaimer: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
})

export default AddCommentScreen
