import { StyleSheet, View, ActivityIndicator, Text, Image } from "react-native"

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={require("../../assets/logo.png")} style={styles.logo} />
      <ActivityIndicator size="large" color="#146193" style={styles.loader} />
      <Text style={styles.loadingText}>Cargando Eventify...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  loader: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
})

export default LoadingScreen
