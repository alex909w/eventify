"use client"

import { useState, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useAuth } from "../context/AuthContext"
import { fetchUserStatistics, type UserStatistics } from "../services/api"

const { width } = Dimensions.get("window")

const StatisticsScreen = () => {
  const navigation = useNavigation()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [statistics, setStatistics] = useState<UserStatistics | null>(null)

  useEffect(() => {
    loadStatistics()
  }, [user])

  const loadStatistics = async () => {
    if (!user?.uid) return

    try {
      setLoading(true)
      const stats = await fetchUserStatistics(user.uid)
      setStatistics(stats)
    } catch (error) {
      console.error("Error loading statistics:", error)
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadStatistics()
    setRefreshing(false)
  }

  const renderStatCard = (title: string, value: string | number, icon: string, color: string, subtitle?: string) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Ionicons name={icon as any} size={24} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  )

  const renderProgressBar = (label: string, value: number, maxValue: number, color: string) => {
    const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>{label}</Text>
          <Text style={styles.progressValue}>
            {value}/{maxValue}
          </Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
        </View>
      </View>
    )
  }

  const renderMonthlyChart = () => {
    if (!statistics?.monthlyActivity) return null

    const maxValue = Math.max(...statistics.monthlyActivity.map((item) => item.events))

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Actividad Mensual</Text>
        <View style={styles.chart}>
          {statistics.monthlyActivity.map((item, index) => {
            const height = maxValue > 0 ? (item.events / maxValue) * 100 : 0
            return (
              <View key={index} style={styles.chartColumn}>
                <View style={styles.chartBarContainer}>
                  <View style={[styles.chartBar, { height: `${height}%` }]} />
                </View>
                <Text style={styles.chartLabel}>{item.month}</Text>
                <Text style={styles.chartValue}>{item.events}</Text>
              </View>
            )
          })}
        </View>
      </View>
    )
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#146193" />
        <Text style={styles.loadingText}>Cargando estadísticas...</Text>
      </View>
    )
  }

  if (!statistics) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="stats-chart-outline" size={64} color="#ccc" />
        <Text style={styles.errorText}>No se pudieron cargar las estadísticas</Text>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#146193"]} tintColor="#146193" />
      }
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#146193" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Estadísticas</Text>
      </View>

      {/* Resumen General */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen General</Text>
        <View style={styles.statsGrid}>
          {renderStatCard(
            "Eventos Organizados",
            statistics.totalEventsOrganized,
            "calendar-outline",
            "#146193",
            "Total histórico",
          )}
          {renderStatCard(
            "Eventos Asistidos",
            statistics.totalEventsAttended,
            "heart-outline",
            "#4CAF50",
            "Como participante",
          )}
          {renderStatCard(
            "Comentarios Escritos",
            statistics.totalComments,
            "chatbubble-outline",
            "#FF9800",
            "En todos los eventos",
          )}
          {renderStatCard(
            "Rating Promedio",
            statistics.averageRatingGiven.toFixed(1),
            "star-outline",
            "#FFD700",
            "De tus calificaciones",
          )}
        </View>
      </View>

      {/* Estadísticas de Organización */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Como Organizador</Text>
        <View style={styles.statsGrid}>
          {renderStatCard(
            "Total Asistentes",
            statistics.totalAttendeesReceived,
            "people-outline",
            "#2196F3",
            "En tus eventos",
          )}
          {renderStatCard(
            "Rating Recibido",
            statistics.averageRatingReceived.toFixed(1),
            "star-half-outline",
            "#9C27B0",
            "De tus eventos",
          )}
          {renderStatCard(
            "Comentarios Recibidos",
            statistics.totalCommentsReceived,
            "chatbubbles-outline",
            "#00BCD4",
            "En tus eventos",
          )}
          {renderStatCard("Eventos Exitosos", statistics.successfulEvents, "trophy-outline", "#4CAF50", "Rating > 4.0")}
        </View>
      </View>

      {/* Progreso y Logros */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progreso y Logros</Text>
        <View style={styles.progressSection}>
          {renderProgressBar("Organizador Novato", statistics.totalEventsOrganized, 5, "#146193")}
          {renderProgressBar("Participante Activo", statistics.totalEventsAttended, 10, "#4CAF50")}
          {renderProgressBar("Comentarista", statistics.totalComments, 20, "#FF9800")}
          {renderProgressBar("Anfitrión Popular", statistics.totalAttendeesReceived, 50, "#2196F3")}
        </View>
      </View>

      {/* Gráfico de Actividad Mensual */}
      {renderMonthlyChart()}

      {/* Categorías Favoritas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categorías Favoritas</Text>
        <View style={styles.categoriesContainer}>
          {statistics.favoriteCategories.map((category, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.count} eventos</Text>
              </View>
              <View style={styles.categoryPercentage}>
                <Text style={styles.percentageText}>{category.percentage}%</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Logros Desbloqueados */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Logros Desbloqueados</Text>
        <View style={styles.achievementsContainer}>
          {statistics.achievements.map((achievement, index) => (
            <View key={index} style={[styles.achievementItem, achievement.unlocked && styles.achievementUnlocked]}>
              <Ionicons name={achievement.icon as any} size={32} color={achievement.unlocked ? "#FFD700" : "#ccc"} />
              <Text style={[styles.achievementTitle, achievement.unlocked && styles.achievementTitleUnlocked]}>
                {achievement.title}
              </Text>
              <Text style={styles.achievementDescription}>{achievement.description}</Text>
              {achievement.unlocked && (
                <Text style={styles.achievementDate}>Desbloqueado: {achievement.unlockedDate}</Text>
              )}
            </View>
          ))}
        </View>
      </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginTop: 16,
    textAlign: "center",
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
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: (width - 48) / 2,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: "#999",
  },
  progressSection: {
    gap: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  progressValue: {
    fontSize: 14,
    color: "#666",
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  chartContainer: {
    padding: 16,
    backgroundColor: "#f8f9fa",
    margin: 16,
    borderRadius: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  chart: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 120,
  },
  chartColumn: {
    alignItems: "center",
    flex: 1,
  },
  chartBarContainer: {
    height: 80,
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  chartBar: {
    backgroundColor: "#146193",
    width: 20,
    borderRadius: 2,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 10,
    color: "#666",
    marginBottom: 2,
  },
  chartValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  categoriesContainer: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  categoryCount: {
    fontSize: 14,
    color: "#666",
  },
  categoryPercentage: {
    backgroundColor: "#146193",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  percentageText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  achievementsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  achievementItem: {
    width: (width - 48) / 2,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  achievementUnlocked: {
    backgroundColor: "#fff8e1",
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
    color: "#666",
    textAlign: "center",
  },
  achievementTitleUnlocked: {
    color: "#333",
  },
  achievementDescription: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 10,
    color: "#FFD700",
    fontWeight: "bold",
  },
})

export default StatisticsScreen
