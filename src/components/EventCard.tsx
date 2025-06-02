import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, type NavigationProp } from "@react-navigation/native"

// Definir tipos para la navegación
type RootStackParamList = {
  EventDetail: { eventId: string }
}

// Update the navigation type
type EventCardNavigationProp = NavigationProp<RootStackParamList>

type EventCardProps = {
  id: string
  title: string
  date: string
  location: string
  image: string
  horizontal?: boolean
}

const EventCard = ({ id, title, date, location, image, horizontal = false }: EventCardProps) => {
  // Update the navigation hook
  const navigation = useNavigation<EventCardNavigationProp>()

  const handlePress = () => {
    navigation.navigate("EventDetail", { eventId: id })
  }

  // Función para obtener la imagen correcta
  const getImageSource = (imagePath: string) => {
    // Si es una URL completa o placeholder, usarla directamente
    if (imagePath.startsWith("http") || imagePath.startsWith("/placeholder")) {
      return { uri: imagePath }
    }

    // Para las imágenes locales con formato /assets/eventoX.jpg o .png
    switch (imagePath) {
      case "/assets/evento1.jpg":
        return require("../../assets/evento1.jpg")
      case "/assets/evento2.png":
        return require("../../assets/evento2.png")
      case "/assets/evento3.jpg":
        return require("../../assets/evento3.jpg")
      case "/assets/evento4.jpg":
        return require("../../assets/evento4.jpg")
      default:
        // Imagen por defecto
        return require("../../assets/evento5.jpg")
    }
  }

  if (horizontal) {
    return (
      <TouchableOpacity style={styles.horizontalCard} onPress={handlePress}>
        <Image source={getImageSource(image)} style={styles.horizontalImage} />
        <View style={styles.horizontalInfo}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <View style={styles.details}>
            <Ionicons name="calendar-outline" size={14} color="#666" />
            <Text style={styles.detailText}>{date}</Text>
          </View>
          <View style={styles.details}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.detailText}>{location}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image source={getImageSource(image)} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.details}>
          <Ionicons name="calendar-outline" size={14} color="#666" />
          <Text style={styles.detailText}>{date}</Text>
        </View>
        <View style={styles.details}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.detailText}>{location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  details: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  horizontalCard: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  horizontalImage: {
    width: 120,
    height: "100%",
    resizeMode: "cover",
  },
  horizontalInfo: {
    flex: 1,
    padding: 12,
  },
})

export default EventCard
