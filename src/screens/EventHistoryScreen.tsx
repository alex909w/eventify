"use client"

import { useState, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, type NavigationProp } from "@react-navigation/native"
import type { RootStackParamList } from "../navigation/RootNavigator"
import { useAuth } from "../context/AuthContext"
import { fetchEventHistory, type EventHistoryItem } from "../services/api"
import EventCard from "../components/EventCard"
import EmptyState from "../components/EmptyState"

type EventHistoryScreenNavigationProp = NavigationProp<RootStackParamList>

const EventHistoryScreen = () => {
  const navigation = useNavigation<EventHistoryScreenNavigationProp>()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [eventHistory, setEventHistory] = useState<EventHistoryItem[]>([])
  const [activeTab, setActiveTab] = useState<"organized" | "attended">("organized")

  useEffect(() => {
    loadEventHistory()
  }, [activeTab, user])

  const loadEventHistory = async () => {
    if (!user?.uid) return

    try {
      setLoading(true)
      const history = await fetchEventHistory(user.uid, activeTab)
      setEventHistory(history)
    } catch (error) {
      console.error("Error loading event history:", error)
      Alert.alert("Error", "No se pudo cargar el historial de eventos")
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadEventHistory()
    setRefreshing(false)
  }

  const renderEventItem = ({ item }: { item: EventHistoryItem }) => (
    <View style={styles.eventItemContainer}>
      <EventCard
        id={item.id}
        title={item.title}
        date={item.date}
        location={item.location}
        image={item.image}
        horizontal
      />
      <View style={styles.eventMetadata}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Ionicons name={getStatusIcon(item.status)} size={12} color="#fff" />
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {activeTab === "organized" ? (
            <>
              <View style={styles.statItem}>
                <Ionicons name="people-outline" size={16} color="#666" />
                <Text style={styles.statText}>{item.totalAttendees} asistentes</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="star-outline" size={16} color="#666" />
                <Text style={styles.statText}>{item.averageRating?.toFixed(1) || "N/A"} rating</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="chatbubble-outline" size={16} color="#666" />
                <Text style={styles.statText}>{item.totalComments} comentarios</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.statItem}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.statText}>Asististe el {item.attendedDate}</Text>
              </View>
              {item.userRating && (
                <View style={styles.statItem}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.statText}>Tu calificación: {item.userRating}</Text>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </View>
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#4CAF50"
      case "cancelled":
        return "#F44336"
      case "postponed":
        return "#FF9800"
      default:
        return "#666"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "checkmark-circle"
      case "cancelled":
        return "close-circle"
      case "postponed":
        return "time"
      default:
        return "help-circle"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completado"
      case "cancelled":
        return "Cancelado"
      case "postponed":
        return "Pospuesto"
      default:
        return "Desconocido"
    }
  }

  const renderEmptyState = () => {
    if (activeTab === "organized") {
      return (
        <EmptyState
          icon="calendar-outline"
          title="No has organizado eventos pasados"
          message="Los eventos que organices aparecerán aquí una vez que hayan finalizado"
        />
      )
    } else {
      return (
        <EmptyState
          icon="heart-outline"
          title="No has asistido a eventos"
          message="Los eventos a los que asistas aparecerán en tu historial"
        />
      )
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#146193" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial de Eventos</Text>
        <TouchableOpacity style={styles.statsButton} onPress={() => navigation.navigate("Statistics" as never)}>
          <Ionicons name="stats-chart" size={24} color="#146193" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "organized" && styles.activeTab]}
          onPress={() => setActiveTab("organized")}
        >
          <Text style={[styles.tabText, activeTab === "organized" && styles.activeTabText]}>
            Organizados
            {eventHistory.length > 0 && activeTab === "organized" && (
              <Text style={styles.tabBadge}> ({eventHistory.length})</Text>
            )}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "attended" && styles.activeTab]}
          onPress={() => setActiveTab("attended")}
        >
          <Text style={[styles.tabText, activeTab === "attended" && styles.activeTabText]}>
            Asistidos
            {eventHistory.length > 0 && activeTab === "attended" && (
              <Text style={styles.tabBadge}> ({eventHistory.length})</Text>
            )}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#146193" />
          <Text style={styles.loadingText}>Cargando historial...</Text>
        </View>
      ) : eventHistory.length > 0 ? (
        <FlatList
          data={eventHistory}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#146193"]} tintColor="#146193" />
          }
        />
      ) : (
        renderEmptyState()
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
  statsButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#146193",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#146193",
    fontWeight: "bold",
  },
  tabBadge: {
    fontSize: 14,
    color: "#146193",
    fontWeight: "bold",
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
  listContainer: {
    padding: 16,
  },
  eventItemContainer: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  eventMetadata: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  statusContainer: {
    alignItems: "flex-start",
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
  statText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
})

export default EventHistoryScreen
