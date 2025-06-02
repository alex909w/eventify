import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import CommentItem, { type Comment } from "./CommentItem"
import RatingStars from "./RatingStars"
import EmptyState from "./EmptyState"

type CommentsListProps = {
  eventId: string
  comments: Comment[]
  averageRating: number
  totalRatings: number
  onAddComment: () => void
  onLikeComment: (commentId: string) => void
  onReportComment: (commentId: string) => void
}

const CommentsList = ({
  eventId,
  comments,
  averageRating,
  totalRatings,
  onAddComment,
  onLikeComment,
  onReportComment,
}: CommentsListProps) => {
  const handleReportComment = (commentId: string) => {
    Alert.alert("Reportar comentario", "¿Estás seguro de que quieres reportar este comentario?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Reportar",
        style: "destructive",
        onPress: () => onReportComment(commentId),
      },
    ])
  }

  const renderComment = ({ item }: { item: Comment }) => (
    <CommentItem comment={item} onLike={onLikeComment} onReport={handleReportComment} />
  )

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.ratingSection}>
        <Text style={styles.sectionTitle}>Calificaciones y Comentarios</Text>
        <View style={styles.ratingOverview}>
          <View style={styles.averageRating}>
            <Text style={styles.averageNumber}>{averageRating.toFixed(1)}</Text>
            <RatingStars rating={averageRating} size={20} readonly />
            <Text style={styles.totalRatings}>({totalRatings} calificaciones)</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.addCommentButton} onPress={onAddComment}>
        <Ionicons name="add-circle-outline" size={24} color="#146193" />
        <Text style={styles.addCommentText}>Agregar comentario y calificación</Text>
      </TouchableOpacity>
    </View>
  )

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <EmptyState
        icon="chatbubble-outline"
        title="No hay comentarios aún"
        message="Sé el primero en compartir tu experiencia sobre este evento"
      />
    </View>
  )

  return (
    <View style={styles.container}>
      {renderHeader()}
      {comments.length > 0 ? (
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        />
      ) : (
        renderEmpty()
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  ratingSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  ratingOverview: {
    alignItems: "center",
  },
  averageRating: {
    alignItems: "center",
  },
  averageNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#146193",
    marginBottom: 8,
  },
  totalRatings: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  addCommentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#146193",
  },
  addCommentText: {
    color: "#146193",
    fontWeight: "500",
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
})

export default CommentsList
