import { StyleSheet, View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"

type EmptyStateProps = {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  message: string
}

const EmptyState = ({ icon, title, message }: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color="#ccc" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#333",
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    maxWidth: "80%",
  },
})

export default EmptyState
