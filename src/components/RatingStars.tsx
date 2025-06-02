import { StyleSheet, View, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

type RatingStarsProps = {
  rating: number
  maxRating?: number
  size?: number
  color?: string
  readonly?: boolean
  onRatingChange?: (rating: number) => void
}

const RatingStars = ({
  rating,
  maxRating = 5,
  size = 20,
  color = "#FFD700",
  readonly = false,
  onRatingChange,
}: RatingStarsProps) => {
  const handleStarPress = (starIndex: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starIndex + 1)
    }
  }

  return (
    <View style={styles.container}>
      {Array.from({ length: maxRating }, (_, index) => {
        const isFilled = index < rating
        const isHalfFilled = index < rating && index + 1 > rating

        return (
          <TouchableOpacity
            key={index}
            onPress={() => handleStarPress(index)}
            disabled={readonly}
            style={styles.starButton}
          >
            <Ionicons
              name={isFilled ? "star" : isHalfFilled ? "star-half" : "star-outline"}
              size={size}
              color={isFilled || isHalfFilled ? color : "#ccc"}
            />
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  starButton: {
    marginRight: 4,
  },
})

export default RatingStars
