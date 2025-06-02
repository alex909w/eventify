"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, Text, FlatList, ActivityIndicator, ScrollView } from "react-native"
import { useNavigation, type NavigationProp } from "@react-navigation/native"
import type { RootStackParamList } from "../navigation/RootNavigator"
import { useAuth } from "../context/AuthContext"
import { fetchEvents, type Event } from "../services/api"
import EventCard from "../components/EventCard"
import EmptyState from "../components/EmptyState"

// Update the navigation type
type HomeScreenNavigationProp = NavigationProp<RootStackParamList>

const HomeScreen = () => {
  // Update the navigation hook
  const navigation = useNavigation<HomeScreenNavigationProp>()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const eventsData = await fetchEvents()
      setEvents(eventsData)
    } catch (error) {
      console.error("Error loading events:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderFeaturedEvent = ({ item }: { item: Event }) => (
    <EventCard id={item.id} title={item.title} date={item.date} location={item.location} image={item.image} />
  )

  const renderUpcomingEvent = ({ item }: { item: Event }) => (
    <View style={styles.upcomingEventContainer}>
      <EventCard
        id={item.id}
        title={item.title}
        date={item.date}
        location={item.location}
        image={item.image}
        horizontal
      />
    </View>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#146193" />
        <Text style={styles.loadingText}>Cargando eventos...</Text>
      </View>
    )
  }

  const featuredEvents = events.filter((event) => event.category === "featured")
  const upcomingEvents = events.filter((event) => event.category === "upcoming")

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          ¡Bienvenido{user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}!
        </Text>
        <Text style={styles.subtitle}>Descubre eventos increíbles cerca de ti</Text>
      </View>

      {featuredEvents.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eventos Destacados</Text>
          <FlatList
            data={featuredEvents}
            renderItem={renderFeaturedEvent}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
            nestedScrollEnabled={true}
          />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próximos Eventos</Text>
        {upcomingEvents.length > 0 ? (
          <View style={styles.upcomingEventsContainer}>
            {upcomingEvents.map((item) => (
              <View key={item.id} style={styles.upcomingEventContainer}>
                <EventCard
                  id={item.id}
                  title={item.title}
                  date={item.date}
                  location={item.location}
                  image={item.image}
                  horizontal
                />
              </View>
            ))}
          </View>
        ) : (
          <EmptyState
            icon="calendar-outline"
            title="No hay eventos próximos"
            message="¡Sé el primero en crear un evento increíble!"
          />
        )}
      </View>

      {/* Espaciado adicional al final */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
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
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  header: {
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    marginHorizontal: 20,
    color: "#333",
  },
  featuredList: {
    paddingHorizontal: 20,
  },
  upcomingEventsContainer: {
    paddingHorizontal: 20,
  },
  upcomingEventContainer: {
    marginBottom: 16,
  },
  bottomSpacing: {
    height: 20,
  },
})

export default HomeScreen
