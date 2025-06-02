import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import RatingStars from "./RatingStars"

export type Comment = {
  id: string
  userId: string
  userName: string
  userPhoto?: string | undefined
  rating: number
  comment: string
  date: string
  likes: number
  isLiked: boolean
}

type CommentItemProps = {
  comment: Comment
  onLike?: (commentId: string) => void
  onReport?: (commentId: string) => void
}

const CommentItem = ({ comment, onLike, onReport }: CommentItemProps) => {
  const handleLike = () => {
    if (onLike) {
      onLike(comment.id)
    }
  }

  const handleReport = () => {
    if (onReport) {
      onReport(comment.id)
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: comment.userPhoto || `/placeholder.svg?height=40&width=40&text=${comment.userName.charAt(0)}`,
        }}
        style={styles.userPhoto}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.userName}>{comment.userName}</Text>
          <Text style={styles.date}>{comment.date}</Text>
        </View>

        <RatingStars rating={comment.rating} size={16} readonly />

        <Text style={styles.commentText}>{comment.comment}</Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Ionicons
              name={comment.isLiked ? "heart" : "heart-outline"}
              size={16}
              color={comment.isLiked ? "#F44336" : "#666"}
            />
            <Text style={[styles.actionText, comment.isLiked && styles.likedText]}>{comment.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleReport}>
            <Ionicons name="flag-outline" size={16} color="#666" />
            <Text style={styles.actionText}>Reportar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
  commentText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  actionText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  likedText: {
    color: "#F44336",
  },
})

export default CommentItem
