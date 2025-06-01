"use client"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"

// Screens
import LoginScreen from "../screens/auth/LoginScreen"
import RegisterScreen from "../screens/auth/RegisterScreen"
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen"
import HomeScreen from "../screens/HomeScreen"
import EventDetailScreen from "../screens/EventDetailScreen"
import CalendarScreen from "../screens/CalendarScreen"
import CreateEventScreen from "../screens/CreateEventScreen"
import NotificationsScreen from "../screens/NotificationsScreen"
import ProfileScreen from "../screens/ProfileScreen"
import EditProfileScreen from "../screens/EditProfileScreen"
import MyEventsScreen from "../screens/MyEventsScreen"
import SettingsScreen from "../screens/SettingsScreen"
import HelpSupportScreen from "../screens/HelpSupportScreen"
import LoadingScreen from "../screens/LoadingScreen"

export type RootStackParamList = {
  Main: undefined
  EventDetail: { eventId: string }
  Login: undefined
  Register: undefined
  ForgotPassword: undefined
  EditProfile: undefined
  MyEvents: undefined
  Settings: undefined
  HelpSupport: undefined
}

export type MainTabParamList = {
  Home: undefined
  Calendar: undefined
  Create: undefined
  Notifications: undefined
  Profile: undefined
}

const Tab = createBottomTabNavigator<MainTabParamList>()
const Stack = createStackNavigator<RootStackParamList>()

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home"

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Calendar") {
            iconName = focused ? "calendar" : "calendar-outline"
          } else if (route.name === "Create") {
            iconName = focused ? "add-circle" : "add-circle-outline"
          } else if (route.name === "Notifications") {
            iconName = focused ? "notifications" : "notifications-outline"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#146193",
        tabBarInactiveTintColor: "gray",
        headerStyle: {
          backgroundColor: "#146193",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Inicio" }} />
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ title: "Calendario" }} />
      <Tab.Screen name="Create" component={CreateEventScreen} options={{ title: "Crear" }} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ title: "Notificaciones" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Perfil" }} />
    </Tab.Navigator>
  )
}

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  )
}

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{
          title: "Detalle del Evento",
          headerStyle: {
            backgroundColor: "#146193",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MyEvents" component={MyEventsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

const RootNavigator = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  return <NavigationContainer>{user ? <AppStack /> : <AuthStack />}</NavigationContainer>
}

export default RootNavigator
