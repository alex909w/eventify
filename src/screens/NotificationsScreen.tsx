"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, type NavigationProp } from "@react-navigation/native"
import type { RootStackParamList } from "../navigation/RootNavigator"
import { fetchNotifications, markNotificationAsRead, type Notification } from "../services/api"

const NotificationsScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const notificationsData = await fetchNotifications()
      setNotifications(notificationsData)
    } catch (error) {
      console.error("Error loading notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadNotifications()
    setRefreshing(false)
  }

  const markAsRead = async (notification: Notification) => {
    if (!notification.read) {
      try {
        await markNotificationAsRead(notification.id)
        setNotifications((prev) =>
          prev.map((notif) => (notif.id === notification.id ? { ...notif, read: true } : notif)),
        )
      } catch (error) {
        console.error("Error marking notification as read:", error)
      }
    }

    // Navegar al evento si la notificación tiene eventId
    if (notification.eventId) {
      navigation.navigate("EventDetail", { eventId: notification.eventId })
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "event":
        return "calendar-outline"
      case "message":
        return "mail-outline"
      case "reminder":
        return "alarm-outline"
      case "system":
        return "settings-outline"
      case "rsvp":
        return "checkmark-circle-outline"
      default:
        return "notifications-outline"
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "event":
        return "#146193"
      case "message":
        return "#4CAF50"
      case "reminder":
        return "#FF9800"
      case "system":
        return "#9C27B0"
      case "rsvp":
        return "#2196F3"
      default:
        return "#146193"
    }
  }

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.read && styles.unreadNotification]}
      onPress={() => markAsRead(item)}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${getNotificationColor(item.type)}20` }]}>
        <Ionicons name={getNotificationIcon(item.type) as any} size={24} color={getNotificationColor(item.type)} />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationDate}>{item.date}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
      {item.eventId && <Ionicons name="chevron-forward" size={20} color="#ccc" style={styles.chevron} />}
    </TouchableOpacity>
  )

  const unreadCount = notifications.filter((n) => !n.read).length

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#146193" />
        <Text style={styles.loadingText}>Cargando notificaciones...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No hay notificaciones</Text>
          <Text style={styles.emptyMessage}>Te notificaremos cuando tengas nuevas actualizaciones</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#146193"]} tintColor="#146193" />
          }
        />
      )}
    </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  unreadBadge: {
    backgroundColor: "#FF4444",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: "center",
  },
  unreadBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: "row",
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadNotification: {
    backgroundColor: "#f8f9ff",
    borderLeftWidth: 4,
    borderLeftColor: "#146193",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationDate: {
    fontSize: 12,
    color: "#999",
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#146193",
    alignSelf: "center",
    marginRight: 8,
  },
  chevron: {
    alignSelf: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#333",
  },
  emptyMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
})

export default NotificationsScreen
